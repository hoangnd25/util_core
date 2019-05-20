import React, { Suspense } from 'react';

const Go1Suspense = ({ children, ...props }: any) => {
  if (!process.env.BROWSER) {
    return children;
  }

  return <Suspense {...props}>{children}</Suspense>;
};

export default Go1Suspense;
