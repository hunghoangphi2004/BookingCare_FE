import { useEffect, useState } from "react";
import {getAllPrescriptionByDoctor, createPrescription, updatePrescription, deletePrescription, sendPrescriptionPDF } from "../../../services/prescriptionService";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function DoctorPrescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({ page: 1, limit: 5 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [show, setShow] = useState(false);
    const [selectedId, setSelectedId] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate()

    const handleClose = () => setShow(false);
    const handleShow = (id, patientEmail) => {
        setSelectedId(id);
        setEmail(patientEmail);
        setShow(true);
    };

    useEffect(() => {
        fetchPrescriptions(filters);
    }, [filters]);

    const fetchPrescriptions = async () => {
        try {
            setLoading(true);
            const res = await getAllPrescriptionByDoctor();
            console.log(res)
            if (res.success) {
                setPrescriptions(res.data);
                setPagination(res.pagination);
            } else {
                setError(res.message || "Không lấy được dữ liệu toa thuốc");
            }
        } catch (err) {
            console.error(err);
            setError("Có lỗi xảy ra khi lấy dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa toa thuốc này không?")) {
            const res = await deletePrescription(id);
            if (res.success) {
                alert("Xóa toa thuốc thành công!");
                setPrescriptions((prev) => prev.filter((d) => d._id !== id));
                setPagination((prev) => {
                    const newTotal = (prev.total || 0) - 1;
                    const totalPages = Math.ceil(newTotal / (filters.limit || 10));

                    if (filters.page > totalPages && totalPages > 0) {
                        setFilters((f) => ({ ...f, page: totalPages }));
                    }

                    return {
                        ...prev,
                        total: newTotal,
                        totalPages,
                    };
                });
            } else {
                alert(res.message || "Lỗi khi xóa toa thuốc");
            }
        }
    };

    const handleSendEmail = async () => {
        if (!email) {
            alert("Không tìm thấy email của bệnh nhân!");
            return;
        }
        try {
            const res = await sendPrescriptionPDF(selectedId, { email });
            if (res.success) {
                alert("Gửi PDF thành công!");
                handleClose();
            } else {
                alert(res.message || "Gửi thất bại!");
            }
        } catch (err) {
            console.error(err);
            alert("Có lỗi khi gửi email!");
        }
    };

    const handlePageChange = (newPage) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <h2 className="mb-4">Danh sách toa thuốc ({pagination.total || 0})</h2>

            <button
                className="btn btn-primary mb-3"
                onClick={() => navigate("/admin/doctor/prescriptions/create")}
            >Thêm mới</button>

            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Bệnh nhân</th>
                        <th>Chẩn đoán</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {prescriptions.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center">
                                Không có toa thuốc nào
                            </td>
                        </tr>
                    ) : (
                        prescriptions.map((p, idx) => (
                            <tr key={p._id}>
                                <td>{(filters.page - 1) * (filters.limit || 10) + idx + 1}</td>
                                <td>{p.patientId.firstName + ' ' + p.patientId.lastName || "N/A"}</td>
                                <td>{p.diagnosis || "-"}</td>
                                <td>
                                    <span className={`badge ${p.status === "final" ? "bg-success" : "bg-secondary"}`}>
                                        {p.status}
                                    </span>
                                </td>
                                <td>{new Date(p.createdAt).toLocaleDateString("vi-VN")}</td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-info btn-sm"
                                            onClick={() => navigate(`/doctor/prescriptions/detail/${p._id}`)}
                                        >
                                            Xem
                                        </button>
                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() => navigate(`/doctor/prescriptions/edit/${p._id}`)}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(p._id)}
                                        >
                                            Xóa
                                        </button>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleShow(p._id, p.patientId.userId.email)}
                                        >
                                            Gửi PDF
                                        </button>
                                    </div>
                                </td>

                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {pagination.totalPages > 1 && (
                <div className="d-flex justify-content-center gap-2 mt-3">
                    {Array.from({ length: pagination.totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`btn ${pagination.page === i + 1 ? "btn-primary" : "btn-outline-primary"} btn-sm`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}

            {/* Modal gửi PDF */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Gửi PDF toa thuốc</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="email">
                            <Form.Label>Email bệnh nhân</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Hủy</Button>
                    <Button variant="primary" onClick={handleSendEmail}>Gửi</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default DoctorPrescriptions;
