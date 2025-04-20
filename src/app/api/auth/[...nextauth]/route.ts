import { firebaseAuth } from '@/config/firebase';
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: AuthOptions = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    newUser: '/dashboard',
    signIn: '/dashboard',
    signOut: '/',
  },
  callbacks: {
    async signIn({ user }) {
      try {
        await firebaseAuth.getUserByEmail(user.email!)
      } catch (error) {
        await firebaseAuth.createUser({
          uid: user.id,
          email: user.email!,
          displayName: user.name!,
          photoURL: user.image!,
        })
      }

      return true
    },
  },
})

export { authOptions as GET, authOptions as POST };
