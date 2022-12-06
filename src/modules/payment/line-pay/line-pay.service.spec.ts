import { Test, TestingModule } from '@nestjs/testing';
import { LinePayService } from './line-pay.service';

describe('LinePayService', () => {
  let service: LinePayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinePayService],
    }).compile();

    service = module.get<LinePayService>(LinePayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
