import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useWallet } from '../context/WalletContext.jsx';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { WS_URL } from '../config/api.js';
import styles from './ChatroomPage.module.css';

const WalletIcon3D = () => {
    const groupRef = useRef();

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.3;
            groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            <RoundedBox args={[1.5, 1, 0.3]} radius={0.05} scale={0.8}>
                <meshStandardMaterial 
                    color="#3B82F6" 
                    metalness={0.8} 
                    roughness={0.2}
                    emissive="#1e40af"
                    emissiveIntensity={0.1}
                />
            </RoundedBox>
            <RoundedBox args={[0.5, 0.5, 0.31]} radius={0.05} position={[0.4, 0.2, 0]}>
                <meshStandardMaterial 
                    color="#1F2937" 
                    metalness={0.5}
                    roughness={0.8}
                />
            </RoundedBox>
            <RoundedBox args={[0.3, 0.3, 0.32]} radius={0.05} position={[-0.3, -0.1, 0]}>
                <meshStandardMaterial 
                    color="#10B981" 
                    metalness={0.6}
                    roughness={0.4}
                    emissive="#059669"
                    emissiveIntensity={0.1}
                />
            </RoundedBox>
        </group>
    );
};

const ChatroomPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const { account, connectWallet } = useWallet();
    const ws = useRef(null);
    const messagesEndRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const connectWebSocket = () => {
        if (ws.current?.readyState === WebSocket.OPEN) return;

        try {
            setConnectionStatus('connecting');
            ws.current = new WebSocket(WS_URL);
            
            ws.current.onopen = () => {
                console.log("WebSocket terhubung");
                setConnectionStatus('connected');
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }
            };

            ws.current.onmessage = (event) => {
                try {
                    const receivedMessage = JSON.parse(event.data);
                    setMessages(prev => [...prev, receivedMessage]);
                } catch (error) {
                    console.error("Error parsing WebSocket message:", error);
                }
            };

            ws.current.onclose = () => {
                console.log("WebSocket terputus");
                setConnectionStatus('disconnected');
                
                // Reconnect after 3 seconds if user is still connected
                if (account && !reconnectTimeoutRef.current) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        console.log("Attempting to reconnect...");
                        connectWebSocket();
                    }, 3000);
                }
            };

            ws.current.onerror = (error) => {
                console.error("WebSocket error:", error);
                setConnectionStatus('error');
            };

        } catch (error) {
            console.error("Failed to create WebSocket connection:", error);
            setConnectionStatus('error');
        }
    };

    useEffect(() => {
        if (account) {
            connectWebSocket();
        }

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [account]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (input.trim() && account && ws.current && ws.current.readyState === WebSocket.OPEN) {
            const message = {
                type: 'chat',
                user: account,
                message: input.trim(),
                timestamp: new Date().toISOString()
            };
            ws.current.send(JSON.stringify(message));
            setInput('');
        }
    };
    
    const truncateAddress = (address) => {
        if (!address) return "";
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        let date;
        if (timestamp._seconds) {
            date = new Date(timestamp._seconds * 1000);
        } else {
            date = new Date(timestamp);
        }
        return date.toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getConnectionStatusColor = () => {
        switch (connectionStatus) {
            case 'connected': return '#10B981';
            case 'connecting': return '#F59E0B';
            case 'disconnected': return '#6B7280';
            case 'error': return '#EF4444';
            default: return '#6B7280';
        }
    };

    const getConnectionStatusText = () => {
        switch (connectionStatus) {
            case 'connected': return 'Terhubung';
            case 'connecting': return 'Menghubungkan...';
            case 'disconnected': return 'Terputus';
            case 'error': return 'Error';
            default: return 'Tidak diketahui';
        }
    };

    if (!account) {
        return (
            <div className={styles.promptContainer}>
                <div className={styles.canvasWrapper}>
                    <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                        <Suspense fallback={null}>
                            <ambientLight intensity={0.4} />
                            <directionalLight position={[10, 10, 5]} intensity={1.2} />
                            <pointLight position={[-10, -10, -10]} color="#3B82F6" intensity={0.5} />
                            <WalletIcon3D />
                        </Suspense>
                    </Canvas>
                </div>
                <h1 className={styles.promptTitle}>Masuk ke Ruang Obrolan</h1>
                <p className={styles.promptText}>
                    Hubungkan dompet Web3 Anda untuk memulai percakapan yang aman dan terdesentralisasi.
                    Berinteraksi dengan komunitas crypto global secara real-time.
                </p>
                <button onClick={connectWallet} className={styles.promptButton}>
                    <span className={styles.buttonIcon}>🔗</span>
                    Hubungkan Dompet
                </button>
            </div>
        );
    }

    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>
                <h1 className={styles.pageTitle}>Ruang Obrolan Global</h1>
                <div className={styles.statusIndicator}>
                    <div 
                        className={styles.statusDot}
                        style={{ backgroundColor: getConnectionStatusColor() }}
                    ></div>
                    <span className={styles.statusText}>
                        {getConnectionStatusText()}
                    </span>
                </div>
            </div>
            
            <div className={styles.messagesWindow}>
                {messages.length === 0 && (
                    <div className={styles.emptyState}>
                        <p>Belum ada pesan. Mulai percakapan!</p>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div key={index} className={
                        msg.type === 'system' ? styles.systemMessage :
                        msg.user && msg.user.toLowerCase() === account.toLowerCase() ? styles.myMessage : styles.otherMessage
                    }>
                        {msg.type === 'chat' && (
                            <div className={styles.messageHeader}>
                                <span className={styles.username}>{truncateAddress(msg.user)}</span>
                                {msg.timestamp && (
                                    <span className={styles.timestamp}>{formatTimestamp(msg.timestamp)}</span>
                                )}
                            </div>
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
                    placeholder={connectionStatus === 'connected' ? "Ketik pesan..." : "Menunggu koneksi..."}
                    disabled={connectionStatus !== 'connected'}
                />
                <button 
                    type="submit" 
                    className={styles.sendButton}
                    disabled={!input.trim() || connectionStatus !== 'connected'}
                >
                    <span className={styles.sendIcon}>📤</span>
                    Kirim
                </button>
            </form>
        </div>
    );
};

export default ChatroomPage;