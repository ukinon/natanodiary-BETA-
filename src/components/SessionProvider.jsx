"use client";

import { refetchState } from "@/atom/refetchAtom";
import { SessionProvider } from "next-auth/react";
import { useRecoilState } from "recoil";

export default function AuthContext({ sesion, children }) {
  const [refetch, setRefetch] = useRecoilState(refetchState);
  return (
    <SessionProvider refetchInterval={refetch} session={sesion}>
      {children}
    </SessionProvider>
  );
}
