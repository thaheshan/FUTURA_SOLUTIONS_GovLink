import { Injectable, Inject } from '@nestjs/common';
import { Model, SortOrder } from 'mongoose';
import * as moment from 'moment';
import { PageableData } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { SPECIAL_REQUEST_MODEL_PROVIDER } from '../providers';
import { SpecialRequestModel } from '../models';
import { SpecialRequestDto } from '../dtos';
import { SpecialRequestSearchRequest } from '../payloads';

@Injectable()
export class SpecialRequestSearchService {
  constructor(
    @Inject(SPECIAL_REQUEST_MODEL_PROVIDER)
    private readonly specialRequestModel: Model<SpecialRequestModel>
  ) {}

  /**
   * Admin search for all special requests with optional filters
   */
  public async adminSearch(
    req: SpecialRequestSearchRequest
  ): Promise<PageableData<SpecialRequestDto>> {
    const query = {} as any;

    // Full-text search for keywords in description or refundReason
    if (req.q) {
      const regexp = new RegExp(
        req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''),
        'i'
      );
      query.$or = [
        { description: { $regex: regexp } },
        { refundReason: { $regex: regexp } }
      ];
    }

    // Filter by date range
    if (req.fromDate && req.toDate) {
      query.creationDate = {
        $gte: moment(req.fromDate).startOf('day').toDate(),
        $lte: moment(req.toDate).endOf('day').toDate()
      };
    }

    // Filter by status
    if (req.status) query.status = req.status;

    // Sort and pagination
    let sort: { [key: string]: SortOrder } = { creationDate: -1 }; // Default to newest first
    if (req.sort && req.sortBy) {
      sort = { [req.sortBy]: req.sort === 'asc' ? 1 : -1 };
    }
    const limit = req.limit || 10;
    const offset = req.offset || 0;

    // Fetch results
    const [data, total] = await Promise.all([
      this.specialRequestModel
        .find(query)
        .lean()
        .sort(sort)
        .limit(limit)
        .skip(offset),
      this.specialRequestModel.countDocuments(query)
    ]);

    return {
      data: data.map((request) => new SpecialRequestDto(request)),
      total
    };
  }

  /**
   * Search requests specific to a creator
   */
  public async creatorSearch(
    req: SpecialRequestSearchRequest,
    user: UserDto
  ): Promise<PageableData<SpecialRequestDto>> {
    const query = {
      creatorID: user._id
    } as any;

    if (req.q) {
      const regexp = new RegExp(
        req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''),
        'i'
      );
      query.$or = [
        { description: { $regex: regexp } },
        { refundReason: { $regex: regexp } }
      ];
    }

    if (req.fromDate && req.toDate) {
      query.creationDate = {
        $gte: moment(req.fromDate).startOf('day').toDate(),
        $lte: moment(req.toDate).endOf('day').toDate()
      };
    }

    if (req.status) query.status = req.status;

    let sort: { [key: string]: SortOrder } = { creationDate: -1 };
    if (req.sort && req.sortBy) {
      sort = { [req.sortBy]: req.sort === 'asc' ? 1 : -1 };
    }
    const limit = req.limit || 10;
    const offset = req.offset || 0;

    const [data, total] = await Promise.all([
      this.specialRequestModel
        .find(query)
        .lean()
        .sort(sort)
        .limit(limit)
        .skip(offset),
      this.specialRequestModel.countDocuments(query)
    ]);

    return {
      data: data.map((request) => new SpecialRequestDto(request)),
      total
    };
  }

  /**
   * Search requests specific to a fan
   */
  public async fanSearch(
    req: SpecialRequestSearchRequest,
    user: UserDto
  ): Promise<PageableData<SpecialRequestDto>> {
    const query = {
      fanID: user._id
    } as any;

    if (req.q) {
      const regexp = new RegExp(
        req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''),
        'i'
      );
      query.$or = [
        { description: { $regex: regexp } },
        { refundReason: { $regex: regexp } }
      ];
    }

    if (req.fromDate && req.toDate) {
      query.creationDate = {
        $gte: moment(req.fromDate).startOf('day').toDate(),
        $lte: moment(req.toDate).endOf('day').toDate()
      };
    }

    if (req.status) query.status = req.status;

    let sort: { [key: string]: SortOrder } = { creationDate: -1 };
    if (req.sort && req.sortBy) {
      sort = { [req.sortBy]: req.sort === 'asc' ? 1 : -1 };
    }
    const limit = req.limit || 10;
    const offset = req.offset || 0;

    const [data, total] = await Promise.all([
      this.specialRequestModel
        .find(query)
        .lean()
        .sort(sort)
        .limit(limit)
        .skip(offset),
      this.specialRequestModel.countDocuments(query)
    ]);

    return {
      data: data.map((request) => new SpecialRequestDto(request)),
      total
    };
  }
}
