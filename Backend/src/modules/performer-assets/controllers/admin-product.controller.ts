import {
  Controller,
  Injectable,
  UseGuards,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Put,
  Get,
  Param,
  Query,
  UseInterceptors,
  Delete,
  Request
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { DataResponse, getConfig } from 'src/kernel';
import { Roles, CurrentUser } from 'src/modules/auth';
import { MultiFileUploadInterceptor, FilesUploaded } from 'src/modules/file';
import { UserDto } from 'src/modules/user/dtos';
import { S3ObjectCannelACL, Storage } from 'src/modules/storage/contants';
import { ProductService } from '../services/product.service';
import { ProductCreatePayload, ProductSearchRequest } from '../payloads';
import { ProductSearchService } from '../services/product-search.service';

@Injectable()
@Controller('admin/performer-assets/products')
export class AdminPerformerProductsController {
  constructor(
    private readonly productService: ProductService,
    private readonly productSearchService: ProductSearchService
  ) {}

  @Post('/')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseInterceptors(
    // TODO - check and support multiple files!!!
    MultiFileUploadInterceptor([
      {
        type: 'performer-product-image',
        fieldName: 'image',
        options: {
          destination: getConfig('file').imageDir,
          generateThumbnail: true,
          uploadImmediately: true,
          thumbnailSize: getConfig('image').originThumbnail,
          acl: S3ObjectCannelACL.PublicRead,
          server: Storage.S3
        }
      },
      {
        type: 'performer-product-digital',
        fieldName: 'digitalFile',
        options: {
          destination: getConfig('file').digitalProductDir,
          uploadImmediately: true,
          acl: S3ObjectCannelACL.AuthenticatedRead,
          server: Storage.S3
        }
      }
    ])
  )
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(
    @FilesUploaded() files: Record<string, any>,
    @Body() payload: ProductCreatePayload,
    @CurrentUser() creator: UserDto
  ): Promise<any> {
    const resp = await this.productService.create(
      payload,
      files.digitalFile,
      files.image,
      creator
    );
    return DataResponse.ok(resp);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseInterceptors(
    // TODO - check and support multiple files!!!
    MultiFileUploadInterceptor([
      {
        type: 'performer-product-image',
        fieldName: 'image',
        options: {
          destination: getConfig('file').imageDir,
          uploadImmediately: true,
          generateThumbnail: true,
          thumbnailSize: getConfig('image').originThumbnail,
          acl: S3ObjectCannelACL.PublicRead,
          server: Storage.S3
        }
      },
      {
        type: 'performer-product-digital',
        fieldName: 'digitalFile',
        options: {
          destination: getConfig('file').digitalProductDir,
          uploadImmediately: true,
          acl: S3ObjectCannelACL.AuthenticatedRead,
          server: Storage.S3
        }
      }
    ])
  )
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(
    @Param('id') id: string,
    @FilesUploaded() files: Record<string, any>,
    @Body() payload: ProductCreatePayload,
    @CurrentUser() updater: UserDto
  ): Promise<any> {
    const resp = await this.productService.update(
      id,
      payload,
      files.digitalFile,
      files.image,
      updater
    );
    return DataResponse.ok(resp);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: UserDto
  ): Promise<any> {
    const resp = await this.productService.delete(id, user);
    return DataResponse.ok(resp);
  }

  @Get('/:id/view')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async details(
    @Param('id') id: string,
    @CurrentUser() user: UserDto,
    @Request() req: any
  ): Promise<any> {
    const resp = await this.productService.getDetails(id, user, req.jwToken);
    return DataResponse.ok(resp);
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async search(@Query() req: ProductSearchRequest): Promise<any> {
    const resp = await this.productSearchService.adminSearch(req);
    return DataResponse.ok(resp);
  }
}
