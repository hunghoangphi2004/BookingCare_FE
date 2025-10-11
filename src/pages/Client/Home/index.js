import { useEffect, useState } from "react";
import { getHomePage } from "../../../services/homeService";
import { useNavigate } from "react-router-dom";
import './home.scss'

function Home() {
    const [dataHomePage, setDataHomePage] = useState({
        specializations: [],
        clinics: [],
        doctors: []
    });

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getHomePage();
                setDataHomePage(result);
                console.log("Home page data:", result);
            } catch (error) {
                console.error("Error fetching home page data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }


    const handleDoctorClick = (slug) => {
        navigate(`doctor/${slug}`)
    }

    return (
        <>
            <section className="services">
                <h2 className="services__title">
                    Nền tảng đặt lịch khám bệnh, chăm sóc răng miệng và làm đẹp
                </h2>
                <p className="services__subtitle">
                    Tìm các bác sĩ, phòng khám &amp; bệnh viện tốt nhất gần bạn.
                </p>

                <div className="search-box">
                    <form>
                        <div
                            className="mb-3 search-location aos aos-init aos-animate"
                        >
                            <input
                                className="form-control"
                                placeholder="Tìm vị trí"
                                type="text"
                            />
                            <span className="form-text">Dựa trên vị trí của bạn</span>
                        </div>

                        <div
                            className="mb-3 search-info aos aos-init aos-animate"
                            data-aos="fade-up"
                        >
                            <input
                                className="form-control"
                                placeholder="Tìm bác sĩ, phòng khám, bệnh viện, bệnh lý..."
                                type="text"
                            />
                            <span className="form-text">
                                Ví dụ: Khám răng hoặc kiểm tra đường huyết...
                            </span>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary search-btn mt-0 aos aos-init aos-animate"
                        >
                            <i className="fas fa-search"></i> <span>Tìm kiếm</span>
                        </button>
                    </form>
                </div>
            </section>


            <section className="features">
                <div className="container">
                    <div className="for-you">
                        <div className="for-you__title mt-4 mb-5">
                            <h2>Bạn đang tìm kiếm gì?</h2>
                        </div>
                        <div className="row d-flex justify-content-around">
                            <div className="col-3 for-you__item">
                                <div className="for-you__item-image">
                                    <img src="doctor-07.png" alt="Cơ sở y tế" />
                                </div>

                                <h3 className="mt-4">Cơ sở y tế</h3>
                            </div>
                            <div className="col-3 for-you__item">
                                <div className="for-you__item-image">
                                    <img src="header-cover.jpg" alt="Bác sĩ" />
                                </div>

                                <h3 className="mt-4">Bác sĩ</h3>
                            </div>
                            <div className="col-3 for-you__item">
                                <div className="for-you__item-image">
                                    <img src="for-doctors.jpg" alt="Chuyên khoa" />
                                </div>

                                <h3 className="mt-4">Chuyên khoa</h3>
                            </div>
                        </div>
                    </div>

                    <div className="comprehensive">
                        <div className="comprehensive__title">
                            Dịch vụ toàn diện
                        </div>
                        <div className="row comprehensive__menu d-flex justify-content-around">
                            <div className="col-5 comprehensive__item d-flex align-items-center">
                                <div className="comprehensive__image">
                                    <img src='khamchuyenkhoa.png' alt='Khám chuyên khoa' />
                                </div>
                                <h3>Khám chuyên khoa</h3>
                            </div>
                            <div className="col-5 comprehensive__item d-flex align-items-center">
                                <div className="comprehensive__image">
                                    <img src='khamnhakhoa.png' alt='Khám nha khoa' />
                                </div>
                                <h3>Khám nha khoa</h3>
                            </div>
                            <div className="col-5 comprehensive__item d-flex align-items-center">
                                <div className="comprehensive__image">
                                    <img src='khamtongquat.png' alt='Khám tổng quát' />
                                </div>
                                <h3>Khám tổng quát</h3>
                            </div>
                            <div className="col-5 comprehensive__item d-flex align-items-center">
                                <div className="comprehensive__image">
                                    <img src='khamtieuduong.png' alt='Khám tiểu đường' />
                                </div>
                                <h3>Khám tiểu đường</h3>
                            </div>
                        </div>
                    </div>

                    {/* Specializations Section */}
                    <div className="specialization">
                        <div className="specialization__title">
                            <span>Chuyên khoa</span>
                        </div>
                        <div className="row specialization__menu d-flex justify-content-around">
                            {dataHomePage.specializations && dataHomePage.specializations.slice(0, 3).map((specialization) => (
                                <div key={specialization._id} className="col-3 specialization__item">
                                    <div className="specialization__image">
                                        <img
                                            src={specialization.image || 'khamnhakhoa.png'}
                                            alt={specialization.name}
                                            onError={(e) => {
                                                e.target.src = 'khamnhakhoa.png'; // Fallback image
                                            }}
                                        />
                                    </div>
                                    <h3>{specialization.name}</h3>
                                    <p>{specialization.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Clinics Section */}
                    <div className="clinic">
                        <div className="clinic__title">
                            <span>Cơ sở y tế</span>
                        </div>
                        <div className="row clinic__menu d-flex justify-content-around">
                            {dataHomePage.clinics && dataHomePage.clinics.slice(0, 3).map((clinic) => (
                                <div key={clinic._id} className="col-3 clinic__item">
                                    <div className="clinic__image">
                                        <img
                                            src={clinic.image || 'cosoyte.png'}
                                            alt={clinic.name}
                                            onError={(e) => {
                                                e.target.src = 'cosoyte.png'; // Fallback image
                                            }}
                                        />
                                    </div>
                                    <h3>{clinic.name}</h3>
                                    <p>{clinic.address}</p>
                                    <p>Giờ mở cửa: {clinic.openingHours}</p>
                                    <p>SĐT: {clinic.phone}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Doctors Section */}
                <div className="doctor">
                    <div className="container">
                        <div className="doctor__title">
                            <span>Bác sĩ nổi bật</span>
                        </div>
                        <div className="row doctor__menu d-flex justify-content-around">
                            {dataHomePage.doctors && dataHomePage.doctors.slice(0, 3).map((doctor) => (
                                <div key={doctor._id} className="col-3 doctor__item" onClick={() => handleDoctorClick(doctor.slug)} style={{ cursor: 'pointer' }}>
                                    <div className="doctor__image">
                                        <img
                                            src={doctor.thumbnail || 'bacsi.png'}
                                            alt={doctor.name || doctor.userId?.email}
                                            onError={(e) => {
                                                e.target.src = 'bacsi.png'; // Fallback image
                                            }}
                                        />
                                    </div>
                                    <h3>{doctor.name || doctor.userId?.email}</h3>
                                    {doctor.specializationId && (
                                        <p>Chuyên khoa: {doctor.specializationId.name}</p>
                                    )}
                                    {doctor.clinicId && (
                                        <p>Phòng khám: {doctor.clinicId.name}</p>
                                    )}
                                    <p>Kinh nghiệm: {doctor.experience} năm</p>
                                    <p>Phí tư vấn: {doctor.consultationFee?.toLocaleString('vi-VN')} VNĐ</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* <div className="suggest">
                    <div className="container">
                        <div className="suggest__title mt-4 mb-5">
                            <h2>Gợi ý của BookingCare</h2>
                        </div>
                        <div className="row">
                            <div className="col-4 suggest__item">
                                <img src="cosoyte.png" alt="Cơ sở y tế" />
                                <h3 className="mt-4">Được quan tâm</h3>
                            </div>
                            <div className="col-4 suggest__item">
                                <img src="bacsi.png" alt="Bác sĩ" />
                                <h3 className="mt-4">Y tế nổi bật</h3>
                            </div>
                            <div className="col-4 suggest__item">
                                <img src="chuyenkhoa.png" alt="Chuyên khoa" />
                                <h3 className="mt-4">Bài viết liên quan</h3>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* <div className="QA">
                    <div className="container">
                        <div className="QA__title mt-4 mb-5">
                            <h2>Bác sĩ hỏi đáp</h2>
                        </div>
                        <div className="row d-flex">
                            <div className="col-4 QA__item">
                                <img src="cosoyte.png" alt="Cơ sở y tế" />
                                <h3 className="mt-4">Hỏi bác sĩ miễn phí</h3>
                            </div>
                            <div className="col-4 QA__item">
                                <img src="bacsi.png" alt="Bác sĩ" />
                                <h3 className="mt-4">Cẩm nang hỏi đáp</h3>
                            </div>
                        </div>
                    </div>
                </div> */}

                <div className="post">
                    <div className="container">
                        <div className="post__title mt-4 mb-5">
                            <h2>Bài viết</h2>
                        </div>
                        <div className="row">
                            <div className="col-4 post__item">
                                <img src="surgery.jpg" alt="Cơ sở y tế" />
                                <h3 className="mt-4">Được quan tâm</h3>
                            </div>
                            <div className="col-4 post__item">
                                <img src="otolaryngology.jpg" alt="Bác sĩ" />
                                <h3 className="mt-4">Y tế nổi bật</h3>
                            </div>
                            <div className="col-4 post__item">
                                <img src="medicine.jpg" alt="Chuyên khoa" />
                                <h3 className="mt-4">Bài viết liên quan</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Home;