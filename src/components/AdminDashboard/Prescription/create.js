import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPrescription } from "../../../services/prescriptionService";
import { getAllDoctor } from "../../../services/doctorService";
import { getAllPatient } from "../../../services/patientService";
import { getAllMedicine } from "../../../services/medicineService";
import Cookies from "js-cookie";
import { Form, Input, Select, Button, Alert, Divider, Space, Row, Col } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

const PrescriptionCreate = () => {
  const profile = Cookies.get("profile")
    ? JSON.parse(Cookies.get("profile"))
    : null;
  const isDoctor = profile?.role === "doctor";

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [allMedicines, setAllMedicines] = useState([]);

  useEffect(() => {
    fetchInitialData();
    if (isDoctor) {
      form.setFieldsValue({ doctorId: profile.doctor._id });
    }
  }, []);

  const fetchInitialData = async () => {
    try {
      const [docRes, patRes, medRes] = await Promise.all([
        getAllDoctor({ limit: 0 }),
        getAllPatient({ limit: 0 }),
        getAllMedicine({ limit: 0 }),
      ]);
      if (docRes.success) setDoctors(docRes.data);
      if (patRes.success) setPatients(patRes.data);
      if (medRes.success) setAllMedicines(medRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (values) => {
    if (!values.patientId || !values.diagnosis || (!values.doctorId && !isDoctor)) {
      setAlert({ type: "error", message: "Vui lòng nhập đủ thông tin bắt buộc!" });
      setTimeout(() => setAlert({ type: "", message: "" }), 5000);
      return;
    }

    const body = {
      ...values,
      medicines: values.medicines?.filter((m) => m.medicineId) || [],
    };

    setLoading(true);
    try {
      const res = await createPrescription(body);
      if (res.success) {
        navigate("/admin/prescriptions", {
          state: { alert: { type: "success", message: "Tạo toa thuốc thành công!" } },
        });
      } else {
        setAlert({ type: "error", message: res.message || "Không thể tạo toa thuốc!" });
        setTimeout(() => setAlert({ type: "", message: "" }), 5000);
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", message: "Đã xảy ra lỗi hệ thống!" });
      setTimeout(() => setAlert({ type: "", message: "" }), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Tạo toa thuốc</h3>

      {alert.message && (
        <Alert
          message={alert.message}
          type={alert.type}
          showIcon
          closable
          style={{ marginBottom: 16 }}
          onClose={() => setAlert({ type: "", message: "" })}
        />
      )}

      <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ maxWidth: 800 }}>
        {!isDoctor && (
          <Form.Item
            label="Bác sĩ"
            name="doctorId"
            rules={[{ required: true, message: "Vui lòng chọn bác sĩ!" }]}
          >
            <Select placeholder="-- Chọn bác sĩ --">
              {doctors.map((d) => (
                <Option key={d._id} value={d._id}>
                  {d.userId?.fullName || d.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          label="Bệnh nhân"
          name="patientId"
          rules={[{ required: true, message: "Vui lòng chọn bệnh nhân!" }]}
        >
          <Select placeholder="-- Chọn bệnh nhân --">
            {patients.map((p) => (
              <Option key={p._id} value={p._id}>
                {p.firstName} {p.lastName} - {p.phoneNumber}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Chẩn đoán"
          name="diagnosis"
          rules={[{ required: true, message: "Vui lòng nhập chẩn đoán!" }]}
        >
          <Input placeholder="Chẩn đoán bệnh" />
        </Form.Item>

        <Form.Item label="Ghi chú" name="notes">
          <Input.TextArea rows={3} placeholder="Ghi chú thêm" />
        </Form.Item>

        <Divider>Thuốc</Divider>

        <Form.List name="medicines" initialValue={[{ medicineId: "", dosage: "", duration: "", instructions: "" }]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, idx) => (
                <Row key={key} gutter={8} align="middle" style={{ marginBottom: 8 }}>
                  <Col>
                    <Form.Item
                      {...restField}
                      name={[name, "medicineId"]}
                      rules={[{ required: true, message: "Chọn thuốc!" }]}
                    >
                      <Select placeholder="Chọn thuốc" style={{ width: 180 }}>
                        {allMedicines.map((med) => (
                          <Option key={med._id} value={med._id}>
                            {med.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col flex={1}>
                    <Form.Item {...restField} name={[name, "dosage"]}>
                      <Input placeholder="Liều dùng" />
                    </Form.Item>
                  </Col>
                  <Col flex={1}>
                    <Form.Item {...restField} name={[name, "duration"]}>
                      <Input placeholder="Thời gian" />
                    </Form.Item>
                  </Col>
                  <Col flex={1}>
                    <Form.Item {...restField} name={[name, "instructions"]}>
                      <Input placeholder="Hướng dẫn" />
                    </Form.Item>
                  </Col>
                  <Col>
                    {idx > 0 && (
                      <Button
                        danger
                        type="primary"
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                      />
                    )}
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Thêm thuốc
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
            {loading ? "Đang tạo..." : "Tạo toa thuốc"}
          </Button>
          <Button onClick={() => navigate("/admin/prescriptions")}>Hủy</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PrescriptionCreate;
