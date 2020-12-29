import { Link } from 'gatsby';
import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import MultiSelect from '../components/multiselect'; 

const metaKeys = ['cdId', 'title', 'label', 'format', 'country', 'artists', 'composition', 'license'];
const metakeysToDelete = metaKeys;
const checkBoxes = metakeysToDelete.map(metaKey => { return { 'label': metaKey === 'cdId' ? 'ID' : metaKey }});
/*const checkBoxes = [{ 'label': 'item 1' }, { 'label': 'item 2' }];
*/
function createRecordingsWithSearchField(recordings, metakeysToDelete) {
  return recordings.map(rec => {
    metakeysToDelete.forEach(key => delete rec.meta[key]);
    return { ...rec, searchField: Object.values(rec.meta).join(' ').toLowerCase() }
  });
}

function filterRecordings(searchTerm, allRecordingsWithSearchField) {
  const terms = searchTerm.trim().replace(/\s+/g, ' ').toLowerCase().split(' ');
  if (!terms.length) {
    return allRecordingsWithSearchField;
  }
  return allRecordingsWithSearchField.filter(elem => {
    return terms.every(term => elem.searchField.includes(term));
  });
}

export default ({ pageContext: { recordings }}) => {

  const [recordingsWithSearchField, setRecordingsWithSearchField] = useState(createRecordingsWithSearchField(recordings, metakeysToDelete));

  useEffect(() => {
    setRecordingsWithSearchField(createRecordingsWithSearchField(recordings, metakeysToDelete));
  }, [recordings]);

  const [searchTerm, setSearchTerm] = useState('');
  const [recordingEntries, setRecordingEntries] = useState(filterRecordings(searchTerm, recordingsWithSearchField));

  useEffect(() => {
    setRecordingEntries(filterRecordings(searchTerm, recordingsWithSearchField));
  }, [recordingsWithSearchField, searchTerm]);

  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
  }

  function onMultiSelectDataChange(dataFromMultiSelectComponent){
    console.log(dataFromMultiSelectComponent);
  }

  return (
    <Layout>
    	<div className="jumbotron">
        <h1>Public Domain Musik</h1>
        <h2>Auf dieser Seite finden Sie Aufnahmen klassischer Musik, die nach deutschem Urheberecht nicht mehr geschützt sind. Aktuell sind <span className="obHighlighted">&nbsp;{new Intl.NumberFormat('de-DE').format(recordings.length)} Aufnahmen&nbsp;</span> verfügbar!</h2>
        <span>Suche in Feldern: </span><MultiSelect options={checkBoxes} onChange={onMultiSelectDataChange} />
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
