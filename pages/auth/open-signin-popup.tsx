import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, signIn, useSession } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]";
import { useEffect, useState } from "react";

export default function SignIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session, status } = useSession();
  const [isIframed, setIsIframed] = useState<Boolean>(false)
  const openInNewTab = () => {
    const url = "/"
    const newTab = window.open(url, '_blank');
    newTab?.focus();
  }

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
          <div className="flex flex-col justify-center items-center h-screen">
            <h1 className="text-3xl font-bold text-white pb-8">This view is not currently supported</h1>
            <button
              className="bg-blue-500 p-4 align-middle hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => openInNewTab()}
            >
              Go to chat.poiesis.education
            </button>
          </div>
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