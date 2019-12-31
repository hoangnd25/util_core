import Link from 'next/link';
import React from 'react';
import { modulesInApp, availableModules } from '@src/config';

class CustomLink extends React.PureComponent<any> {
  public render() {
    const {
      module = null, // name of module this link belongs to so a baseUrl can be prepended. module is considered a microapp e.g. prospector, 1-player. A list of modules can be found in /src/config.ts
      children,
      href,
      isApiomLink,
      className,
      style,
      replace = false,
      target = '_self',
      prefix = '', // deprecated!!!!!!! write full link instead in href,
      as,
      query = {},
    } = this.props;

    let externalLink = true;
    const baseURL = (module && modulesInApp[module]) ? modulesInApp[module].baseURL : '';
    const composedLink = `${baseURL}${isApiomLink ? '/p/#/' : ''}${prefix}${prefix ? "/" : ""}${href}`;
    // Check if url is within this APP
    availableModules.forEach(moduleName => {
      if (composedLink.indexOf(modulesInApp[moduleName].baseURL) === 0) {
        externalLink = false;
      }
    });

    if (isApiomLink || externalLink) {
      return (
        <a className={className} target={target} style={style} href={composedLink}>
          {children}
        </a>
      );
    }

    return (
      <Link
        href={{
          pathname: composedLink,
          query,
        }}
        as={as || composedLink}
        passHref
        prefetch={false}
        replace={replace}
      >
        <a className={className} style={style}>
          {children}
        </a>
      </Link>
    );
  }
}

export default CustomLink;
