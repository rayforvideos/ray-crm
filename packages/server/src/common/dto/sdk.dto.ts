import { IsString, IsOptional, IsObject, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class IdentifyDto {
  @IsString()
  externalId!: string;

  @IsObject()
  @IsOptional()
  properties?: Record<string, unknown>;
}

export class TrackDto {
  @IsString()
  externalId!: string;

  @IsString()
  name!: string;

  @IsObject()
  @IsOptional()
  properties?: Record<string, unknown>;

  @IsOptional()
  timestamp?: string;
}

export class TrackBatchDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrackDto)
  events!: TrackDto[];
}

export class ActionFeedbackDto {
  @IsString()
  actionLogId!: string;

  @IsString()
  status!: 'clicked' | 'dismissed';
}
