import "../styles/global.css"
import Hamburger from './hamburger';
import Navigation from './navigation';
import React, { useState, useEffect } from 'react';
import { useStaticQuery, Link, graphql } from "gatsby"

export default ({ children }) => {
  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  )

  const [showNav, setShowNav] = useState(false);

  return (
    <div>
      <header>
        <Hamburger />      
        <div id="menuContainer" className="mobileCollapsed container">
         {!showNav && <Navigation />}
       </div>
      </header>
       <main>
        <div id="mainContainer">
          {children}
        </div>
       </main>
       <footer>
        <div className="danger">
          <p>Please take into account that due to differences in international copyright law, some of the digitized materials on this website may be protected outside of Germany/Europe. More information regarding the digitized material can be found in the metadata-sections attached to each recording.</p>
        </div>
       </footer>
    </div>
  )
}
