import '../styles/Chat.css';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import NavigationBar from "./NavigationBar";
import SideNavBtn from '../components/SideNavBtn';



function Chat() {
    const [messages, setMessages] = useState([]);
    const [question, setQuestion] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const chatLogRef = useRef(null); // chat-log에 대한 레퍼런스 생성

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
            setQuestion('');
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    };

    const handleSubmit = async () => {
        setQuestion('');
        if (question.trim() === '') return; // 빈 입력 방지
        const userMessage = { sender: 'user', text: question };
        setMessages([...messages, userMessage]);
        setLoading(true);

        try {
            const result = await axios.post('/ask', { question: question }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const botMessage = { sender: 'bot', text: result.data.result }; // 응답 구조에 맞게 수정
            setMessages([...messages, userMessage, botMessage]);
            setError(null);
        } catch (error) {
            setError(error);
            console.error('Error asking the question:', error);
        } finally {
            setLoading(false);
            setQuestion(''); // 질문 입력 후 초기화
        }
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    useEffect(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    }, [messages]); // messages 배열이 업데이트될 때마다 스크롤을 조정

    return (
        <div className="chatbot-background">
            <NavigationBar/>
            <SideNavBtn/>
            <div className="chatbot-frame">
                <div className="chatbot-header">
                    <img className="chatbot-header-logo" src="/images/chatbot/AIport.png"/>
                </div>
                <div className="chatbot-content">
                    <div className="chat-log" ref={chatLogRef}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.sender}`}>
                                <p>{msg.text}</p>
                            </div>
                        ))}
                        {loading && (
                            <div className="chat-message bot">
                                <div className="loading-animation"></div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="chatbot-footer">
                    <div className="chatbot-footer-user-msg">
                        <input
                            ref={inputRef}
                            className="chatbot-footer-user-msg-text"
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="메세지를 입력해주세요"
                            onKeyDown={handleKeyDown}
                        />
                        <button onClick={handleSubmit}>
                            <img
                                className="chatbot-footer-user-msg-send-img"
                                src="/images/chatbot/chatbot-footer-user-send.png"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;
