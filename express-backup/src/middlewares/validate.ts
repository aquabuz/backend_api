/**
 * 유효성 검증 미들웨어
 * Zod 스키마를 사용해 요청 데이터 검증
 */
import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";
import { ApiError } from "./errorHandler";
import { Injectable, NestMiddleware } from "@nestjs/common";

// 검증 대상 타입
type ValidationTarget = "body" | "query" | "params";

/**
 * 요청 유효성 검증 미들웨어 팩토리
 * @param schema - Zod 스키마
 * @param target - 검증 대상 (body, query, params)
 * @returns 미들웨어 함수
 */
export const validate = (
  schema: ZodSchema,
  target: ValidationTarget = "body",
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = req[target];
      const result = schema.safeParse(data);

      // 검증 실패시
      if (!result.success) {
        // 에러 상세 정보 추출
        const errors = result.error.errors.map((err) => ({
          path: err.path.join("."), // 에러 발생 위치
          message: err.message, // 에러 메시지
        }));

        throw ApiError.badRequest("Validation failed", errors);
      }

      // 검증된 데이터로 교체 (transform 적용된 값)
      req[target] = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// ========== 공통 유효성 검증 스키마 ==========
export const schemas = {
  // 페이지네이션 쿼리 파라미터
  pagination: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => parseInt(val || "1", 10)),
    limit: z
      .string()
      .optional()
      .transform((val) => Math.min(parseInt(val || "20", 10), 100)),
  }),

  // ID 파라미터 (UUID 형식)
  id: z.object({
    id: z.string().uuid("Invalid ID format"),
  }),

  // 검색 쿼리
  search: z.object({
    q: z.string().min(1).optional(),
  }),
};

@Injectable()
export class ValidateMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 기존 validate 함수 로직 이관 필요
    next();
  }
}
