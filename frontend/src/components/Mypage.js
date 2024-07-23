import React, {useState, useEffect} from 'react';
import axios from 'axios';
import '../styles/Mypage.css';
import NavigationBar from "./NavigationBar";

// 모달 컴포넌트 정의
const Modal = ({isOpen, onClose, children}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="mp-modal-overlay" onClick={handleBackdropClick}>
            <div className="mp-modal-content">
                <button className="mp-modal-close" onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
};

function Mypage() {
    const [email, setEmail] = useState(null);
    const [name, setName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 비밀번호 변경 폼 상태
    const [userID, setUserID] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    // 모달 표시 상태
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const emailResponse = await axios.get('/auth/token/email');
                const nameResponse = await axios.get('/auth/token/name');
                setEmail(emailResponse.data);
                setName(nameResponse.data);
                setLoading(false);
            } catch (error) {
                setError('정보를 가져오는 중 에러가 발생했습니다.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handlePasswordChange = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('/auth/change-password', new URLSearchParams({
                userID,
                oldPassword,
                newPassword
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            setPasswordSuccess(response.data);
            setPasswordError(null);
            setIsModalOpen(false);
            alert('비밀번호 변경 성공!'); // 비밀번호 변경 성공 메시지
        } catch (error) {
            console.log(error.response); // 오류 메시지 확인
            if (error.response && error.response.status === 400) {
                setPasswordError('아이디를 잘못 입력했습니다!');
                alert('아이디를 잘못 입력했습니다!');
            } else if (error.response) {
                setPasswordError(error.response.data);
            } else {
                setPasswordError('비밀번호 변경 중 오류가 발생했습니다.');
            }
            setPasswordSuccess(null);
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    if (loading) {
        return <p>이메일을 불러오는 중...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="mypage">
            <NavigationBar/>
            <div className="mypage-main-banner">
                <h1 className="mypage-main-banner-text">MYPAGE</h1>
            </div>

            <div className="mypage-content">
                <div className="mypage-content-text">회원정보</div>
                {email && name ? (
                    <>
                        <div className="mypage-username-text">회원이름 :</div>
                        <p className="mypage-username-input">{name}</p>
                        <div className="mypage-useremail-text">이메일 :</div>
                        <p className="mypage-useremail-input">{email}</p>
                    </>
                ) : (
                    <p>정보를 가져오지 못했습니다.</p>
                )}

                <div className="mypage-pw-btn" onClick={handleOpenModal}>
                    <div className="mypage-pw-btn-text">비밀번호 변경</div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <form onSubmit={handlePasswordChange}>
                    <div className="mypage-pw-popup">
                        <button className="mp-popup-close-box" onClick={handleCloseModal}>X</button>
                        <img src="/images/chatbot/AIport.png" alt="AIrport 로고" className="mp-home-logo"/>
                        <div className="mypage-pw-popup-text">비밀번호 변경</div>
                        <div>
                            {/*아이디*/}
                            <input
                                placeholder="아이디"
                                className="mypage-pw-popup-name"
                                type="text"
                                id="userID"
                                value={userID}
                                onChange={(e) => setUserID(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            {/*이전*/}
                            <input
                                placeholder="이전 비밀번호"
                                className="mypage-pw-popup-current"
                                type="password"
                                id="oldPassword"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            {/*신규*/}
                            <input
                                placeholder="변경할 비밀번호"
                                className="mypage-pw-popup-change"
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button className="mypage-pw-popup-btn" type="submit">비밀번호 변경</button>
                    </div>
                </form>

                {passwordSuccess && <p>{passwordSuccess}</p>}
                {passwordError && <p>{passwordError}</p>}
            </Modal>
        </div>
    );
}

export default Mypage;
