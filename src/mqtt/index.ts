import mqtt from 'async-mqtt';

import config from '../config';
import { getLocaleString } from '../utils/date';

export async function publish(msg: string) {
    try {
        const client = await mqtt.connectAsync({
            host: config.MQTT_HOST,
            port: config.MQTT_PORT,
            username: config.MQTT_USERNAME,
            password: config.MQTT_PASSWORD,
            protocol: 'mqtts',
        });

        await client.publish('cdc/signal', msg);
        await client.end();
        console.log(getLocaleString(), ': 🚀 Message published to mqtt host');
    } catch (err) {
        console.log(`🔴 MQTT error:`, err.message);
    }
}
