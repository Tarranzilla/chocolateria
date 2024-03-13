/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ["@mercadopago"],
    i18n: {
        locales: ["en", "pt-BR"],
        defaultLocale: "pt-BR",
    },
};

export default nextConfig;
