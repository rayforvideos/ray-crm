import { Injectable, Logger } from '@nestjs/common';
import { CampaignsService } from '../campaigns/campaigns.service';
import { SegmentsService } from '../segments/segments.service';
import { ActionsService, ActionContext } from '../actions/actions.service';
import { Event } from '../common/entities/event.entity';
import { User } from '../common/entities/user.entity';

@Injectable()
export class TriggerEngineService {
  private readonly logger = new Logger(TriggerEngineService.name);

  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly segmentsService: SegmentsService,
    private readonly actionsService: ActionsService,
  ) {}

  async evaluate(event: Event, user: User) {
    const campaigns = await this.campaignsService.findActiveByEventName(
      event.appId,
      event.name,
    );

    for (const campaign of campaigns) {
      const segmentTriggers = campaign.triggers.filter((t) => t.type === 'segment' && t.segmentId);
      if (segmentTriggers.length > 0) {
        const segmentResults = await Promise.all(
          segmentTriggers.map((t) => this.segmentsService.evaluateUser(t.segmentId!, user.id)),
        );
        if (!segmentResults.every(Boolean)) continue;
      }

      const eventTrigger = campaign.triggers.find(
        (t) => t.type === 'event' && t.eventName === event.name,
      );
      if (eventTrigger?.eventConditions) {
        if (!this.matchEventConditions(eventTrigger.eventConditions, event.properties)) {
          continue;
        }
      }

      const ctx: ActionContext = {
        userId: user.id,
        campaignId: campaign.id,
        externalId: user.externalId,
        eventName: event.name,
        eventProperties: event.properties,
      };

      for (const action of campaign.actions) {
        try {
          await this.actionsService.dispatch(action, ctx);
        } catch (err) {
          this.logger.error(`Action dispatch failed: campaign=${campaign.id}, action=${action.id}`, err);
        }
      }
    }
  }

  private matchEventConditions(
    conditions: Record<string, unknown>,
    properties: Record<string, unknown>,
  ): boolean {
    for (const [key, expected] of Object.entries(conditions)) {
      if (properties[key] !== expected) return false;
    }
    return true;
  }
}
