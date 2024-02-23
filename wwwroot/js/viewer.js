/// import * as Autodesk from "@types/forge-viewer";
import { SensorDetailExtension } from './extensions/SensorDetailExtension.js';
export const SensorDetailExtensionID = 'IoT.SensorDetail';
Autodesk.Viewing.theExtensionManager.registerExtension(SensorDetailExtensionID, SensorDetailExtension);
async function getAccessToken(callback) {
    try {
        const resp = await fetch('/api/auth/token');
        if (!resp.ok) {
            throw new Error(await resp.text());
        }
        const { access_token, expires_in } = await resp.json();
        callback(access_token, expires_in);
    } catch (err) {
        alert('Could not obtain access token. See the console for more details.');
        console.error(err);
    }
}

export function initViewer(container,extensions) {
    return new Promise(function (resolve, reject) {
        Autodesk.Viewing.Initializer({ env: 'AutodeskProduction2', api: 'streamingV2', getAccessToken }, function () {
            const viewer = new Autodesk.Viewing.GuiViewer3D(container, { extensions });
            viewer.start();
            viewer.setTheme('light-theme');
            resolve(viewer);
        });
    });
}

// export function loadModel(viewer, urn) {
//     return new Promise(function (resolve, reject) {
//         function onDocumentLoadSuccess(doc) {
//             resolve(viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry()));
//         }
//         function onDocumentLoadFailure(code, message, errors) {
//             reject({ code, message, errors });
//         }
//         viewer.setLightPreset(0);
//         Autodesk.Viewing.Document.load('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
//     });
// }

export function addViewable(viewer, urn, xform, offset) {
    return new Promise(function (resolve, reject) {
      function onDocumentLoadSuccess(doc) {
        const viewable = doc.getRoot().search({'role':'3d'})[0]
        const options = {
          //  preserveView: true,
          keepCurrentModels: true
        };
        if (xform) {
          options.placementTransform = xform;
        }
        if (offset) {
          options.globalOffset = offset;
        }
        viewer
          .loadDocumentNode(doc, viewable, options)
          .then(resolve)
          .catch(reject);
      }
      function onDocumentLoadFailure(code) {
        reject(`Could not load document (${code}).`);
      }
      Autodesk.Viewing.Document.load(
        "urn:" + urn,
        onDocumentLoadSuccess,
        onDocumentLoadFailure
      );
    });
}

export function adjustPanelStyle(panel, { left, right, top, bottom, width, height }) {
    const style = panel.container.style;
    style.setProperty('left', left ? left : 'unset');
    style.setProperty('right', right ? right : 'unset');
    style.setProperty('top', top ? top : 'unset');
    style.setProperty('bottom', bottom ? bottom : 'unset');
    style.setProperty('width', width ? width : 'unset');
    style.setProperty('height', height ? height : 'unset');
}