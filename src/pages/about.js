import React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/layout';

export default ({ data }) => (

  <Layout>
    <h1>Zum Projekt ›{data.site.siteMetadata.title}‹</h1>
    <p>
       Meine Motivation, auf dieser Seite kostenlos gemeinfreie Musik im Sinne der CC0-Lizenz zur Verfügung zu stellen, liegt darin, dass ich Musik als Kulturgut ansehe, das im Rahmen eines fair-use bzw. einer lebendigen Musikkultur sowie in der Musikerziehung jedem Menschen frei zur Verfügung stehen sollte. Im Bereich der Musik ist das derzeit aufgrund des Urheberrechts leider nur mit Werken möglich, deren Urheber länger als 70 Jahre tot und deren Erstveröffentlichungen vor 1963 erfolgt sind. Weitere Infomationen entnehmen Sie bitte den Seiten zum <Link to="urheberrecht">Urheberrecht</Link> und zum <Link to="leistungsschutzrecht">Leistungsschutzrecht</Link>. Mehr über dieses Projekt können Sie über das nachfolgende Video und die Präsentation erfahren:
    </p>
    <div className="videoContainer">
      <video controls>
        <source src="https://kaiser-ulrich.de/publicfiles/oer-videos/cc0.oer-musik.de.mp4" type="video/mp4" />
      </video>
    </div>
    <h2>Zu den Aufnahmen</h2>
    <p>
      Einige der digitalisierten Schallplatten waren in einem sehr guten Zustand (hören Sie hierzu z.B. d-Moll Chaconne für Violine solo von J. S. Bach), andere Platten hingegen in einem schlechten. Bei der Bearbeitung entstehen dabei insbesondere durch die Anwendung des DeNoiser-Plugins Artefakte, so dass immer wieder ein Kompromiss zwischem störenden Rauschen und verzerrenden Artefakten (vorwiegend an leisen Stellen) gefunden werden musste. Eine Entscheidung in dieser Sache ist sicherlich eine Frage des Geschmacks, des Zeit- und Ressourceneinsatzes, die Sie vielleicht anders gefällt hätten. Aus diesem Grunde werden von der BSB auch die unbearbeiteten Digitalisierungen archiviert (WAV), so dass zukünftig andere Lösung bei der Bearbeitung gefunden werden können.<br />
      Ziel meiner Digitalisierung ist es nicht, möglichst originale Reproduktionen für Performancestudies, sondern brauchbare und urheberrechtsfreie Aufnahmen für pädagogische Zwecke bereitzustellen. Aus diesem Grunde passe ich den Klangeindruck älterer Aufnahmen an moderne Hörgewohnheiten an.
     </p>
     <h3>Verwendetes Equipment</h3>
     <p>
        Audio Technika AT-LP 120 USB<br />
        Nowsonik Phonix<br />
        RME Fireface<br />
        WaveLab Studio 6<br />
        Cubase 10 (64 bit) / Nuendo 11<br />
        Acon Restauration Suite<br />
        UAD- und FabFilter-Plugins
     </p>
  </Layout>
)

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`