# Ray CRM

기획자/마케터가 대시보드에서 캠페인을 설정하면, 클라이언트 웹에 심어진 SDK가 유저 이벤트를 수집하고 트리거 조건 충족 시 인앱 액션(토스트/모달/배너), 웹훅, 카카오 채널 메시지(구조만)를 자동 실행하는 CRM 시스템.

## Architecture

```
[클라이언트 웹] ←→ [SDK] ←REST/SSE→ [CRM Server (NestJS)]
                                           ├── PostgreSQL
                                           └── Redis

[기획자/마케터] → [Dashboard (React SPA)] ←REST→ [CRM Server]
```

## Packages

| 패키지 | 설명 | 기술 |
|--------|------|------|
| `@ray-crm/server` | API 서버 | NestJS, TypeORM, PostgreSQL, Redis |
| `@ray-crm/dashboard` | 관리자 대시보드 | React 18, Vite, React Router, TanStack Query, zustand |
| `@ray-crm/sdk` | 클라이언트 SDK | Vanilla TypeScript, Vite lib mode |

## Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (PostgreSQL + Redis)

## Getting Started

```bash
# 의존성 설치
pnpm install

# PostgreSQL + Redis 시작
pnpm db:up

# 서버 시작 (http://localhost:3000)
pnpm dev:server

# 대시보드 시작 (http://localhost:5173)
pnpm dev:dashboard
```

### 초기 설정

1. `http://localhost:5173` 접속
2. `admin` / `admin1234` 로 로그인
3. Settings 페이지에서 앱 생성 → appKey 복사
4. 캠페인 생성 및 활성화

## SDK Usage

```js
import { RayCRM } from '@ray-crm/sdk'

const crm = RayCRM.init({
  appKey: 'your-app-key',
  serverUrl: 'https://crm-api.example.com'
})

// 유저 식별
await crm.identify('user-123', {
  name: '홍길동',
  email: 'hong@example.com',
  plan: 'free'
})

// 이벤트 전송
crm.track('page_view', { path: '/pricing' })
crm.track('purchase', { amount: 29000, item: 'premium' })
```

## Action Channels

| 채널 | 전달 방식 | 상태 |
|------|-----------|------|
| 인앱 (토스트/모달/배너) | SSE (서버 → SDK) | 구현 완료 |
| 웹훅 | HTTP (서버 → 외부 URL) | 구현 완료 |
| 카카오 채널 | 외부 API | 구조만 |

## Scripts

```bash
pnpm build          # 전체 빌드
pnpm dev            # 전체 dev 모드
pnpm dev:server     # 서버만
pnpm dev:dashboard  # 대시보드만
pnpm db:up          # DB 시작
pnpm db:down        # DB 종료
pnpm typecheck      # 타입 체크
pnpm test           # 테스트
```

## Environment Variables

서버 환경변수는 `packages/server/.env`에 설정:

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `DB_HOST` | `localhost` | PostgreSQL 호스트 |
| `DB_PORT` | `5432` | PostgreSQL 포트 |
| `DB_USER` | `ray` | DB 유저 |
| `DB_PASSWORD` | `ray1234` | DB 비밀번호 |
| `DB_NAME` | `ray_crm` | DB 이름 |
| `REDIS_HOST` | `localhost` | Redis 호스트 |
| `REDIS_PORT` | `6379` | Redis 포트 |
| `JWT_SECRET` | `change-me-in-production` | JWT 시크릿 |
| `JWT_EXPIRES_IN` | `7d` | JWT 만료 시간 |
