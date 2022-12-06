import { Test, TestingModule } from '@nestjs/testing';
import { KerryexpressController } from './kerryexpress.controller';
import { KerryexpressService } from './kerryexpress.service';

describe('KerryexpressController', () => {
  let controller: KerryexpressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KerryexpressController],
      providers: [KerryexpressService],
    }).compile();

    controller = module.get<KerryexpressController>(KerryexpressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
