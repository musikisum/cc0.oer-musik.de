import React from 'react';
import Layout from '../components/layout';

export default () => {
  return (
    <Layout>
    	<div className="jumbotron">
        <h1>Public Domain Musik</h1>
        <h2>Auf dieser Seite finden Sie Aufnahmen klassischer Musik, die nach deutschem Urheberecht nicht mehr geschützt sind.</h2>
        <a className="btn btn-ob" href="/recordings">Zu den Aufnahmen...</a>
      </div>
    </Layout>
  )
}
