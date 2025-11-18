import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../../services/authService";
import Cookies from "js-cookie";
import { checkLogin } from "../../../actions/login";
import "./login.css";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [userFormData, setUserFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await login(userFormData);
            if (data.success === true) {
                Cookies.set("tokenUser", data.result.token);
                Cookies.set("profileUser", JSON.stringify(data.result));
                dispatch(checkLogin(true));
                navigate("/");
            } else {
                setError("Sai thông tin đăng nhập. Vui lòng kiểm tra lại email và mật khẩu.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>Đăng nhập</h2>
                    <p>Chào mừng bạn trở lại</p>
                </div>

                <div className="login-body">
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={userFormData.email}
                                onChange={handleChange}
                                placeholder="Nhập email của bạn"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Mật khẩu</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={userFormData.password}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-login"
                            disabled={loading}
                        >
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>

                        <div className="forgot-password">
                            <Link to="/forgot-password">Quên mật khẩu?</Link>
                        </div>
                    </form>
                </div>

                <div className="login-footer">
                    <span>Chưa có tài khoản?</span>
                    <Link to="/dang-ky">Đăng ký ngay</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;