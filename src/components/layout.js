import "../styles/global.css"
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

  return (
    <div>
      <header>
        <div id="hamburgerRow">
          <div className="hamburg">
              <span className="line"></span>
              <span className="line"></span>
              <span className="line"></span>
          </div>
        </div>
        <div id="menuContainer" className="mobileCollapsed container">
          <nav id="mainMenu">
            <ul>
             <li><Link to="/" activeClassName="active">PD Musik</Link></li>
              <li><Link to="/about/" activeStyle={{ background: "#4a6b8a" }}>Projekt</Link></li>
              <li><Link to="/urheberrecht/" activeStyle={{ background: "#4a6b8a" }}>Urheberrecht</Link></li>
              <li><Link to="/leistungsschutzrecht/" activeStyle={{ background: "#4a6b8a" }}>Leistungsschutzrecht</Link></li>
              <li><Link to="/dsgvo/" activeStyle={{ background: "#4a6b8a" }}>DSGVO</Link></li>
              <li><a href="http://oer-musik.de">oer-musik.de</a></li>
            </ul>
          </nav>
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
