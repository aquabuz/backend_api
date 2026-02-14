import { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase";

export const getAuctionRecommendations = async (
  req: Request,
  res: Response,
) => {
  const page = parseInt(req.query.page as string) || 1;
  const size = parseInt(req.query.size as string) || 10;
  const from = (page - 1) * size;
  const to = from + size - 1;

  // 전체 개수 구하기
  const { count, error: countError } = await supabaseAdmin
    .from("auction_recommendations_test")
    .select("*", { count: "exact", head: true });
  if (countError) {
    return res.status(500).json({ success: false, error: countError });
  }

  const { data, error } = await supabaseAdmin
    .from("auction_recommendations_test")
    .select("*")
    .range(from, to)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ success: false, error });
  }
  const total = count || 0;
  const remain = total - page * size;
  return res.json({
    success: true,
    data,
    page,
    size,
    total,
    remain: remain > 0 ? remain : 0,
  });
};
