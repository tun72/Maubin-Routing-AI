import { getSession } from "next-auth/react";

export async function getClientToken(): Promise<string | null> {
  try {
    const session = await getSession();
    return (session as any)?.accessToken || null;
  } catch (error) {
    console.error("Error getting client token:", error);
    return null;
  }
}
