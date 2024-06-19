import ollama from 'ollama';

// 해당 구문을 실핼하기 위해서는 ollama 페이지에서 llama 프로그램을 다운로드 후
// 터미널에서 ollama run llama2  를 통해 llama2를 먼저 구동시켜야함
// 그렇게되면 해당 구문을 실행 할 수잇음
async function run() {
  const response = await ollama.chat({
    model: 'llama2',
    messages: [{ role: 'user', content: '안녕하세요 라마 한국어로 답해주실 수 있나요?' }],
  });
  console.log(response.message.content);
}

run();
