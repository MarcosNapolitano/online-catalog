import "./admin.css";
import { Poppins } from 'next/font/google'

const poppins = Poppins({ 
    weight: ["400", "800"],
    subsets: ['latin'], 
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={poppins.className}>
      <body>
        {children}
      </body>
    </html>
  );
}
