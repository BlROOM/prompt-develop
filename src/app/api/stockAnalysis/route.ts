import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  return NextResponse.json({ message: "hello world" });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { stock } = body;

  if (!stock) {
    return NextResponse.json(
      { error: "Stock symbol is required" },
      { status: 400 }
    );
  }

  const prompt = `You are an international stock analyst. Analyze the stock ${stock} and provide details on investment volume, trading volume, value, profitability, risk, investment index, growth, dividend yield, and stock price.`;

  try {
    const response = await openai.chat.completions.create({
      // model: "gpt-3.5-turbo",
      model: "text-curie-001", // 무료 티어에서 사용할 수 있는 모델로 변경
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });
    console.log(response, "response");
    const analysis = response.choices[0]?.message?.content;
    console.log(analysis, "analysis");
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Error fetching stock analysis:", error);

    // if (error.code === 'insufficient_quota') {
    //   return NextResponse.json({ error: 'You have exceeded your quota. Please check your plan and billing details.' }, { status: 429 });
    // }

    return NextResponse.json(
      { error: "Error fetching stock analysis" },
      { status: 500 }
    );
  }
}
