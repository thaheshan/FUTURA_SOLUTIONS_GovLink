import {
  Controller,
  Injectable,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Param,
  Post,
  UseGuards,
  Body,
  Get,
  Delete,
  Query
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { CurrentUser, Roles } from 'src/modules/auth';
import { DataResponse, PageableData } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { PayoutRequestService } from '../services/payout-request.service';
import { PayoutRequestSearchPayload, PayoutRequestUpdatePayload } from '../payloads/payout-request.payload';
import { PayoutRequestDto } from '../dtos/payout-request.dto';

@Injectable()
@Controller('admin/payout-requests')
export class AdminPayoutRequestController {
  constructor(private readonly payoutRequestService: PayoutRequestService) {}

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async adminSearch(
    @Query() req: PayoutRequestSearchPayload,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<PageableData<PayoutRequestDto>>> {
    const data = await this.payoutRequestService.search(req, user);
    return DataResponse.ok(data);
  }

  // @Post('/payout/:id')
  // @HttpCode(HttpStatus.OK)
  // @Roles('admin')
  // @UseGuards(RoleGuard)
  // @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  // async payout(
  //   @Param('id') id: string
  // ): Promise<DataResponse<any>> {
  //   const data = await this.payoutRequestService.adminStripePayout(id);
  //   return DataResponse.ok(data);
  // }

  @Post('/status/:id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateStatus(
    @Param('id') id: string,
    @Body() payload: PayoutRequestUpdatePayload
  ): Promise<DataResponse<any>> {
    const data = await this.payoutRequestService.adminUpdateStatus(id, payload);
    return DataResponse.ok(data);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async adminDetails(@Param('id') id: string): Promise<DataResponse<any>> {
    const data = await this.payoutRequestService.adminDetails(id);
    return DataResponse.ok(data);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async delete(@Param('id') id: string): Promise<DataResponse<any>> {
    const data = await this.payoutRequestService.adminDelete(id);
    return DataResponse.ok(data);
  }

  @Post('/calculate')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async calculate(
    @Body() payload: { performerId: string },
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<any>> {
    const data = await this.payoutRequestService.calculate(user, payload);
    return DataResponse.ok(data);
  }
}
