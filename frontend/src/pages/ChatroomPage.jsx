import React, { useState, useEffect, useRef } from 'react';

const ChatroomPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const ws = useRef(null);

    useEffect(() => {
        // Ganti dengan alamat IP atau domain server WebSocket Anda jika perlu
        ws.current = new WebSocket('ws://localhost:3001');

        ws.current.onopen = () => {
            console.log("WebSocket terhubung");
        };

        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages(prev => [...prev, message]);
        };

        ws.current.onclose = () => {
            console.log("WebSocket terputus");
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (input.trim() && ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ user: 'PenggunaX', message: input }));
            setInput('');
        }
    };

    return (
        <div style={{ height: '75vh', display: 'flex', flexDirection: 'column', maxWidth: '768px', margin: 'auto' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>Ruang Obrolan</h1>
            <div style={{ flexGrow: 1, backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem', padding: '1rem', overflowY: 'auto' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ marginBottom: '0.75rem' }}>
                        <span style={{ fontWeight: 'bold', color: '#60A5FA' }}>{msg.user}: </span>
                        <span>{msg.message}</span>
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ketik pesan..."
                    style={{ flexGrow: 1, backgroundColor: '#374151', border: '1px solid #4B5563', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', color: 'white', outline: 'none' }}
                />
                <button type="submit" style={{ border: 'none', backgroundColor: '#2563EB', color: 'white', fontWeight: '600', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' }}>Kirim</button>
            </form>
        </div>
    );
};

export default ChatroomPage;