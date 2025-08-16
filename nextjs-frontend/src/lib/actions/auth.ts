"use server";
import axios from "axios";

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">
) => {
  const { email, password } = params;

  console.log("hit");

  try {
    const response = await axios.post("http://127.0.0.1:4000/login", {
      email,
      password,
    });

    if (response.status !== 200) {
      throw new Error("Something went wrong");
    }

    // if(response.isSuccess !== true) {
    //    throw new Error(response.msg);
    // }
    // const result = await signIn("credentials", {
    //   email,
    //   password,
    //   redirect: false,
    // });

    // if (result?.error) {
    //   return { success: false, error: result.error };
    // }
    console.log("Login Success");

    return { success: true };
  } catch (error) {
    console.log(error, "sign up error");
    return { success: false, error: "Sign In error" };
  }
};

export const signUpWithCredentials = async (params: AuthCredentials) => {
  const { email, password, username } = params;

  try {
    console.log(email, password, username);

    const response = await axios.post("http://127.0.0.1:4000/register", {
      email,
      password,
      username,
    });

    if (response.status !== 201) {
      throw new Error("Something went wrong");
    }
    // console.log(response);

    // const result = await signIn("credentials", {
    //   email,
    //   password,
    //   redirect: false,
    // });

    // if (result?.error) {
    //   return { success: false, error: result.error };
    // }
    return { success: true };
  } catch (error) {
    console.log(error, "sign up error");
    return { success: false, error: "Sign In error" };
  }
};
