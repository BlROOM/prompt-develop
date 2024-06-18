export default function ChatBot() {
  return (
    <main className="flex justify-center items-center h-screen m-0">
      <div
        id="chat-container"
        className="w-96 h-96 md:w-1/3 md:h-[600px] flex flex-col border border-gray-300"
      >
        <div
          id="chat-messages"
          className="flex-1 overflow-y-auto p-2 flex flex-col-reverse bg-gray-100 border-b border-gray-300"
        >
          <div className="bg-[#e6e6e6] m-1 p-2"> 안녕하세요</div>
        </div>
        <div
          id="user-input"
          className="flex p-2 border-t border-gray-300"
        >
          <input
            type="text"
            placeholder="메시지를 입력하세요..."
            className="flex-1 p-2 outline-none"
          />
          <button className="bg-blue-600 text-white p-2 ml-2">
            전송
          </button>
        </div>
      </div>
    </main>
  );
}
