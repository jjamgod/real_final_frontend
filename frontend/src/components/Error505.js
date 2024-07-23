import '../styles/Error505.css';
import { Link, useNavigate } from 'react-router-dom';



function Error505() {

    return (<div>
            <div className="error505">
                <img className="error505-img" src='/images/error/ERROR505.png'/>
            </div>
            <a href='/'>
                <button className="error505-home">홈페이지로 돌아가기</button>
            </a>

        </div>

    );
}

export default Error505;
