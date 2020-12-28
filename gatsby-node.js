const path = require('path');
const util = require('util');
const glob = require('glob');
const fs = require('fs').promises;
const CsvParser = require('./csv-parser');
const MetaParser = require('./meta-parser');

const globP = util.promisify(glob);

exports.createPages = async ({ actions: { createPage } }) => {
  const metaParser = new MetaParser();
  const dataDirectory = path.join(__dirname, './data/');
  const metaPaths = await globP(path.join(dataDirectory, './meta/*.txt'));
  const recordings = await Promise.all(metaPaths.map(f => metaParser.parse(f, f.replace(/[\\\/]meta[\\\/]/, '/files/'))));

  const csvParser = new CsvParser();
  const bsbFileName = path.join(__dirname, './data/bsbdata.csv');
  const bsbData = await csvParser.parse(bsbFileName);

  const bsbDataLookUp = bsbData.reduce((accu, item) => {
    accu[item.id] = { ...accu[item.id], [item.track]: item.pid };
    return accu;
  }, {});

  recordings.forEach(recording => {
    recording.tracks.forEach(recordingTrack => {
      const lookUpTracks = bsbDataLookUp[recording.meta.cdId] || {};
      recordingTrack.pid = lookUpTracks[recordingTrack.key] || null;
      recordingTrack.bsbLink = recordingTrack.pid ? {
        url: `http://digital.bib-bvb.de/webclient/DeliveryManager?pid=${recordingTrack.pid}&custom_att_2=download`,
        type: 'bsb'
      } : null;
      recordingTrack.hmtLink = {
        url: `http://soundprojekt.hmtm.de/sound/${recording.meta.cdId} ${recordingTrack.key} ${recordingTrack.fileName}`,
        type: 'hmtm'
      };
    });
  });

  recordings.sort((a, b) => {
    if ( a.meta.display < b.meta.display ) { return -1; }
    if ( a.meta.display > b.meta.display ) { return 1; }
    return 0;
  });

  createPage({
    path: '/',
    component: require.resolve('./src/templates/index.js'),
    context: { recordings }
  });

  recordings.forEach(recording => {
    createPage({
      path: `/${recording.id}/`,
      component: path.resolve('./src/templates/recording.js'),
      context: { recording }
    });
  });
}
