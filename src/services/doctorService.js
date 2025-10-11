import { get,post,postForm } from "../utils/request"; // dùng hàm get đã có token

export const getDoctorById = async (id) => {
  return await get(`/doctors/getDoctorById/${id}`);
};

export const getAllDoctor = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/doctors/get-all?query=${query}` : `/doctors/get-all`
  const result = await get(url);
  return result;
}

export const createDoctor = async (data) => {
  return await postForm("/doctors/create", data);
};