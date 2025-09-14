from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Разрешаем запросы с фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Простая база пользователей (вместо SQLite пока словарь)
users = {}
user_id_counter = 1

class UserIn(BaseModel):
    username: str
    password: str

class ChatIn(BaseModel):
    user_id: int
    message: str

@app.post("/register")
def register(u: UserIn):
    global user_id_counter
    if len(u.password) != 8:
        raise HTTPException(400, "Пароль должен быть 8 символов")
    if u.username in users:
        raise HTTPException(400, "Логин занят")
    users[u.username] = {"id": user_id_counter, "password": u.password}
    user_id_counter += 1
    return {"ok": True}

@app.post("/login")
def login(u: UserIn):
    if u.username not in users or users[u.username]["password"] != u.password:
        raise HTTPException(400, "Неверный логин или пароль")
    return {"id": users[u.username]["id"], "username": u.username}

@app.post("/chat")
def chat(c: ChatIn):
    # Здесь можно подключить OpenAI API
    reply = f"BoburGPT отвечает: '{c.message}' на английском будет -> ... (демо)"
    return {"reply": reply}
