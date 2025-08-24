import { formatData } from "@/util/locationFormat";
import { api } from "../api";

export const getLocations = async () => {
  try {
    const result = await api.get("/locations");
    if (result.status !== 200) {
      throw new Error("Roads not found");
    }
    return { locations: result.data };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Sign In error" };
  }
};

export const postRoutes = async (params: Routes) => {
  try {
    const result = await api.post("/routes", params);
    console.log(result);

    if (result.status !== 200) {
      throw new Error("Error in routes post");
    }
    return { success: true, result: result.data };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Route creation error" };
  }
};

export const getHistory = async (historyId: string) => {
  try {
    const result = await api.get(`/history/${historyId}`);

    console.log(result);

    if (result.status !== 200) {
      throw new Error("Error in history");
    }
    return { success: true, result: result.data };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Get History Error" };
  }
};

export const getHistories = async () => {
  try {
    const result = await api.get(`/histories`);
    if (result.status !== 200) {
      throw new Error("Error in history");
    }

    const histories = result.data.histories.map((history: Place) =>
      formatData(history)
    );
    console.log(histories);

    return { success: true, result: histories };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Get History Error" };
  }
};
