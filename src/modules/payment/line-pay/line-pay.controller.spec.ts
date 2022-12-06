import { Test, TestingModule } from '@nestjs/testing';
import { LinePayController } from './line-pay.controller';
import { LinePayService } from './line-pay.service';

describe('LinePayController', () => {
  let controller: LinePayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinePayController],
      providers: [LinePayService],
    }).compile();

    controller = module.get<LinePayController>(LinePayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
