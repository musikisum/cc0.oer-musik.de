import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

export default ({ data }) => {
  const { id, fields, meta, tracks } = data.soundInfoItem;
  return (
    <Layout>
      <div>
        <h1>{meta.display}</h1>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($id: String!) {
    soundInfoItem(id: { eq: $id }) {
      id
      fields {
        slug
      }
      meta {
        annotations
        artists
        cdId
        composition
        country
        display
        firstPublished
        format
        label
        license
        published
        title
      }
      tracks {
        fileName
        key
        name
      }
    }
  }
`;
