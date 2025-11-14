import { postForm, patchForm, deleteData, getInclude } from "../utils/request"; // dùng hàm get đã có token


export const getAllSpec = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `/admin/specializations/get-all${query ? `?${query}` : ''}`;
  const result = await getInclude(url);
  return result;
}

export const createSpecialization = async (data) => {
  return await postForm("/admin/specializations/create", data);
};

export const getSpecializationById = async (id) => {
  return await getInclude(`/admin/specializations/get-specialization-by-id/${id}`);
};

export const updateSpecialization = async (id, data) => {
  return await patchForm(`/admin/specializations/edit/${id}`, data);
}

export const deleteSpecialization = async (id) => {
  return await deleteData(`/admin/specializations/delete/${id}`);
};