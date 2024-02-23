import { initViewer, addViewable,SensorDetailExtensionID, adjustPanelStyle } from './viewer.js';
const EXTENSIONS = [SensorDetailExtensionID];
import { initTimeline } from './timeline.js';
import { MyDataView } from './dataview.js';
import {
    DEFAULT_TIMERANGE_START,
    DEFAULT_TIMERANGE_END
} from './config.js';
const socket = io();
// import { IotPanel } from './iotpanel.js';

let vs = {"viewport":{"name":"","eye":[-1084.9281814854833,-721.0869936024823,40.2769448821125],"target":[-205.485521763439,673.0655841366873,-544.9665633276065],"up":[0.17850943924988413,0.2829853568391336,0.9423659946715608],"worldUpVector":[0,0,1],"pivotPoint":[34.27784577826885,613.7329671172855,-326.0159711456097],"distanceToOrbit":1749.1685926912153,"aspectRatio":3.375,"projection":"orthographic","isOrthographic":true,"orthographicHeight":1749.1685926912176}}
let vc = document.getElementById("preview")
const viewer = await initViewer(vc,EXTENSIONS);
await addViewable(
    viewer,
    "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bXF0dF9kZW1vLzEtUEUtMDAxLmR3Zw",null
);

viewer.setTheme('dark-theme')
viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, async () => {
  viewer.restoreState(vs);
  // Initialize the timeline
//   initTimeline(document.getElementById('timeline'), onTimeRangeChanged, onTimeMarkerChanged);

  // Initialize our data view
  const dataView = new MyDataView();
  await dataView.init({ start: DEFAULT_TIMERANGE_START, end: DEFAULT_TIMERANGE_END });

  // Configure and activate our custom IoT extensions
  const extensions = [SensorDetailExtensionID].map(id => viewer.getExtension(id));
  for (const ext of extensions) {
      ext.dataView = dataView;
      ext.activate();
  }
  
  adjustPanelStyle(viewer.getExtension(SensorDetailExtensionID).panel, { left: '10px', top: '10px', width: '500px', height: '500px' });

  onTimeRangeChanged(DEFAULT_TIMERANGE_START, DEFAULT_TIMERANGE_END);

  async function onTimeRangeChanged(start, end) {
      await dataView.refresh({ start, end });
      extensions.forEach(ext => ext.dataView = dataView);
  }

//   onDataChanged(info);

async function onDataChanged(info){
      dataView._timestamps = info.timestamps.map(str => new Date(str));
      dataView._data['sensor-1'].pressure = info.pressure
      dataView._data['sensor-1'].flowrate = info.flowrate
      dataView._data['sensor-1'].temperature = info.temperature
      extensions.forEach(ext => ext.dataView = dataView);
  }
  
  socket.on('mqttdata', message => {
    // console.log('From server: ', message)
    onDataChanged(message)
  })

  function onLevelChanged({ target, levelIndex }) {
      dataView.floor = levelIndex !== undefined ? target.floorData[levelIndex] : null;
      extensions.forEach(ext => ext.dataView = dataView);
  }

  function onTimeMarkerChanged(time) {
      extensions.forEach(ext => ext.currentTime = time);
  }

  function onCurrentSensorChanged(sensorId) {
      const sensor = dataView.getSensors().get(sensorId);
      if (sensor && sensor.objectId) {
          viewer.fitToView([sensor.objectId]);
      }
      extensions.forEach(ext => ext.currentSensorID = sensorId);
  }

  function onCurrentChannelChanged(channelId) {
      extensions.forEach(ext => ext.currentChannelID = channelId);
  }
});


// let flowrate_panel = IotPanel(vc,'flowrate','flowrate Data','content',50,50)