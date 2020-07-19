const path = require('path');

module.exports = {
  siteMetadata: {
    title: 'Public Domain Musik',
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'src',
        path: `${__dirname}/src/`
      },
    }
  ]
}
