import { api } from "../api";

export const postRoutes = async (params: Routes) => {
  try {
    const result = await api.post("/routes", params);

    if (result.status !== 200) {
      throw new Error("Error in routes post");
    }
    return { success: true, result: result.data };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Route creation error" };
  }
};
