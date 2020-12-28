import { Link } from 'gatsby';
import Layout from '../components/layout';
import Search from '../components/search';
import React, { useEffect, useState } from 'react';

function createRecordingsWithSearchField(recordings) {
  return recordings.map(rec => ({
    ...rec,
    searchField: Object.values(rec.meta).join(' ').toLowerCase()
  }));
}

function filterRecordings(searchTerm, allRecordingsWithSearchField) {
  const terms = searchTerm.trim().replace(/\s+/g, ' ').toLowerCase().split(' ');
  if (!terms.length) {
    return allRecordingsWithSearchField;
  }
  return allRecordingsWithSearchField.filter(elem => {
    return terms.every(term => elem.searchField.includes(term))
  });
}

export default ({ pageContext: { recordings }}) => {

  const [recordingsWithSearchField, setRecordingsWithSearchField] = useState(createRecordingsWithSearchField(recordings));

  useEffect(() => {
    setRecordingsWithSearchField(createRecordingsWithSearchField(recordings));
  }, [recordings]);

  const [searchTerm, setSearchTerm] = useState('');
  const [recordingEntries, setRecordingEntries] = useState(filterRecordings(searchTerm, recordingsWithSearchField));

  useEffect(() => {
    setRecordingEntries(filterRecordings(searchTerm, recordingsWithSearchField));
  }, [recordingsWithSearchField, searchTerm]);

  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
  }

  return (
    <Layout>
    	<div className="jumbotron">
        <h1>Public Domain Musik</h1>
        <h2>Auf dieser Seite finden Sie Aufnahmen klassischer Musik, die nach deutschem Urheberecht nicht mehr geschützt sind. Aktuell sind <span className="obHighlighted">&nbsp;{new Intl.NumberFormat('de-DE').format(recordings.length)} Aufnahmen&nbsp;</span> verfügbar!</h2>
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
          </div>
        ))}
      </div>
    </Layout>
  )
}
