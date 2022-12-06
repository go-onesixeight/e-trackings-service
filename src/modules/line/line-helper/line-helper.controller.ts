import { Controller } from '@nestjs/common';
import { LineHelperService } from './line-helper.service';

@Controller('line-helper')
export class LineHelperController {
  constructor(private readonly lineHelperService: LineHelperService) {}
}
