import { api } from "../api";

export const getLocations = async () => {
  try {
    const result = await api.get("admin/locations");

    console.log(result);

    if (result.status !== 200) {
      throw new Error("Roads not found");
    }
    return { locations: result.data };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Sign In error" };
  }
};

export const postLocations = async (params: Locations) => {
  try {
    console.log("hit");
    // const session = await auth();
    // console.log(session?.user);

    const result = await api.post("/admin/locations", params);

    if (result.status !== 200) {
      throw new Error("Roads not found");
    }
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Route creation error" };
  }
};
