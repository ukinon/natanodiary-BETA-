"use client";

import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SignInButton() {
  const [providers, setProviders] = useState({});

  useEffect(() => {
    const fetchProvider = async () => {
      const prov = await getProviders();
      setProviders(prov);
    };
    fetchProvider();
  }, []);

  return (
    <>
      {Object.values(providers).map((provider) => {
        return (
          <button
            className=" font-bold flex flex-row gap-2 items-center p-2"
            key={provider.id}
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            <img
              src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
              alt=""
            />
            <h1 className="hidden xl:inline">Sign In with {provider.name}</h1>
          </button>
        );
      })}
    </>
  );
}
