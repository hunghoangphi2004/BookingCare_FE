import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { checkLogin } from "../../../actions/login";

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const logout = async () => {
      try {
        const token = Cookies.get("token");

        await fetch("http://localhost:3000/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Lỗi khi logout:", error);
      } finally {
        const allCookies = Object.keys(Cookies.get());
        allCookies.forEach((cookieName) => {
          Cookies.remove(cookieName, { path: "/" });
        });

        dispatch(checkLogin(false));
        navigate("/login");
      }
    };

    logout();
  }, [dispatch, navigate]);

  return <p>Đang đăng xuất...</p>;
}

export default Logout;
