import { IsString, IsOptional, IsEnum, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { TriggerType } from '../entities/campaign-trigger.entity';
import { ActionType } from '../entities/campaign-action.entity';
import { HttpMethod } from '../entities/webhook-config.entity';

export class CreateTriggerDto {
  @IsEnum(['event', 'segment'] as const)
  type!: TriggerType;

  @IsString()
  @IsOptional()
  eventName?: string;

  @IsString()
  @IsOptional()
  segmentId?: string;

  @IsObject()
  @IsOptional()
  eventConditions?: Record<string, unknown>;
}

export class CreateWebhookConfigDto {
  @IsString()
  url!: string;

  @IsEnum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const)
  @IsOptional()
  method?: HttpMethod;

  @IsObject()
  @IsOptional()
  headers?: Record<string, string>;

  @IsString()
  @IsOptional()
  bodyTemplate?: string;
}

export class CreateActionDto {
  @IsEnum(['inapp_toast', 'inapp_modal', 'inapp_banner', 'webhook', 'kakao'] as const)
  type!: ActionType;

  @IsObject()
  @IsOptional()
  config?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => CreateWebhookConfigDto)
  @IsOptional()
  webhookConfig?: CreateWebhookConfigDto;
}

export class CreateCampaignDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTriggerDto)
  triggers!: CreateTriggerDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateActionDto)
  actions!: CreateActionDto[];
}

export class UpdateCampaignStatusDto {
  @IsEnum(['draft', 'active', 'paused'] as const)
  status!: 'draft' | 'active' | 'paused';
}
