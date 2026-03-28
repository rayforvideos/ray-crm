import { Transport } from './transport';

interface QueuedEvent {
  externalId: string;
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: string;
}

export class EventBatcher {
  private queue: QueuedEvent[] = [];
  private timer: ReturnType<typeof setTimeout> | null = null;
  private readonly flushInterval = 1000;
  private readonly maxBatchSize = 20;

  constructor(private readonly transport: Transport) {}

  add(event: QueuedEvent) {
    this.queue.push(event);

    if (this.queue.length >= this.maxBatchSize) {
      this.flush();
      return;
    }

    if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.flushInterval);
    }
  }

  private async flush() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.queue.length === 0) return;

    const batch = this.queue.splice(0);

    try {
      await this.transport.post('/events/track/batch', { events: batch });
    } catch (err) {
      console.error('[RayCRM] Failed to flush events:', err);
      this.queue.unshift(...batch);
    }
  }

  destroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.flush();
  }
}
