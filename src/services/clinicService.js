import { get, postForm, patchForm,putForm, deleteData, getInclude } from "../utils/request"; 


export const getAllClinic = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `/admin/clinics/get-all${query ? `?${query}` : ''}`;
  const result = await getInclude(url);
  return result;
};

export const createClinic = async (data) => {
  return await postForm("/admin/clinics/create", data);
};

export const getClinicById = async (id) => {
  return await getInclude(`/admin/clinics/get-clinic-by-id/${id}`);
};

export const updateClinic = async (id, data) => {
  return await patchForm(`/admin/clinics/edit/${id}`, data);
}

export const deleteClinic = async (id) => {
  return await deleteData(`/admin/clinics/delete/${id}`);
};