import { globalCSS } from '@go1d/go1d';
import { extractCritical } from 'emotion-server';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import * as React from 'react';

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
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <link href="https://fonts.googleapis.com/css?family=Muli:300,400,400i,600,700" rel="stylesheet" />
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
              window.beam = window.houston = h;`
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
