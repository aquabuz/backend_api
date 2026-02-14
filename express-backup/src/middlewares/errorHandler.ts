/**
 * 에러 핸들러 및 API 에러 클래스
 * 모든 에러를 일관된 형식으로 처리
 */
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types";
import { Injectable, NestMiddleware } from "@nestjs/common";

/**
 * 커스텀 API 에러 클래스
 * - HTTP 상태 코드와 에러 코드를 함께 관리
 * - 정적 메서드로 쉽게 에러 생성 가능
 */
export class ApiError extends Error {
  public statusCode: number; // HTTP 상태 코드
  public code: string; // 에러 코드 (ex: BAD_REQUEST)
  public details?: unknown; // 추가 상세 정보

  constructor(
    statusCode: number,
    message: string,
    code: string = "UNKNOWN_ERROR",
    details?: unknown,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  // 400 Bad Request - 잘못된 요청
  static badRequest(message: string, details?: unknown): ApiError {
    return new ApiError(400, message, "BAD_REQUEST", details);
  }

  // 401 Unauthorized - 인증 필요
  static unauthorized(message: string = "Unauthorized"): ApiError {
    return new ApiError(401, message, "UNAUTHORIZED");
  }

  // 403 Forbidden - 권한 없음
  static forbidden(message: string = "Forbidden"): ApiError {
    return new ApiError(403, message, "FORBIDDEN");
  }

  // 404 Not Found - 리소스 없음
  static notFound(message: string = "Resource not found"): ApiError {
    return new ApiError(404, message, "NOT_FOUND");
  }

  // 409 Conflict - 충돌
  static conflict(message: string, details?: unknown): ApiError {
    return new ApiError(409, message, "CONFLICT", details);
  }

  // 500 Internal Server Error - 서버 오류
  static internal(message: string = "Internal server error"): ApiError {
    return new ApiError(500, message, "INTERNAL_ERROR");
  }
}

/**
 * 전역 에러 핸들러 미들웨어
 * - 모든 에러를 잡아서 일관된 JSON 형식으로 응답
 * - ApiError, Supabase 에러, 일반 에러 구분 처리
 */

// Express 에러 핸들러 미들웨어 함수로 분리
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  let statusCode = 500;
  let code = "INTERNAL_ERROR";
  let message = "Internal server error";
  let details: unknown = undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;
  } else if (err && err.status) {
    // Supabase 등 외부 에러 객체 처리
    statusCode = err.status;
    code = err.code || code;
    message = err.message || message;
    details = err.details || details;
  }

  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  };
  res.status(statusCode).json(response);
}

/**
 * 404 Not Found 핸들러
 * - 존재하지 않는 라우트 접근시 호출
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  const response: ApiResponse = {
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.path} not found`,
    },
  };
  res.status(404).json(response);
};
