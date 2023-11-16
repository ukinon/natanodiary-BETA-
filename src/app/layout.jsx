import { Montserrat } from "next/font/google";
import "./globals.css";
import RecoilRootWrapper from "@/components/RecoilRootWrapper";

const montserrat = Montserrat({ subsets: ["latin"] });
export const metadata = {
  title: "Natano Diary",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <RecoilRootWrapper>{children}</RecoilRootWrapper>
      </body>
    </html>
  );
}
