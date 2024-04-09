"use client";

import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
const New = () => {
  const { setTheme } = useTheme();
  const { data: session } = useSession();
  console.log(session);
  return (
    <div>
      <div>{JSON.stringify(session)}</div>
      {session && (
        <Button onClick={() => signOut({ callbackUrl: "/auth/login" })}>
          SingOut
        </Button>
      )}

      <Button onClick={() => setTheme("dark")}>Dark</Button>
      <Button onClick={() => setTheme("light")}>Light</Button>
    </div>
  );
};

export default New;
