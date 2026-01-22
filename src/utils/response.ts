/**
 * 응답 헬퍼 함수들
 * 일관된 API 응답 형식을 생성하는 유틸리티 함수
 */
import { Response } from "express";
import { ApiResponse, PaginationParams } from "../types";

/**
 * 성공 응답 반환
 * @param res - Express Response 객체
 * @param data - 응답 데이터
 * @param statusCode - HTTP 상태 코드 (기본: 200)
 * @param meta - 추가 메타 정보 (페이지네이션 등)
 */
export const successResponse = <T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  meta?: ApiResponse["meta"],
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    meta,
  };
  return res.status(statusCode).json(response);
};

/**
 * 생성 성공 응답 (201 Created)
 */
export const createdResponse = <T>(res: Response, data: T): Response => {
  return successResponse(res, data, 201);
};

/**
 * 내용 없음 응답 (204 No Content)
 * - 삭제 성공 등에 사용
 */
export const noContentResponse = (res: Response): Response => {
  return res.status(204).send();
};

/**
 * 페이지네이션 응답
 * - 목록 조회시 사용
 * - 페이지 정보와 전체 개수 포함
 */
export const paginatedResponse = <T>(
  res: Response,
  data: T[],
  pagination: PaginationParams,
  total: number,
): Response => {
  const totalPages = Math.ceil(total / pagination.limit);

  return successResponse(res, data, 200, {
    page: pagination.page,
    limit: pagination.limit,
    total,
    totalPages,
  });
};

/**
 * 페이지네이션 파라미터 계산
 * @param page - 페이지 번호 (최소 1)
 * @param limit - 페이지당 개수 (1~100)
 * @returns 계산된 페이지네이션 파라미터
 */
export const getPaginationParams = (
  page: number = 1,
  limit: number = 20,
): PaginationParams => {
  const validPage = Math.max(1, page); // 최소 1페이지
  const validLimit = Math.min(Math.max(1, limit), 100); // 1~100 사이

  return {
    page: validPage,
    limit: validLimit,
    offset: (validPage - 1) * validLimit, // DB 조회용 offset 계산
  };
};
