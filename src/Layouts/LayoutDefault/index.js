import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import "./LayoutDefault.scss";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function LayoutDefault() {
    const token = Cookies.get("token");
    const isLogin = useSelector(state => state.loginReducer);
    const profile = Cookies.get("profile");
    const profileObj = profile ? JSON.parse(profile) : null;
    console.log(profileObj);
    const navigate = useNavigate();

    // useEffect(() => {
    //     const checkProfile = async () => {
    //         if (!token) return;

    //         try {
    //             const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/patient/profile`, {
    //                 headers: { Authorization: `Bearer ${token}` }
    //             });
    //             const data = await res.json();

    //             if (
    //                 data?.success &&
    //                 data.result &&
    //                 data.result.firstName === "Chưa cập nhật" &&
    //                 data.result.lastName === "" &&
    //                 data.result.phoneNumber === "" &&
    //                 data.result.dateOfBitth === null,
    //                 data.result.gender === '' &&
    //                 data.result.address === '' 
    //             ) {
    //                 navigate("/profile/edit");
    //             }
    //         } catch (err) {
    //             console.error("Lỗi kiểm tra hồ sơ:", err);
    //         }
    //     };

    //     checkProfile();
    // }, [token, navigate]);

    return (
        <div className="layout-default">
            <header className="header">
                <div className="container">
                    <div className="header__logo-detail">
                        <div className="header__icon">
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT49F2ps83MOUp-0Ypzc0N8JoFczuQIt6TZgg&s"
                                alt="Icon"
                            />
                        </div>
                        <div className="header__logo">
                            {/* Logo content */}
                        </div>
                    </div>
                    <div className="header__nav">
                        <ul className="header__menu">
                            <li className="header__menu-item">
                                <Link to="/">Trang chủ</Link>
                            </li>
                            <li className="header__menu-item">
                                <Link to="/home">Bác sĩ</Link>
                            </li>
                            <li className="header__menu-item">
                                <Link to="/clinic">Bệnh nhân</Link>
                            </li>
                            <li className="header__menu-item">
                                <Link to="/health">Blog</Link>
                            </li>
                            <li className="header__menu-item">
                                <Link to="/admin">Admin</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="header__auth d-flex align-items-center">
                        <div className="header__auth d-flex align-items-center">
                            {token ?
                                (
                                    <div className="header__logout">
                                        <Link to="/logout">Đăng xuất</Link>
                                        <Link to="/profile">Profile</Link>
                                    </div>
                                ) :
                                (
                                    <div className="header__login">
                                        <Link to="/login">Đăng nhập</Link>
                                        <Link to="/register">Đăng ký</Link>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="layout-default__main">
                <Outlet />
            </main>

            <footer className="footer pt-4">
                <div className="container">
                    <div className="row">
                        {/* Cột 1: Thông tin liên hệ */}
                        <div className="col-md-4 mb-3">
                            <h5>Liên hệ</h5>
                            <p>Email: contact@example.com</p>
                            <p>Điện thoại: 0123 456 789</p>
                            <p>Địa chỉ: 123 Đường ABC, Quận XYZ</p>
                        </div>
                        {/* Cột 2: Liên kết */}
                        <div className="col-md-4 mb-3">
                            <h5>Liên kết nhanh</h5>
                            <ul className="list-unstyled">
                                <li>
                                    <Link to="/" className="text-decoration-none">
                                        Trang chủ
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/services" className="text-decoration-none">
                                        Dịch vụ
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/news" className="text-decoration-none">
                                        Tin tức
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact" className="text-decoration-none">
                                        Liên hệ
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        {/* Cột 3: Mạng xã hội */}
                        <div className="contact col-md-4 mb-3">
                            <h5>Kết nối với chúng tôi</h5>
                            <a href="#" className="me-3">
                                <i className="bi bi-facebook"></i> Facebook
                            </a>
                            <br />
                            <a href="#" className="me-3">
                                <i className="bi bi-instagram"></i> Instagram
                            </a>
                            <br />
                            <a href="#" className="me-3">
                                <i className="bi bi-twitter"></i> Twitter
                            </a>
                        </div>
                    </div>
                    <hr className="bg-white" />
                    <p className="text-center mb-0">
                        &copy; 2025 MyWebsite. Bản quyền thuộc về MyWebsite.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default LayoutDefault;