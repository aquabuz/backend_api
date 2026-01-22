/**
 * 에러 핸들러 및 API 에러 클래스
 * 모든 에러를 일관된 형식으로 처리
 */
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types";

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
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error("Error:", err);

  // ApiError 인스턴스인 경우 - 우리가 정의한 에러
  if (err instanceof ApiError) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // Supabase 관련 에러 처리
  if (
    err.message?.includes("supabase") ||
    err.message?.includes("PostgrestError")
  ) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: "DATABASE_ERROR",
        message: "Database operation failed",
      },
    };
    res.status(500).json(response);
    return;
  }

  // 기타 예상치 못한 에러
  const response: ApiResponse = {
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    },
  };
  res.status(500).json(response);
};

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
