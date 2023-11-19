"use client";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { auth } from "../../../firebase";
import { useRecoilState } from "recoil";
import { redirect } from "next/navigation";
export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
  redirect("/");
};
export default function SignInButton() {
  return (
    <>
      <button
        className=" font-bold flex flex-row gap-2 items-center p-2"
        onClick={signInWithGoogle}
      >
        <img
          src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
          alt=""
        />
      </button>
    </>
  );
}
