import 'dotenv/config';

const config = {
    CLIENT_TOKEN: process.env.CLIENT_TOKEN,
    API_KEY: process.env.API_KEY,
    UPDATE_TIME: process.env.UPDATE_TIME,
    SIGNAL_CHANNEL: process.env.SIGNAL_CHANNEL,
    MQTT_HOST: process.env.MQTT_HOST,
    MQTT_PORT: process.env.MQTT_PORT,
    MQTT_USERNAME: process.env.MQTT_USERNAME,
    MQTT_PASSWORD: process.env.MQTT_PASSWORD,
};

export default config;
