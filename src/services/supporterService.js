import { deleteData, get,getInclude,patchForm,post,postForm, putForm } from "../utils/request"; // dùng hàm get đã có token

export const getSupporterById = async (id) => {
  return await getInclude(`/admin/supporters/get-supporter-by-id/${id}`);
};

export const getAllSupporter = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `/admin/supporters/get-all${query ? `?${query}` : ''}`;
  const result = await getInclude(url);
  return result;
}

export const createSupporter = async (data) => {
  return await postForm("/admin/supporters/create", data);
};

export const updateSupporter = async (id, data) => {
  return await patchForm(`/admin/supporters/edit/${id}`, data);
}

export const deleteSupporter = async (id) => {
  return await deleteData(`/admin/supporters/delete/${id}`);
};