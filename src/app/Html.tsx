/* eslint-disable react/no-danger */
import React from 'react';
import serialize from 'serialize-javascript';
import config from '../config';

const BASE_URL = config.basePath;

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
    scripts,
    dnsPrefetchUrls,
    state,
    children,
    config: appConfig,
    noIndex,
  } = props;

  const styleTags = styles.map(style => <style key={style.id} id={style.id} dangerouslySetInnerHTML={{ __html: style.cssText }} />);

  const scriptTags = scripts.map(script => <script key={script} src={script} />);

  const dnsPrefetch = dnsPrefetchUrls.map(api => <link key={api} rel="dns-prefetch" href={api} />);

  return (
    <html className="no-js" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <title>{title}</title>
        <base href={`${config.basePath}`} />
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0d3880" />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={imageUrl} />
        <link rel="manifest" href="manifest.webmanifest" />
        <link rel="icon" href="favicon.ico" />
        <link rel="icon" href="favicon.ico" sizes="32x32" />
        <link rel="icon" href="icon.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="icon.png" sizes="192x192" data-analytics="ui-link-appleTouchIcon" />
        <link rel="apple-touch-icon" href="tile.png" sizes="558x558" data-analytics="ui-link-appleTouchIcon" />
        {/* TODO: Pull this dynamicly */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Muli:300,400,400i,600,700" />
        {noIndex && <meta name="robots" content="noindex" />}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        {styleTags}
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
              __html: `window.APP_STATE=${serialize(state, { unsafe: true, isJSON: true })}`,
            }}
          />
        )}
        {appConfig && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.APP_CONFIG=${serialize(appConfig, { unsafe: true, isJSON: true })}`,
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
