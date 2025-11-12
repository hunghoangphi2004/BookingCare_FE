import { get, post,patch,deleteData, getInclude } from "../utils/request"; 


export const getAllMedicine = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `/admin/medicines/get-all${query ? `?${query}` : ''}`;
  const result = await getInclude(url);
  return result;
}

export const createMedicine = async (data) => {
  return await post("/admin/medicines/create", data);
};

export const getMedicineById = async (id) => {
  return await getInclude(`/admin/medicines/get-medicine-by-id/${id}`);
};

export const updateMedicine = async (id, data) => {
  return await patch(`/admin/medicines/edit/${id}`, data);
}

export const deleteMedicine = async (id) => {
  return await deleteData(`/admin/medicines/delete/${id}`);
};