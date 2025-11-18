import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register, sendRegisterOTP } from "../../../services/authService";
import "./register.css";

function Register() {
    const [userFormData, setUserFormData] = useState({
        email: "",
        otp: "",
        password: "",
        confirmPassword: "",
    });
    const [timer, setTimer] = useState(0);
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const handleSubmitRegisterOTP = async (e) => {
        e.preventDefault();
        if (!userFormData.email) {
            setError("Vui lòng nhập email trước khi gửi OTP");
            return;
        }

        setOtpLoading(true);
        setError("");
        
        try {
            const payload = { email: userFormData.email };
            const result = await sendRegisterOTP(payload);
            
            if (result.success === true) {
                setOtpSent(true);
                setTimer(30);
                setSuccess("OTP đã được gửi đến email của bạn!");
            } else {
                setError("Lỗi khi gửi OTP. Vui lòng thử lại.");
            }
        } catch (err) {
            setError("Có lỗi xảy ra khi gửi OTP.");
        } finally {
            setOtpLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (userFormData.password !== userFormData.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }
        
        if (userFormData.password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }
        
        if (!otpSent) {
            setError("Vui lòng gửi và nhập OTP trước khi đăng ký");
            return;
        }

        setLoading(true);
        setError("");
        
        try {
            const payload = {
                email: userFormData.email,
                otp: userFormData.otp,
                password: userFormData.password,
            };
            
            const result = await register(payload);
            
            if (result.success === true) {
                setSuccess("Đăng ký thành công! Chuyển hướng đến trang đăng nhập...");
                setTimeout(() => {
                    navigate("/dang-nhap");
                }, 2000);
            } else {
                setError(result.message || "Có lỗi xảy ra khi đăng ký");
            }
        } catch (err) {
            setError("Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError("");
        if (success) setSuccess("");
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h2>Đăng ký tài khoản</h2>
                    <p>Tạo tài khoản mới để sử dụng dịch vụ</p>
                </div>

                <div className="register-body">
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="success-message">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <div className="input-with-button">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={userFormData.email}
                                    onChange={handleChange}
                                    placeholder="Nhập email của bạn"
                                    required
                                    disabled={otpSent || loading}
                                />
                                <button
                                    type="button"
                                    className="btn-otp"
                                    onClick={handleSubmitRegisterOTP}
                                    disabled={timer > 0 || otpLoading || !userFormData.email}
                                >
                                    {otpLoading ? "..." : timer > 0 ? `${timer}s` : otpSent ? "Gửi lại" : "Gửi OTP"}
                                </button>
                            </div>
                            {otpSent && (
                                <small className="success-text">
                                    OTP đã được gửi đến email của bạn
                                </small>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="otp">Mã OTP</label>
                            <input
                                type="text"
                                id="otp"
                                name="otp"
                                value={userFormData.otp}
                                onChange={handleChange}
                                placeholder="Nhập mã OTP từ email"
                                required
                                disabled={loading || !otpSent}
                                maxLength="6"
                            />
                            <small>Nhập mã 6 số được gửi đến email của bạn</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Mật khẩu</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={userFormData.password}
                                onChange={handleChange}
                                placeholder="Tối thiểu 6 ký tự"
                                required
                                disabled={loading}
                                minLength="6"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={userFormData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Nhập lại mật khẩu"
                                required
                                disabled={loading}
                                className={userFormData.confirmPassword && 
                                    userFormData.password !== userFormData.confirmPassword ? 
                                    'error-input' : ''}
                            />
                            {userFormData.confirmPassword && userFormData.password !== userFormData.confirmPassword && (
                                <small className="error-text">Mật khẩu không khớp</small>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            className="btn-register"
                            disabled={loading || !otpSent}
                        >
                            {loading ? "Đang đăng ký..." : "Đăng ký tài khoản"}
                        </button>
                    </form>
                </div>

                <div className="register-footer">
                    <span>Đã có tài khoản?</span>
                    <Link to="/dang-nhap">Đăng nhập ngay</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;