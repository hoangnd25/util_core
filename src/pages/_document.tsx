import { globalCSS } from '@go1d/go1d';
import { extractCritical } from 'emotion-server';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import * as React from 'react';
import getConfig from 'next/config';

globalCSS();

export default class extends Document<any> {
  public static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const styles = extractCritical(initialProps.html);
    return { ...initialProps, ...styles };
  }

  public globalCss = `
    body {
      background: #F7F8F8;
    }`;

  public render() {
    const {
      publicRuntimeConfig: { CDN_PATH },
    } = getConfig();

    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" type="image/png" sizes="32x32" href={`${CDN_PATH}/favicon.ico`} />
          <link rel="icon" type="image/png" sizes="16x16" href={`${CDN_PATH}/favicon.ico`} />
          <link rel="apple-touch-icon" sizes="180x180" href={`${CDN_PATH}/favicon.ico`} />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <style dangerouslySetInnerHTML={{ __html: this.globalCss }} />
          <style dangerouslySetInnerHTML={{ __html: this.props.css }} />
          <script
            id="beam"
            dangerouslySetInnerHTML={{
              __html: `var h = {}, e = [], p = e.push.bind(e, h.na);
              h.track = h.event = p.bind(e, "track");
              h.identify = p.bind(e, "identify");
              h.startSession = p.bind(e, "startSession");
              h.endSession = p.bind(e, "startSession");
              h.setContext = p.bind(e, "setContext");
              h.feature = h.featureToggle = function(a,b){return b;};
              h.i = e; h.l = 1*new Date();
              window.beam = window.houston = h;`,
            }}
          />
          <script async src={process.env.BEAM_URL} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
