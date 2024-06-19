import os
from dotenv import load_dotenv
from langchain.tools.tavily_search import TavilySearchResults
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain.document_loaders import PyPDFLoader

# 환경 변수 로드
load_dotenv()

# 환경 변수 설정
# TAVILY API KEY와 프로젝트명을 환경 변수로 설정합니다.
# 이를 통해 API 키가 코드 내부에 하드코딩되지 않도록 합니다.
os.environ["TAVILY_API_KEY"] = os.getenv("TAVILY_API_KEY")
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

# 디버깅을 위한 프로젝트명을 기입합니다.
os.environ["LANGCHAIN_PROJECT"] = os.getenv("LANGCHAIN_PROJECT")

# LangChain 도구 초기화
# langchain_community.tools.tavily_search.tool 모듈에서 
# TavilySearchResults 클래스를 가져와 Tavily Search 도구를 초기화합니다.
def main():
    # Tavily Search를 사용하여 검색 수행
    # TavilySearchResults 클래스를 사용하여 Tavily Search 도구를 초기화합니다. 
    # TavilySearchResults 클래스의 인스턴스를 생성합니다
    # k=5은 검색 결과를 5개까지 가져오겠다는 의미입니다   
    search = TavilySearchResults(k=5)
    # 검색 쿼리 설정
    # 검색할 쿼리를 "What happened in the latest Burning Man floods?"로 설정합니다.
    query = "판교 카카오 프렌즈샵 아지트점의 전화번호는 무엇인가요?"
    # 검색 수행
    # 검색 도구의 invoke 메서드를 사용하여 쿼리를 실행하고 결과를 가져옵니다.
    # search.invoke 함수는 주어진 문자열에 대한 검색을 실행합니다.
    # invoke() 함수에 검색하고 싶은 검색어를 넣어 검색을 수행합니다.
    results = search.invoke({"query": query})
    
    # 결과 출력
    # 검색 결과를 반복하여 출력합니다.
    for result in results:
        print(result)
        
# PDF 기반 문서 검색 도구: Retriever
# 우리의 데이터에 대해 조회를 수행할 retriever도 생성합니다.

# 이 코드는 웹 기반 문서 로더, 문서 분할기, 벡터 저장소, 
# 그리고 OpenAI 임베딩을 사용하여 문서 검색 시스템을 구축합니다.

# 여기서는 PDF 문서를 FAISS DB 에 저장하고 조회하는 retriever 를 생성합니다.

# PDF 파일 로드. 파일의 경로 입력
loader = PyPDFLoader("data/SPRI_AI_Brief_2023년12월호_F.pdf")

# 텍스트 분할기를 사용하여 문서를 분할합니다.
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)

# 문서를 로드하고 분할합니다.
split_docs = loader.load_and_split(text_splitter)

# VectorStore를 생성합니다.
vector = FAISS.from_documents(split_docs, OpenAIEmbeddings())

# Retriever를 생성합니다.
retriever = vector.as_retriever()

if __name__ == "__main__":
    main()
