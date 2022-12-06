import { Test, TestingModule } from '@nestjs/testing';
import { KerryexpressService } from './kerryexpress.service';

describe('KerryexpressService', () => {
  let service: KerryexpressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KerryexpressService],
    }).compile();

    service = module.get<KerryexpressService>(KerryexpressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
