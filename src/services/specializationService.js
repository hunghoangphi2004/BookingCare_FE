import { get } from "../utils/request"; // dùng hàm get đã có token


export const getAllSpec = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/specializations/get-all?query=${query}` : `/specializations/get-all`
  const result = await get(url);
  return result;
}