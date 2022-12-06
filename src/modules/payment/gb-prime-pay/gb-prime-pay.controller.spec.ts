import { Test, TestingModule } from '@nestjs/testing';
import { GbPrimePayController } from './gb-prime-pay.controller';
import { GbPrimePayService } from './gb-prime-pay.service';

describe('GbPrimePayController', () => {
  let controller: GbPrimePayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GbPrimePayController],
      providers: [GbPrimePayService],
    }).compile();

    controller = module.get<GbPrimePayController>(GbPrimePayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
