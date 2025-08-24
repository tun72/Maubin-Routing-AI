import { api } from "../api";

export const getLocations = async () => {
  try {
    const result = await api.get("admin/locations");
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
    // const session = await auth();
    // console.log(session?.user);

    const result = await api.post("/admin/locations", params);

    if (result.status !== 201) {
      throw new Error("Error in locations");
    }
    return { success: true, result: result.data };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Route creation error" };
  }
};

export const deleteLocations = async (id: string) => {
  try {
    // const session = await auth();
    // console.log(session?.user);

    const result = await api.delete(`/admin/locations/${id}`);

    if (result.status !== 200) {
      throw new Error("Locations not found");
    }
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Route creation error" };
  }
};

export const updateLocations = async (params: Locations) => {
  try {
    // const session = await auth();
    // console.log(session?.user);
    const result = await api.put(`/admin/locations/${params.id}`, params);

    if (result.status !== 200) {
      throw new Error("Locations not found");
    }
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Route creation error" };
  }
};
