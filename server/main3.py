
import os
from dotenv import load_dotenv
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.document_loaders import PyPDFLoader
from langchain_openai import ChatOpenAI
from langchain import hub
from langchain.agents import  AgentExecutor
from langchain_community.chat_message_histories import ChatMessageHistory
# from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain.agents import create_json_chat_agent

load_dotenv()

api_key = os.getenv("XIONIC_API_KEY")
sonic_chat_url = os.getenv("SONIC_CHAT_URL")
if not api_key:
    raise ValueError("API key not found. Please set the XIONIC_API_KEY environment variable in your .env file.")

########## 1. 도구를 정의합니다 ##########

### 1-1. Search 도구 ###
# TavilySearchResults 클래스의 인스턴스를 생성합니다
# k=5은 검색 결과를 5개까지 가져오겠다는 의미입니다
# search = TavilySearchResults(k=5)
search = TavilySearchResults(k=3)

# 텍스트 분할기를 사용하여 문서를 분할합니다.
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)

### 1-3. tools 리스트에 도구 목록을 추가합니다 ###
# tools 리스트에 search와 retriever_tool을 추가합니다.
tools = [search]

########## 2. LLM 을 정의합니다 ##########
# LLM 모델을 생성합니다.
llama3 = ChatOpenAI(
    base_url=sonic_chat_url,
    api_key=api_key,
    model="xionic-ko-llama-3-70b",
    # model="cognitivecomputations/dolphin-2.9-llama3-8b-gguf",
    temperature=0.1,
)
# Use Prompt for JSON Agent
########## 3. Prompt 를 정의합니다 ##########
# json_prompt = hub.pull("hwchase17/react-chat-json")
prompt_ko = hub.pull("teddynote/react-chat-json-korean")

########## 4. Agent 를 정의합니다 ##########
# OpenAI 함수 기반 에이전트를 생성합니다.
# llm, tools, prompt를 인자로 사용합니다.
llama3_agent = create_json_chat_agent(llama3, tools, prompt_ko)

########## 5. AgentExecutor 를 정의합니다 ##########
# AgentExecutor 클래스를 사용하여 agent와 tools를 설정하고, 상세한 로그를 출력하도록 verbose를 True로 설정합니다.
llama3_agent_executor = AgentExecutor(
    agent=llama3_agent,
    tools=tools,
    verbose=True,
    handle_parsing_errors=True,
    return_intermediate_steps=True,
)
########## 6. 채팅 기록을 수행하는 메모리를 추가합니다. ##########
# 채팅 메시지 기록을 관리하는 객체를 생성합니다.
message_history = ChatMessageHistory()

# 채팅 메시지 기록이 추가된 에이전트를 생성합니다.
# agent_with_chat_history = RunnableWithMessageHistory(
#     agent_executor,
#     # 대부분의 실제 시나리오에서 세션 ID가 필요하기 때문에 이것이 필요합니다
#     # 여기서는 간단한 메모리 내 ChatMessageHistory를 사용하기 때문에 실제로 사용되지 않습니다
#     lambda session_id: message_history,
#     # 프롬프트의 질문이 입력되는 key: "input"
#     input_messages_key="input",
#     # 프롬프트의 메시지가 입력되는 key: "chat_history"
#     history_messages_key="chat_history",
# )

########## 7. 질의-응답 테스트를 수행합니다. ##########

# 질의에 대한 답변을 출력합니다.
# 검색 결과를 요청 후 질문에 대한 답변을 출력합니다.
response = llama3_agent_executor.invoke(
    {"input": "2024년 6월 19일 현 시각을 기점으로 해외 주식 Tesla 주가에 대해서 한국어로 번역해줄래"}
)
print(f'답변: {response["output"]}')