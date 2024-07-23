import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles/Login.css';
import axios from "axios";
import qs from 'qs';
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
    const googleclientId = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID;
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [captchaValue, setCaptchaValue] = useState(null);

    const handleEmailOrUsernameChange = (e) => {
        setEmailOrUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const [shouldVerifyCaptcha, setShouldVerifyCaptcha] = useState(true);
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!captchaValue) {
            alert("Captcha를 확인해주세요.");
            return;
        }

        const user = {
            userID: emailOrUsername,
            password: password,
            captchaResponse: shouldVerifyCaptcha ? captchaValue : undefined,
        };

        axios.post('/auth/login', qs.stringify(user), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
            .then(response => {
                console.log('Success:', response.data);
                // 로그인 성공 시 토큰을 로컬 스토리지에 저장
                localStorage.setItem('token', response.data.token);
                navigate('/'); // 홈 페이지로 리다이렉트
            })
            .catch(error => {
                console.error('Error:', error);
                alert('로그인 실패: ' + (error.response?.data?.message || error.message));
            });
    };

    // const [captchaValue, setCaptchaValue] = useState(null);
    const onCaptchaChange = (value) => {
        if (shouldVerifyCaptcha) {
            if (value) {
                setCaptchaValue(value);
            } else {
                console.error("Invalid CAPTCHA value");
                setCaptchaValue(null);
            }
        }
    };

    useEffect(() => {
        const loadKakaoSDK = () => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
                script.onload = () => {
                    if (window.Kakao) {
                        window.Kakao.init('b7460a5f188beb205d56560fa8ef7c45'); // 여기에 실제 JavaScript 키를 입력하세요.
                        resolve(window.Kakao);
                    } else {
                        reject(new Error('Kakao SDK 로드 실패'));
                    }
                };
                script.onerror = () => reject(new Error('Kakao SDK 로드 실패'));
                document.head.appendChild(script);
            });
        };

        loadKakaoSDK()
            .then(() => {
                console.log('Kakao SDK 로드 및 초기화 성공');
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    // 카카오 로그인 버튼 클릭 시 호출되는 함수
    const loginWithKakao = () => {
        const clientId = '160902b869d905d3e51e7580bdd12709'; // 카카오 애플리케이션의 REST API 키
        const redirectUri = 'http://localhost:3000/oauth'; // 리디렉션 URI

        // 카카오 로그인 URL 생성
        const authUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;

        // URL을 콘솔에 출력
        console.log('Kakao Auth URL:', authUrl);

        // 카카오 인증 페이지로 리디렉션
        window.location.href = authUrl;
    };

    // 구글 로그인 버튼 클릭 시 호출되는 함수
    const loginWithGoogle = () => {
        const clientId = googleclientId;
        const redirectUri = 'http://localhost:3000/auth-callback'; // 리디렉션 URI

        // 구글 로그인 URL 생성
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid%20profile%20email&access_type=offline`;

        // 구글 인증 페이지로 리디렉션
        window.location.href = authUrl;
    };




    return (
        <div className="login-full-container">
            <Link to="/">
                <img src="/images/chatbot/AIport.png" alt="AIrport 로고" className="login-home-logo" />
            </Link>
            <div className="login-container">
                <h1 className="login-title">로그인</h1>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="input-label">아이디 입력</label>
                        <input
                            type="text"
                            placeholder="아이디를 입력해주세요."
                            className="login-input"
                            value={emailOrUsername}
                            onChange={handleEmailOrUsernameChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="input-label">비밀번호 입력</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="비밀번호를 입력해주세요."
                            className="login-input"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <button
                            type="button"
                            className="login-show-hide-button"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <div className="form-group">
                        <ReCAPTCHA
                            sitekey="6LcX7hIqAAAAANwXNsGWClj7CFdauq4p-x4e_i7e" // 실제 Google에서 받은 사이트 키로 변경하세요.
                            onChange={onCaptchaChange}
                        />
                    </div>
                    <button
                        type="submit"
                        className="login-button"
                        disabled={!emailOrUsername || !password || !captchaValue}
                    >
                        <span>로그인</span>
                    </button>
                </form>

                <div className="login-links">
                    <Link to="/IdInquiry" className="find-link">아이디를 잊어버리셨나요?</Link>
                    <Link to="/PwInquiry" className="find-link">비밀번호를 잊어버리셨나요?</Link>
                </div>

                <div className="login-social">
                    <button className="social-button google-button" onClick={loginWithGoogle}>
                        <img src="/images/google_icon.png" alt="Google" className="social-icon" />
                        Google로 시작하기
                    </button>
                    <button className="social-button kakao-button" onClick={loginWithKakao}>
                        <img src="/images/kakao_icon.png" alt="Kakao" className="social-icon" />
                        Kakao로 시작하기
                    </button>


                </div>

                <div className="signup-link">
                    아직 회원이 아니신가요? 지금 <Link to="/signup">회원가입</Link> 하세요!
                </div>
            </div>
        </div>
    );
};

export default Login;
