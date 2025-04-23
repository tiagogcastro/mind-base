"use client"

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from 'react-icons/fc';

export function SigninAuth() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-76px)] bg-gray-900">
      <div className="w-full max-w-sm bg-gray-800 rounded-2xl shadow-lg p-6 gap-4 flex justify-center items-center flex-col">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-center text-white">
            Bem-vindo(a) 👋
          </h1>
          <p className="text-sm text-gray-100 text-center">
            Faça login com sua conta Google para continuar
          </p>
        </div>

        <Button
          className="w-full text-white bg-gray-600"
          onClick={() => signIn('google')}
        >
          <FcGoogle />
          Entrar com Google
        </Button>
      </div>
    </div>
  )
}
