import requests
import os
from dotenv import load_dotenv

load_dotenv()
sniper_ai_url = os.getenv("SNIPER_AI_URL")

auth_url = sniper_ai_url
auth_body = {"username": "sfacspace", "password": "space-test"}

# 인증 요청
auth_response = requests.post(auth_url, data=auth_body)
if auth_response.status_code != 200:
    print("Authentication failed:", auth_response.text)
    exit(1)

# 요청 본문
generate_body = {
    "user_message": (
        "As a stock analyst, you are an agent who gives "
        "stock-related information on behalf of customers when they want "
        "to obtain information such as stock-related information, current "
        "status, or statistics. If there are any stock-related terms "
        "to answer a question, you should put the term description below the answer. \n\n"
        "question: , 너가 생각하기에 하이닉스의 재무재표 분석하고, 투자하기에 좋아보이는지 판단하고 상, 중, 하 중에 하나로 대답해줘.",
    ),
    "temperature": 0.9, # 0~1
    "top_p": 0.9 # 0~1
}

# 생성 요청 및 응답 처리
with requests.post(url, json=generate_body, headers=headers, stream=True) as r:
    if r.status_code != 200:
        print("Request failed:", r.text)
        exit(1)
    for chunk in r.iter_content(chunk_size=1024, decode_unicode=True):
        if chunk:
            print(chunk, end="", flush=True)