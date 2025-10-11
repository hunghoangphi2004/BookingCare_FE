// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { register, sendRegisterOTP } from "../../../services/authService";

// function Register() {
//     const [userFormData, setUserFormData] = useState({
//         email: "",
//         otp: "",
//         password: "",
//     });
//     const [timer, setTimer] = useState(0);
//     const [otpSent, setOtpSent] = useState(false);
//     const navigate = useNavigate();


//     useEffect(() => {
//         if (timer <= 0) return;

//         const interval = setInterval(() => {
//             setTimer(prev => prev - 1);
//         }, 1000);


//         return () => clearInterval(interval);
//     }, [timer]);

//     const handleSubmitRegisterOTP = async (e) => {
//         const payload = { email: userFormData.email };
//         const result = await sendRegisterOTP(payload);
//         console.log(result)
//         if(result.success===true){
//             setOtpSent(true)
//             setTimer(30)
//         }
//         else {
//             alert("Lỗi khi gửi otp")
//         }
//     }

//     const handleSubmit = async(e) => {
//         e.preventDefault();
//         const payload = userFormData;
//         console.log(payload)
//         const result = await register(payload)
//         console.log(result)
//         if(result.success === true){
//             navigate("/login")
//         } else {
//             alert("Có lỗi xảy ra khi đăng ký")
//         }
//     }

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setUserFormData((prev) => ({ ...prev, [name]: value }));
//     };
//     console.log(userFormData)


//     return (
//         <div className="register-page">
//             <h2>Đăng ký</h2>
//             <form>
//                 <div>
//                     <label>Email:</label>
//                     <input
//                         onChange={handleChange}
//                         type="email"
//                         name="email"
//                         required
//                     />
//                     <button
//                         type="button"
//                         onClick={handleSubmitRegisterOTP}
//                         disabled={timer > 0}
//                     >
//                         {timer > 0 ? `Gửi lại sau ${timer}s` : "Gửi OTP"}
//                     </button>
//                 </div>


//                 <div>
//                     <label>OTP:</label>
//                     <input
//                         type="text"
//                         name="otp"
//                         onChange={handleChange}

//                         required
//                     />
//                 </div>

//                 <div>
//                     <label>Mật khẩu:</label>
//                     <input
//                         type="password"
//                         name="password"
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label>Xác nhận mật khẩu:</label>
//                     <input
//                         type="password"
//                         name="confirmPassword"
//                         required
//                     />
//                 </div>

//                 <button type="submit" onClick={handleSubmit}>Đăng ký</button>
//             </form>
//         </div>
//     );
// }

// export default Register;
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register, sendRegisterOTP } from "../../../services/authService";

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
            console.log(result);
            
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
        
        // Validation
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
            console.log(result);
            
            if (result.success === true) {
                setSuccess("Đăng ký thành công! Chuyển hướng đến trang đăng nhập...");
                setTimeout(() => {
                    navigate("/login");
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
        // Clear error when user starts typing
        if (error) setError("");
        if (success) setSuccess("");
    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light py-4">
            <div className="row w-100 justify-content-center">
                <div className="col-12 col-sm-10 col-md-8 col-lg-5">
                    <div className="card shadow-lg border-0">
                        <div className="card-header bg-success text-white text-center py-4">
                            <h2 className="mb-0">
                                <i className="fas fa-user-plus me-2"></i>
                                Đăng ký tài khoản
                            </h2>
                            <p className="mb-0 mt-2 opacity-75">Tạo tài khoản mới để sử dụng dịch vụ</p>
                        </div>
                        
                        <div className="card-body p-4">
                            {error && (
                                <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
                                    <i className="fas fa-exclamation-triangle me-2"></i>
                                    <div>{error}</div>
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success d-flex align-items-center mb-3" role="alert">
                                    <i className="fas fa-check-circle me-2"></i>
                                    <div>{success}</div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Email & OTP Section */}
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label fw-semibold">
                                        <i className="fas fa-envelope me-2 text-muted"></i>
                                        Email <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type="email"
                                            className="form-control"
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
                                            className={`btn ${otpSent ? 'btn-outline-success' : 'btn-outline-primary'}`}
                                            onClick={handleSubmitRegisterOTP}
                                            disabled={timer > 0 || otpLoading || !userFormData.email}
                                        >
                                            {otpLoading ? (
                                                <span className="spinner-border spinner-border-sm"></span>
                                            ) : timer > 0 ? (
                                                <>
                                                    <i className="fas fa-clock me-1"></i>
                                                    {timer}s
                                                </>
                                            ) : otpSent ? (
                                                <>
                                                    <i className="fas fa-redo me-1"></i>
                                                    Gửi lại
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-paper-plane me-1"></i>
                                                    Gửi OTP
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    {otpSent && (
                                        <div className="form-text text-success">
                                            <i className="fas fa-check me-1"></i>
                                            OTP đã được gửi đến email của bạn
                                        </div>
                                    )}
                                </div>

                                {/* OTP Input */}
                                <div className="mb-3">
                                    <label htmlFor="otp" className="form-label fw-semibold">
                                        <i className="fas fa-key me-2 text-muted"></i>
                                        Mã OTP <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="otp"
                                        name="otp"
                                        value={userFormData.otp}
                                        onChange={handleChange}
                                        placeholder="Nhập mã OTP từ email"
                                        required
                                        disabled={loading || !otpSent}
                                        maxLength="6"
                                    />
                                    <div className="form-text">
                                        Nhập mã 6 số được gửi đến email của bạn
                                    </div>
                                </div>

                                {/* Password Section */}
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label fw-semibold">
                                                <i className="fas fa-lock me-2 text-muted"></i>
                                                Mật khẩu <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="password"
                                                className="form-control"
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
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <label htmlFor="confirmPassword" className="form-label fw-semibold">
                                                <i className="fas fa-check-circle me-2 text-muted"></i>
                                                Xác nhận <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="password"
                                                className={`form-control ${userFormData.confirmPassword && 
                                                    userFormData.password !== userFormData.confirmPassword ? 
                                                    'is-invalid' : userFormData.confirmPassword && 
                                                    userFormData.password === userFormData.confirmPassword ? 
                                                    'is-valid' : ''}`}
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={userFormData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Nhập lại mật khẩu"
                                                required
                                                disabled={loading}
                                            />
                                            {userFormData.confirmPassword && userFormData.password !== userFormData.confirmPassword && (
                                                <div className="invalid-feedback">
                                                    Mật khẩu không khớp
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="d-grid mb-3">
                                    <button 
                                        type="submit" 
                                        className="btn btn-success btn-lg"
                                        disabled={loading || !otpSent}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </span>
                                                Đang đăng ký...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-user-plus me-2"></i>
                                                Đăng ký tài khoản
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="text-center">
                                    <small className="text-muted">
                                        Bằng cách đăng ký, bạn đồng ý với 
                                        <a href="#" className="text-decoration-none ms-1">Điều khoản dịch vụ</a>
                                    </small>
                                </div>
                            </form>
                        </div>

                        <div className="card-footer bg-light text-center py-3">
                            <span className="text-muted">Đã có tài khoản?</span>
                            <Link to="/login" className="text-decoration-none ms-1 fw-semibold">
                                Đăng nhập ngay
                            </Link>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="text-center mt-4">
                        <small className="text-muted">
                            <i className="fas fa-shield-alt me-1"></i>
                            Thông tin cá nhân được bảo mật theo tiêu chuẩn quốc tế
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;