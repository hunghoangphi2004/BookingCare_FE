import { post,getInclude,get,put,patch } from "../utils/request";


export const getAllFamily = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `/admin/families/get-all${query ? `?${query}` : ''}`;
  const result = await getInclude(url);
  return result;
}

export const createFamily = async (payload) => {
  try {
    return await post("/family/create", payload);
  } catch (error) {
    console.error("Create family error:", error);
    throw error;
  }
};


export const getFamily = async () => {
  try {
    return await getInclude("/families/get-family");
  } catch (error) {
    console.error("Get family error:", error);
    throw error;
  }
};

export const getFamilyById = async (id) => {
  return await getInclude(`/admin/families/get-family-by-id/${id}`);
};

export const getAllFamilyRequests = async (filters = {}, page = 1, limit = 10) => {
  try {
    const queryParams = new URLSearchParams({
      page,
      limit,  
      ...(filters.status && { status: filters.status }),
      ...(filters.keyword && { keyword: filters.keyword }),
      ...(filters.fromDate && { fromDate: filters.fromDate }),
      ...(filters.toDate && { toDate: filters.toDate }),
    });

    const result = await getInclude(`/admin/doctors/get-all-family-requests?${queryParams}`);
    console.log(result)
    return result;
  } catch (error) {
    console.error("Error fetching family requests:", error);
    throw error;
  }
};

export const updateFamily = async (payload) => {
  try {
    return await patch("/families/edit", payload);
  } catch (error) {
    console.error("Update family error:", error);
    throw error;
  }
};

export const getAllFamilyDoctors = async (filters = {}, page = 1, limit = 9) => {
    try {
        const queryParams = new URLSearchParams({
            page,
            limit,
            ...(filters.specializationId && { specializationId: filters.specializationId }),
            ...(filters.clinicId && { clinicId: filters.clinicId }),
            ...(filters.keyword && { keyword: filters.keyword })
        });

        const result = await get(`/home/get-all-family-doctor?${queryParams}`);
        return result;
    } catch (error) {
        console.error('Error fetching family doctors:', error);
        throw error;
    }
};

export const requestFamilyDoctor = async (payload) => {
    try {
        const result = await post("/families/request", payload);
        return result;
    } catch (error) {
        console.error('Error requesting family doctor:', error);
        throw error;
    }
};

export const getDoctorBySlug = async (slug) => {
    try {
        const result = await get(`/doctors/${slug}`);
        return result;
    } catch (error) {
        console.error('Error fetching doctor detail:', error);
        throw error;
    }
};

// Duyệt yêu cầu
export const approveFamilyDoctor = async (familyId) => {
  try {
    const result = await patch(`/admin/doctors/approve-family-doctor/${familyId}`);
    return result;
  } catch (error) {
    console.error("Error approving family doctor:", error);
    throw error;
  }
};

// Từ chối yêu cầu
export const rejectFamilyDoctor = async (familyId, reason = "") => {
  try {
    const result = await put(`/doctors/reject-family-doctor/${familyId}`, { reason });
    return result;
  } catch (error) {
    console.error("Error rejecting family doctor:", error);
    throw error;
  }
};

// Huỷ yêu cầu
export const cancelFamilyDoctor = async (familyId) => {
  try {
    const result = await put(`/doctors/cancel-family-doctor/${familyId}`);
    return result;
  } catch (error) {
    console.error("Error cancelling family doctor:", error);
    throw error;
  }
};