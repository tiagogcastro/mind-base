'use client'
import { reactQueryClient } from '@/config/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import React from 'react';

export type AppProvidersProps = {
  children: React.ReactNode;
}

export function AppProviders({
  children
}: AppProvidersProps) {
  return (
    <QueryClientProvider client={reactQueryClient}>
      <SessionProvider>
        {children}
      </SessionProvider>
    </QueryClientProvider>
  )
}
