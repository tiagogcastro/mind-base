'use client'

import { SessionProvider } from 'next-auth/react';
import React from 'react';

export type AppProvidersProps = {
  children: React.ReactNode;
}

export function AppProviders({
  children
}: AppProvidersProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
