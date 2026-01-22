/**
 * Express 애플리케이션 설정 파일
 * 미들웨어, 라우트, 에러 핸들러 등을 설정함
 */
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "express-async-errors"; // async 함수에서 발생한 에러를 자동으로 catch해줌

import { config } from "./config";
import routes from "./routes";
import { errorHandler, notFoundHandler } from "./middlewares";

// Express 앱 인스턴스 생성
const app: Application = express();

// 보안 미들웨어 - HTTP 헤더 보안 설정 (XSS, clickjacking 등 방어)
app.use(helmet());

// CORS 설정 - 다른 도메인에서의 API 요청 허용 설정
app.use(
  cors({
    origin: config.cors.origin, // 허용할 도메인 목록
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // 허용할 HTTP 메서드
    allowedHeaders: ["Content-Type", "Authorization"], // 허용할 헤더
    credentials: true, // 쿠키/인증 정보 포함 허용
  }),
);

// 요청 로깅 - 개발환경에서는 간단한 로그, 프로덕션에서는 상세 로그
if (config.isDevelopment) {
  app.use(morgan("dev")); // 개발용: 컬러풀하고 간단한 로그
} else {
  app.use(morgan("combined")); // 프로덕션용: Apache 스타일 상세 로그
}

// 요청 본문 파싱 - JSON과 URL-encoded 데이터를 파싱
app.use(express.json({ limit: "10mb" })); // JSON 요청 본문 파싱
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // form 데이터 파싱

// API 라우트 - 모든 API는 /api/v1 prefix 사용
app.use("/api/v1", routes);

// 루트 엔드포인트 - API 정보 반환
app.get("/", (req, res) => {
  res.json({
    name: "Backend API",
    version: "1.0.0",
    documentation: "/api/v1/health",
  });
});

// 404 에러 핸들러 - 존재하지 않는 라우트 처리
app.use(notFoundHandler);

// 전역 에러 핸들러 - 모든 에러를 잡아서 일관된 형식으로 응답
app.use(errorHandler);

export default app;
