import React from 'react';
import { Link } from "gatsby"
import "../styles/global.css"

export default () => (<nav id="mainMenu">
											  <ul>
											   <li><Link to="/" activeClassName="active">PD Musik</Link></li>
											    <li><Link to="/about/" activeStyle={{ background: "#4a6b8a" }}>Projekt</Link></li>
											    <li><Link to="/urheberrecht/" activeStyle={{ background: "#4a6b8a" }}>Urheberrecht</Link></li>
											    <li><Link to="/leistungsschutzrecht/" activeStyle={{ background: "#4a6b8a" }}>Leistungsschutzrecht</Link></li>
											    <li><Link to="/dsgvo/" activeStyle={{ background: "#4a6b8a" }}>DSGVO</Link></li>
											    <li><a href="http://oer-musik.de">oer-musik.de</a></li>
											  </ul>
											</nav>)