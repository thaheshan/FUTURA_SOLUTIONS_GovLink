import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { SpecialRequestController } from './controllers/special-request.controller';
import { SpecialRequestService } from './services/special-request.service';
import { SpecialRequestCreatePayload } from './payloads';
import { UserDto } from '../user/dtos';

describe('SpecialRequestController', () => {
    let controller: SpecialRequestController;
    let service: SpecialRequestService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SpecialRequestController],
            providers: [
                {
                    provide: SpecialRequestService,
                    useValue: {
                        createRequest: jest.fn()
                    }
                }
            ]
        }).compile();

        controller = module.get<SpecialRequestController>(
            SpecialRequestController
        );
        service = module.get<SpecialRequestService>(SpecialRequestService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call service to create a special request', async () => {
        const payload: SpecialRequestCreatePayload = {
            creatorID: new Types.ObjectId().toHexString(),
            description: 'Sample request description',
            requestTypeID: new Types.ObjectId().toHexString(),
            totalPrice: 100,
            details: []
        };

        const mockUser: UserDto = new UserDto({
            _id: new Types.ObjectId(),
            email: 'test@example.com',
            roles: ['user'],
            username: 'testuser',
            name: 'Test User'
        });

        const mockResult = { id: new Types.ObjectId(), ...payload };
        jest.spyOn(service, 'createRequest').mockResolvedValue(
            mockResult as any
        );

        const result = await controller.createRequest(payload, mockUser);

        expect(service.createRequest).toHaveBeenCalledWith(
            payload,
            mockUser._id
        );
        expect(result).toEqual(mockResult);
    });
});
