import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Delete
} from '@nestjs/common';
import { UserV2Service } from './user-v2.service';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
export class UserV2Controller {
  constructor(private usersService: UserV2Service) {}

  @Roles('admin')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.usersService.update(id, updateDto);
  }

  @Roles('admin')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.deleteById(id);
  }
}
