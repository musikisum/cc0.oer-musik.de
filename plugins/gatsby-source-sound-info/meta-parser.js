const fs = require('fs').promises;

module.exports = class MetaParser {
  async parse(metaPath, filePath) {
    const [metaContent, fileContent] = await Promise.all([
      await this.loadContent(metaPath),
      await this.loadContent(filePath)
    ]);

    const metaObj = this.parseMetaContent(metaContent, metaPath);
    const fileObj = this.parseFileContent(fileContent, filePath);

    if (!metaObj || !fileObj) {
      return null;
    }

    const trackKeys = fileObj.tracks.map(t => t.key);
    const metaKeys = Object.keys(metaObj).filter(m => !trackKeys.includes(m));
    const remainingMetas = Object.fromEntries(metaKeys.map(m => [m, metaObj[m]]));

    return {
      id: `${fileObj.cdId}-${fileObj.tracks[0].key}`,
      meta: { cdId: fileObj.cdId, ...remainingMetas },
      tracks: fileObj.tracks
    }
  }

  parseMetaContent(content, path) {
    if (!content.includes('::')) {
      console.error(`Could not find '::' in meta content ${path}: ${content}`);
      return null;
    }

    return this.getNonEmptyLines(content).reduce((map, item) => {
      const [key, value] = item.split('::');
      map[key.trim()] = value.trim();
      return map;
    }, {});
  }

  parseFileContent(content, path) {
    if (content.includes('::')) {
      console.error(`Found '::' in file content ${path}: ${content}`);
      return null;
    }

    return this.getNonEmptyLines(content).reduce((map, item) => {
      const matches = /^(\S+)\s+(\S+)\s+(\S.*)$/.exec(item);
      map.cdId = matches[1];
      map.tracks.push({
        key: matches[2],
        fileName: matches[3].trim()
      });
      return map;
    }, { cdId: null, tracks: [] });
  }

  getNonEmptyLines(str) {
    return str
      .replace('\r')
      .split('\n')
      .map(x => x.trim())
      .filter(x => !!x);
  }

  loadContent(path) {
    return fs.readFile(path, 'utf8');
  }
}
