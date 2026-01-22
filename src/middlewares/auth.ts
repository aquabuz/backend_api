/**
 * 인증 미들웨어
 * Supabase JWT 토큰을 검증하고 사용자 정보를 요청에 추가
 */
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types";
import { supabase } from "../config/supabase";
import { ApiError } from "./errorHandler";

/**
 * 인증 필수 미들웨어
 * - Authorization 헤더에서 Bearer 토큰 추출
 * - Supabase로 토큰 검증
 * - 검증 성공시 req.user에 사용자 정보 추가
 */

import { AUTH_REQUIRED_URIS } from "../constants/auth";

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // 인증이 필요한 URI가 아니면 바로 통과
  const reqPath = req.baseUrl + req.path;
  const isProtected = AUTH_REQUIRED_URIS.some((uri) => reqPath.startsWith(uri));
  if (!isProtected) {
    return next();
  }
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw ApiError.unauthorized("No token provided");
    }
    const token = authHeader.substring(7);
    req.accessToken = token;
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    if (error || !user) {
      throw ApiError.unauthorized("Invalid or expired token");
    }
    req.user = {
      id: user.id,
      email: user.email || "",
      role: user.role,
    };
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * 선택적 인증 미들웨어
 * - 토큰이 없어도 에러 없이 통과
 * - 토큰이 있으면 검증 후 사용자 정보 추가
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      req.accessToken = token;

      const {
        data: { user },
      } = await supabase.auth.getUser(token);

      if (user) {
        req.user = {
          id: user.id,
          email: user.email || "",
          role: user.role,
        };
      }
    }

    next();
  } catch (error) {
    // 인증 실패해도 계속 진행
    next();
  }
};

/**
 * 역할 기반 접근 제어 미들웨어
 * - 특정 역할을 가진 사용자만 접근 가능
 * @param roles - 허용할 역할 목록
 */
export const requireRole = (...roles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    // 사용자 정보 없음
    if (!req.user) {
      next(ApiError.unauthorized());
      return;
    }

    // 역할 확인
    if (!req.user.role || !roles.includes(req.user.role)) {
      next(ApiError.forbidden("Insufficient permissions"));
      return;
    }

    next();
  };
};
