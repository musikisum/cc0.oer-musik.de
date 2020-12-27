import { Link } from 'gatsby';
import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import Search from '../components/search';

export default ({ pageContext: { recordings } }) => {
  const compare = (a, b) => {
    if ( a.meta.display < b.meta.display ) { return -1; }
    if ( a.meta.display > b.meta.display ) { return 1; }
    return 0;
  }
  recordings = recordings.sort(compare);
  return (
    <Layout>
      <div className="jumbotron">
        <h1>Public Domain Musik</h1>
        <Search recordings={recordings} />
        <h3>Aktuell sind {recordings.length} Aufnahmen verfügbar!</h3>
      </div>
      <div className="colums">
        {recordings.map(recording => (
          <div key={recording.id} className="recordingIsVisible">
            <Link to={`/recordings/${recording.id}/`}>
              <p className="recordingItemLink">{recording.meta.display}</p>
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  )
}
