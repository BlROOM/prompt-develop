// app/api/stockAnalysis
// route handler
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: Request) {
  // const threadMessages = await openai.beta.threads.messages.create(
  //   process.env.TREAD_ID || '',
  //   {
  //     role: 'user',
  //     // content: `Analyze the stock ${stock} and provide details on investment volume, trading volume, value, profitability, risk, investment index, growth, dividend yield, and stock price.`,
  //     // content: `2024년 6월 19일 날짜로 해외 주식 ${stock}을 분석하고 현재 시간을 기준으로 업종과,주가, 시가, 고가, 저가, 미국 달러(usd)가격으로 보여주고,
  //     // 거래량은 숫자로,가치, 수익성, 위험성, 투자 지수, 성장, 배당 수익률,
  //     // 주가에 대한 세부 정보와 최근 관련 뉴스를 시간, 날짜와 함께 제공하고 한국어로 번역하여 보여주세요 만약 현재 시간대에 주식 정보를 가져올 수 없다면 가장 최신 해당 주식 정보를 가져오고 해당 정보의 날짜와 출처를 보여주세요. 마지막 결과물은 json 형태로 보여주세요 `,
  //     content: `${stock}`,
  //   },
  // );
  // console.log(threadMessages, 'threadMessages');

  const runCreate = await openai.beta.threads.runs.create(process.env.TREAD_ID || '', {
    assistant_id: process.env.ASSISTANT_ID || '',
  });
  // console.log(runCreate, 'runCreate');

  const run = await openai.beta.threads.runs.retrieve(
    process.env.TREAD_ID || '',
    runCreate.id,
  );

  console.log(run, 'run object');

  async function waitOnRun(run: { id: string; status: string }) {
    while (run.status === 'queued' || run.status === 'in_progress') {
      console.log('status', run.status);
      run = await openai.beta.threads.runs.retrieve(
        process.env.TREAD_ID || '',
        runCreate.id,
      );
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    return run;
  }

  const completedRun = await waitOnRun(run);
  console.log(completedRun, 'completeRun');
  // const threadListMessages = await openai.beta.threads.messages.list(
  //   process.env.TREAD_ID || '',
  // );

  // console.log(
  //   threadListMessages.data[0].content[0]?.text.value as string,
  //   "threadListMessages"
  // );

  // console.log(threadListMessages, 'threadListMessages');
  const responseMessages = await openai.beta.threads.messages.list(
    process.env.TREAD_ID || '',
    // { order: 'asc' },
  );
  // console.log(responseMessages, 'responseMessages');

  // 각 메시지에서 content 값을 추출하여 배열에 저장
  const contentValues = responseMessages.data.map(message => {
    if (message.content && Array.isArray(message.content)) {
      const content = message.content
        .map((contentItem: any) => contentItem?.text?.value)
        .join(' ');
      return { role: message.role, content };
    }
    return { role: message.role, content: '' };
  });

  console.log(contentValues, 'contentValues');
  return NextResponse.json({ messages: contentValues });
}
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
  console.log('stock', stock);
  // const { stock } = (await req.json()) as { stock: string };
  // if (!stock) {
  //   return NextResponse.json(
  //     { error: "Stock symbol is required" },
  //     { status: 400 }
  //   );
  // }

  // const assistant = await openai.beta.assistants.create({
  //   name: 'Stock Analyst',
  //   instructions: 'Provide detailed analysis of international stocks.',
  //   // instructions: 'Analyze stocks and provide detailed financial analysis.',
  //   model: 'gpt-3.5-turbo',
  //   // model: 'gpt-4o',
  //   description: 'This assistant provides detailed stock analysis.',
  //   tools: [],
  //   tool_resources: null,
  //   metadata: {},
  //   temperature: 1,
  //   top_p: 1,
  //   response_format: { type: 'json_object' },
  // });
  // console.log('assistant', assistant);
  // const thread = await openai.beta.threads.create();
  // console.log(thread, 'thread');
  const threadMessages = await openai.beta.threads.messages.create(
    process.env.TREAD_ID || '',
    {
      role: 'user',
      // content: `Analyze the stock ${stock} and provide details on investment volume, trading volume, value, profitability, risk, investment index, growth, dividend yield, and stock price.`,
      // content: `2024년 6월 19일 날짜로 해외 주식 ${stock}을 분석하고 현재 시간을 기준으로 업종과,주가, 시가, 고가, 저가, 미국 달러(usd)가격으로 보여주고,
      // 거래량은 숫자로,가치, 수익성, 위험성, 투자 지수, 성장, 배당 수익률,
      // 주가에 대한 세부 정보와 최근 관련 뉴스를 시간, 날짜와 함께 제공하고 한국어로 번역하여 보여주세요 만약 현재 시간대에 주식 정보를 가져올 수 없다면 가장 최신 해당 주식 정보를 가져오고 해당 정보의 날짜와 출처를 보여주세요. 마지막 결과물은 json 형태로 보여주세요 `,
      content: `${stock}`,
    },
  );
  console.log(threadMessages, 'threadMessages');

  const runCreate = await openai.beta.threads.runs.create(process.env.TREAD_ID || '', {
    assistant_id: process.env.ASSISTANT_ID || '',
  });
  // console.log(runCreate, 'runCreate');

  const run = await openai.beta.threads.runs.retrieve(
    process.env.TREAD_ID || '',
    runCreate.id,
  );

  console.log(run, 'run object');

  async function waitOnRun(run: { id: string; status: string }) {
    while (run.status === 'queued' || run.status === 'in_progress') {
      console.log('status', run.status);
      run = await openai.beta.threads.runs.retrieve(
        process.env.TREAD_ID || '',
        runCreate.id,
      );
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    return run;
  }

  const completedRun = await waitOnRun(run);
  console.log(completedRun, 'completeRun');
  // const threadListMessages = await openai.beta.threads.messages.list(
  //   process.env.TREAD_ID || '',
  // );

  // console.log(
  //   threadListMessages.data[0].content[0]?.text.value as string,
  //   "threadListMessages"
  // );

  // console.log(threadListMessages, 'threadListMessages');
  const responseMessages = await openai.beta.threads.messages.list(
    process.env.TREAD_ID || '',
    // { order: 'asc' },
  );
  // console.log(responseMessages, 'responseMessages');

  // 각 메시지에서 content 값을 추출하여 배열에 저장
  const contentValues = responseMessages.data.map(message => {
    if (message.content && Array.isArray(message.content)) {
      const content = message.content
        .map((contentItem: any) => contentItem?.text?.value)
        .join(' ');
      return { role: message.role, content };
    }
    return { role: message.role, content: '' };
  });

  console.log(contentValues, 'contentValues');
  return NextResponse.json({ messages: contentValues });
}
