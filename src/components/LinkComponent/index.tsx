import * as React from 'react';
import { Link } from 'react-router-dom';

const LinkComponent = ({ href, children, ...props }: any) => {
  return typeof href === 'string' && href.indexOf('http') === 0 ? (
    <a href={href} {...props}>
      {children}
    </a>
  ) : (
    <Link to={href} {...props}>
      {children}
    </Link>
  );
};

export default LinkComponent;
