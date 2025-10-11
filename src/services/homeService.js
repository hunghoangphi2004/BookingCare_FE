import {get} from "../utils/request";
export const getHomePage = async () => {   
    const result = await get("/");
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