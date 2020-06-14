const path = require('path');
const util = require('util');
const glob = require('glob');
const MetaParser = require('./meta-parser');

const globP = util.promisify(glob);

exports.createPages = async ({ actions: { createPage } }) => {
  const parser = new MetaParser();
  const dataDirectory = path.join(__dirname, './data/');
  const metaPaths = await globP(path.join(dataDirectory, './meta/*.txt'));
  const recordings = await Promise.all(metaPaths.map(f => parser.parse(f, f.replace(/[\\\/]meta[\\\/]/, '/files/'))));

  createPage({
    path: '/recordings',
    component: require.resolve('./src/templates/recordings.js'),
    context: { recordings },
  });


  recordings.forEach(recording => {
    createPage({
      path: `/recordings/${recording.id}/`,
      component: path.resolve('./src/templates/recording.js'),
      context: { recording }
    });
  });
}
