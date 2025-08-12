import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PathIdDto } from 'src/kernel';
import { MembershipPlanService } from './membership-plan.service';
import { CreateMembershipPlanDto } from './dto/create-membership-plan.dto';

@Controller({ path: 'membership-plans', version: '1' })
@ApiTags('Membership plan')
export class MembershipPlanController {
    constructor(
        private readonly membershipPlanService: MembershipPlanService
    ) {}

    @Post()
    create(@Body() createMembershipPlanDto: CreateMembershipPlanDto) {
        return this.membershipPlanService.create(createMembershipPlanDto);
    }

    @Get(':id')
    findOne(@Param('id') { id }: PathIdDto) {
        return this.membershipPlanService.getOrThrow(id);
    }

    @Delete(':id')
    remove(@Param('id') { id }: PathIdDto) {
        return this.membershipPlanService.remove(id);
    }
}
