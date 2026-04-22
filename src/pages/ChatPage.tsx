import { useState } from "react";

export default function ChatPage() {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (!message.trim()) return;
        alert("Message sent: " + message);
        setMessage("");
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Chat System</h2>

            <div style={styles.chatBox}>
                <p style={styles.placeholder}>No messages yet...</p>
            </div>

            <div style={styles.inputArea}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={styles.input}
                />
                <button onClick={handleSend} style={styles.button}>
                    Send
                </button>
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: "600px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        fontFamily: "Arial",
    },
    heading: {
        textAlign: "center",
    },
    chatBox: {
        height: "300px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        marginBottom: "10px",
        overflowY: "auto",
        backgroundColor: "#f9f9f9",
    },
    placeholder: {
        color: "#888",
        textAlign: "center",
        marginTop: "120px",
    },
    inputArea: {
        display: "flex",
        gap: "10px",
    },
    input: {
        flex: 1,
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },
    button: {
        padding: "10px 15px",
        border: "none",
        borderRadius: "5px",
        backgroundColor: "#007bff",
        color: "#fff",
        cursor: "pointer",
    },
};