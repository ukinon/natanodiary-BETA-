"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../firebase";
import { useRecoilState } from "recoil";

export default function SignInButton() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

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
        <h1 className="hidden xl:inline">Sign In with Google</h1>
      </button>
    </>
  );
}
