// const getUrl = window.location;
const getUrl = { protocol: 'https:', hostname: 'example.com' };

export const environment = {
    production: true,
    API_URL: `${getUrl.protocol}//${getUrl.hostname}`
};
