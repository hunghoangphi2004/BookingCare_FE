function Hero() {
  return (
    <section id="hero" className="hero section light-background">
      <img src="hero-bg.jpg" alt="Hero Background" data-aos="fade-in" />

      <div className="container position-relative">
        {/* Welcome */}
        <div className="welcome position-relative"   data-aos="fade-down" data-aos-delay="100">
          <h2>Chào mừng đến với BookingHealth</h2>
          <p>Nền tảng đặt lịch khám bệnh hiện đại</p>
        </div>

        {/* Content */}
        <div className="content row gy-4">
          {/* Why Box */}
          <div className="col-lg-4 d-flex align-items-stretch">
            <div className="why-box" data-aos="zoom-out" data-aos-delay="200">
              <h3>Tại sao chọn BookingHealth?</h3>
              <p>
                Chúng tôi luôn nỗ lực mang đến dịch vụ chăm sóc sức khỏe tốt nhất. Medilab cam kết cung cấp giải pháp an toàn, hiệu quả và đáng tin cậy để phục vụ nhu cầu của bạn. Đội ngũ của chúng tôi luôn tận tâm, chuyên nghiệp và sẵn sàng hỗ trợ bạn trong mọi tình huống.
              </p>
              <div className="text-center">
                <a href="#about" className="more-btn">
                  <span>Xem thêm</span> <i className="bi bi-chevron-right"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Icon Boxes */}
          <div className="col-lg-8 d-flex align-items-stretch">
            <div className="d-flex flex-column justify-content-center">
              <div className="row gy-4">
                <div className="col-xl-4 d-flex align-items-stretch">
                  <div className="icon-box" data-aos="zoom-out" data-aos-delay="300">
                    <i className="bi bi-clipboard-data"></i>
                    <h4>Dịch vụ chất lượng cao</h4>
                    <p>Chúng tôi cung cấp các dịch vụ y tế chuyên nghiệp, an toàn và đáng tin cậy cho mọi nhu cầu của bạn.</p>
                  </div>
                </div>

                <div className="col-xl-4 d-flex align-items-stretch">
                  <div className="icon-box" data-aos="zoom-out" data-aos-delay="400">
                    <i className="bi bi-gem"></i>
                    <h4>Đội ngũ chuyên gia</h4>
                    <p>Đội ngũ bác sĩ và nhân viên y tế giàu kinh nghiệm, luôn tận tâm chăm sóc sức khỏe cho bạn.</p>
                  </div>
                </div>

                <div className="col-xl-4 d-flex align-items-stretch">
                  <div className="icon-box" data-aos="zoom-out" data-aos-delay="500">
                    <i className="bi bi-inboxes"></i>
                    <h4>Công nghệ hiện đại</h4>
                    <p>Chúng tôi sử dụng trang thiết bị y tế tiên tiến, đảm bảo quy trình khám chữa bệnh nhanh chóng và chính xác.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
