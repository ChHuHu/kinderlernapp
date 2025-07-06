import React, { useState } from "react";
import { createRoot } from "react-dom/client";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

const App = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "Du bist ein geduldiger Lernassistent für Kinder." },
            { role: "user", content: input },
          ],
        }),
      });

      const data = await res.json();

      if (data.choices?.[0]?.message?.content) {
        setResponse(data.choices[0].message.content.trim());
      } else {
        setResponse("Leider kam keine Antwort von der KI.");
      }
    } catch (err) {
      console.error(err);
      setResponse("Fehler beim Laden der Antwort.");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20, fontFamily: "sans-serif" }}>
      <h1>Kinder-Lernhilfe 🤖</h1>
      <p>Stell mir eine Frage zu deinen Hausaufgaben:</p>
      <textarea
        rows={4}
        style={{ width: "100%", padding: 10 }}
        placeholder="Z.B. Was ist ein Verb?"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={handleSend}
        disabled={loading}
        style={{
          marginTop: 10,
          padding: "10px 20px",
          background: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Antwort wird geladen..." : "Frage senden"}
      </button>

      {response && (
        <div style={{ marginTop: 30, background: "#f0f0f0", padding: 15, borderRadius: 5 }}>
          <strong>Antwort:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
