let user = null;

async function register(){
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const r = await fetch("http://127.0.0.1:8000/register", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({username,password})
  });
  if(r.ok){
    alert("Регистрация успешна! Теперь войдите.");
  }else{
    const err = await r.json();
    alert("Ошибка: " + err.detail);
  }
}

async function login(){
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const r = await fetch("http://127.0.0.1:8000/login", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({username,password})
  });
  if(r.ok){
    user = await r.json();
    document.getElementById("login-box").style.display="none";
    document.getElementById("chat-box").style.display="block";
  }else{
    const err = await r.json();
    alert("Ошибка: " + err.detail);
  }
}

async function sendMessage(){
  const msg = document.getElementById("msg").value;
  if(!msg) return;
  addMessage("user", msg);
  document.getElementById("msg").value = "";

  const r = await fetch("http://127.0.0.1:8000/chat", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({user_id: user.id, message: msg})
  });
  if(r.ok){
    const data = await r.json();
    const botText = data.reply || "Ошибка ответа";
    addMessage("bot", botText);
  }else{
    addMessage("bot", "Ошибка сервера");
  }
}

function addMessage(from, text){
  const div = document.createElement("div");
  div.className = from==="user" ? "msg-user" : "msg-bot";
  div.innerText = text;
  document.getElementById("messages").appendChild(div);
}
