import type { RayCRMConfig, InappAction } from './types';

export class SseClient {
  private eventSource: EventSource | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private onAction: ((action: InappAction) => void) | null = null;

  constructor(private readonly config: RayCRMConfig) {}

  connect(userId: string, onAction: (action: InappAction) => void) {
    this.onAction = onAction;
    this.doConnect(userId);
  }

  private doConnect(userId: string) {
    const url = `${this.config.serverUrl}/api/sse/connect?userId=${encodeURIComponent(userId)}&appKey=${encodeURIComponent(this.config.appKey)}`;

    this.eventSource = new EventSource(url);

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'connected') return;
        if (this.onAction) {
          this.onAction(data as InappAction);
        }
      } catch {
        // ignore parse errors
      }
    };

    this.eventSource.onerror = () => {
      this.eventSource?.close();
      this.reconnectTimer = setTimeout(() => this.doConnect(userId), 3000);
    };
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    this.eventSource?.close();
    this.eventSource = null;
  }
}
