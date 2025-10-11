import { post } from "../utils/request";

export const createSchedule = async (payload) => {
  try {
    return await post("/schedule/create-schedule", payload);
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};