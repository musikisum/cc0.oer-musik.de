import React from "react"
import { useStaticQuery, Link, graphql } from "gatsby"
import "../styles/global.css"

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
          <div class="hamburg">
              <span class="line"></span>
              <span class="line"></span>
              <span class="line"></span>
          </div>
        </div>
        <div id="menuContainer" class="mobileCollapsed container">
          <nav>
            <ul>
             <li><a id="index" class="brand navAnchor" href="/">Home</a></li>
              <li><a id="musik" class="navAnchor" href="/">Zur Musik</a></li>
              <li><a id="about" class="navAnchor" href="/">Zum Projekt</a></li>
              <li><a id="urheberrecht" class="navAnchor" href="/urheberrecht">Urheberrecht</a></li>
              <li><a id="leistungsschutzrecht" class="navAnchor" href="/leistungsschutzrecht">Leistungsschutz</a></li>
              <li><a id="dsgvo" class="navAnchor" href="/dsgvo">DSGVO</a></li>
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
       {/*<footer>
        <div class="danger">
          <p>Please take into account that due to differences in international copyright law, some of the digitized materials on this website may be protected outside of Germany. More information regarding the digitized material can be found in the metadata-sections attached to each recording.</p>
        </div>
       </footer>*/}
    </div>
  )
}

