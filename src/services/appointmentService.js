import {get,getInclude,patch,post} from "../utils/request";
export const getAllAppointments = async () => {   
    const result = await getInclude("/admin/appointments/get-all");
    return result;
}

export const changeStatusAppointment = async (id, status) => {   
    console.log(id,status)
    const result = await patch(`/admin/appointments/change-status/${id}/${status}`);
    return result;
}

export const getMyAppointmentsByDoctor = async (params = {}) => {
  const url = `/admin/schedules/my-appointments`;
  const result = await getInclude(url);
  return result;
};