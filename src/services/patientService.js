import { get } from "../utils/request"; // dùng hàm get đã có token

export const getPatientById = async (id) => {
  return await get(`/patient/getPatientById/${id}`);
};