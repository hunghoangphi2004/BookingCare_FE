import { getAllSpecialization } from "../../../../services/homeService";
import { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";

function AllSpecialization() {
    const navigate = useNavigate();

    const [allSpec, setAllSpec] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const result = await getAllSpecialization();
            setAllSpec(result.data);
        }
        fetchData();
    }, [])


    const handleClick = (spec) => {
        navigate(`/kham-chuyen-khoa/${spec.slug}`);
    }

    return (
        <>
            {allSpec.length > 0 && (
                <>
                    <div className="container">
                        <div className="mt-4">
                            <h2>Khám chuyên khoa</h2>

                            <div className="row">
                                {allSpec.map((spec, index) => (
                                    <div className="col-12 col-sm-6 col-md-3 mb-4" key={index} onClick={() => handleClick(spec)}>
                                        <div className="specialization-list-item text-center mb-4">
                                            <div className="specialization-list-item-image mb-4">
                                                <img
                                                    src={spec.image}
                                                    alt={spec.name}
                                                    className="img-fluid"
                                                />
                                            </div>
                                            <p className="specialization-title">{spec.name}</p>
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

export default AllSpecialization;