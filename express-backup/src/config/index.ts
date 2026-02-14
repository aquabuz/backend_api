/**
 * 환경 설정 파일
 * .env 파일에서 환경변수를 읽어와서 설정 객체로 만듦
 */
import dotenv from "dotenv";

// .env 파일 로드
dotenv.config();

export const config = {
  // 서버 설정
  port: parseInt(process.env.PORT || "3000", 10), // 서버 포트
  nodeEnv: process.env.NODE_ENV || "development", // 실행 환경
  isDevelopment: process.env.NODE_ENV === "development", // 개발 환경 여부
  isProduction: process.env.NODE_ENV === "production", // 프로덕션 환경 여부

  // Supabase 설정 - 데이터베이스 연결 정보
  supabase: {
    url: process.env.SUPABASE_URL || "", // Supabase 프로젝트 URL
    anonKey: process.env.SUPABASE_ANON_KEY || "", // 공개 키 (RLS 적용됨)
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "", // 서비스 키 (RLS 우회)
  },

  // CORS 설정 - 허용할 프론트엔드 도메인
  cors: {
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"],
  },

  // JWT 설정 - 커스텀 인증 사용시
  jwt: {
    secret: process.env.JWT_SECRET || "default-secret", // JWT 서명 키
    expiresIn: process.env.JWT_EXPIRES_IN || "7d", // 토큰 만료 시간
  },
};
