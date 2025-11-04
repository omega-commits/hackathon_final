// ...existing code...
import { GoogleGenerativeAI } from 'https://esm.run/@google/generative-ai';

document.addEventListener('DOMContentLoaded', () => {
  // ⚠ For testing only: replace with your Gemini API key. Do NOT put production keys in client-side code.
  const genAI = new GoogleGenerativeAI('AIzaSyCdbUvNLg2iVZKjm_GESRCPq7IoVQN3pa4');
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const chatBox = document.getElementById("chat-box");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");

  // Add message to chat
  function addMessage(sender, text) {
    const msg = document.createElement("div");
    msg.classList.add("chat-message", sender === "user" ? "user-message" : "ai-message");
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Send user question
  async function sendMessage() {
    const question = userInput.value.trim();
    if (!question) return;

    addMessage("user", question);
    userInput.value = "";

    try {
      const prompt = `
        You are PulsePoint AI — an expert fitness and nutrition assistant.
        The user may ask about:
        - Personalized workout plans
        - Nutrition and meal guidance
        - Recovery and motivation
        Provide clear, concise, science-backed advice.

        User: ${question}
      `;

      const result = await model.generateContent(prompt);
      // ensure we await text() if it's a Response-like object
      const response = result?.response ? await result.response.text() : String(result);
      addMessage("ai", response);
    } catch (error) {
      console.error(error);
      addMessage("ai", "⚠ Sorry, there was an issue processing your request.");
    }
  }

  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
// ...existing code...