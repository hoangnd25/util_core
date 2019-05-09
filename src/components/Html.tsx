/* eslint-disable react/no-danger */
import React from 'react';
import serialize from 'serialize-javascript';
import { BASE_URL } from '../constants/urls';

interface Style {
  id: string;
  cssText: string;
}

interface HTMLProps {
  title: string;
  description: string;
  styles: Style[];
  styleLinks: string[];
  scripts: string[];
  dnsPrefetchUrls: string[];
  state?: any;
  children: string;
  config?: any;
  canonicalUrl?: string;
  schemas?: any[];
  imageUrl?: string;
  noIndex?: boolean;
}

const Html = (props: HTMLProps) => {
  const {
    title,
    description,
    canonicalUrl,
    imageUrl,
    schemas,
    styles,
    styleLinks,
    scripts,
    dnsPrefetchUrls,
    state,
    children,
    config,
    noIndex,
  } = props;

  const styleTags = styles.map(style => <style key={style.id} id={style.id} dangerouslySetInnerHTML={{ __html: style.cssText }} />);

  const styleLinkTags = styleLinks.map(styleLink => <link key={styleLink} rel="stylesheet" type="text/css" href={styleLink} />);

  const scriptTags = scripts.map(script => <script key={script} src={script} />);

  const dnsPrefetch = dnsPrefetchUrls.map(api => <link key={api} rel="dns-prefetch" href={api} />);

  return (
    <html className="no-js" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0d3880" />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={imageUrl} />
        <link rel="manifest" href={`${BASE_URL}/manifest.webmanifest`} />
        <link rel="icon" href={`${BASE_URL}/favicon.ico`} />
        <link rel="icon" href={`${BASE_URL}/favicon.ico`} sizes="32x32" />
        <link rel="icon" href={`${BASE_URL}/icon.png`} sizes="192x192" />
        <link rel="apple-touch-icon" href={`${BASE_URL}/icon.png`} sizes="192x192" data-analytics="ui-link-appleTouchIcon" />
        <link rel="apple-touch-icon" href={`${BASE_URL}/tile.png`} sizes="558x558" data-analytics="ui-link-appleTouchIcon" />
        {noIndex && <meta name="robots" content="noindex" />}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        {styleTags}
        {styleLinkTags}
        {dnsPrefetch}
      </head>
      <body>
        {schemas &&
          schemas.map(
            schema => schema && <script type="application/ld+json" key={schema['@type']} dangerouslySetInnerHTML={{ __html: schema }} />
          )}
        <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
        {state && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.APP_STATE=${serialize(state, { isJSON: true })}`,
            }}
          />
        )}
        {config && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.APP_CONFIG=${serialize(config, { isJSON: true })}`,
            }}
          />
        )}
        {scriptTags}
        <script
          dangerouslySetInnerHTML={{
            __html: 'typeof _satellite !== "undefined" ? _satellite.pageBottom() : null',
          }}
        />
      </body>
    </html>
  );
};

Html.defaultProps = {
  styles: [],
  styleLinks: [],
  scripts: [],
  dnsPrefetchUrls: [],
  state: null,
  config: {},
  canonicalUrl: '',
  schemas: [],
  imageUrl: undefined,
  noIndex: false,
};

export default Html;
