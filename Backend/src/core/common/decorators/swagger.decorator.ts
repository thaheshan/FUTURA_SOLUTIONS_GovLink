import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function GetAllDecorator(entityName: string): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: `Retrieve all ${entityName}` }),
        ApiResponse({ status: 200, description: 'Success' }),
        ApiResponse({ status: 404, description: 'Not Found' })
    );
}
