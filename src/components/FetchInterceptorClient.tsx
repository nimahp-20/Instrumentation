'use client';

import { useEffect } from 'react';
import ClientOnly from './ClientOnly';

function FetchInterceptorLoader() {
  useEffect(() => {
    // Import the interceptor only on the client side
    import('@/lib/fetch-interceptor');
  }, []);

  return null;
}

export default function FetchInterceptorClient() {
  return (
    <ClientOnly>
      <FetchInterceptorLoader />
    </ClientOnly>
  );
}
