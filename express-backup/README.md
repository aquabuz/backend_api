# Backend API for Flutter App

Supabase를 이용한 백엔드 API 서버입니다.

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 Supabase 정보를 입력합니다.

```bash
cp .env.example .env
```

필수 환경 변수:

- `SUPABASE_URL`: Supabase 프로젝트 URL
- `SUPABASE_ANON_KEY`: Supabase Anonymous Key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase Service Role Key

### 3. Supabase 테이블 생성

Supabase Dashboard에서 아래 SQL을 실행하여 테이블을 생성합니다:

```sql
-- Users table (Supabase Auth와 연동)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auctions table
CREATE TABLE IF NOT EXISTS public.auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  starting_price NUMERIC NOT NULL,
  current_price NUMERIC NOT NULL,
  seller_id UUID NOT NULL REFERENCES public.users(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'ended', 'cancelled')),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bids table
CREATE TABLE IF NOT EXISTS public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID NOT NULL REFERENCES public.auctions(id) ON DELETE CASCADE,
  bidder_id UUID NOT NULL REFERENCES public.users(id),
  amount NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view auctions" ON public.auctions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create auctions" ON public.auctions FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update own auctions" ON public.auctions FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can delete own auctions" ON public.auctions FOR DELETE USING (auth.uid() = seller_id);

CREATE POLICY "Anyone can view bids" ON public.bids FOR SELECT USING (true);
CREATE POLICY "Authenticated users can place bids" ON public.bids FOR INSERT WITH CHECK (auth.uid() = bidder_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_auctions_status ON public.auctions(status);
CREATE INDEX IF NOT EXISTS idx_auctions_seller_id ON public.auctions(seller_id);
CREATE INDEX IF NOT EXISTS idx_bids_auction_id ON public.bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_bids_bidder_id ON public.bids(bidder_id);
```

### 4. 개발 서버 실행

```bash
npm run dev
```

서버가 http://localhost:3000 에서 실행됩니다.

### 5. 프로덕션 빌드

```bash
npm run build
npm start
```

## 📁 프로젝트 구조

```
backend_api/
├── src/
│   ├── config/           # 환경 설정 및 Supabase 클라이언트
│   │   ├── index.ts
│   │   └── supabase.ts
│   ├── controllers/      # 요청 처리 컨트롤러
│   │   ├── auction.controller.ts
│   │   ├── bid.controller.ts
│   │   └── health.controller.ts
│   ├── middlewares/      # 미들웨어 (인증, 에러 처리, 검증)
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── validate.ts
│   ├── routes/           # API 라우트 정의
│   │   ├── auction.routes.ts
│   │   ├── bid.routes.ts
│   │   └── health.routes.ts
│   ├── services/         # 비즈니스 로직 및 DB 작업
│   │   ├── auction.service.ts
│   │   └── bid.service.ts
│   ├── types/            # TypeScript 타입 정의
│   │   ├── database.types.ts
│   │   └── index.ts
│   ├── utils/            # 유틸리티 함수
│   │   └── response.ts
│   ├── app.ts            # Express 앱 설정
│   └── index.ts          # 서버 진입점
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 API 엔드포인트

### Health Check

- `GET /api/v1/health` - 서버 상태 확인

### Auctions

- `GET /api/v1/auctions` - 경매 목록 조회
- `GET /api/v1/auctions/active` - 진행 중인 경매 조회
- `GET /api/v1/auctions/:id` - 경매 상세 조회
- `GET /api/v1/auctions/my` - 내 경매 목록 (인증 필요)
- `POST /api/v1/auctions` - 경매 생성 (인증 필요)
- `PUT /api/v1/auctions/:id` - 경매 수정 (인증 필요)
- `DELETE /api/v1/auctions/:id` - 경매 삭제 (인증 필요)
- `PATCH /api/v1/auctions/:id/status` - 경매 상태 변경 (인증 필요)

### Bids

- `GET /api/v1/auctions/:auctionId/bids` - 경매 입찰 목록
- `GET /api/v1/auctions/:auctionId/bids/highest` - 최고 입찰가 조회
- `POST /api/v1/auctions/:auctionId/bids` - 입찰하기 (인증 필요)
- `GET /api/v1/bids/my` - 내 입찰 목록 (인증 필요)

## 🔐 인증

Supabase Auth를 사용합니다. 인증이 필요한 API에는 `Authorization: Bearer <access_token>` 헤더를 포함해야 합니다.

## 🔗 Flutter 앱 연동

Flutter 앱에서 이 API를 사용하려면:

1. `supabase_flutter` 패키지 설치
2. Supabase 클라이언트 초기화
3. API 호출 시 `supabase.auth.currentSession?.accessToken`을 Authorization 헤더에 포함

```dart
final response = await http.get(
  Uri.parse('http://localhost:3000/api/v1/auctions'),
  headers: {
    'Authorization': 'Bearer ${supabase.auth.currentSession?.accessToken}',
  },
);
```
