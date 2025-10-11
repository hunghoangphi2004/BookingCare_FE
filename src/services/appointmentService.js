import {get,post} from "../utils/request";
export const getAllAppointments = async () => {   
    const result = await get("/appointment/get-all");
    return result;
}

export const changeStatusAppointment = async (id, status) => {   
    const result = await post(`/appointment/change-status/${id}/${status}`);
    return result;
}