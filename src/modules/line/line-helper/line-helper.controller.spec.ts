import { Test, TestingModule } from '@nestjs/testing';
import { LineHelperController } from './line-helper.controller';
import { LineHelperService } from './line-helper.service';

describe('LineHelperController', () => {
  let controller: LineHelperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LineHelperController],
      providers: [LineHelperService],
    }).compile();

    controller = module.get<LineHelperController>(LineHelperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
