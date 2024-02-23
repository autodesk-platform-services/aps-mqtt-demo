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
    'pressure': {
        name: 'pressure',
        description: 'Fluid pressure',
        type: 'double',
        unit: 'Pa',
        min: 0,
        max: 500,
        color:'#4287f5'
    },
    'flowrate': {
        name: 'flowrate',
        description: 'Fluid flowrate',
        type: 'double',
        unit: 'm3/s',
        min: 0,
        max: 1000,
        color:'#1e6910'
    },
    'temperature': {
        name: 'temperature',
        description: 'Fluid temperature',
        type: 'double',
        unit: 'C',
        min: 0,
        max: 200,
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
                'pressure': generateRandomValues(0, 500, resolution, 1.0),
                'flowrate': generateRandomValues(0, 1000, resolution, 1.0),
                'temperature': generateRandomValues(0, 200, resolution, 5.0)
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
