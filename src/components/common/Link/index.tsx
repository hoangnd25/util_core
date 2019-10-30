import Link from 'next/link';
import React from 'react';

class CustomLink extends React.PureComponent<any> {
  public render() {
    const {
      children,
      externalLink,
      href,
      isApiomLink,
      className,
      style,
      replace = false,
      target = '_self',
    } = this.props;

    if (isApiomLink || (typeof href === 'string' && href.indexOf('http') === 0) || externalLink) {
      return (
        <a className={className} target={target} style={style} href={`${isApiomLink ? '/p/#/' : ''}${href}`}>
          {children}
        </a>
      );
    }

    return (
      <Link href={`${href}`} passHref prefetch={false} replace={replace}>
        <a className={className} style={style}>
          {children}
        </a>
      </Link>
    );
  }
}

export default CustomLink;
