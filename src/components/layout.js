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
         <li><a id="index" class="brand navAnchor" href="/index.html">Home</a></li>
          <li><a id="musik" class="navAnchor" href="/musik.html">Musik</a></li>
          <li><a id="bilder" class="navAnchor" href="/bilder.html">Bilder</a></li>
          <li><a id="about" class="navAnchor" href="/about.html">Das Projekt</a></li>
          <li><a id="urheberrecht" class="navAnchor" href="/urheberrecht.html">Urheberrecht</a></li>
          <li><a id="leistungsschutzrecht" class="navAnchor" href="/leistungsschutzrecht.html">Leistungsschutz</a></li>
          <li><a id="dsgvo" class="navAnchor" href="/dsgvo.html">DSGVO</a></li>
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
     <div class="container">

     </div>
   </footer>
</div>
  )
}

