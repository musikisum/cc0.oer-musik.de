import React from 'react';
import Layout from '../components/layout';

export default ({ pageContext: { recording } }) => {
  return (
    <Layout>
      <div>
        <h1>{recording.meta.display}</h1>
        {recording.tracks.map(track => (
          <div style={{ marginBottom: '10px' }}>
            <div>{track.name}</div>
            <audio src={track.link.url} controls />
          </div>
        ))}
      </div>
    </Layout>
  );
};
