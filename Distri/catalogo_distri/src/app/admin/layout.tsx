import "./admin.css";
import { Poppins } from 'next/font/google'
import { redirect, RedirectType } from "next/navigation";
import { getSession } from "../_data/auth";

const poppins = Poppins({ 
    weight: ["400", "800"],
    subsets: ['latin'], 
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  if (!getSession()) redirect('/login', RedirectType.replace);
  return (
    <html lang="es" className={poppins.className}>
      <body>
        {children}
      </body>
    </html>
  );
}
