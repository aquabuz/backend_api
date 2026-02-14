/**
 * Supabase 클라이언트 설정
 * 데이터베이스 연결을 위한 클라이언트 인스턴스 생성
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { config } from "./index";
import { Database } from "../types/database.types";

/**
 * 일반 Supabase 클라이언트
 * - RLS(Row Level Security) 정책이 적용됨
 * - 프론트엔드에서 사용하는 것과 동일한 권한
 */
export const supabase: SupabaseClient<Database> = createClient<Database>(
  config.supabase.url,
  config.supabase.anonKey,
);

/**
 * 관리자용 Supabase 클라이언트
 * - RLS를 우회함 (service_role 키 사용)
 * - 모든 데이터에 접근 가능하므로 주의해서 사용할 것
 * - 백엔드에서만 사용해야 함
 */
export const supabaseAdmin: SupabaseClient<Database> = createClient<Database>(
  config.supabase.url,
  config.supabase.serviceRoleKey,
);

/**
 * 사용자별 Supabase 클라이언트 생성 함수
 * - 사용자의 JWT 토큰을 포함하여 해당 사용자 권한으로 DB 접근
 * @param accessToken - 사용자의 액세스 토큰 (없으면 일반 클라이언트 반환)
 */
export const getSupabaseClient = (
  accessToken?: string,
): SupabaseClient<Database> => {
  if (!accessToken) {
    return supabase;
  }

  return createClient<Database>(config.supabase.url, config.supabase.anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
};
