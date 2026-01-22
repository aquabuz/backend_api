import { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase";

export const getAllUsers = async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin.from("users").select("*");
  if (error) {
    return res.status(500).json({ message: "Failed to fetch users", error });
  }
  return res.json(data);
};
