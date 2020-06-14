import React from 'react';
import { css } from '@emotion/core';
import { Link, graphql } from 'gatsby';
import Layout from '../components/layout';
import { rhythm } from '../utils/typography';

export default () => {
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
        <p>
          Goto <a href="/recordings">recordings</a>
        </p>
      </div>
    </Layout>
  )
}
