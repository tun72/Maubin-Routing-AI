import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";

import { NextIntlClientProvider } from "next-intl";
import React, { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <NextIntlClientProvider>
                <Toaster />
                {children}
            </NextIntlClientProvider>

        </ThemeProvider>
    );
}

export default Layout;