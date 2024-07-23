import React from 'react';
import '../styles/ServiceIntro.css';
import NavigationBar from '../components/NavigationBar';
import SideNavBtn from '../components/SideNavBtn';


function ServiceIntro(){
    return(
        <div className="serviceintro-div">
            <NavigationBar/>
            <SideNavBtn/>
            <div className="service-intro-content">
                <img className="service-intro-content-img"
                src="/images/serviceintro/serviceintro.png"/>
            </div>
        </div>


    );
}

export default ServiceIntro;