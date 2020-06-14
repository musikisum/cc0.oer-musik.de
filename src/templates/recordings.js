import React from 'react';
import { Link } from 'gatsby';
import { css } from '@emotion/core';
import Layout from '../components/layout';
import { rhythm } from '../utils/typography';

export default ({ pageContext: { recordings } }) => {
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
        <h4>{recordings.length} recordings</h4>
        {recordings.map(recording => (
          <div key={recording.id}>
            <Link
              to={`/recordings/${recording.id}/`}
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
                {recording.meta.display}{' '}
                <span
                  css={css`
                    color: #bbb;
                  `}
                  >
                  — {recording.meta.firstPublished || recording.meta.published}
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
