// const getUrl = window.location;
const getUrl = { protocol: 'http:', hostname: 'localhost' };

export const environment = {
    production: true,
    API_URL: `${getUrl.protocol}//${getUrl.hostname}:3001`
};
