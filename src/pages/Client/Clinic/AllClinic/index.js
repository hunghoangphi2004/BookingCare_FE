import { getAllClinic } from "../../../../services/homeService";
import { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";

function AllClinic() {
    const navigate = useNavigate();

    const [allClinic, setAllClinic] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const result = await getAllClinic();
            setAllClinic(result.data);
        }
        fetchData();
    }, [])


    const handleClick = (clinic) => {
        navigate(`/phong-kham/${clinic.slug}`);
    }

    return (
        <>
            {allClinic.length > 0 && (
                <>
                    <div className="container">
                        <div className="mt-4">
                            <h2>Phòng khám</h2>

                            <div className="row">
                                {allClinic.map((clinic, index) => (
                                    <div className="col-12 col-sm-6 col-md-3 mb-4" key={index} onClick={() => handleClick(clinic)}>
                                        <div className="specialization-list-item text-center mb-4">
                                            <div className="specialization-list-item-image mb-4">
                                                <img
                                                    src={clinic.image}
                                                    alt={clinic.name}
                                                    className="img-fluid"
                                                />
                                            </div>
                                            <p className="specialization-title">{clinic.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );

}

export default AllClinic;