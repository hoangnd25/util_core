import React, { Suspense } from 'react';
import { Container, Spinner } from '@go1d/go1d';

export const LoadingSpinner = () => (
    <Container minHeight="600" height="100vh" contain="full" justifyContent="center" alignItems="center">
        <Spinner size={6} />
  </Container>
);

const Go1Suspense = ({ children }: any) => {
  if (typeof window === 'undefined') {
    return children;
  }
  return <Suspense fallback={LoadingSpinner}>{children}</Suspense>;
};

export default Go1Suspense;
