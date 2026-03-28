import type { RayCRMConfig, UserProperties, EventProperties, ActionRenderer } from './types';
import { Transport } from './transport';
import { EventBatcher } from './event-batcher';
import { CampaignEngine } from './campaign-engine';

export class RayCRM {
  private transport: Transport;
  private batcher: EventBatcher;
  private campaignEngine: CampaignEngine;
  private renderer: ActionRenderer | null;
  private anonymousId: string;
  private externalId: string | null = null;
  private userId: string | null = null;

  private static readonly STORAGE_KEY_EXTERNAL_ID = 'ray_crm_ext_id';
  private static readonly STORAGE_KEY_USER_ID = 'ray_crm_user_id';

  private constructor(private readonly config: RayCRMConfig) {
    this.transport = new Transport(config);
    this.batcher = new EventBatcher(this.transport);
    this.renderer = config.renderer ?? null;
    this.campaignEngine = new CampaignEngine(
      this.transport,
      () => this.renderer,
      () => this.userId,
    );
    this.anonymousId = this.getOrCreateAnonymousId();
    this.restoreIdentity();
  }

  static init(config: RayCRMConfig): RayCRM {
    return new RayCRM(config);
  }

  async identify(externalId: string, properties?: UserProperties) {
    this.externalId = externalId;

    const user = await this.transport.post<{ id: string }>('/users/identify', {
      externalId,
      properties,
    });

    this.userId = user.id;
    this.persistIdentity();
    this.campaignEngine.fetchRules().catch(() => {});
  }

  track(eventName: string, properties?: EventProperties) {
    const id = this.externalId ?? this.anonymousId;
    this.batcher.add({
      externalId: id,
      name: eventName,
      properties,
      timestamp: new Date().toISOString(),
    });

    // Local rule matching — render inapp actions immediately
    this.campaignEngine.evaluate(eventName, properties as Record<string, unknown>);
  }

  destroy() {
    this.batcher.destroy();
  }

  private persistIdentity() {
    try {
      localStorage.setItem(RayCRM.STORAGE_KEY_EXTERNAL_ID, this.externalId!);
      localStorage.setItem(RayCRM.STORAGE_KEY_USER_ID, this.userId!);
    } catch { /* ignore */ }
  }

  private restoreIdentity() {
    try {
      const extId = localStorage.getItem(RayCRM.STORAGE_KEY_EXTERNAL_ID);
      const userId = localStorage.getItem(RayCRM.STORAGE_KEY_USER_ID);
      if (extId && userId) {
        this.externalId = extId;
        this.userId = userId;
        this.campaignEngine.fetchRules().catch(() => {});
      }
    } catch { /* ignore */ }
  }

  private getOrCreateAnonymousId(): string {
    const key = 'ray_crm_anon_id';
    let id: string | null = null;
    try {
      id = localStorage.getItem(key);
    } catch { /* SSR or no localStorage */ }
    if (!id) {
      id = `anon_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      try { localStorage.setItem(key, id); } catch { /* ignore */ }
    }
    return id;
  }
}
