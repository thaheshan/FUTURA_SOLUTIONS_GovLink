/* eslint-disable no-param-reassign */
import {
  Injectable,
  Inject,
  forwardRef,
  ForbiddenException
} from '@nestjs/common';
import { PerformerService } from 'src/modules/performer/services';
import {
  ProductService
} from 'src/modules/performer-assets/services';
import {
  EntityNotFoundException, QueueEvent, QueueEventService
} from 'src/kernel';
import { Model, Types } from 'mongoose';
import * as moment from 'moment';
import { PerformerDto } from 'src/modules/performer/dtos';
import { MailerService } from 'src/modules/mailer';
import { uniq } from 'lodash';
import { UserService } from 'src/modules/user/services';
import { UserDto } from 'src/modules/user/dtos';
import { EVENT } from 'src/kernel/constants';
import { ORDER_MODEL_PROVIDER, SHIPPING_ADDRESS_MODEL_PROVIDER } from '../providers';
import { OrderModel, ShippingAddressModel } from '../models';
import {
  OrderSearchPayload, OrderUpdatePayload
} from '../payloads';
import {
  ORDER_STATUS, REFUND_ORDER_CHANNEL
} from '../constants';
import { OrderDto } from '../dtos';

@Injectable()
export class OrderService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
    @Inject(ORDER_MODEL_PROVIDER)
    private readonly orderModel: Model<OrderModel>,
    @Inject(SHIPPING_ADDRESS_MODEL_PROVIDER)
    private readonly addressModel: Model<ShippingAddressModel>,
    private readonly mailService: MailerService,
    private readonly queueEventService: QueueEventService
  ) { }

  public async findById(id: string | Types.ObjectId) {
    return this.orderModel.findById(id);
  }

  public async findByIds(ids: string[] | Types.ObjectId[]) {
    return this.orderModel.find({ _id: { $in: ids } });
  }

  public async findByQuery(payload: any) {
    const data = await this.orderModel.find(payload);
    return data;
  }

  public async search(req: OrderSearchPayload, user: UserDto) {
    const query = {
      performerId: user._id
    } as any;
    if (user.roles && user.roles.includes('admin')) delete query.performerId;
    if (req.performerId) query.performerId = req.performerId;
    if (req.deliveryStatus) query.deliveryStatus = req.deliveryStatus;
    if (req.phoneNumber) query.phoneNumber = { $regex: req.phoneNumber };
    if (req.fromDate && req.toDate) {
      query.createdAt = {
        $gte: moment(req.fromDate).startOf('day').toDate(),
        $lte: moment(req.toDate).endOf('day').toDate()
      };
    }
    const sort = {
      [req.sortBy || 'updatedAt']: req.sort || -1
    } as any;
    const [data, total] = await Promise.all([
      this.orderModel
        .find(query)
        .sort(sort)
        .limit(req.limit)
        .skip(req.offset),
      this.orderModel.countDocuments(query)
    ]);
    const PIds = uniq(data.map((d) => d.performerId));
    const UIds = uniq(data.map((d) => d.userId));
    const productIds = uniq(data.map((d) => d.productId));

    const [performers, users, products] = await Promise.all([
      PIds.length ? this.performerService.findByIds(PIds) : [],
      UIds.length ? this.userService.findByIds(UIds) : [],
      productIds.length ? this.productService.findByIds(productIds) : []
    ]);

    const orders = data.map((v) => new OrderDto(v));
    orders.forEach((order) => {
      if (order.performerId) {
        const performerInfo = performers.find(
          (t) => t._id.toString() === order.performerId.toString()
        );
        if (performerInfo) {
          order.performerInfo = performerInfo.toResponse();
        }
      }
      if (order.userId) {
        const userInfo = users.find(
          (t) => t._id.toString() === order.userId.toString()
        );
        if (userInfo) {
          order.userInfo = userInfo.toResponse();
        }
      }
      if (order.productId) {
        const productInfo = products.find((p) => order.productId.toString() === p._id.toString());
        order.productInfo = productInfo || null;
      }
    });
    return {
      data: orders,
      total
    };
  }

  public async findOne(id: string) {
    const order = await this.findById(id);
    if (!order) {
      throw new EntityNotFoundException();
    }

    const [user, performer, product] = await Promise.all([
      this.userService.findById(order.userId),
      this.performerService.findById(order.performerId),
      this.productService.findById(order.productId)
    ]);
    const newOrder = new OrderDto(order);
    if (user) {
      newOrder.userInfo = new PerformerDto(user).toResponse();
    }
    if (performer) {
      newOrder.performerInfo = new PerformerDto(performer).toResponse();
    }
    if (product) {
      newOrder.productInfo = product;
    }
    return newOrder;
  }

  public async update(id: string, payload: OrderUpdatePayload) {
    const data = { ...payload };
    const order = await this.findById(id);
    if (!order) {
      throw new EntityNotFoundException();
    }
    await this.orderModel.updateOne({ _id: id }, data);
    const [user, product] = await Promise.all([
      this.userService.findById(order.userId),
      this.productService.findById(order.productId)
    ]);
    if (data.deliveryStatus !== ORDER_STATUS.PROCESSING) {
      user?.email && await this.mailService.send({
        subject: 'Order Status Changed',
        to: user.email,
        data: {
          user,
          order: { ...new OrderDto(order), shippingCode: data.shippingCode, name: product.name },
          oldDeliveryStatus: order.deliveryStatus,
          deliveryStatus: data.deliveryStatus
        },
        template: 'update-order-status'
      });
    }
    if (data.deliveryStatus === ORDER_STATUS.REFUNDED) {
      await this.queueEventService.publish(
        new QueueEvent({
          channel: REFUND_ORDER_CHANNEL,
          eventName: EVENT.CREATED,
          data: new OrderDto(order)
        })
      );
      user?.email && await this.mailService.send({
        subject: 'Order Refunded',
        to: user?.email,
        data: {
          orderNumber: order.orderNumber,
          userName: user?.name || user?.username
        },
        template: 'user-refunded-order'
      });
    }
    return { success: true };
  }

  public async userSearch(req: OrderSearchPayload, user: any) {
    const query = {
      userId: user._id
    } as any;
    if (req.deliveryStatus) query.deliveryStatus = req.deliveryStatus;
    if (req.phoneNumber) query.phoneNumber = { $regex: req.phoneNumber };
    if (req.fromDate && req.toDate) {
      query.createdAt = {
        $gte: moment(req.fromDate).startOf('day').toDate(),
        $lte: moment(req.toDate).endOf('day').toDate()
      };
    }
    const sort = {
      [req.sortBy || 'updatedAt']: req.sort || -1
    } as any;
    const [data, total] = await Promise.all([
      this.orderModel
        .find(query)
        .lean()
        .sort(sort)
        .limit(req.limit)
        .skip(req.offset),
      this.orderModel.countDocuments(query)
    ]);
    const PIds = uniq(data.map((d) => d.performerId));
    const productIds = uniq(data.map((d) => d.productId));
    const [performers, products] = await Promise.all([
      this.performerService.findByIds(PIds),
      this.productService.findByIds(productIds)
    ]);
    const orders = data.map((v) => new OrderDto(v));
    orders.forEach((order) => {
      if (order.performerId) {
        const performerInfo = performers.find(
          (t) => `${t?._id}` === `${order?.performerId}`
        );
        if (performerInfo) {
          order.performerInfo = performerInfo.toResponse();
        }
        if (order.productId) {
          const productInfo = products.find((p) => `${order?.productId}` === `${p?._id}`);
          order.productInfo = productInfo || null;
        }
      }
    });
    return {
      data: orders,
      total
    };
  }

  public async updateDeliveryAddress(id: string, payload: any, user: UserDto) {
    const order = await this.findById(id);
    if (!order || !payload.deliveryAddressId) {
      throw new EntityNotFoundException();
    }
    if (`${order.userId}` !== `${user._id}`) throw new ForbiddenException();
    if (order.deliveryStatus !== ORDER_STATUS.PROCESSING) throw new ForbiddenException();
    if (order?.deliveryAddressId && payload?.deliveryAddressId && `${order?.deliveryAddressId}` !== `${payload?.deliveryAddressId}`) {
      const performer = await this.performerService.findById(order.performerId);
      performer?.email && await this.mailService.send({
        subject: 'Order Delivery Address Changed',
        to: performer?.email,
        data: {
          order
        },
        template: 'update-order-delivery-address'
      });
    }
    const address = await this.addressModel.findById(payload.deliveryAddressId);
    const deliveryAddress = address ? `${address.name.toUpperCase()} - ${address.streetNumber || ''} ${address.streetAddress || ''} ${address.ward || ''} ${address.district || ''} ${address.city || ''} ${address.state || ''} ${address.zipCode || ''}, ${address.country}` : '';
    order.deliveryAddressId = payload.deliveryAddressId;
    order.deliveryAddress = deliveryAddress;
    await order.save();
    return new OrderDto(order);
  }
}
