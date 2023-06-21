import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, signIn, useSession } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]";
import { useEffect, useState } from "react";

export default function SignIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session, status } = useSession();
  const [isIframed, setIsIframed] = useState<Boolean>(false)
  const openPopup = (providerId: string) => {

    const url = `/auth/signin?provider=${providerId}`; // Replace with your desired URL
    const options = "width=500,height=500"; // Customize the window options as needed
    const popup = window.open(url, "_blank", options);

    // Close the popup and remove the event listener when the window is closed
  };
  useEffect(() => {
    if (!(window===window.parent)) {
      setIsIframed(true)
    }
  }, [])

  if (status === "authenticated") {
    window.location.href = "/"
    return null

  } else if (isIframed && status === "unauthenticated") {
    return (
      <>
        {Object.values(providers).map((provider) => (
          <div className="flex justify-center items-center h-screen" key={provider.name}>
            <button
              className="bg-blue-500 align-middle hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => openPopup(provider.id)}
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </>
    )
  } else if (status === "unauthenticated") {
    return (<>
    {Object.values(providers).map((provider) => (
      <div className="flex justify-center items-center h-screen" key={provider.name}>
        <button
          className="bg-blue-500 align-middle hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => signIn(provider.id)}
        >
          Sign in with {provider.name}
        </button>
      </div>
    ))}
  </>)
  }

}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  
  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();
  
  return {
    props: { providers: providers ?? [] },
  }
}