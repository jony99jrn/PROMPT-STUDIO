// --- JRN AI CHATBOT SYSTEM ---
const GEMINI_API_KEY = "AIzaSyAOl4tZO1DTM2LUBOFrbr-wjls6Mf84vXg";

// ১. চ্যাটবট UI বডিতে ইনজেক্ট করা
const injectChatbot = () => {
    const chatbotHTML = `
    <div id="chat-bubble" style="position: fixed; bottom: 25px; right: 25px; background: #38bdf8; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 10000; transition: transform 0.3s ease;">
        <i class="fas fa-robot" style="color: #0f172a; font-size: 28px;"></i>
    </div>

    <div id="chat-window" style="display: none; position: fixed; bottom: 100px; right: 25px; width: 350px; height: 500px; background: #1e293b; border: 1px solid #334155; border-radius: 20px; flex-direction: column; overflow: hidden; z-index: 10000; box-shadow: 0 15px 50px rgba(0,0,0,0.6); font-family: 'Poppins', sans-serif;">
        <div style="background: #38bdf8; padding: 15px; color: #0f172a; font-weight: 800; display: flex; justify-content: space-between; align-items: center;">
            <span><i class="fas fa-bolt"></i> JRN ASSISTANT</span>
            <i class="fas fa-times" id="close-chat" style="cursor: pointer; font-size: 18px;"></i>
        </div>
        <div id="chat-logs" style="flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; background: #0f172a; scroll-behavior: smooth;">
            <div style="background: #1e293b; color: #f8fafc; padding: 12px 16px; border-radius: 15px 15px 15px 0; align-self: flex-start; max-width: 85%; font-size: 14px; border: 1px solid #334155;">
                হ্যালো! আমি JRN STUDIO-র এআই অ্যাসিস্ট্যান্ট। কীভাবে সাহায্য করতে পারি?
            </div>
        </div>
        <div style="padding: 15px; background: #1e293b; border-top: 1px solid #334155; display: flex; gap: 8px;">
            <input type="text" id="user-input" placeholder="বার্তা লিখুন..." style="flex: 1; background: #0f172a; border: 1px solid #334155; color: white; padding: 12px; border-radius: 12px; outline: none; font-size: 14px;">
            <button id="send-btn" style="background: #38bdf8; border: none; width: 45px; height: 45px; border-radius: 12px; cursor: pointer; color: #0f172a; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-paper-plane"></i>
            </button>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
};

injectChatbot();

// ২. এলিমেন্ট রেফারেন্স
const bubble = document.getElementById('chat-bubble');
const chatWin = document.getElementById('chat-window');
const closeChat = document.getElementById('close-chat');
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatLogs = document.getElementById('chat-logs');

// ৩. ওপেন/ক্লোজ লজিক
bubble.onclick = () => chatWin.style.display = chatWin.style.display === 'none' ? 'flex' : 'none';
closeChat.onclick = () => chatWin.style.display = 'none';

// ৪. এআই ফাংশন
async function askGemini(message) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const systemPrompt = "You are JRN Assistant for JRN STUDIO (Owner: Jony Roy). You provide info about Web Design, Development and AI Prompts. Be polite and use Bengali.";

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${systemPrompt}\nUser: ${message}` }] }]
            })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        return "দুঃখিত, বর্তমানে এআই রেসপন্স করতে পারছে না।";
    }
}

// ৫. মেসেজ হ্যান্ডলিং
async function handleChat() {
    const text = userInput.value.trim();
    if (!text) return;

    chatLogs.innerHTML += `<div style="background: #38bdf8; color: #0f172a; padding: 10px 15px; border-radius: 15px 15px 0 15px; align-self: flex-end; max-width: 85%; font-size: 14px; font-weight: 500;">${text}</div>`;
    userInput.value = "";
    chatLogs.scrollTop = chatLogs.scrollHeight;

    const loading = document.createElement('div');
    loading.style = "color: #94a3b8; font-size: 12px; margin-left: 10px;";
    loading.innerText = "JRN AI ভাবছে...";
    chatLogs.appendChild(loading);

    const reply = await askGemini(text);
    chatLogs.removeChild(loading);
    chatLogs.innerHTML += `<div style="background: #1e293b; color: #f8fafc; padding: 10px 15px; border-radius: 15px 15px 15px 0; align-self: flex-start; max-width: 85%; font-size: 14px; border: 1px solid #334155;">${reply}</div>`;
    chatLogs.scrollTop = chatLogs.scrollHeight;
}

sendBtn.onclick = handleChat;
userInput.onkeypress = (e) => { if (e.key === 'Enter') handleChat(); };
