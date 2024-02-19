let { APS_CLIENT_ID, APS_CLIENT_SECRET, APS_BUCKET, PORT,MQTT_URL,MQTT_PORT,MQTT_CLIENT,MQTT_USERNAME,MQTT_PASSWORD } = process.env;
if (!APS_CLIENT_ID || !APS_CLIENT_SECRET) {
    console.warn('Missing some of the environment variables.');
    process.exit(1);
}
APS_BUCKET = APS_BUCKET || `${APS_CLIENT_ID.toLowerCase()}-basic-app`;
PORT = PORT || 8080;

module.exports = {
    APS_CLIENT_ID,
    APS_CLIENT_SECRET,
    APS_BUCKET,
    PORT,
    MQTT_URL,
    MQTT_CLIENT,
    MQTT_USERNAME,
    MQTT_PASSWORD
};
