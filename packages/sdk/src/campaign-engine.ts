import type { CampaignRule, CampaignRuleAction, ActionRenderer, ActionCallbacks } from './types';
import { Transport } from './transport';

export class CampaignEngine {
  private rules: CampaignRule[] = [];

  constructor(
    private readonly transport: Transport,
    private readonly getRenderer: () => ActionRenderer | null,
    private readonly getUserId: () => string | null,
  ) {}

  async fetchRules() {
    this.rules = await this.transport.get<CampaignRule[]>('/sdk/campaigns/rules');
  }

  evaluate(eventName: string, properties?: Record<string, unknown>) {
    const renderer = this.getRenderer();
    if (!renderer) return;

    for (const rule of this.rules) {
      const eventTrigger = rule.triggers.find(
        (t) => t.type === 'event' && t.eventName === eventName,
      );
      if (!eventTrigger) continue;

      if (eventTrigger.eventConditions) {
        if (!this.matchConditions(eventTrigger.eventConditions, properties ?? {})) continue;
      }

      for (const action of rule.actions) {
        this.renderAction(renderer, action, rule.id);
      }
    }
  }

  private matchConditions(
    conditions: Record<string, unknown>,
    properties: Record<string, unknown>,
  ): boolean {
    for (const [key, expected] of Object.entries(conditions)) {
      if (properties[key] !== expected) return false;
    }
    return true;
  }

  private renderAction(renderer: ActionRenderer, action: CampaignRuleAction, campaignId: string) {
    const userId = this.getUserId();
    if (!userId) return;

    // Create action log asynchronously
    this.transport
      .post<{ id: string }>('/events/action-log', {
        campaignId,
        actionId: action.id,
        userId,
        actionType: action.type,
      })
      .then((log) => {
        const callbacks: ActionCallbacks = {
          dismiss: () => {
            this.transport.post('/events/feedback', { actionLogId: log.id, status: 'dismissed' }).catch(() => {});
          },
          click: (url?: string) => {
            this.transport.post('/events/feedback', { actionLogId: log.id, status: 'clicked' }).catch(() => {});
            if (url) window.open(url, '_blank');
          },
        };

        switch (action.type) {
          case 'inapp_toast':
            renderer.toast(action.config as any, callbacks);
            break;
          case 'inapp_modal':
            renderer.modal(action.config as any, callbacks);
            break;
          case 'inapp_banner':
            renderer.banner(action.config as any, callbacks);
            break;
        }
      })
      .catch(() => {});
  }
}
