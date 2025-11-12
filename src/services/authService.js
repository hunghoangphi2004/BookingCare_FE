import { post,get, getWithTokenUser, getInclude  } from "../utils/request";

export const loginAdmin = async (payload) => {
  try {
    return await post("/admin/auth/login", payload);
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const login = async (payload) => {
  try {
    return await post("/auth/login", payload);
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logoutAdmin = async (payload) => {
  try {
    return await get("/admin/auth/logout");
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

export const getProfile = async () => {
  try {
    const result = await getInclude("/auth/profile");
    return result;
  } catch (error) {
    console.error("Get profile error:", error);
    throw error;
  }
};

export const getProfileAdmin= async () => {
  try {
    const result = await getInclude("/admin/auth/get-profile");
    return result;
  } catch (error) {
    console.error("Get profile error:", error);
    throw error;
  }
};