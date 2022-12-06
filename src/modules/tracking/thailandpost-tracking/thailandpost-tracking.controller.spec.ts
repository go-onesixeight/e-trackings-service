import { Test, TestingModule } from '@nestjs/testing';
import { ThailandpostTrackingController } from './thailandpost-tracking.controller';
import { ThailandpostTrackingService } from './thailandpost-tracking.service';

describe('ThailandpostTrackingController', () => {
  let controller: ThailandpostTrackingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThailandpostTrackingController],
      providers: [ThailandpostTrackingService],
    }).compile();

    controller = module.get<ThailandpostTrackingController>(ThailandpostTrackingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
