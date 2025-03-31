import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthContextProvider from "./context/authContext";
import CoordinateContextProvider from "./context/coordinateContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "India Water Resource | Dashboard",
  description: "A platform for real-time monitoring and analysis of water quality in user-defined water bodies.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel='icon' href='/frontend/app/assets/images/favicon-32x32.png'></link>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthContextProvider>
          <CoordinateContextProvider>
            {children}
          </CoordinateContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
