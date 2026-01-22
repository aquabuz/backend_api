/**
 * 공통 타입 정의
 * API 응답, 인증된 요청, 페이지네이션 등
 */
import { Request, Response, NextFunction } from "express";

// API 응답 공통 형식
export interface ApiResponse<T = unknown> {
  success: boolean; // 성공 여부
  data?: T; // 응답 데이터
  error?: {
    code: string; // 에러 코드
    message: string; // 에러 메시지
    details?: unknown; // 상세 정보
  };
  meta?: {
    page?: number; // 현재 페이지
    limit?: number; // 페이지당 개수
    total?: number; // 전체 개수
    totalPages?: number; // 전체 페이지 수
  };
}

// 인증된 요청 - 사용자 정보가 포함된 Request
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string; // 사용자 ID
    email: string; // 이메일
    role?: string; // 역할 (선택)
  };
  accessToken?: string; // JWT 토큰
}

// 컨트롤러 함수 타입
export type ControllerFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void> | void;

// 페이지네이션 파라미터
export interface PaginationParams {
  page: number; // 현재 페이지 번호
  limit: number; // 페이지당 개수
  offset: number; // 시작 위치 (skip)
}

// 정렬 파라미터
export interface SortParams {
  field: string; // 정렬 필드
  order: "asc" | "desc"; // 오름차순/내림차순
}
