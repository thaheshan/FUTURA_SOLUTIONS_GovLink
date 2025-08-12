import {
  Controller,
  Injectable,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Query,
  UseGuards,
  ValidationPipe,
  UsePipes,
  Request
} from '@nestjs/common';
import { DataResponse, ForbiddenException } from 'src/kernel';
import { CurrentUser } from 'src/modules/auth';
import { LoadUser } from 'src/modules/auth/guards';
import { UserDto } from 'src/modules/user/dtos';
import { VideoService } from '../services/video.service';
import { VideoSearchRequest } from '../payloads';
import { VideoSearchService } from '../services/video-search.service';
import { AuthService } from '../../auth/services';

@Injectable()
@Controller('performer-assets/videos')
export class UserVideosController {
  constructor(
    private readonly videoService: VideoService,
    private readonly videoSearchService: VideoSearchService,
    private readonly authService: AuthService
  ) { }

  @Get('/search')
  @UseGuards(LoadUser)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async search(
    @Query() req: VideoSearchRequest,
    @CurrentUser() user: UserDto
  ) {
    const resp = await this.videoSearchService.userSearch(req, user);
    return DataResponse.ok(resp);
  }

  @Get('/auth/check')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async checkAuth(
    @Request() req: any
  ) {
    if (!req.query.token) throw new ForbiddenException();
    const decodded = await this.authService.verifySession(req.query.token);
    if (!decodded) throw new ForbiddenException();
    const user = await this.authService.getSourceFromAuthSession({
      source: decodded.source,
      sourceId: decodded.sourceId
    });
    if (!user) {
      throw new ForbiddenException();
    }
    const valid = await this.videoService.checkAuth(req, user);
    return DataResponse.ok(valid);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LoadUser)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async details(
    @Param('id') id: string,
    @CurrentUser() user: UserDto,
    @Request() req: any
  ) {
    const details = await this.videoService.userGetDetails(id, user, req.jwToken);
    return DataResponse.ok(details);
  }
}
