import {get} from "../utils/request";
export const getAllClinic = async () => {   
    const result = await get("/home/get-all-clinic");
    return result;
}

export const getAllSpecialization = async () => {   
    const result = await get("/home/get-all-specialization");
    return result;
}


export const getAllDoctor = async () => {   
    const result = await get("/home/get-all-doctor");
    return result;
}

export const getDoctorBySlug = async (slug) => {   
    const result = await get(`/home/get-doctor-by-slug/${slug}`);

    return result;
}


// export const sendRegisterOTP = async (payload) => {
//     const result = await post("/auth/send-register-otp", payload);
//     return result;
// }

// export const register = async (payload) => {
//     const result = await post("/auth/register", payload);
//     return result;
// }