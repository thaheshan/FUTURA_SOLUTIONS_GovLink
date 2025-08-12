import { Test, TestingModule } from '@nestjs/testing';
import { UserV2Service } from './user-v2.service';

describe('UserV2Service', () => {
  let service: UserV2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserV2Service]
    }).compile();

    service = module.get<UserV2Service>(UserV2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
