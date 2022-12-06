import { Test, TestingModule } from '@nestjs/testing';
import { ThailandpostTrackingService } from './thailandpost-tracking.service';

describe('ThailandpostTrackingService', () => {
  let service: ThailandpostTrackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThailandpostTrackingService],
    }).compile();

    service = module.get<ThailandpostTrackingService>(ThailandpostTrackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
