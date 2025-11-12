import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../../services/authService";
import Cookies from "js-cookie";
import { checkLogin } from "../../../actions/login";

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
        // Clear error when user starts typing
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
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="row w-100 justify-content-center">
                <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                    <div className="card shadow-lg border-0">
                        <div className="card-header bg-primary text-white text-center py-4">
                            <h2 className="mb-0">
                                <i className="fas fa-user-circle me-2"></i>
                                Đăng nhập
                            </h2>
                            <p className="mb-0 mt-2 opacity-75">Chào mừng bạn trở lại</p>
                        </div>

                        <div className="card-body p-4">
                            {error && (
                                <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
                                    <i className="fas fa-exclamation-triangle me-2"></i>
                                    <div>{error}</div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label fw-semibold">
                                        <i className="fas fa-envelope me-2 text-muted"></i>
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control form-control-lg"
                                        id="email"
                                        name="email"
                                        value={userFormData.email}
                                        onChange={handleChange}
                                        placeholder="Nhập email của bạn"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label fw-semibold">
                                        <i className="fas fa-lock me-2 text-muted"></i>
                                        Mật khẩu
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg"
                                        id="password"
                                        name="password"
                                        value={userFormData.password}
                                        onChange={handleChange}
                                        placeholder="Nhập mật khẩu"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="d-grid mb-3">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </span>
                                                Đang đăng nhập...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-sign-in-alt me-2"></i>
                                                Đăng nhập
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="text-center">
                                    <Link to="/forgot-password" className="text-decoration-none small">
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                            </form>
                        </div>

                        <div className="card-footer bg-light text-center py-3">
                            <span className="text-muted">Chưa có tài khoản?</span>
                            <Link to="/register" className="text-decoration-none ms-1 fw-semibold">
                                Đăng ký ngay
                            </Link>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="text-center mt-4">
                        <small className="text-muted">
                            <i className="fas fa-shield-alt me-1"></i>
                            Thông tin của bạn được bảo mật tuyệt đối
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;