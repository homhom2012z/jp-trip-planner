"use client";

import { useUser } from "@/context/UserContext";
import Image from "next/image";

export default function LoginButton() {
  const { user, login } = useUser();

  if (user) {
    // We already show "My Profile" or Avatar in Header usually?
    // For now, let's just show nothing if logged in, ensuring this component is "Sign In Button" specifically.
    // Or we handle that logic in Header.
    return null;
  }

  return (
    <button
      onClick={login}
      className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2.5 rounded-full border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors font-medium text-sm"
    >
      <Image
        src="https://www.google.com/favicon.ico"
        alt="Google"
        width={16}
        height={16}
      />
      Sign in with Google
    </button>
  );
}
