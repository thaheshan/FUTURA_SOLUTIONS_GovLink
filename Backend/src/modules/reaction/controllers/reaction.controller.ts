/* eslint-disable no-param-reassign */
import {
  Controller,
  Injectable,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Get,
  UseGuards,
  Query,
  Post,
  Body,
  Delete,
  forwardRef,
  Inject,
  Request
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guards';
import { DataResponse, PageableData } from 'src/kernel';
import { CurrentUser } from 'src/modules/auth';
import { AuthService } from 'src/modules/auth/services';
import { ReactionService } from '../services/reaction.service';
import { ReactionCreatePayload, ReactionSearchRequestPayload } from '../payloads';
import { ReactionDto } from '../dtos/reaction.dto';
import { UserDto } from '../../user/dtos';

@Injectable()
@Controller('reactions')
export class ReactionController {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly reactionService: ReactionService
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(
    @CurrentUser() user: UserDto,
    @Body() payload: ReactionCreatePayload
  ): Promise<DataResponse<ReactionDto>> {
    const data = await this.reactionService.create(payload, user);
    return DataResponse.ok(data);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async remove(
    @CurrentUser() user: UserDto,
    @Body() payload: ReactionCreatePayload
  ): Promise<DataResponse<boolean>> {
    const data = await this.reactionService.remove(payload, user);
    return DataResponse.ok(data);
  }

  @Get('/feeds/bookmark')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async bookmarkFeeds(
    @Query() query: ReactionSearchRequestPayload,
    @CurrentUser() user: UserDto,
    @Request() req: any
  ): Promise<DataResponse<PageableData<ReactionDto>>> {
    const data = await this.reactionService.getListFeeds(query, user, req.jwToken);
    return DataResponse.ok(data);
  }

  @Get('/products/bookmark')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async bookmarkProducts(
    @Query() query: ReactionSearchRequestPayload,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<PageableData<ReactionDto>>> {
    const data = await this.reactionService.getListProduct(query, user);
    return DataResponse.ok(data);
  }

  @Get('/videos/bookmark')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async bookmarkVideo(
    @Query() query: ReactionSearchRequestPayload,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<PageableData<ReactionDto>>> {
    const data = await this.reactionService.getListVideo(query, user);
    return DataResponse.ok(data);
  }

  @Get('/galleries/bookmark')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async bookmarkGalleries(
    @Query() query: ReactionSearchRequestPayload,
    @CurrentUser() user: UserDto,
    @Request() req: any
  ): Promise<DataResponse<PageableData<ReactionDto>>> {
    const data = await this.reactionService.getListGallery(query, user, req.jwToken);
    return DataResponse.ok(data);
  }

  @Get('/performers/bookmark')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async bookmarkPerformers(
    @Query() req: ReactionSearchRequestPayload,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<PageableData<ReactionDto>>> {
    const data = await this.reactionService.getListPerformer(req, user);
    return DataResponse.ok(data);
  }
}
