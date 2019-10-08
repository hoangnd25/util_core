import * as React from 'react';
import { ErrorState } from '@go1d/go1d';

function Error({ statusCode }) {
  return (
        <ErrorState>
            {statusCode ? `An error ${statusCode} occurred on server` : 'An error occurred on client'}
      </ErrorState>
  );
}

Error.getInitialProps = ({ res, err }) => {
  let statusCode = 404;
  if (res) {
    statusCode = res.statusCode;
  } else if (err) {
    statusCode = err.statusCode;
  }
  return { statusCode };
};

export default Error;
