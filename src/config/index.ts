import 'dotenv/config';

const config = {
    CLIENT_TOKEN: process.env.CLIENT_TOKEN,
    API_KEY: process.env.API_KEY,
    UPDATE_TIME: process.env.UPDATE_TIME,
    SIGNAL_CHANNEL: process.env.SIGNAL_CHANNEL,
};

export default config;
