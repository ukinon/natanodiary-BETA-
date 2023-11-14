import { Montserrat } from "next/font/google";
import "./globals.css";
import RecoilRootWrapper from "@/components/RecoilRootWrapper";
import { getServerSession } from "next-auth";
import AuthContext from "../components/SessionProvider";

const montserrat = Montserrat({ subsets: ["latin"] });
export const metadata = {
  title: "Natano Diary",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <RecoilRootWrapper>
          <AuthContext session={session}> {children} </AuthContext>
        </RecoilRootWrapper>
      </body>
    </html>
  );
}
