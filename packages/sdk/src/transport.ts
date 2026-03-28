import type { RayCRMConfig } from './types';

export class Transport {
  constructor(private readonly config: RayCRMConfig) {}

  async get<T = unknown>(path: string): Promise<T> {
    const res = await fetch(`${this.config.serverUrl}/api${path}`, {
      headers: {
        'x-app-key': this.config.appKey,
      },
    });

    if (!res.ok) {
      throw new Error(`CRM API error: ${res.status} ${res.statusText}`);
    }

    return res.json() as Promise<T>;
  }

  async post<T = unknown>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.config.serverUrl}/api${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-key': this.config.appKey,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`CRM API error: ${res.status} ${res.statusText}`);
    }

    return res.json() as Promise<T>;
  }
}
