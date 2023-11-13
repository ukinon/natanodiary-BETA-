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
            className=" font-bold"
            key={provider.id}
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            {" "}
            Sign In with {provider.name}{" "}
          </button>
        );
      })}
    </>
  );
}
