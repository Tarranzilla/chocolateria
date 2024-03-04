import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="icon" href="/favicon.png" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#313840" />
                <link rel="stylesheet" href="https://use.typekit.net/bhr7kbf.css" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
