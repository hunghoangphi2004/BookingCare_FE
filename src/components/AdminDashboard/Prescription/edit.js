import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getPrescriptionById, updatePrescription } from "../../../services/prescriptionService";
import { getAllMedicine } from "../../../services/medicineService";
import { Form, Input, Button, Select, Alert, Divider, Typography, Row, Col } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

const PrescriptionEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [form] = Form.useForm();
  const [allMedicines, setAllMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [presRes, medRes] = await Promise.all([
          getPrescriptionById(id),
          getAllMedicine({ limit: 0 }),
        ]);

        if (presRes.success && presRes.data) {
          const data = presRes.data;
          form.setFieldsValue({
            diagnosis: data.diagnosis || "",
            notes: data.notes || "",
            status: data.status || "draft",
            medicines: data.medicines.map(m => ({
              medicineId: m.medicineId?._id || "",
              dosage: m.dosage || "",
              duration: m.duration || "",
              instructions: m.instructions || "",
            })),
          });
        }

        if (medRes.success) setAllMedicines(medRes.data);
      } catch (err) {
        console.error(err);
        setAlert({ type: "error", message: "Lỗi khi tải dữ liệu!" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Nếu có alert từ trang trước (nếu muốn), hiện 1 lần
    if (location.state?.alert) {
      setAlert(location.state.alert);
      window.history.replaceState({}, document.title);
      setTimeout(() => setAlert({ type: "", message: "" }), 4000);
    }
  }, [id, form, location.state]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await updatePrescription(id, values);
      if (res.success) {
        navigate("/admin/prescriptions", {
          state: { alert: { type: "success", message: "Cập nhật toa thuốc thành công!" } },
        });
      } else {
        setAlert({ type: "error", message: res.message || "Không thể cập nhật toa thuốc!" });
        setTimeout(() => setAlert({ type: "", message: "" }), 4000);
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", message: "Có lỗi xảy ra khi cập nhật!" });
      setTimeout(() => setAlert({ type: "", message: "" }), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 800 }}>
      <Title level={3}>Cập nhật toa thuốc</Title>

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

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Trạng thái" name="status">
          <Select>
            <Option value="draft">Draft</Option>
            <Option value="final">Final</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Chẩn đoán"
          name="diagnosis"
          rules={[{ required: true, message: "Vui lòng nhập chẩn đoán!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Ghi chú" name="notes">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Divider>Thuốc</Divider>

        <Form.List
          name="medicines"
          initialValue={[{ medicineId: "", dosage: "", duration: "", instructions: "" }]}
        >
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
            {loading ? "Đang cập nhật..." : "Cập nhật toa thuốc"}
          </Button>
          <Button onClick={() => navigate("/admin/prescriptions")}>Hủy</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PrescriptionEdit;
