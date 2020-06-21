const fs = require('fs').promises;

const metadataKeyMappings = {
  'Display': 'display',
  'Titel': 'title',
  'Label': 'label',
  'Format': 'format',
  'Land': 'country',
  'Veröffentlicht': 'published',
  'Erstveröffentlichung': 'firstPublished',
  'Trackliste': 'composition',
  'Tracks': 'composition2',
  'Mitwirkende': 'artists',
  'Urheberrecht': 'license',
  'Title': 'title2',
  'Untertitel': 'subtitle',
  'Werk': 'composition3',
  'Komponist': 'composer',
  'Erstveröffentlicht': 'firstPublished2',
  'Record Company': 'label2',
  'Anmerkungen': 'annotations',
  'Serie': 'series',
  'Auszüge': 'tobedeleted'
};

const finalFieldNames = [
  'display',
  'title',
  'label',
  'format',
  'country',
  'published',
  'firstPublished',
  'composition',
  'artists',
  'license',
  'annotations'
];

const metaDataFilters = [
  mapMetadataKeys,
  pruneMetadataKeys,
  setCc0License,
  unEnDashifyArtists,
  consolidateWhitespace
];

function mapMetadataKeys(input) {
  const output = {};
  Object.keys(input).forEach(originalKey => {
    const originalValue = input[originalKey];
    const mappingKey = metadataKeyMappings[originalKey];
    if (mappingKey) {
      output[mappingKey] = originalValue !== undefined ? originalValue : null;
    } else {
      output[originalKey] = originalValue;
    }
  });

  return output;
}

function pruneMetadataKeys(input) {
  if (input.title2) {
    input.title = input.title2;
  }

  if (input.label2) {
    input.label = input.label2;
  }

  if (input.composition3) {
    input.composition2 = input.composition3;
  }

  if (input.composition2) {
    input.composition = input.composition2;
  }

  if (input.series) {
    input.format = input.series;
  }

  if (input.firstPublished2) {
    input.firstPublished = input.firstPublished2;
  }

  if (input.subtitle && input.title) {
    input.title = `${input.title.replace(/\.?/, '')}. ${input.subtitle}`;
  } else if (input.subtitle && !input.title) {
    input.title = input.subtitle;
  }

  if (input.composer && input.artists && !input.artists.includes('Composer')) {
    input.artists = `Composer - ${input.composer}, ${input.artists}`;
  }

  if (input.artists && input.artists.includes('Composed By')) {
    input.artists = input.artists.replace('Composed By', 'Composer');
  }

  delete input.title2;
  delete input.label2;
  delete input.series;
  delete input.composition2;
  delete input.composition3;
  delete input.firstPublished2;
  delete input.subtitle;
  delete input.composer;
  delete input.tobedeleted;

  return input;
}

function setCc0License(input) {
  input.license = 'CC0';
  return input;
}

function unEnDashifyArtists(input) {
  if (input.artists) {
    input.artists = input.artists.replace(/[–:]/g, ' - ');
  }

  return input;
}

function consolidateWhitespace(input) {
  finalFieldNames.forEach(key => {
    if (typeof input[key] === 'string') {
      input[key] = input[key].replace(/\s+/g, ' ');
    }
  });

  return input;
}

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

    const fileMetaKeys = Object.keys(metaObj).filter(m => trackKeys.includes(m));
    const remainingFileMetas = Object.fromEntries(fileMetaKeys.map(m => [m, metaObj[m]]));

    const finalMeta = Object.fromEntries(Object.entries(remainingMetas).filter(([k, v]) => finalFieldNames.includes(k)))

    return {
      id: `${fileObj.cdId}-${fileObj.tracks[0].key}`,
      meta: { cdId: fileObj.cdId, ...finalMeta },
      tracks: fileObj.tracks.map(t => ({ key: t.key, name: remainingFileMetas[t.key], fileName: t.fileName }))
    }
  }

  parseMetaContent(content, path) {
    if (!content.includes('::')) {
      console.error(`Could not find '::' in meta content ${path}: ${content}`);
      return null;
    }

    const originalObject = this.getNonEmptyLines(content).reduce((map, item) => {
      const [key, value] = item.split('::');
      try { map[key.trim()] = value.trim(); } catch (err) { console.log('content', content); throw err; }
      return map;
    }, {});

    return metaDataFilters.reduce((o, f) => f(o), originalObject);
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
      .replace(/^\uFEFF/, '')
      .replace('\r', '')
      .split('\n')
      .map(x => x.trim())
      .filter(x => !!x);
  }

  loadContent(path) {
    return fs.readFile(path, 'utf8');
  }
}
