import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Header from "./header"
import Hero from "./hero"
import Footer from "./footer"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'aos/dist/aos.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'glightbox/dist/css/glightbox.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './style.css'
import AOS from 'aos';
import 'aos/dist/aos.css';

function LayoutDefault() {
    const profile = Cookies.get("profileUser");
    const profileObj = profile ? JSON.parse(profile) : null;
    const navigate = useNavigate();
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        <div className="layout-default">
            <Header profileObj={profileObj} />

            <main className="main">
                <Hero />
                <Outlet />
            </main>

            <Footer/>
            
        </div>
    );
}

export default LayoutDefault;