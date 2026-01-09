import "./admin.css";
import { Poppins } from 'next/font/google'
import { redirect, RedirectType } from "next/navigation";
import { getSession } from "@/app/_services/auth";

const poppins = Poppins({
  weight: ["400", "800"],
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  if (process.env.NODE_ENV === "production") {
    if (!getSession()) redirect('/login', RedirectType.replace);
  }

  return (
    <html lang="es" className={poppins.className}>
      <body>
        {children}
      </body>
    </html>
  );
}
