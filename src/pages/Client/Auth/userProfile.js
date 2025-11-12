import React, { useEffect, useState } from "react";
import { getProfile } from "../../../services/authService";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        if (data) {
          setProfile(data);
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };
    loadProfile();
  }, [navigate]);

  console.log(profile)


  if (!profile) return <div className="text-center mt-5">Đang tải...</div>;

  if (profile.role !== "patient") {
    return (
      <div className="text-center mt-5 text-danger">
        <h5>Tài khoản của bạn không phải tài khoản bệnh nhân</h5>
      </div>
    );
  }

  const p = profile.patient;

  if (!p)
    return (
      <div className="text-center mt-5 text-warning">
        Hồ sơ bệnh nhân chưa được cập nhật.
      </div>
    );

  return (
    <div className="container mt-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Hồ sơ cá nhân</h4>
        </div>
        <div className="card-body">
          <h5>
            {p.lastName} {p.firstName}
          </h5>
          <p><strong>Mã BN:</strong> {p.patientId}</p>
          <p><strong>Ngày sinh:</strong> {new Date(p.dateOfBirth).toLocaleDateString()}</p>
          <p><strong>Giới tính:</strong> {p.gender === "male" ? "Nam" : "Nữ"}</p>
          <p><strong>Số điện thoại:</strong> {p.phoneNumber}</p>
          <p><strong>Địa chỉ:</strong> {p.address}</p>

          <hr />
          <h6>Liên hệ khẩn cấp</h6>
          <p><strong>Tên:</strong> {p.emergencyContact?.name}</p>
          <p><strong>Quan hệ:</strong> {p.emergencyContact?.relationship}</p>
          <p><strong>SĐT:</strong> {p.emergencyContact?.phone}</p>

          <div className="text-center mt-4">
            <button
              className="btn btn-outline-primary px-4"
              onClick={() => navigate("/family-profile")}
            >
              Quản lý hồ sơ gia đình →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
