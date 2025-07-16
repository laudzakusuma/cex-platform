import React, { useState, useEffect, useRef, Suspense } from 'react';
import axios from 'axios';
import { useWallet } from '../context/WalletContext.jsx';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import styles from './ChatroomPage.module.css';

const WalletIcon3D = () => {
    const groupRef = useRef();

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.2;
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            <RoundedBox args={[1.5, 1, 0.3]} radius={0.05} scale={0.8}>
                <meshStandardMaterial color="#3B82F6" metalness={0.6} roughness={0.4} />
            </RoundedBox>
            <RoundedBox args={[0.5, 0.5, 0.31]} radius={0.05} position={[0.4, 0.2, 0]}>
                <meshStandardMaterial color="#1F2937" />
            </RoundedBox>
        </group>
    );
};


const ChatroomPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const { account, connectWallet } = useWallet();
    const ws = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (account) {
            axios.get('http://localhost:3001/api/chat/history')
                .then(response => setMessages(response.data))
                .catch(error => console.error("Gagal memuat riwayat obrolan:", error));

            ws.current = new WebSocket('ws://localhost:3001');
            ws.current.onopen = () => console.log("WebSocket terhubung");
            ws.current.onmessage = (event) => {
                const receivedMessage = JSON.parse(event.data);
                setMessages(prev => [...prev, receivedMessage]);
            };
            ws.current.onclose = () => console.log("WebSocket terputus");

            return () => {
                if (ws.current) ws.current.close();
            };
        }
    }, [account]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (input.trim() && account && ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'chat', user: account, message: input }));
            setInput('');
        }
    };
    
    const truncateAddress = (address) => {
        if (!address) return "";
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp._seconds * 1000);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    if (!account) {
        return (
            <div className={styles.promptContainer}>
                <div className={styles.canvasWrapper}>
                    <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                        <Suspense fallback={null}>
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[10, 10, 5]} intensity={1} />
                            <WalletIcon3D />
                        </Suspense>
                    </Canvas>
                </div>
                <h1 className={styles.promptTitle}>Masuk ke Ruang Obrolan</h1>
                <p className={styles.promptText}>Hubungkan dompet Web3 Anda untuk memulai percakapan yang aman dan terdesentralisasi.</p>
                <button onClick={connectWallet} className={styles.promptButton}>
                    Hubungkan Dompet
                </button>
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
                        msg.user.toLowerCase() === account.toLowerCase() ? styles.myMessage : styles.otherMessage
                    }>
                        {msg.type === 'chat' && (
                            <div className={styles.username}>{truncateAddress(msg.user)}</div>
                        )}
                        <div className={styles.messageContent}>{msg.message}</div>
                        {msg.timestamp && (
                            <div className={styles.timestamp}>{formatTimestamp(msg.timestamp)}</div>
                        )}
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
                    placeholder="Ketik sebagai..."
                />
                <button type="submit" className={styles.sendButton}>Kirim</button>
            </form>
        </div>
    );
};

export default ChatroomPage;