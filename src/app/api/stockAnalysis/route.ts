// app/api/stockAnalysis
// route handler
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// export async function POST(req: Request) {
//   const body = await req.json();
//   const { stock } = body;

//   if (!stock) {
//     return NextResponse.json(
//       { error: "Stock symbol is required" },
//       { status: 400 }
//     );
//   }
//   // chat gpt에게 보낼 문장
//   const prompt = `You are an international stock analyst. Analyze the stock ${stock} and provide details on investment volume, trading volume, value, profitability, risk, investment index, growth, dividend yield, and stock price.`;

//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: prompt }],
//       max_tokens: 200,
//     });
//     // console.log(response, "response");
//     const analysis = response.choices[0]?.message?.content;
//     // console.log(analysis, "analysis");
//     return NextResponse.json({ analysis });
//   } catch (error) {
//     console.error("Error fetching stock analysis:", error);

//     return NextResponse.json(
//       { error: "Error fetching stock analysis" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req: Request) {
  const body = await req.json();
  const { stock } = body;
  console.log("stock", stock);
  // const { stock } = (await req.json()) as { stock: string };
  // if (!stock) {
  //   return NextResponse.json(
  //     { error: "Stock symbol is required" },
  //     { status: 400 }
  //   );
  // }

  // const assistant = await openai.beta.assistants.create({
  //   name: "Stock Analyst",
  //   instructions: "Analyze stocks and provide detailed financial analysis.",
  //   model: "gpt-3.5-turbo",
  //   description: "This assistant provides detailed stock analysis.",
  //   tools: [],
  //   tool_resources: null,
  //   metadata: {},
  //   temperature: 1,
  //   top_p: 1,
  //   response_format: { type: "json_object" },
  // });
  // console.log("assistant", assistant);
  // const thread = await openai.beta.threads.create();

  const threadMessages = await openai.beta.threads.messages.create(
    process.env.TREAD_ID || "",
    {
      role: "user",
      content: `Analyze the stock ${stock} and provide details on investment volume, trading volume, value, profitability, risk, investment index, growth, dividend yield, and stock price. Please respond in JSON format.`,
    }
  );
  console.log(threadMessages, "threadMessages");

  const runCreate = await openai.beta.threads.runs.create(
    process.env.TREAD_ID || "",
    {
      assistant_id: process.env.ASSISTANT_ID || "",
    }
  );
  console.log(runCreate, "runCreate");

  const run = await openai.beta.threads.runs.retrieve(
    process.env.TREAD_ID || "",
    runCreate.id
  );

  console.log(run, "run object");

  async function waitOnRun(run: { id: string; status: string }) {
    while (run.status === "queued" || run.status === "in_progress") {
      run = await openai.beta.threads.runs.retrieve(
        process.env.TREAD_ID || "",
        runCreate.id
      );
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    return run;
  }

  const completedRun = await waitOnRun(run);
  console.log(completedRun, "completeRun");
  const threadListMessages = await openai.beta.threads.messages.list(
    process.env.TREAD_ID || ""
  );

  console.log(
    threadListMessages.data[0].content[0]?.text.value as string,
    "threadListMessages"
  );
  const responseMessages = await openai.beta.threads.messages.list(
    process.env.TREAD_ID || ""
  );
  console.log(responseMessages, "responseMessages");

  // const analysis = responseMessages.data
  //   .map((text: { value: string }) => text.value)
  //   .join("\n");

  // const analysis = responseMessages.data
  //   .map((msg: { content: { text: { value: string } }[] }) =>
  //     msg.content
  //       .map(content => {
  //         console.log(content.text.value, "text message");
  //         return content.text.value;
  //       })
  //       .join(" ")
  //   )
  //   .join("\n");

  // console.log(analysis, "analysis");
  const analysis = threadListMessages.data[0].content[0]?.text.value as string;

  return NextResponse.json({ analysis });
}
