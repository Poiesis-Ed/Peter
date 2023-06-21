import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function SignIn() {
  const { data: session, status } = useSession();
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    console.log(query);
    const provider = query.get("provider");
    if (!provider) {
      window.close();
    }
    if (!(status === "loading") && !session) void signIn(provider!);
    if (session) window.close();
    

  }, [session, status]);


  return (
    <div
    className="bg-slate-800"
  ></div>
  )
}
