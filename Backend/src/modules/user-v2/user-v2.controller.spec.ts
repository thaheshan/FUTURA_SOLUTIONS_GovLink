import { Test, TestingModule } from '@nestjs/testing';
import { UserV2Controller } from './user-v2.controller';
import { UserV2Service } from './user-v2.service';

describe('UserV2Controller', () => {
  let controller: UserV2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserV2Controller],
      providers: [UserV2Service]
    }).compile();

    controller = module.get<UserV2Controller>(UserV2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
