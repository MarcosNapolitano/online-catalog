import "./admin.css";
import { Poppins } from 'next/font/google'
import { redirect, RedirectType } from "next/navigation";
import { getSession } from "@/app/_services/auth";
import { cookies } from "next/headers";

const poppins = Poppins({
  weight: ["400", "800"],
  subsets: ['latin'],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  if (process.env.NODE_ENV === "production") {
    if (!getSession()) redirect('/login', RedirectType.replace);
  }

  const user = await cookies().then((cookie) => {
    const userName = cookie.get('userName')?.value
    return userName ? ''.concat(userName[0].toUpperCase(), userName?.slice(1)) : ''
  });

  return (
    <html lang="es" className={poppins.className}>
      <body>
        <div className="admin-panel panel-back">
          <div className="panel-header">
            <h1>Admin Panel</h1>
            <p>Hoy es {new Date(Date.now()).toLocaleDateString('es-ES', {
              weekday: "long", year: "numeric", month: "long",
              day: "numeric", hour: '2-digit', minute: '2-digit'
            })}
            </p>
          </div>
          <h2 className="separator">Wellcome <span className="pageLink-active">{user}</span></h2>
          {children}
        </div>
      </body>
    </html>
  );
}
