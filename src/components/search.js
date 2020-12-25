import "../styles/global.css"
import React, { useEffect, useState } from 'react';
import { useStaticQuery, Link, graphql } from "gatsby"

export default ({ recordings }) => {
  useEffect(() => {
    alert('I am in the browser, we have ' + recordings.length + ' Aufnahmen!');
  }, []);
  return (
  	<input class="searchInput" type="search" id="tutorials-filter" placeholder="Suchbegriff eingeben" />
  )
}