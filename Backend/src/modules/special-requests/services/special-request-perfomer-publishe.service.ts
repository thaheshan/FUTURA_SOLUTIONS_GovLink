import {
  Injectable,
  Inject,
  BadRequestException,
  forwardRef,
  NotFoundException
} from '@nestjs/common';
import { FileService } from 'src/modules/file/services';
import { Model, Types } from 'mongoose';
import { SpecialRequestPerformerPublishDto } from '../dtos';
import { SpecialRequestPerfomerPublishedModel } from '../models';
import { SpecialRequestTypeModel } from '../models/special-request-type.model';
import { SPECIAL_REQUEST_PERFORMER_PAGE_PROVIDER, SPECIAL_REQUEST_TYPE_MODEL_PROVIDER } from '../providers';
import {
  SpecialRequestTypeAddPerfomerPayload,
  SpecialRequestPerformerPublishPagePayload
} from '../payloads';


@Injectable()
export class SpecialRequestPerfomerPublishService {
  constructor(
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
    @Inject(SPECIAL_REQUEST_TYPE_MODEL_PROVIDER)
    private readonly specialRequestTypeModel: Model<SpecialRequestTypeModel>,
    @Inject(SPECIAL_REQUEST_PERFORMER_PAGE_PROVIDER)
    private readonly specialRequestPulishPageModel: Model<SpecialRequestPerfomerPublishedModel>
  ) {}

  public async addSpecialRequestPerformerPage(
    payload: SpecialRequestTypeAddPerfomerPayload,
    creatorId: Types.ObjectId
  ):Promise<SpecialRequestPerformerPublishDto>{
    try{
      let addedRequest;
      if(payload._id){
        addedRequest=await this.specialRequestPulishPageModel.findByIdAndUpdate(
          new Types.ObjectId(payload._id),
          {
            $push:{
              specialRequestTypes:payload.specialRequestTypes
            }
          },
          {new:true}
        )
        const dto = new SpecialRequestPerformerPublishDto(addedRequest);
        return dto;
      } 
      addedRequest = await this.specialRequestPulishPageModel.create({...payload,creatorId})
      const dto = new SpecialRequestPerformerPublishDto(addedRequest);
      return dto;
    }catch(e){
        console.error('Error in service:', e);
        throw e;
    }
  }

  public async updateSpecialRequestPage(
    payload: SpecialRequestTypeAddPerfomerPayload,
    creatorId: Types.ObjectId
  ):Promise<SpecialRequestPerformerPublishDto>{
    try{
      const res= await this.specialRequestPulishPageModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(payload._id),
          creatorId,
          'specialRequestTypes._id': new Types.ObjectId(payload.specialRequestTypes[0]._id)
        },
        {
          $set: {
            'specialRequestTypes.$.name':payload.specialRequestTypes[0].name,
            'specialRequestTypes.$.requestDescription':payload.specialRequestTypes[0].requestDescription,
            'specialRequestTypes.$.enabled':payload.specialRequestTypes[0].enabled,
            'specialRequestTypes.$.basePrice':payload.specialRequestTypes[0].basePrice,
            'specialRequestTypes.$.highlights':payload.specialRequestTypes[0].highlights
          }
        },
        { new: true }
      )
      const dto = new SpecialRequestPerformerPublishDto(res);
      return dto;
    }catch(e){
      console.error('Error in service:', e);
      throw e;
    }
  }

  public async publishSpecialRequestPage(
    payload: SpecialRequestPerformerPublishPagePayload,
    creatorId: Types.ObjectId
  ):Promise<SpecialRequestPerformerPublishDto>{
    try{

      if(!creatorId){
        throw new BadRequestException('Missing required fields');
      }
      let pageDet;
      if(payload._id){
        pageDet= await this.specialRequestPulishPageModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(payload._id),
          creatorId
        },
        {
          pageDescription:payload.pageDescription,
          isPublished:payload.isPublished
        },
        { new: true }
      )
      const dto = new SpecialRequestPerformerPublishDto(pageDet);
      return dto;

      }
      pageDet = await this.specialRequestPulishPageModel.create({...payload,creatorId})
      const dto = new SpecialRequestPerformerPublishDto(pageDet);
      return dto;

    }catch(e){
      console.error('Error in service:', e);
      throw e;
    }
  }

  public async uploadTeaserVideo(
    fileId: Types.ObjectId,
    creatorId: Types.ObjectId
  ):Promise<any>{
    try{
      const pageExists= await this.specialRequestPulishPageModel.findOne({creatorId}).lean();
      if (!pageExists) {
        throw new NotFoundException('Special request page does not exist for this creator');
      }
      if(pageExists.specialRequestTeaserVideo?.length>3){
        throw new BadRequestException('You can only upload a maximum of 3 teaser videos');
      }
      const pageDet= await this.specialRequestPulishPageModel.findOneAndUpdate(
        {
          creatorId
        },
        {
          $push:{
            specialRequestTeaserVideo:{teaserVideoId: fileId}
          }
        },
        { new: true }
      )
      const dto = new SpecialRequestPerformerPublishDto(pageDet);
      return dto;
    }catch(e){
      console.error('Error in uploadTeaser:', e);
      throw e;
    }
  }

  public async getSpecialRequestPage(
    creatorId: Types.ObjectId
  ):Promise<SpecialRequestPerformerPublishDto>{
    try{
      const specialRequestPage=await this.specialRequestPulishPageModel.findOne({
        creatorId
      }).lean();
      if (!specialRequestPage) return null;

      if (specialRequestPage.specialRequestTeaserVideo?.length > 0) {
        const teaserVideosWithUrls = await Promise.all(
          specialRequestPage.specialRequestTeaserVideo.map(async (data) => {
            if (data.teaserVideoId) {
              const teaserFile = await this.fileService.findById(data.teaserVideoId);
              if (teaserFile) {
                // eslint-disable-next-line no-param-reassign
                data.url = teaserFile.getUrl();
                return data;
              }
            }
            return data;
          })
        );
        specialRequestPage.specialRequestTeaserVideo = teaserVideosWithUrls;
      }
      const typeIds = (specialRequestPage.specialRequestTypes || []).map((t) => t.specialRequestTypeId).filter((id) => !!id);
      const typeDocs = await this.specialRequestTypeModel.find({_id: { $in: typeIds }}).lean();
      const typeIdToCategoryMap = new Map<string, Types.ObjectId>();
      typeDocs.forEach(doc => {
        typeIdToCategoryMap.set(doc._id.toString(), doc.categoryId);
      });
      specialRequestPage.specialRequestTypes = specialRequestPage.specialRequestTypes.map((type) => {
        const categoryId = type.specialRequestTypeId ?
          typeIdToCategoryMap.get(type.specialRequestTypeId.toString()) :
          null;
        return {
          ...type,
          categoryId
        };
      });
      return new SpecialRequestPerformerPublishDto(specialRequestPage);
    }catch(e){
      console.error('Error in service:', e);
      throw e;
    }

  }

  public async getPerformersSpecialRequestPage(
    creatorId: Types.ObjectId|string
  ):Promise<SpecialRequestPerformerPublishDto>{
    try{
      const specialRequestPage=await this.specialRequestPulishPageModel.findOne({
        creatorId
      }).lean();
      if (!specialRequestPage) return null;

      if (specialRequestPage.specialRequestTeaserVideo?.length > 0) {
        const teaserVideosWithUrls = await Promise.all(
          specialRequestPage.specialRequestTeaserVideo.map(async (data) => {
            if (data.teaserVideoId) {
              const teaserFile = await this.fileService.findById(data.teaserVideoId);
              if (teaserFile) {
                // eslint-disable-next-line no-param-reassign
                data.url = teaserFile.getUrl();
                return data;
              }
            }
            return data;
          })
        );
        specialRequestPage.specialRequestTeaserVideo = teaserVideosWithUrls;
      }
      const typeIds = (specialRequestPage.specialRequestTypes || []).map((t) => t.specialRequestTypeId).filter((id) => !!id);
      const typeDocs = await this.specialRequestTypeModel.find({_id: { $in: typeIds }}).lean();
      const typeIdToCategoryMap = new Map<string, Types.ObjectId>();
      typeDocs.forEach(doc => {
        typeIdToCategoryMap.set(doc._id.toString(), doc.categoryId);
      });
      specialRequestPage.specialRequestTypes = specialRequestPage.specialRequestTypes.filter((type) => type.enabled).map((type) => {
        const categoryId = type.specialRequestTypeId ?
          typeIdToCategoryMap.get(type.specialRequestTypeId.toString()) :
          null;
        return {
          ...type,
          categoryId
        };
      });
      return new SpecialRequestPerformerPublishDto(specialRequestPage);
    }catch(e){
      console.error('Error in service:', e);
      throw e;
    }

  }
}
