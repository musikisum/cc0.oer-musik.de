import "../styles/global.css"
import Navigation from './navigation';
import React, { useState, useEffect } from 'react';
import { useStaticQuery, graphql } from "gatsby"

export default ({ children }) => {

  const [showNav, setShowNav] = useState(false);

  return (
    <div>
      <header>
        <div id="hamburgerRow">
          <div className="hamburg" onClick={() => { setShowNav(!showNav) }}>
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>
        </div>    
        <div id="menuContainer" className="container">
         {!showNav && <Navigation />}
       </div>
      </header>
       <main>
        <div id="mainContainer">
          {children}
        </div>
       </main>
       <footer>
        <div className="internationalCopyrightLawInfo">
          <p>Please take into account that due to differences in international copyright law, some of the digitized materials on this website may be protected outside of Germany/Europe. More information regarding the digitized material can be found in the metadata-sections attached to each recording.</p>
        </div>
       </footer>
    </div>
  )
}
