import { Link } from "react-router-dom";

function Header({ profileObj }) {
  return (
    <header id="header" className="header sticky-top">
      {/* Topbar */}
      <div className="topbar d-flex align-items-center">
        <div className="container d-flex justify-content-center justify-content-md-between">
          <div className="contact-info d-flex align-items-center">
            <i className="bi bi-envelope d-flex align-items-center">
              <a href="mailto:contact@example.com">contact@example.com</a>
            </i>
            <i className="bi bi-phone d-flex align-items-center ms-4">
              <span>+1 5589 55488 55</span>
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
          <a href="/" className="logo d-flex align-items-center me-auto">
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
              <li><Link to="/" className="active">Trang chủ</Link></li>
              <li><Link to="/home">Bác sĩ</Link></li>
              <li><Link to="/family-doctors">Bác sĩ gia đình</Link></li>
              <li><Link to="/health">Phòng khám</Link></li>
              <li><Link to="/admin">Chuyên khoa</Link></li>

              {/* Login/Logout trong menu */}
              {profileObj ? (
                <>
                  <li><Link to="/user-profile">Profile</Link></li>
                  <li><Link to="/logout">Đăng xuất</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/login">Đăng nhập</Link></li>
                  <li><Link to="/register">Đăng ký</Link></li>
                </>
              )}
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>


          {/* CTA Button */}
          <Link to="/appointment" className="cta-btn d-none d-sm-block">Đặt lịch</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
