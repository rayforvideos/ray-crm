import { IsString, IsObject } from 'class-validator';
import { SegmentConditions } from '../entities/segment.entity';

export class CreateSegmentDto {
  @IsString()
  name!: string;

  @IsObject()
  conditions!: SegmentConditions;
}
