import { useEffect, useState } from "react";
import { getAllClinic, getAllSpecialization, getAllDoctor, getAllFamilyDoctor } from "../../../services/homeService";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import {Link} from "react-router-dom";
import Hero from "../../../Layouts/LayoutDefault/hero";

function Home() {
    const [dataHomePage, setDataHomePage] = useState({
        specializations: [],
        clinics: [],
        doctors: [],
        familyDoctors: []
    });

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clinicsRes, specializationsRes, doctorsRes, familyDoctorsRes] = await Promise.all([
                    getAllClinic(),
                    getAllSpecialization(),
                    getAllDoctor(),
                    getAllFamilyDoctor()
                ]);

                setDataHomePage(prev => ({
                    ...prev,
                    clinics: clinicsRes.success ? clinicsRes.data : [],
                    specializations: specializationsRes.success ? specializationsRes.data : [],
                    doctors: doctorsRes.success ? doctorsRes.data : [],
                    familyDoctors: familyDoctorsRes.success ? familyDoctorsRes.data : []
                }));
            } catch (error) {
                console.error("Error fetching home page data:", error);
            } finally {
                setLoading(false);
            }
        };


        fetchData();
    }, []);

    console.log(dataHomePage)


    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }


    const handleDoctorClick = (slug) => {
        navigate(`bac-si/${slug}`)
    }

    const handleDoctorFamilyClick = (doctorId) => {
        navigate(`gia-dinh/yeu-cau/${doctorId}`)
    }

    return (
        <>  
            <Hero />
            <section className="features" data-aos="fade-zoom-in" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600">
                <div className="container">
                    <div className="for-you">
                        <div className="for-you__title mt-4 mb-5">
                            <h2>Bạn đang tìm kiếm gì?</h2>
                        </div>
                        <div className="row d-flex justify-content-around">
                            <div className="col-12 col-md-6 col-lg-3 for-you__item">
                                <div className="for-you__item-image">
                                    <img src="doctor-07.png" alt="Cơ sở y tế" />
                                    <h3 className="mt-4">Cơ sở y tế</h3>
                                </div>

                            </div>
                            <div className="col-12 col-md-6 col-lg-3 for-you__item">
                                <div className="for-you__item-image">
                                    <img src="header-cover.jpg" alt="Bác sĩ" />

                                    <h3 className="mt-4">Bác sĩ</h3>
                                </div>

                            </div>
                            <div className="col-12 col-md-6 col-lg-3 for-you__item">
                                <div className="for-you__item-image">
                                    <img src="for-doctors.jpg" alt="Chuyên khoa" />
                                    <h3 className="mt-4">Chuyên khoa</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="doctors" className="doctor">
                <div className="container">
                    <div className="doctor__title d-flex justify-content-between align-items-center">
                        <span>Bác sĩ nổi bật</span>
                        <Link className="more" to="bac-si-noi-bat">Xem thêm</Link>
                    </div>

                    <Slider
                        infinite={true}
                        speed={500}
                        slidesToShow={3}
                        slidesToScroll={3}
                        swipeToSlide={true}
                        arrows={true}
                        responsive={[
                            {
                                breakpoint: 992,
                                settings: {
                                    slidesToShow: 2,
                                }
                            },
                            {
                                breakpoint: 576,
                                settings: {
                                    slidesToShow: 1,
                                }
                            }
                        ]}
                    >
                        {dataHomePage.doctors &&
                            dataHomePage.doctors.slice(0, 10).map((doctor) => (
                                <div
                                    key={doctor._id}
                                    className="doctor__item px-2"
                                    onClick={() => handleDoctorClick(doctor.slug)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="doctor__image">
                                        <img
                                            src={doctor.thumbnail || "bacsi.png"}
                                            alt={doctor.name || doctor.userId?.email}
                                            onError={(e) => (e.target.src = "bacsi.png")}
                                        />
                                    </div>
                                    <h3>{doctor.name || doctor.userId?.email}</h3>

                                    {doctor.specializationId && (
                                        <p>Chuyên khoa: {doctor.specializationId.name}</p>
                                    )}
                                </div>
                            ))}
                    </Slider>
                </div>
            </section>

            {/* Doctors Section */}
            <section id="family-doctors" className="doctor">
                <div className="container">
                    <div className="doctor__title d-flex justify-content-between align-items-center">
                        <span>Bác sĩ gia đình</span>
                        <Link className="more" to="bac-si-gia-dinh">Xem thêm</Link>
                    </div>
                    <Slider
                        infinite={true}
                        speed={500}
                        slidesToShow={3}
                        slidesToScroll={3}
                        swipeToSlide={true}
                        arrows={true}
                        responsive={[
                            {
                                breakpoint: 992,
                                settings: {
                                    slidesToShow: 2,
                                }
                            },
                            {
                                breakpoint: 576,
                                settings: {
                                    slidesToShow: 1,
                                }
                            }
                        ]}
                    >
                        {dataHomePage.familyDoctors && dataHomePage.familyDoctors.slice(0, 10).map((doctor) => (
                            <div key={doctor._id} className="col-12 col-md-5 col-lg-3 doctor__item" onClick={() => handleDoctorFamilyClick(doctor._id)} style={{ cursor: 'pointer' }}>
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
                    </Slider>
                </div>
            </section>

            {/* Clinics Section */}
            <section id="clinics" className="clinic">
                <div className="container">
                    <div className="clinic__title d-flex justify-content-between align-items-center">
                        <span>Cơ sở y tế</span>
                        <Link className="more" to="phong-kham">Xem thêm</Link>
                    </div>
                    <Slider
                        infinite={true}
                        speed={500}
                        slidesToShow={3}
                        slidesToScroll={3}
                        swipeToSlide={true}
                        arrows={true}
                        responsive={[
                            {
                                breakpoint: 992,
                                settings: {
                                    slidesToShow: 2,
                                }
                            },
                            {
                                breakpoint: 576,
                                settings: {
                                    slidesToShow: 1,
                                }
                            }
                        ]}
                    >
                          {dataHomePage.clinics && dataHomePage.clinics.slice(0, 10).map((clinic) => (
                            <div key={clinic._id} className="col-12 col-md-5 col-lg-3 clinic__item">
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
                    </Slider>
                </div>
            </section>

            {/* Specializations Section */}
            <section id="specializations" className="specialization">
                <div className="container">
                    <div className="specialization__title d-flex justify-content-between align-items-center">
                        <span>Chuyên khoa</span>
                        <Link className="more" to="kham-chuyen-khoa">Xem thêm</Link>
                    </div>
                    <Slider
                        infinite={true}
                        speed={500}
                        slidesToShow={3}
                        slidesToScroll={3}
                        swipeToSlide={true}
                        arrows={true}
                        responsive={[
                            {
                                breakpoint: 992,
                                settings: {
                                    slidesToShow: 2,
                                }
                            },
                            {
                                breakpoint: 576,
                                settings: {
                                    slidesToShow: 1,
                                }
                            }
                        ]}
                    >
                           {dataHomePage.specializations && dataHomePage.specializations.slice(0, 10).map((specialization) => (
                            <div key={specialization._id} className="col-12 col-md-5 col-lg-3 specialization__item">
                                <div className="specialization__image">
                                    <img
                                        src={specialization.image || 'khamnhakhoa.png'}
                                        alt={specialization.name}
                                        onError={(e) => {
                                            e.target.src = 'khamnhakhoa.png'; 
                                        }}
                                    />
                                </div>
                                <h3>{specialization.name}</h3>
                                <p>{specialization.description}</p>
                            </div>
                        ))}
                    </Slider>
                </div>
            </section>

        </>
    );
}

export default Home;