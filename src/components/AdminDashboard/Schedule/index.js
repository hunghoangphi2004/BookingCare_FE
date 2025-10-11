import { useEffect, useState } from "react";
import { getAllDoctor } from "../../../services/doctorService";
import { createSchedule } from "../../../services/scheduleService"
import { getAllSpec } from "../../../services/specializationService";

function Schedule() {

    const [selectedDate, setSelectedDate] = useState("")
    const [selectedTime, setSelectedTime] = useState([])
    const [selectedDoctor, setSelectedDoctor] = useState("")
    const [doctors, setDoctors] = useState([])
    const [specializations, setSpecializations] = useState([])
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");




    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const result = await getAllDoctor();
                setDoctors(result.data)
            } catch (error) {
                console.error("Lỗi khi lấy danh sách bác sĩ:", error);
            }
        };

        // const fetchSpecializations = async () => {
        //     try {
        //         const result = await getAllSpec();
        //         console.log(result)
        //         setSpecializations(result.data)
        //     } catch (error) {
        //         console.error("Lỗi khi lấy danh sách bác sĩ:", error);
        //     }
        // };

        fetchDoctors();
        // fetchSpecializations();
    }, []);

    const handleClickTime = (item) => {
        setSelectedTime((prevSelected) => {
            const isSelected = prevSelected.includes(item);

            let updatedSelected;

            if (isSelected) {
                updatedSelected = prevSelected.filter((t) => t !== item);
            } else {
                updatedSelected = [...prevSelected, item];
            }
            return updatedSelected;
        });
    };


    const handleChangeDate = (e) => {
        let date = e.target.value;
        const [year, month, day] = date.split("-")
        date = `${day}/${month}/${year}`
        setSelectedDate(date)
    }

    const handleCreateSchedule = async () => {
        if (!selectedDoctor || !selectedDate || selectedTime.length === 0) {
            setMessage("Vui lòng chọn bác sĩ, ngày và giờ trước khi tạo lịch");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const result = await createSchedule(payload); // gọi API
            if (result.success) {
                setMessage("Tạo lịch thành công");
                setSelectedTime([]);
            } else {
                setMessage(result.message || "Tạo lịch thất bại");
            }
        } catch (error) {
            console.error(error);
            setMessage("Có lỗi xảy ra khi tạo lịch");
        } finally {
            setLoading(false);
        }
    };


    const timeArr = [
        "08:00-08:30",
        "08:30-09:00",
        "09:00-09:30",
        "09:30-10:00",
        "10:00-10:30",
        "10:30-11:00",
        "11:00-11:30",
        "11:30-12:00",
        "13:00-13:30",
        "13:30-14:00",
        "14:00-14:30",
        "14:30-15:00",
        "15:00-15:30",
        "15:30-16:00",
        "16:00-16:30",
        "16:30-17:00",
    ];

    let payload = {
        doctorId: selectedDoctor,
        date: selectedDate,
        schedules: selectedTime.map((item) => ({
            time: item
        }))
    }

    // console.log(payload)

    return (
        <>
            <p>Bác sĩ</p>
            <select
                className="form-select mb-3"
                style={{ display: "block", width: "auto" }}
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
            >
                <option value="">Chọn bác sĩ</option>
                {doctors.map((item) => (
                    <option key={item._id} value={item._id}>
                        {item.name}
                    </option>
                ))}
            </select>



            <div className="mb-3">
                <label
                    htmlFor="date"
                    className="form-label fw-bold"
                    style={{ display: "block", width: "auto" }}
                >
                    Chọn ngày:
                </label>
                <input
                    type="date"
                    id="date"
                    className="form-control"
                    style={{ width: "auto", display: "block" }}
                    onChange={handleChangeDate}
                />
            </div>

            <h6 className="fw-bold">Chọn khung giờ:</h6>
            {timeArr.map((item, index) => (
                <button
                    key={index}
                    value={item}
                    className={`btn m-1 ${selectedTime.includes(item) ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => handleClickTime(item)}
                >
                    {item}
                </button>
            ))}


            <div>
                <button
                    className="btn btn-success mt-3"
                    onClick={handleCreateSchedule}
                    disabled={loading || !selectedDoctor || !selectedDate || selectedTime.length === 0}
                >
                    {loading ? "Đang tạo..." : "Tạo lịch"}
                </button>
            </div>

            {message && <div className="alert alert-info mt-2">{message}</div>}

        </>
    );
}

export default Schedule;
