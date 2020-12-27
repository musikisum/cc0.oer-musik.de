import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';

export default ({ data }) => (
  <Layout>
    <h1>Zum Projekt <span className="obHighlighted">{data.site.siteMetadata.title}</span></h1>
    <p>Hier wird in Kürze eine Projektbeschreibung ergänzt...</p> 
  </Layout>
)

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`