import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllFamilyDoctor } from "../../../services/homeService";

function FamilyDoctor() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await getAllFamilyDoctor();
                setDoctors(result.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleBookFamilyDoctor = (id) => {
        console.log("Đặt làm bác sĩ gia đình", id);
        navigate(`/gia-dinh/yeu-cau/${id}`);
        return;
    }

    return (
        <div className="container mt-4">
            {loading ? (
                <p>Đang tải danh sách bác sĩ...</p>
            ) : doctors.length === 0 ? null : (
                <>
                    <h2 style={{ fontSize: "30px", fontWeight: "600" }}>Danh sách bác sĩ gia đình: </h2>
                    {doctors.map((doc) => (
                        <div key={doc._id} className="doctor-box p-3 mb-4 rounded border">
                            <div className="row align-items-center">

                                {/* Bên trái: thông tin bác sĩ */}
                                <div className="col-md-6 d-flex align-items-center">
                                    <img
                                        src={doc.thumbnail}
                                        alt={doc.name}
                                        className="img-fluid rounded me-3"
                                        style={{ width: 120, height: 120, objectFit: "cover" }}
                                    />
                                    <div>
                                        <p className="fw-bold mb-1">{doc.name}</p>
                                        <p className="mb-1">{doc.clinicId.name}</p>
                                        <p className="mb-0">{doc.clinicId.address}</p>
                                        <div className="mt-2">
                                            <Link to={`/bac-si/${doc.slug}`}>Xem thêm</Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Bên phải: nút */}
                                <div className="col-md-6 text-center">
                                    <button className="btn btn-primary" onClick={() => handleBookFamilyDoctor(doc._id)}>
                                        Đặt làm bác sĩ gia đình
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))} 
                </>
            )}
        </div>
    );
}

export default FamilyDoctor;
