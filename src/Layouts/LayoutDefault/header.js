import { Link, useNavigate, useLocation } from "react-router-dom";

function Header({ profileObj }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const goToSection = (e, id) => {
    e.preventDefault();
    if (!isHome) navigate("/");
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  return (
    <header id="header" className="header sticky-top">
      {/* Topbar */}
      <div className="topbar d-flex align-items-center">
        <div className="container d-flex justify-content-center justify-content-md-between">
          <div className="contact-info d-flex align-items-center">
            <i className="bi bi-envelope d-flex align-items-center">
              <a href="mailto:nhph20049@gmail.com">nhph20049@gmail.com</a>
            </i>
            <i className="bi bi-phone d-flex align-items-center ms-4">
              <span>+0862 770 487</span>
            </i>
          </div>
          <div className="social-links d-none d-md-flex align-items-center">
            <a href="#" className="twitter"><i className="bi bi-twitter-x"></i></a>
            <a href="#" className="facebook"><i className="bi bi-facebook"></i></a>
            <a href="#" className="instagram"><i className="bi bi-instagram"></i></a>
            <a href="#" className="linkedin"><i className="bi bi-linkedin"></i></a>
          </div>
        </div>
      </div>

      {/* Branding + Menu + Auth */}
      <div className="branding d-flex align-items-center">
        <div className="container position-relative d-flex align-items-center justify-content-between">

          {/* Logo */}
          <a
            href="/"
            className="logo d-flex align-items-center me-auto"
            onClick={(e) => goToSection(e, "hero")}
          >
            <div className="header__icon">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT49F2ps83MOUp-0Ypzc0N8JoFczuQIt6TZgg&s"
                alt="Icon"
              />
            </div>
            <h1 className="sitename">BookingHealth</h1>
          </a>

          {/* Menu React */}
          <nav id="navmenu" className="navmenu">
            <ul>
              {/* Chỉ show section khi ở home */}
              {isHome && (
                <>
                  <li><a href="#hero" onClick={(e) => goToSection(e, "hero")}>Trang chủ</a></li>
                  <li><a href="#doctors" onClick={(e) => goToSection(e, "doctors")}>Bác sĩ</a></li>
                  <li><a href="#family-doctors" onClick={(e) => goToSection(e, "family-doctors")}>Bác sĩ gia đình</a></li>
                  <li><a href="#clinics" onClick={(e) => goToSection(e, "clinics")}>Phòng khám</a></li>
                  <li><a href="#specializations" onClick={(e) => goToSection(e, "specializations")}>Chuyên khoa</a></li>
                </>
              )}

              {/* Login/Logout */}
              {profileObj ? (
                <>
                  <li><Link to="/ho-so-ca-nhan">Hồ sơ</Link></li>
                  <li><Link to="/dang-xuat">Đăng xuất</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/dang-nhap">Đăng nhập</Link></li>
                  <li><Link to="/dang-ky">Đăng ký</Link></li>
                </>
              )}
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>

          {/* CTA Button */}
          <Link to="/lich-hen" className="cta-btn d-none d-sm-block">Lịch hẹn</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
