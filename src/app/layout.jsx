import { Montserrat } from "next/font/google";
import "./globals.css";
import RecoilRootWrapper from "@/components/RecoilRootWrapper";
import Script from "next/script";

const montserrat = Montserrat({ subsets: ["latin"] });
export const metadata = {
  title: "Natano Diary",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <Script
        type="text/javascript"
        src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
        defer
      />
      <body className={montserrat.className}>
        <RecoilRootWrapper>{children}</RecoilRootWrapper>
      </body>
    </html>
  );
}
