/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import login from "@/assets/imgs/login.jpeg"
import { type DefaultValues, type FieldValues, type Path, type SubmitHandler, useForm } from "react-hook-form"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { Input } from "@/components/ui/input"

import type { ZodType } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { FIELD_NAMES, FIELD_TYPES } from "@/constant/constant"
import { toast } from "sonner"
import { authApi } from "@/lib/api"
import { useAuthStore } from "@/store/auth-store"
import { useState } from "react"
import { GitBranchIcon } from "lucide-react"

interface Props<T extends FieldValues> {
    type: "SIGN_IN" | "SIGN_UP"
    schema: ZodType<T, any, any>
    defaultValues: DefaultValues<T>
}

function AuthForm<T extends FieldValues>({ type, schema, defaultValues }: Props<T>) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>,
    })

    const { setAuth } = useAuthStore()

    const handelSubmit: SubmitHandler<T> = async (data) => {
        setIsLoading(true)

        try {
            if (type === "SIGN_IN") {
                const response = await authApi.login({
                    email: data.email,
                    password: data.password,
                })

                if (response.data.is_success) {
                    toast.success("Login successful! Welcome back.", {
                        description: "You will be redirected to your dashboard.",
                    })
                    setAuth(response.data.access_token, response.data.user)
                    router.push("/home")
                } else {
                    const errorMessage = "Login failed. Please check your credentials."
                    toast.error("Login Failed", {
                        description: errorMessage,
                    })
                }
            }

            if (type === "SIGN_UP") {
                const response = await authApi.register({
                    username: data.username,
                    email: data.email,
                    password: data.password,
                })

                if (response.data.is_success) {
                    toast.success("Registration successful!", {
                        description: "Please check your email to verify your account.",
                    })
                    router.push("/login")
                } else {
                    const errorMessage = "Registration failed. Please try again."
                    toast.error("Registration Failed", {
                        description: errorMessage,
                    })
                }
            }
        } catch (error: any) {
            console.error("Authentication failed:", error)

            let errorMessage = "Something went wrong. Please try again."
            let errorTitle = type === "SIGN_IN" ? "Login Failed" : "Registration Failed"

            if (error.response) {
                const status = error.response.status
                const serverMessage = error.response.data?.message

                switch (status) {
                    case 400:
                        errorMessage = serverMessage || "Invalid request. Please check your input."
                        break
                    case 401:
                        errorMessage = "Invalid credentials. Please check your email and password."
                        break
                    case 403:
                        errorMessage = "Access denied. Your account may be suspended."
                        break
                    case 409:
                        errorMessage = "An account with this email already exists."
                        break
                    case 422:
                        errorMessage = serverMessage || "Please check your input and try again."
                        break
                    case 429:
                        errorMessage = "Too many attempts. Please wait a moment before trying again."
                        break
                    case 500:
                        errorMessage = "Server error. Please try again later."
                        break
                    default:
                        errorMessage = serverMessage || `Server error (${status}). Please try again.`
                }
            } else if (error.request) {
                errorMessage = "Network error. Please check your internet connection and try again."
                errorTitle = "Connection Failed"
            } else if (error.code === "ECONNABORTED") {
                errorMessage = "Request timed out. Please try again."
                errorTitle = "Request Timeout"
            }

            toast.error(errorTitle, {
                description: errorMessage,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6")}>
            <Card className="overflow-hidden p-0">
                <CardContent className={`${type === "SIGN_IN" && "grid p-0 md:grid-cols-2"}`}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handelSubmit)} className="p-6 md:p-8">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    {type === "SIGN_IN" ? (
                                        <h1 className="text-2xl font-bold">Welcome back</h1>
                                    ) : (
                                        <h1 className="text-2xl font-bold">Welcome new User</h1>
                                    )}
                                    <p className="text-muted-foreground text-balance">
                                        {type === "SIGN_IN" ? "Login to your  account" : "Signup to your account"}
                                    </p>
                                </div>

                                {Object.keys(defaultValues).map((fields) => (
                                    <div className="grid gap-3" key={fields}>
                                        <FormField
                                            control={form.control}
                                            name={fields as Path<T>}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]}
                                                            disabled={isLoading}
                                                            {...field}
                                                        />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                ))}

                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            {type === "SIGN_IN" ? "Signing in..." : "Creating account..."}
                                        </>
                                    ) : type === "SIGN_IN" ? (
                                        "Login"
                                    ) : (
                                        "Sign up"
                                    )}
                                </Button>
                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    <span className="bg-card text-muted-foreground relative z-10 px-2">Or continue with</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button variant="outline" type="button" className="w-full bg-transparent">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <path
                                                d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        <span className="sr-only">Apple</span>
                                    </Button>
                                    <Button variant="outline" type="button" className="w-full bg-transparent">
                                        <GitBranchIcon />
                                        <span className="sr-only">Apple</span>
                                    </Button>

                                </div>
                                <div className="text-center text-sm">
                                    {type === "SIGN_IN" ? "Don't have an account ? " : "Alreadt have an account? "}
                                    <Link href={type === "SIGN_IN" ? "/signup" : "/login"} className="underline underline-offset-4">
                                        {" "}
                                        {type === "SIGN_IN" ? "Sign Up" : "Login"}
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                    {!!(type === "SIGN_IN") && (
                        <div className="bg-muted relative hidden md:block">
                            <Image
                                src={login || "/placeholder.svg"}
                                alt="Image"
                                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.9] dark:grayscale"
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    )
}

export default AuthForm
