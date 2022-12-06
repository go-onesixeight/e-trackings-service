import { Test, TestingModule } from '@nestjs/testing';
import { LineHelperService } from './line-helper.service';

describe('LineHelperService', () => {
  let service: LineHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LineHelperService],
    }).compile();

    service = module.get<LineHelperService>(LineHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
