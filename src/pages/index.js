import React from "react"
import { css } from "@emotion/core"
import { Link, graphql } from "gatsby"
import { rhythm } from "../utils/typography"
import Layout from "../components/layout"

export default ({ data }) => {
  return (
    <Layout>
      <div>
        <h1
          css={css`
            display: inline-block;
            border-bottom: 1px solid;
          `}
        >
          Amazing Pandas Eating Things
        </h1>
        <h4>{data.allSoundInfoItem.totalCount} recordings</h4>
        {data.allSoundInfoItem.nodes.map(node => (
          <div key={node.id}>
            <Link
              to={node.fields.slug}
              css={css`
                text-decoration: none;
                color: inherit;
              `}
            >
              <h3
                css={css`
                  margin-bottom: ${rhythm(1 / 4)};
                `}
              >
                {node.meta.display}{" "}
                <span
                  css={css`
                    color: #bbb;
                  `}
                >
                  — {node.meta.firstPublished || node.meta.published}
                </span>
              </h3>
              <p>etc.</p>
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allSoundInfoItem(sort: { fields: meta___display }) {
      nodes {
        id
        fields {
          slug
        }
        meta {
          display
          firstPublished
          published
        }
      }
    }
  }
`;
