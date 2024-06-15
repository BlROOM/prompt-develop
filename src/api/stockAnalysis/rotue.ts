import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  return NextResponse.json({ message: "hello world" });
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { stock } = req.body;

  if (!stock) {
    return res.status(400).json({ error: "Stock symbol is required" });
  }

  const prompt = `You are an international stock analyst. Analyze the stock ${stock} and provide details on investment volume, trading volume, value, profitability, risk, investment index, growth, dividend yield, and stock price.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });

    const analysis = response.choices[0]?.message?.content;
    res.status(200).json({ analysis });
  } catch (error) {
    console.error("Error fetching stock analysis:", error);
    res.status(500).json({ error: "Error fetching stock analysis" });
  }
}
