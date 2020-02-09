const path = require('path');
const util = require('util');
const glob = require('glob');
const MetaParser = require('./plugins/gatsby-source-sound-info/meta-parser');

const globP = util.promisify(glob);

const parser = new MetaParser();

(async () => {
  const metaPaths = await globP('./data/meta/*.txt');
  const items = await Promise.all(metaPaths.map(f => parser.parse(f, f.replace(/[\\\/]meta[\\\/]/, '/files/'))));
  items.forEach(item => {
    const nodeId = `sound-info-id-${item.id}`;
    const nodeContent = JSON.stringify(item);
    const nodeData = {
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: `SoundInfoItem`,
        content: nodeContent,
      },
      meta: item.meta,
      tracks: item.tracks
    };
    if (nodeData.meta.cdId === '002894793100') console.log('nodeData', nodeData);
  });

})();
