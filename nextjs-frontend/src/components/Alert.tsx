"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface AlertProps {
    title: string
    content: string
    text: string
    handler: () => Promise<null>
    disabled?: boolean
}

export function Alert({ title, content, text, handler, disabled = false }: AlertProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button
                    className={`w-full text-left px-2 py-1.5 text-sm rounded-sm ${disabled ? "text-muted-foreground cursor-not-allowed" : "hover:bg-accent"
                        }`}
                    disabled={disabled}
                >
                    {text}
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{content}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={disabled}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handler} disabled={disabled}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
