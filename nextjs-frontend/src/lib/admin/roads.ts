import { api } from "../api";

export const getRoads = async () => {
  try {
    const result = await api.get("/admin/roads");
    if (result.status !== 200) {
      throw new Error("Roads not found");
    }
    return { roads: result.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const postRoads = async (params: Roads) => {
  try {
    const result = await api.post("/admin/roads", params);

    console.log(result);

    if (result.status !== 200) {
      throw new Error("Roads not found");
    }
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Route creation error" };
  }
};
