# Ray CRM

대시보드에서 캠페인을 설정하면, 클라이언트 웹에 심어진 SDK가 유저 이벤트를 수집하고 트리거 조건 충족 시 인앱 액션(토스트/모달/배너), 웹훅을 자동 실행하는 CRM 시스템.

## Architecture

```
[클라이언트 웹] ←→ [SDK] ←REST/SSE→ [CRM Server (NestJS)]
                                           ├── PostgreSQL
                                           └── Redis

[대시보드 (React SPA)] ←REST→ [CRM Server]
```

## Getting Started

```bash
pnpm install
pnpm db:up
pnpm dev:server     # http://localhost:3000
pnpm dev:dashboard  # http://localhost:5173
```

로그인: `admin` / `admin1234` → Settings에서 앱 생성 → appKey 복사 → 캠페인 생성

## SDK

SDK는 렌더링을 직접 하지 않고, 호스트 앱의 디자인 시스템 컴포넌트에 위임합니다.

```js
import { RayCRM } from '@ray-crm/sdk'

const crm = RayCRM.init({
  appKey: 'your-app-key',
  serverUrl: 'https://crm-api.example.com',
  renderer: {
    toast: (config, { dismiss }) => { /* 디자인 시스템 Toast 사용 */ },
    modal: (config, { dismiss, click }) => { /* 디자인 시스템 Modal 사용 */ },
    banner: (config, { dismiss, click }) => { /* 디자인 시스템 Banner 사용 */ },
  }
})

// 유저 식별 (최초 1회, 이후 자동 복원)
await crm.identify('user-123', { name: '홍길동' })

// 이벤트 전송
crm.track('page_view', { path: '/pricing' })
crm.track('purchase', { amount: 29000 })
```

## Action Channels

| 채널 | 전달 방식 | 상태 |
|------|-----------|------|
| 인앱 (토스트/모달/배너) | SSE | 구현 완료 |
| 웹훅 | HTTP | 구현 완료 |
| 카카오 채널 | 외부 API | 구조만 |
