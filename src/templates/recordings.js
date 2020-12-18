import React, { useEffect } from 'react';
import { Link } from 'gatsby';
import Layout from '../components/layout';

export default ({ pageContext: { recordings } }) => {
  useEffect(() => {
    alert('I am in the browser, we have ' + recordings.length + ' Aufnahmen!');
  }, []);
  return (
    <Layout>
      <div class="jumbotron">
        <h1>Public Domain Musik</h1>
        <h2>Auf dieser Seite finden Sie Aufnahmen klassischer Musik, die nach deutschem Urheberecht nicht mehr geschützt sind.</h2>
        <input type="search" id="tutorials-filter" placeholder="Suchbegriff eingeben" />
      </div>
      <div>
        <h4>{recordings.length} recordings</h4>
        <div class="colums">
        {recordings.map(recording => (
          <div key={recording.id} class="recordingIsVisible">
            <Link to={`/recordings/${recording.id}/`}>
              <p class="recordingItemLink">{recording.meta.display}</p>
            </Link>
          </div>
        ))}
      </div>
      </div>
    </Layout>
  )
}
