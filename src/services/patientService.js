import { deleteData, get,getInclude,patchForm,post,postForm, putForm } from "../utils/request"; // dùng hàm get đã có token

export const getPatientById = async (id) => {
  return await getInclude(`/admin/patients/get-patient-by-id/${id}`);
};

export const getAllPatient = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
   const url = `/admin/patients/get-all${query ? `?${query}` : ''}`;
  const result = await getInclude(url);
  return result;
}

export const createPatient = async (data) => {
  return await postForm("/admin/patients/create", data);
};

export const updatePatient = async (id, data) => {
  return await patchForm(`/admin/patients/edit/${id}`, data);
}

export const deletePatient= async (id) => {
  return await deleteData(`/admin/patients/delete/${id}`);
};