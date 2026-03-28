import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { Response } from 'express';

interface SseConnection {
  res: Response;
  appId: string;
  userId: string;
}

@Injectable()
export class SseService implements OnModuleInit, OnModuleDestroy {
  private publisher!: Redis;
  private subscriber!: Redis;
  private connections = new Map<string, SseConnection>();

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const redisConfig = {
      host: this.config.get('REDIS_HOST', 'localhost'),
      port: this.config.get<number>('REDIS_PORT', 6379),
    };

    this.publisher = new Redis(redisConfig);
    this.subscriber = new Redis(redisConfig);

    this.subscriber.subscribe('crm:actions');
    this.subscriber.on('message', (_channel: string, message: string) => {
      const { userId, data } = JSON.parse(message);
      this.sendToUser(userId, data);
    });
  }

  onModuleDestroy() {
    this.publisher.disconnect();
    this.subscriber.disconnect();
  }

  addConnection(connectionId: string, appId: string, userId: string, res: Response) {
    this.connections.set(connectionId, { res, appId, userId });

    res.on('close', () => {
      this.connections.delete(connectionId);
    });
  }

  async publishAction(userId: string, data: Record<string, unknown>) {
    await this.publisher.publish(
      'crm:actions',
      JSON.stringify({ userId, data }),
    );
  }

  private sendToUser(userId: string, data: Record<string, unknown>) {
    for (const [, conn] of this.connections) {
      if (conn.userId === userId) {
        conn.res.write(`data: ${JSON.stringify(data)}\n\n`);
      }
    }
  }
}
