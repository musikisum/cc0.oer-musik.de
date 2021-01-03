import { Link } from 'gatsby';
import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import MultiSelect from '../components/multiselect';

const metakeysToDelete = ['title', 'label', 'composition', 'license'];;
const searchKeys = ['cdId', 'display', 'format', 'artists', 'published', 'firstPublished'];
const checkBoxes = searchKeys.map(key => { return { 'label': key }});

function createRecordingsWithSearchField(recordings, metakeysToDelete) {
  return recordings.map(rec => {
    metakeysToDelete.forEach(key => delete rec.meta[key]);
    return { ...rec, searchField: Object.values(rec.meta).join(' ').toLowerCase() }
  });
}

function filterRecordings(searchTerm, allRecordingsWithSearchField, keys) {
  console.log('Searchterm:', searchTerm, 'Recordings', allRecordingsWithSearchField.length, 'Keys', keys.length);
  const terms = searchTerm.trim().replace(/\s+/g, ' ').toLowerCase().split(' ');
  if (!terms.length) {
    return allRecordingsWithSearchField;
  }
  if (keys.length && searchTerm) {
    return allRecordingsWithSearchField
      .filter(elem => keys.some(key => elem.meta.hasOwnProperty(key)
        ? terms.every(term => elem.meta[key].toLowerCase().includes(term))
        : false));
  }
  return allRecordingsWithSearchField.filter(elem => terms.every(term => elem.searchField.includes(term)));
}

export default ({ pageContext: { recordings }}) => {

  const [recordingsWithSearchField, setRecordingsWithSearchField] = useState(createRecordingsWithSearchField(recordings, metakeysToDelete));
  useEffect(() => {
    setRecordingsWithSearchField(createRecordingsWithSearchField(recordings, metakeysToDelete));
  }, [recordings]);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchKeys, setSearchKeys] = useState([]);
  const [recordingEntries, setRecordingEntries] = useState(filterRecordings(searchTerm, recordingsWithSearchField, searchKeys));

  useEffect(() => {
    setRecordingEntries(filterRecordings(searchTerm, recordingsWithSearchField, searchKeys));
  }, [recordingsWithSearchField, searchTerm, searchKeys]);

  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
  }

  function onMultiSelectDataChange(dataFromMultiSelectComponent){
    setSearchKeys(dataFromMultiSelectComponent.map(obj => obj.label));
  }

  return (
    <Layout>
    	<div className="jumbotron">
        <h1>Public Domain Musik</h1>
        <h2>Auf dieser Seite finden Sie Aufnahmen klassischer Musik, die nach deutschem Urheberecht nicht mehr geschützt sind. Aktuell sind <span className="obHighlighted">&nbsp;{new Intl.NumberFormat('de-DE').format(recordings.length)} Aufnahmen&nbsp;</span> verfügbar!</h2>
        <div className="searchKeys"><span>Suche in Feldern: </span><MultiSelect options={checkBoxes} onChange={onMultiSelectDataChange} /></div>
        <hr />
        <input
          className="searchInput"
          type="search"
          id="tutorials-filter"
          placeholder="Suchbegriff eingeben"
          onChange={handleSearchChange}
        />
      </div>
      <div className="colums">
        {recordingEntries.map(record => (
          <div key={record.id} className="recordingIsVisible">
            <Link to={`/${record.id}/`}>
              <p className="recordingItemLink">{record.meta.display}</p>
            </Link>
          </div>))}
      </div>
    </Layout>
  )
}
