import { useState } from "react";
import { MessageCircle } from "lucide-react";
import axios from "axios";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Thêm tin nhắn của user
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    const question = input;
    setInput("");
    setLoading(true);

    try {
      // Gọi API AI
      const res = await axios.post("/api/ai/chat", { message: question });

      // Thêm tin nhắn của AI
      const botMsg = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);

    } catch (err) {
      const botMsg = { sender: "bot", text: "Lỗi rồi, thử lại sau nhé!" };
      setMessages((prev) => [...prev, botMsg]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Icon Chat */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl transition-all z-50"
      >
        <MessageCircle size={26} />
      </button>

      {/* Popup Chat */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-xl shadow-2xl border p-4 flex flex-col z-50">

          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <h2 className="font-semibold text-lg">Chat AI</h2>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          <div className="flex-1 overflow-y-auto text-gray-700 space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className={msg.sender === "user" ? "text-right" : "text-left"}>
                <span className="inline-block bg-gray-200 p-2 rounded-lg">
                  {msg.text}
                </span>
              </div>
            ))}

            {loading && (
              <div className="text-left text-gray-500">AI đang trả lời...</div>
            )}
          </div>

          <div className="flex gap-2 mt-2">
            <input
              className="border flex-1 rounded px-2 py-1"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
