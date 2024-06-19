'use client';
import { FormEvent, useState } from 'react';

export default function ChatBot() {
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    // { role: 'user', content: '' },
  ]);
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const stock = formData.get('stock') as string;
    console.log('stock', stock);
    const response = await fetch('/api/stockAnalysis', {
      method: 'POST',
      body: JSON.stringify({ stock }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // setMessages(prevMessages => [...prevMessages, { role: 'user', content: stock }]);

    const data = await response.json();
    console.log(data, 'data');

    if (response.ok) {
      setMessages(prevMessages => [...prevMessages, ...data.messages]);
      setError(null);
    } else {
      setError(data.error);
    }
  }
  return (
    <main className="flex justify-center items-center h-screen m-0">
      <form
        id="chat-container"
        className="w-96 h-96 md:w-1/3 md:h-[600px] flex flex-col border border-gray-300"
        onSubmit={onSubmit}>
        <div
          id="chat-messages"
          className="flex-1 overflow-y-auto p-2 flex flex-col-reverse bg-gray-100 border-b border-gray-300">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`m-1 p-2 ${
                message.role === 'user' ? 'bg-blue-200' : 'bg-green-200'
              }`}>
              {message.role} :{message.content}
            </div>
          ))}
        </div>
        <div id="user-input" className="flex p-2 border-t border-gray-300">
          <input
            type="text"
            name="stock"
            placeholder="메시지를 입력하세요..."
            className="flex-1 p-2 outline-none"
          />
          <button className="bg-blue-600 text-white p-2 ml-2">전송</button>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </main>
  );
}
