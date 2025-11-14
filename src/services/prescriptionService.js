import { post, patch, deleteData, getInclude } from "../utils/request";


export const getAllPrescription = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `/admin/prescriptions/get-all${query ? `?${query}` : ''}`;
  const result = await getInclude(url);
  return result;
}

export const getAllPrescriptionByDoctor = async () => {
  const url = `/admin/prescriptions/my-prescriptions`;
  const result = await getInclude(url);
  return result;
}

export const createPrescription = async (data) => {
  return await post("/admin/prescriptions/create", data);
};

export const getPrescriptionById = async (id) => {
  return await getInclude(`/admin/prescriptions/get-prescription-by-id/${id}`);
};

export const updatePrescription = async (id, data) => {
  return await patch(`/admin/prescriptions/edit/${id}`, data);
}

export const deletePrescription = async (id) => {
  return await deleteData(`/admin/prescriptions/delete/${id}`);
};

export const sendPrescriptionPDF = async (id, data) => {
  console.log("gửi")
  return await post(`/admin/prescriptions/send-pdf/${id}`, data)
}