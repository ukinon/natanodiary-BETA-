import { Montserrat } from "next/font/google";
import "./globals.css";
import SessionProvider from "../components/SessionProvider";
import { getServerSession } from "next-auth";
import RecoilRootWrapper from "@/components/RecoilRootWrapper";

const montserrat = Montserrat({ subsets: ["latin"] });
export const metadata = {
  title: "Natano Diary",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <SessionProvider session={session}>
          <RecoilRootWrapper>{children}</RecoilRootWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
