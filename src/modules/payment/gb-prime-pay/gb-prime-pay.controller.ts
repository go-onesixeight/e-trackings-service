import { Controller } from '@nestjs/common';
import { GbPrimePayService } from './gb-prime-pay.service';

@Controller('gb-prime-pay')
export class GbPrimePayController {
  constructor(private readonly gbPrimePayService: GbPrimePayService) {}
}
