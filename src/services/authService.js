import { post,get  } from "../utils/request";

export const login = async (payload) => {
  try {
    return await post("/auth/login", payload);
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const sendRegisterOTP = async (payload) => {
  try {
    return await post("/auth/send-register-otp", payload);
  } catch (error) {
    console.error("Send OTP error:", error);
    throw error;
  }
};

export const register = async (payload) => {
  try {
    return await post("/auth/register", payload);
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

export const getAllUser = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/auth/get-all-users?${query}` : `/auth/get-all-users`;
  const result = await get(url);
  return result;
}