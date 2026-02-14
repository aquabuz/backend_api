/**
 * 헬스체크 컨트롤러
 * 서버 상태와 데이터베이스 연결 상태를 확인
 */
import { Request, Response } from "express";
import { successResponse } from "../utils";
import { supabaseAdmin } from "../config/supabase";

class HealthController {
  /**
   * 서버 상태 확인 API
   * - 서버 실행 상태
   * - Supabase DB 연결 상태
   * - 서버 업타임
   */
  async check(req: Request, res: Response): Promise<void> {
    // Supabase 연결 상태 확인
    let dbStatus = "disconnected";
    try {
      const { error } = await supabaseAdmin
        .from("auctions")
        .select("count", { count: "exact", head: true });
      dbStatus = error ? `error: ${error.message}` : "connected";
    } catch (e) {
      dbStatus = "error";
    }

    // 응답 반환
    successResponse(res, {
      status: "ok",
      timestamp: new Date().toISOString(), // 현재 시간
      uptime: process.uptime(), // 서버 실행 시간(초)
      environment: process.env.NODE_ENV, // 실행 환경
      database: dbStatus, // DB 연결 상태
    });
  }
}

export const healthController = new HealthController();
