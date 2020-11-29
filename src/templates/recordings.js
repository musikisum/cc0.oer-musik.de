import React, { useEffect } from 'react';
import { Link } from 'gatsby';
import Layout from '../components/layout';

export default ({ pageContext: { recordings } }) => {
  useEffect(() => {
    alert('I am in the browser, we have ' + recordings.length + ' Aufnahmen!');
  }, []);
  return (
    <Layout>
      <div>
        <h1>Amazing Pandas Eating Things</h1>
        <h4>{recordings.length} recordings</h4>
        {recordings.map(recording => (
          <div key={recording.id}>
            <Link to={`/recordings/${recording.id}/`}>
              <h3>{recording.meta.display} — {recording.meta.firstPublished || recording.meta.published}</h3>
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  )
}
