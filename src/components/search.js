import "../styles/global.css"
import React, { useEffect, useState } from 'react';
import { useStaticQuery, Link, graphql } from "gatsby"

export default ({ recordings }) => {
  useEffect(() => {
    console.log('I am in the browser, we have ' + recordings.length + ' Aufnahmen!');
  }, []);
  return (
  	<input className="searchInput" type="search" id="tutorials-filter" placeholder="Suchbegriff eingeben" />
  )
}