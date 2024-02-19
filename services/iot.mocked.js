const SENSORS = {
    'sensor-1': {
        name: 'IOT Data',
        description: 'Sensor data',
        groupName: 'Level 1',
        location: {
            x: 31.92,
            y: 11.49,
            z: -12.97
        },
        objectId: 4124
    }
};

const CHANNELS = {
    'Power': {
        name: 'Power',
        description: 'External temperature in degrees Celsius.',
        type: 'double',
        unit: 'W',
        min: 0,
        max: 500,
        color:'#4287f5'
    },
    'Torque': {
        name: 'Torque',
        description: 'Level of carbon dioxide.',
        type: 'double',
        unit: 'Nm',
        min: 0,
        max: 200,
        color:'#1e6910'
    },
    'Speed': {
        name: 'Speed',
        description: 'Level of carbon dioxide.',
        type: 'double',
        unit: 'm/s',
        min: 0,
        max: 2000,
        color:'#cf681f'
    }
};

async function getSensors() {
    return SENSORS;
}

async function getChannels() {
    return CHANNELS;
}

async function getSamples(timerange, resolution = 32) {
    return {
        count: resolution,
        timestamps: generateTimestamps(timerange.start, timerange.end, resolution),
        data: {
            'sensor-1': {
                'Power': generateRandomValues(0, 500, resolution, 1.0),
                'Torque': generateRandomValues(0, 200, resolution, 1.0),
                'Speed': generateRandomValues(0, 2000, resolution, 5.0)
            }
        }
    };
}

function generateTimestamps(start, end, count) {
    const delta = Math.floor((end.getTime() - start.getTime()) / (count - 1));
    const timestamps = [];
    for (let i = 0; i < count; i++) {
        timestamps.push(new Date(start.getTime() + i * delta));
    }
    return timestamps;
}

function generateRandomValues(min, max, count, maxDelta) {
    const values = [];
    let lastValue = min + Math.random() * (max - min);
    for (let i = 0; i < count; i++) {
        values.push(lastValue);
        lastValue += (Math.random() - 0.5) * 2.0 * maxDelta;
        if (lastValue > max) {
            lastValue = max;
        }
        if (lastValue < min) {
            lastValue = min;
        }
    }
    return values;
}

module.exports = {
    getSensors,
    getChannels,
    getSamples
};
