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
  return Promise.all(metaPaths.map(f => parser.parse(f, f.replace(/[\\\/]meta[\\\/]/, '/files/'))));
}
