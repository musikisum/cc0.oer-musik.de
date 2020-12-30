import "../styles/global.css"
import Navigation from './navigation';
import React, { useState } from 'react';

export default ({ children }) => {

  const [showNav, setShowNav] = useState(false);
  const [showCopyrightInfo, setShowCopyrightInfo] = useState(true);

  return (
    <div>
      <header>
        <div id="hamburgerRow">
          <div className={`hamburg ${showNav ? 'checked' : ''}`} onClick={() => { setShowNav(!showNav) }}>
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>
        </div>
        <Navigation className="navigation" mobileExpanded={showNav} />
      </header>
      <main className="mainContainer">
        {children}
      </main>
      <footer>
        <div className={`internationalCopyrightLawInfo ${showCopyrightInfo ? '' : 'hideCopyrightInfo'}`}>
          <span onClick={() => { setShowCopyrightInfo(false) }}>X</span>
          <p>Please take into account that due to differences in international copyright law, some of the digitized materials on this website may be protected outside of Germany/Europe. More information regarding the digitized material can be found in the metadata-sections attached to each recording.</p>
        </div>
      </footer>
    </div>
  )
}
