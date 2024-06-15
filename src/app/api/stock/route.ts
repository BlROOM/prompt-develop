import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  return res.json({ error: "Error fetching stock analysis" });
}
