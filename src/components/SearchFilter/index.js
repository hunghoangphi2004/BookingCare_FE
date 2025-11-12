import { useState } from 'react';

function SearchFilter({ filters: initialFilters, onSearch }) {
    const [filters, setFilters] = useState(initialFilters);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(filters);
    };

    const handleReset = () => {
        const resetFilters = {
            specializationId: '',
            clinicId: '',
            keyword: ''
        };
        setFilters(resetFilters);
        onSearch(resetFilters);
    };

    return (
        <section className="py-4 bg-light border-bottom">
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-5">
                            <div className="input-group">
                                <span className="input-group-text bg-white">
                                    <i className="fas fa-search text-muted"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tìm kiếm bác sĩ theo tên, chuyên khoa..."
                                    value={filters.keyword}
                                    onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={filters.specializationId}
                                onChange={(e) => setFilters({ ...filters, specializationId: e.target.value })}
                            >
                                <option value="">Tất cả chuyên khoa</option>
                                <option value="1">Nội khoa</option>
                                <option value="2">Nhi khoa</option>
                                <option value="3">Sản phụ khoa</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <select
                                className="form-select"
                                value={filters.clinicId}
                                onChange={(e) => setFilters({ ...filters, clinicId: e.target.value })}
                            >
                                <option value="">Tất cả phòng khám</option>
                                <option value="1">Phòng khám A</option>
                                <option value="2">Phòng khám B</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-primary flex-grow-1">
                                    <i className="fas fa-search me-1"></i>Tìm
                                </button>
                                <button type="button" className="btn btn-outline-secondary" onClick={handleReset}>
                                    <i className="fas fa-redo"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default SearchFilter;