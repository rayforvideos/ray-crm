# Ray CRM Design Spec

## Overview

기획자/마케터가 CRM 대시보드에서 캠페인을 설정하면, 클라이언트 웹에 심어진 SDK가 유저 이벤트를 수집하고, 트리거 조건 충족 시 인앱 액션(토스트/모달/배너), 웹훅, 카카오 채널 메시지(구조만)를 자동 실행하는 시스템.

## Tech Stack

- **Server:** NestJS, TypeORM, PostgreSQL, Redis (ioredis)
- **Dashboard:** React 18, Vite SPA, React Router, TanStack Query, zustand, @rasign/react, @rasign/tokens
- **SDK:** Vanilla TypeScript (Vite lib mode), @rasign/react + @rasign/tokens 번들 포함
- **Monorepo:** pnpm workspace + Turborepo

## Architecture

```
[클라이언트 웹] ←→ [SDK] ←REST/SSE→ [CRM Server (NestJS)]
                                           ├── PostgreSQL (유저/이벤트/캠페인)
                                           └── Redis (SSE 연결 관리, 세그먼트 캐싱)

[기획자/마케터] → [Dashboard (React SPA)] ←REST→ [CRM Server]
```

### 핵심 흐름

1. SDK가 클라이언트 웹에서 유저 식별 + 이벤트 수집 → REST로 서버 전송
2. 서버가 이벤트 수신 → 캠페인 룰 평가 (이벤트 트리거 + 세그먼트 조건)
3. 매칭되면 액션 실행:
   - 인앱 → SSE로 SDK에 푸시 → SDK가 rasign 컴포넌트로 토스트/모달/배너 렌더링
   - 웹훅 → HTTP 요청 발송 (URL + 메서드 + 헤더 + 바디 템플릿, 재시도 최대 3회)
   - 카카오 → 외부 API 호출 (구조만 잡아두고 연동은 추후)
4. 대시보드에서 기획자가 캠페인 생성/관리, 이벤트 로그 조회, 세그먼트 설정

### 액션 채널

| 채널 | 전달 방식 | 상태 |
|------|-----------|------|
| 인앱 (토스트/모달/배너) | SSE (서버→SDK) | 구현 |
| 웹훅 | HTTP POST (서버→외부 URL) | 구현 |
| 카카오 채널 | 외부 API | 구조만 |

### 통신 방식

- **이벤트 수집 + 액션 피드백(클릭/닫기):** REST API (SDK → 서버)
- **인앱 액션 전달:** SSE (서버 → SDK, 실시간 푸시)

## Data Model

### users

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | 내부 ID |
| external_id | VARCHAR | 클라이언트 앱의 유저 ID |
| app_id | UUID (FK) | 소속 앱 |
| properties | JSONB | 커스텀 속성 (이름, 이메일 등) |
| first_seen_at | TIMESTAMP | 최초 인식 |
| last_seen_at | TIMESTAMP | 마지막 활동 |
| created_at | TIMESTAMP | 생성일 |
| updated_at | TIMESTAMP | 수정일 |

### events

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | |
| user_id | UUID (FK) | |
| app_id | UUID (FK) | |
| name | VARCHAR | 이벤트명 (page_view, purchase 등) |
| properties | JSONB | 이벤트 속성 |
| timestamp | TIMESTAMP | 이벤트 발생 시각 |
| created_at | TIMESTAMP | 서버 수신 시각 |

### campaigns

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | |
| app_id | UUID (FK) | |
| name | VARCHAR | 캠페인명 |
| description | TEXT | 설명 |
| status | ENUM | draft / active / paused |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### campaign_triggers

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | |
| campaign_id | UUID (FK) | |
| type | ENUM | event / segment |
| event_name | VARCHAR | 트리거 이벤트명 (type=event일 때) |
| segment_id | UUID (FK) | 트리거 세그먼트 (type=segment일 때) |
| event_conditions | JSONB | 이벤트 속성 조건 (선택) |

### campaign_actions

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | |
| campaign_id | UUID (FK) | |
| type | ENUM | inapp_toast / inapp_modal / inapp_banner / webhook / kakao |
| config | JSONB | 액션별 설정 (폼 입력 내용, 웹훅 설정 등) |

### action_logs

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | |
| campaign_id | UUID (FK) | |
| action_id | UUID (FK) | |
| user_id | UUID (FK) | |
| action_type | ENUM | inapp_toast / inapp_modal / inapp_banner / webhook / kakao |
| status | ENUM | sent / clicked / dismissed / failed |
| metadata | JSONB | 에러 메시지, 응답 코드 등 |
| created_at | TIMESTAMP | |

### segments

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | |
| app_id | UUID (FK) | |
| name | VARCHAR | 세그먼트명 |
| conditions | JSONB | 필터 조건 |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

#### 세그먼트 조건 구조

```json
{
  "operator": "AND",
  "conditions": [
    { "field": "properties.plan", "op": "eq", "value": "free" },
    { "field": "last_seen_at", "op": "lt", "value": "-7d" }
  ]
}
```

### webhook_configs

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | |
| campaign_action_id | UUID (FK) | |
| url | VARCHAR | 요청 URL |
| method | ENUM | GET / POST / PUT / PATCH / DELETE |
| headers | JSONB | 커스텀 헤더 |
| body_template | TEXT | 바디 템플릿 (변수 치환: `{{userId}}`, `{{eventName}}` 등) |
| max_retries | INTEGER | 최대 재시도 횟수 (기본 3) |

### apps

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | |
| name | VARCHAR | 앱 이름 |
| app_key | VARCHAR (UNIQUE) | SDK 인증용 키 |
| created_at | TIMESTAMP | |

## SDK Design

### 초기화

```js
import { RayCRM } from '@ray-crm/sdk'

const crm = RayCRM.init({
  appKey: 'your-app-key',
  serverUrl: 'https://crm-api.example.com'
})
```

### 유저 식별

```js
crm.identify('user-123', {
  name: '홍길동',
  email: 'hong@example.com',
  plan: 'free'
})
```

### 이벤트 전송

```js
crm.track('purchase', { amount: 29000, item: 'premium' })
```

### 내부 동작

- `init()` → SSE 연결 수립, 서버로부터 액션 대기
- `identify()` → REST로 유저 등록/업데이트. 호출 전까지 익명 ID 사용, 호출 시 병합
- `track()` → REST로 이벤트 전송. 짧은 간격 내 이벤트를 배치로 모아서 전송
- SSE 수신 시 → 액션 타입에 따라 rasign 컴포넌트(Toast/Modal/Banner)를 DOM에 렌더링
- 액션 피드백(클릭/닫기) → REST로 서버에 전송

### 인앱 렌더링

- SDK가 rasign의 CSS + 컴포넌트를 번들에 포함
- Shadow DOM 컨테이너에 렌더링하여 호스트 앱 스타일과 격리

## Server Module Structure (NestJS)

```
packages/server/src/
├── auth/           ← 대시보드 로그인 (JWT)
├── apps/           ← 앱 관리 (appKey 발급)
├── users/          ← SDK로 수집된 유저 CRUD
├── events/         ← 이벤트 수신 + 저장
├── campaigns/      ← 캠페인 CRUD + 상태 관리
├── segments/       ← 세그먼트 정의 + 유저 평가
├── actions/        ← 액션 실행 엔진
│   ├── inapp/      ← SSE 푸시
│   ├── webhook/    ← HTTP 요청 발송 + 재시도
│   └── kakao/      ← 카카오 연동 (구조만)
├── sse/            ← SSE 연결 관리 (Redis pub/sub)
├── trigger-engine/ ← 이벤트 수신 → 캠페인 룰 매칭 → 액션 디스패치
└── common/         ← guards, decorators, pipes, types
```

### 트리거 엔진 흐름

1. `events` 모듈이 이벤트 수신
2. `trigger-engine`이 해당 이벤트에 매칭되는 active 캠페인 조회
3. 세그먼트 조건이 있으면 `segments` 모듈로 유저 평가
4. 조건 충족 시 `actions` 모듈로 액션 디스패치
5. `action_logs`에 실행 이력 기록

### 세그먼트 평가

- 이벤트 트리거 시 실시간 평가 (PostgreSQL 쿼리)
- 자주 쓰는 세그먼트 결과는 Redis에 캐싱

### 웹훅 실행

- 대시보드에서 URL + HTTP 메서드 + 헤더 + 바디 템플릿 설정
- 바디 템플릿 내 변수 치환: `{{userId}}`, `{{eventName}}`, `{{eventProperties.xxx}}`
- 실패 시 최대 3회 재시도

## Dashboard Routes

| 경로 | 화면 | 설명 |
|------|------|------|
| `/login` | 로그인 | JWT 인증 |
| `/` | 대시보드 홈 | 주요 지표 요약 (활성 캠페인 수, 오늘 이벤트 수, 최근 액션 로그) |
| `/campaigns` | 캠페인 목록 | 상태별 필터 (draft/active/paused), 검색 |
| `/campaigns/new` | 캠페인 생성 | 스텝 폼: 기본정보 → 트리거 설정 → 액션 설정 → 확인 |
| `/campaigns/:id` | 캠페인 상세 | 설정 조회/수정, 액션 로그, 성과 지표 |
| `/segments` | 세그먼트 목록 | 정의된 세그먼트 + 해당 유저 수 |
| `/segments/new` | 세그먼트 생성 | 조건 빌더 (필드/연산자/값 조합) |
| `/users` | 유저 목록 | 속성 검색/필터, 이벤트 이력 조회 |
| `/users/:id` | 유저 상세 | 속성, 이벤트 타임라인, 받은 액션 이력 |
| `/events` | 이벤트 로그 | 실시간 이벤트 스트림, 필터 |
| `/settings` | 설정 | 앱 관리 (appKey), 웹훅 기본 설정 |

### 캠페인 생성 폼 흐름

1. **기본정보** — 캠페인 이름, 설명
2. **트리거** — 이벤트 선택 or 세그먼트 선택
3. **액션** — 타입 선택(토스트/모달/배너/웹훅/카카오) → 타입별 폼 입력
4. **확인** — 요약 → 저장 (draft 상태로)

### 인앱 액션 폼 필드

**토스트:**
- 메시지 텍스트
- 타입 (info / success / warning / error)
- 지속 시간 (초)

**모달:**
- 제목
- 본문 텍스트
- 이미지 URL (선택)
- 버튼 텍스트 + 링크 (최대 2개)

**배너:**
- 텍스트
- 배경색
- 링크 URL (선택)
- 위치 (top / bottom)
- 닫기 가능 여부

## Package Structure

```
ray-crm/
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── packages/
│   ├── server/               ← NestJS + TypeORM + PostgreSQL + Redis
│   ├── dashboard/            ← React + Vite + React Router + @rasign/react
│   └── sdk/                  ← Vanilla TS, Vite lib mode
└── docs/
    └── superpowers/
        └── specs/
```

### 주요 의존성

| 패키지 | 기술 |
|--------|------|
| **server** | NestJS, TypeORM, PostgreSQL (pg), ioredis, passport-jwt, class-validator |
| **dashboard** | React 18, Vite, React Router, @rasign/react, @rasign/tokens, TanStack Query, zustand |
| **sdk** | Vanilla TypeScript (의존성 최소화), @rasign/react + @rasign/tokens 번들 포함 |

### 공유 타입

`packages/server/src/common/types/`에 정의된 DTO/인터페이스를 dashboard와 sdk에서 Turborepo 내부 패키지 참조로 사용. 별도 shared 패키지 없이 해결.
