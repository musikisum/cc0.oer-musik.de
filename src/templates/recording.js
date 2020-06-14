import React from 'react';
import Layout from '../components/layout';

export default ({ pageContext: { recording } }) => {
  return (
    <Layout>
      <div>
        <h1>{recording.meta.display}</h1>
      </div>
    </Layout>
  );
};
