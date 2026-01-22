-- supabase/migrations/002_create_auction_listings.sql
CREATE TABLE IF NOT EXISTS public.auction_listings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url text,
    case_info text, -- 용도/사건
    address text,   -- 소재지
    area text,      -- 면적
    special_rights text, -- 특수권리
    appraisal_price bigint, -- 감정가
    min_price bigint,      -- 최저가
    status text,           -- 현재상태
    auction_date text,     -- 매각기일 (문자열로 저장, 필요시 date로 변경)
    created_at timestamptz DEFAULT now()
);
