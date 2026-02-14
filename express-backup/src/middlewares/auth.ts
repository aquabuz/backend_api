import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 기존 authenticate 함수 로직 이관 필요
    next();
  }
}

// 기타 optionalAuth, requireRole 등은 별도 미들웨어/가드로 분리 가능
