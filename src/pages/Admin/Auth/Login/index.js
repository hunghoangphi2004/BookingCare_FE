import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../../../services/authService";
import Cookies from "js-cookie";
import { checkLogin } from "../../../../actions/login";

function AdminLogin() {
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
                Cookies.set("token", data.token);
                Cookies.set("refreshToken", data.refreshToken);
                Cookies.set("profile", JSON.stringify(data.result));
                dispatch(checkLogin(true));

                // Navigate dựa vào role
                const role = data.result.role;
                console.log(role)
                if (role == "admin") navigate("/admin");
                else if (role == "supporter") navigate("/admin/supporter");
                else if (role == "doctor") navigate("/admin/doctor-dashboard");
                else navigate("/"); 
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="container vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h2 className="text-center mb-3">Admin Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            name="email"
                            value={userFormData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            name="password"
                            value={userFormData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
