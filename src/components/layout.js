import React from "react"
import "../styles/global.css"
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
          <nav>
            <ul>
             <li><a id="index" className="brand navAnchor" href="/">PD Musik</a></li>
              <li><a id="about" className="navAnchor" href="/about">Zum Projekt</a></li>
              <li><a id="urheberrecht" className="navAnchor" href="/urheberrecht">Urheberrecht</a></li>
              <li><a id="leistungsschutzrecht" className="navAnchor" href="/leistungsschutzrecht">Leistungsschutz</a></li>
              <li><a id="dsgvo" className="navAnchor" href="/dsgvo">DSGVO</a></li>
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

