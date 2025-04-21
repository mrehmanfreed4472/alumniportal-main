'use client';

import { metadata } from './metadata';
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ReduxProvider from '@/redux/ReduxProvider'; // Your custom wrapper

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} mb-20`}>
        <ReduxProvider>
          <Toaster />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
