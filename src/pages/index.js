import React from 'react';
import Layout from '../components/layout';

export default () => {
  return (
    <Layout>
    	<div className="jumbotron">
        <h1>Public Domain Musik</h1>
        <h2>Auf dieser Seite finden Sie Aufnahmen klassischer Musik, die nach deutschem Urheberecht nicht mehr geschützt sind.</h2>
        <p>Die im Aufbau befindliche Sammlung besteht aus Digitalisaten von Schallplatten und CD's, auf denen Aufnahmen zu hören sind, die erstmalig vor dem 1. Januar 1963 aufgenommen und veröffentlicht worden sind. Weitere Informationen finden Sie auf den Seiten zum Urheberrecht und zum Leistungsschutzrecht.</p>
        <a className="btn btn-ob" href="/recordings">Zu den Aufnahmen...</a>
      </div>      
    </Layout>
  )
}
