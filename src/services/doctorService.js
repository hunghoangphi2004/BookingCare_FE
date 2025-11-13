import { deleteData, get,getInclude,post,postForm, patchForm } from "../utils/request"; // dùng hàm get đã có token

export const getDoctorById = async (id) => {
  return await get(`/home/get-doctor-by-id/${id}`);
};

export const getAllDoctor = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `/admin/doctors/get-all${query ? `?${query}` : ''}`;
  const result = await getInclude(url);
  return result;
}

export const createDoctor = async (data) => {
  return await postForm("/admin/doctors/create", data);
};

export const updateDoctor = async (id, data) => {
  return await patchForm(`/admin/doctors/edit/${id}`, data);
}

export const deleteDoctor = async (id) => {
  return await deleteData(`/admin/doctors/delete/${id}`);
};