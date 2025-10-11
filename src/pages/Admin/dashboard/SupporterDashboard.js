// pages/Admin/dashboard/SupporterDashboard.jsx
function SupporterDashboard() {
  return (
    <div className="container-fluid">
      <h2 className="mb-4">Tổng quan Supporter</h2>
      <p>Đây là dashboard dành cho supporter.</p>

      {/* Thẻ thống kê */}
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Tickets mở</h5>
              <p className="card-text display-6">12</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">Tickets đang xử lý</h5>
              <p className="card-text display-6">5</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-info">
            <div className="card-body">
              <h5 className="card-title">Khách hàng mới</h5>
              <p className="card-text display-6">23</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupporterDashboard;