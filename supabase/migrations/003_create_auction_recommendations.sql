-- supabase/migrations/003_create_auction_recommendations.sql
CREATE TABLE IF NOT EXISTS public.auction_recommendations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url text,
    case_info text,
    address text,
    area text,
    special_rights text,
    appraisal_price bigint,
    min_price bigint,
    status text,
    auction_date text,
    created_at timestamptz DEFAULT now()
);
