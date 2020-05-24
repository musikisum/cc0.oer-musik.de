const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === 'SoundInfoItem') {
    createNodeField({
      node,
      name: 'slug',
      value: `/recordings/${node.id}/`
    });
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allSoundInfoItem {
        nodes {
          id
          fields {
            slug
          }
          tracks {
            fileName
            key
            name
          }
          meta {
            composition
            cdId
            title
            artists
            annotations
            country
            display
            firstPublished
            format
            label
            license
            published
          }
        }
      }
    }
  `);

  result.data.allSoundInfoItem.nodes.forEach(node => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/recording.js`),
      context: {
        id: node.id
      },
    });
  });
}
