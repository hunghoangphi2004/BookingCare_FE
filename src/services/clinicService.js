import { get } from "../utils/request"; // dùng hàm get đã có token


export const getAllClinic = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  console.log(query)
  const url = query ? `/clinics/get-all?query=${query}` : `/clinics/get-all`
  const result = await get(url);
  return result;
}