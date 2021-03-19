import { globalCSS } from '@go1d/go1d';
import { extractCritical } from 'emotion-server';
import Document, { Head, Main, NextScript } from 'next/document';
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
    background: #F1F6F9;
  }`;

    public render() {
      return (
        <html>
          <Head>
            <meta charSet="utf-8" />
            <meta httpEquiv="x-ua-compatible" content="ie=edge" />
            <link href="https://fonts.googleapis.com/css?family=Muli:300,400,400i,600,700" rel="stylesheet" />
            <style dangerouslySetInnerHTML={{ __html: this.globalCss }} />
            <style dangerouslySetInnerHTML={{ __html: this.props.css }} />
          </Head>
          <body>
            <Main />
            <NextScript />
          </body>
        </html>
      );
    }
}
