import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatroomPage.module.css';

const ChatroomPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [username, setUsername] = useState('');
    const [isJoined, setIsJoined] = useState(false);
    const ws = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const connectWebSocket = () => {
        ws.current = new WebSocket('ws://localhost:3001');

        ws.current.onopen = () => {
            console.log("WebSocket terhubung");
            ws.current.send(JSON.stringify({
                type: 'system',
                message: `${username} telah bergabung.`
            }));
        };

        ws.current.onmessage = (event) => {
            const receivedMessage = JSON.parse(event.data);
            setMessages(prev => [...prev, receivedMessage]);
        };

        ws.current.onclose = () => {
            console.log("WebSocket terputus");
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    };

    const handleJoin = (e) => {
        e.preventDefault();
        if (username.trim()) {
            setIsJoined(true);
            connectWebSocket();
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (input.trim() && ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({
                type: 'chat',
                user: username,
                message: input
            }));
            setInput('');
        }
    };

    if (!isJoined) {
        return (
            <div className={styles.joinContainer}>
                <h1 className={styles.pageTitle}>Masuk ke Ruang Obrolan</h1>
                <form onSubmit={handleJoin} className={styles.joinForm}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={styles.usernameInput}
                        placeholder="Masukkan nama Anda..."
                        maxLength={15}
                    />
                    <button type="submit" className={styles.joinButton}>Gabung</button>
                </form>
            </div>
        );
    }

    return (
        <div className={styles.chatContainer}>
            <h1 className={styles.pageTitle}>Ruang Obrolan Global</h1>
            <div className={styles.messagesWindow}>
                {messages.map((msg, index) => (
                    <div key={index} className={
                        msg.type === 'system' ? styles.systemMessage :
                        msg.user === username ? styles.myMessage : styles.otherMessage
                    }>
                        {msg.type === 'chat' && (
                            <div className={styles.username}>{msg.user}</div>
                        )}
                        <div className={styles.messageContent}>{msg.message}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className={styles.messageForm}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className={styles.messageInput}
                    placeholder="Ketik pesan Anda..."
                />
                <button type="submit" className={styles.sendButton}>Kirim</button>
            </form>
        </div>
    );
};

export default ChatroomPage;