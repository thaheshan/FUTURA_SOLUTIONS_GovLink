export class PaymentProductModel {
  name: string;

  description: string;

  price: number;

  extraInfo: any;

  productType: string;

  productId: string;
}

export interface ITransaction {
  paymentGateway: string;
  source: string;
  sourceId: string;
  target: string;
  targetId: string;
  type: string;
  paymentResponseInfo: any;
  stripeClientSecret: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  products: PaymentProductModel[];
}

export interface ICoupon {
  _id: string;
  name: string;
  description: string;
  code: string;
  value: number;
  expiredDate: string | Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder {
  _id: string;

  transactionId: string;

  performerId: string;

  performerInfo?: any;

  userId: string;

  userInfo?: any;

  orderNumber: string;

  shippingCode: string;

  productId: string;

  productInfo: any;

  quantity: number;

  unitPrice: number;

  totalPrice: number;

  deliveryAddress?: string;

  deliveryStatus: string;

  postalCode?: string;

  userNote?: string;

  phoneNumber?: string;

  createdAt: Date;

  updatedAt: Date;

  digitalPath: string;

  deliveryAddressId: string;
}

export interface IPaymentCard {
  _id: string;

  source: string;

  sourceId: string;

  paymentGateway: string;

  isProduction: boolean;

  customerId: string;

  holderName: string;

  first4Digits: string;

  last4Digits: string;

  brand: string;

  month: string;

  year: string;

  // card id, card token,...
  token: string;

  createdAt: Date;

  updatedAt: Date;
}
