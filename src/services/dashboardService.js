import { getInclude } from "../utils/request";

export const getStatistic = async (params = {}) => {
  const url = `/admin/dashboard/`;
  const result = await getInclude(url);
  return result;
}