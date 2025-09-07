import { Button } from '@/components/ui/button';
import { LogIn, Sparkles } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';

export const LoginButton = () => {
  const { status } = useSession()

  const handleLogin = () => {
    signIn('google')
  };

  return (
    <Button
      onClick={handleLogin}
      disabled={status === 'loading'}
      className="relative overflow-hidden bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 hover:from-purple-600 hover:via-blue-600 hover:to-pink-600 text-white font-medium px-6 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-0"
    >
      {status === 'loading' ? (
        '...'
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 opacity-0 hover:opacity-20 transition-opacity"></div>
          <div className="relative flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            <span>Entrar</span>
            <Sparkles className="h-3 w-3 opacity-70" />
          </div>
        </>
      )}
    </Button>
  );
};