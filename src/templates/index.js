import { Link } from 'gatsby';
import Layout from '../components/layout';
import Search from '../components/search';
import React, { useEffect, useState } from 'react';

export default ({ pageContext: { recordings }}) => {

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
        <h2>Auf dieser Seite finden Sie Aufnahmen klassischer Musik, die nach deutschem Urheberecht nicht mehr geschützt sind. Aktuell sind <span className="highlighted">&nbsp;{new Intl.NumberFormat('de-DE').format(recordings.length)} Aufnahmen&nbsp;</span> verfügbar!</h2>
        <Search recordings={recordings} />
      </div>
       <div className="colums">
        {recordings.map(recording => (
          <div key={recording.id} className="recordingIsVisible">
            <Link to={`/${recording.id}/`}>
              <p className="recordingItemLink">{recording.meta.display}</p>
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  )
}
