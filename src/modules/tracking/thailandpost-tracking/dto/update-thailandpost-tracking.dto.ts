import { PartialType } from '@nestjs/mapped-types';
import { CreateThailandpostTrackingDto } from './create-thailandpost-tracking.dto';

export class UpdateThailandpostTrackingDto extends PartialType(CreateThailandpostTrackingDto) {}
