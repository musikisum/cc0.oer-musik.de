const path = require('path');
const util = require('util');
const glob = require('glob');
const MetaParser = require('./meta-parser');

const globP = util.promisify(glob);

const parser = new MetaParser();

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }, configOptions) => {
  const { createNode } = actions;

  // Gatsby adds a configOption that's not needed for this plugin, delete it
  delete configOptions.plugins;

  // plugin code goes here...
  const { dataDirectory } = configOptions;
  const metaPaths = await globP(path.join(dataDirectory, './meta/*.txt'));
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
        contentDigest: createContentDigest(item),
      },
      meta: item.meta,
      tracks: item.tracks
    };

    createNode(nodeData);
  });
}
