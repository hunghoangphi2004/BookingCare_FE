import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { checkLogin } from "../../../actions/login";

function Logout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const allCookies = Object.keys(Cookies.get());
    allCookies.forEach(cookieName => {
        Cookies.remove(cookieName, { path: "/" });
    });


    useEffect(() => {
         dispatch(checkLogin(false))
        navigate("/");
    }, []);

    return <p>Đang đăng xuất...</p>;
}

export default Logout;
