function Footer() {
    return (
        <footer id="footer" className="footer light-background">
            <div className="container text-center py-4">
                {/* Thông tin liên hệ */}
                <div className="footer-contact mb-3">
                    <p>140 Lê Trọng Tấn, TP. Hồ Chí Minh, Việt Nam</p>
                    <p><strong>Số điện thoại:</strong> <span>0862770487</span></p>
                    <p><strong>Email:</strong> <span>support@bookinghealth.vn</span></p>
                </div>

                {/* Copyright */}
                <div className="copyright">
                    <p>© <strong className="sitename">BookingHealth</strong></p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
