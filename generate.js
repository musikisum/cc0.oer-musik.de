'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT      = __dirname;
const DATA_JSON = path.join(ROOT, 'data', 'json');
const STATIC    = path.join(ROOT, 'static');
const DIST      = path.join(ROOT, 'dist');

function mkdirp(dir) { fs.mkdirSync(dir, { recursive: true }); }

function copyDir(src, dest) {
  mkdirp(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function writeHtml(filePath, content) {
  mkdirp(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

function esc(s) {
  if (!s) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function loadRecordings() {
  return fs.readdirSync(DATA_JSON)
    .filter(f => f.endsWith('.txt'))
    .sort()
    .map(f => JSON.parse(fs.readFileSync(path.join(DATA_JSON, f), 'utf8')));
}

const NAV = [
  { href: '/',                       label: 'PD Musik' },
  { href: '/about/',                 label: 'Projekt' },
  { href: '/urheberrecht/',          label: 'Urheberrecht' },
  { href: '/leistungsschutzrecht/',  label: 'Leistungsschutzrecht' },
  { href: '/dsgvo/',                 label: 'DSGVO' },
  { href: 'http://oer-musik.de',     label: 'oer-musik.de' }
];

function navHtml(active) {
  const items = NAV.map(item =>
    `<li><a href="${item.href}"${item.href === active ? ' class="active"' : ''}>${item.label}</a></li>`
  ).join('\n      ');
  return `<nav id="mainNav" class="mobileExpanded">
    <ul>
      ${items}
    </ul>
  </nav>`;
}

function layout(title, active, body) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} – cc0.oer-musik.de</title>
  <link rel="icon" href="/images/favicon/favicon.ico">
  <link rel="stylesheet" href="/style.css">
</head>
<body>
<header>
  <div id="hamburgerRow">
    <div class="hamburg" id="hamburger">
      <span class="line"></span>
      <span class="line"></span>
      <span class="line"></span>
    </div>
  </div>
  ${navHtml(active)}
</header>
<main class="mainContainer">
${body}
</main>
<footer>
  <div class="internationalCopyrightLawInfo" id="copyrightBanner">
    <span onclick="this.parentElement.classList.add('hideCopyrightInfo')">X</span>
    <p>Please take into account that due to differences in international copyright law, some of the digitized materials on this website may be protected outside of Germany/Europe. More information regarding the digitized material can be found in the metadata-sections attached to each recording.</p>
  </div>
</footer>
<script>
  document.getElementById('hamburger').addEventListener('click', function() {
    this.classList.toggle('checked');
    document.getElementById('mainNav').classList.toggle('mobileExpanded');
  });
</script>
</body>
</html>`;
}

function genIndex(recordings) {
  const searchable = recordings.map(r => ({
    id: r.id,
    display: r.meta.display || '',
    search: [r.meta.display, r.meta.cdId, r.meta.composition, r.meta.format,
             r.meta.artists, r.meta.published, r.meta.firstPublished]
      .filter(Boolean).join(' ').toLowerCase()
  }));

  const body = `<div class="jumbotron">
  <h1>Public Domain Musik</h1>
  <h2>Auf dieser Seite finden Sie Aufnahmen klassischer Musik, die nach deutschem Urheberrecht nicht mehr geschützt sind.
    Aktuell sind <span class="obHighlighted">&nbsp;${recordings.length.toLocaleString('de-DE')} Werke&nbsp;</span> verfügbar!</h2>
  <hr />
  <input class="searchInput" type="search" id="searchInput" placeholder="Suchbegriff eingeben" oninput="filter()" />
</div>
<div class="colums" id="list"></div>
<script>
const data = ${JSON.stringify(searchable)};
function filter() {
  const tokens = document.getElementById('searchInput').value.trim().toLowerCase().split(/\\s+/).filter(Boolean);
  const must = tokens.filter(t => !t.startsWith('-'));
  const not  = tokens.filter(t => t.startsWith('-')).map(t => t.slice(1)).filter(Boolean);
  const out = tokens.length
    ? data.filter(r => must.every(t => r.search.includes(t)) && not.every(t => !r.search.includes(t)))
    : data;
  document.getElementById('list').innerHTML = out.map(r =>
    '<div class="recordingIsVisible"><a href="/' + r.id + '/"><p class="recordingItemLink">' +
    r.display.replace(/&/g,'&amp;').replace(/</g,'&lt;') + '</p></a></div>'
  ).join('');
}
filter();
</script>`;
  return layout('Public Domain Musik', '/', body);
}

function genRecording(rec) {
  const m = rec.meta;
  const rows = [
    ['ID',                           esc(m.filename)],
    ['Tonträger-Titel',              esc(m.title)],
    ['Label',                        esc(m.label)],
    m.firstPublished ? ['Erstveröffentlichung/-aufnahme', esc(m.firstPublished)] : null,
    ['Erscheinungsdatum',            esc(m.published)],
    m.format ? ['Format', esc(m.format) + (m.country ? ', Land: ' + esc(m.country) : '')] : null,
    m.composition ? ['Trackliste',   esc(m.composition)] : null,
    ['Lizenz', '<a href="https://creativecommons.org/publicdomain/zero/1.0/deed.de">' + esc(m.license) + '</a>']
  ].filter(Boolean);

  const tracksHtml = rec.tracks.map(t => {
    const src = t.hmtLink ? t.hmtLink.url : '';
    const bsb = t.bsbLink ? `<div>archiviert durch die Bayerische Staatsbibliothek: <a href="${t.bsbLink.url}">Link</a></div>` : '';
    return `    <div class="trackAudio">
      <div><audio src="${src}" controls></audio></div>
      <div class="trackTitle"><b>${esc(t.name)}</b></div>
      ${bsb}
    </div>`;
  }).join('\n');

  const body = `<div class="track">
  <a href="/" class="closeX"><span>X</span></a>
  <h2>${esc(m.display || '')}</h2>
  <hr />
  ${rows.map(([k, v]) => `<div><span class="metaInfo">${k}:</span> ${v}</div>`).join('\n  ')}
  <hr />
  <div class="trackAudioContainer">
${tracksHtml}
  </div>
  <hr />
  <p><span class="metaInfo">Angabe zu den Ausführenden:</span><br />${esc(m.artists || '')}</p>
</div>`;

  return layout(esc(m.display || rec.id), '/' + rec.id + '/', body);
}

function genAbout() {
  const body = `<h1>Zum Projekt ›cc0.oer-musik.de‹</h1>
<p>
  Meine Motivation, auf dieser Seite kostenlos gemeinfreie Musik im Sinne der CC0-Lizenz zur Verfügung zu stellen, liegt darin, dass ich Musik als Kulturgut ansehe, das im Rahmen eines fair-use bzw. einer lebendigen Musikkultur sowie in der Musikerziehung jedem Menschen frei zur Verfügung stehen sollte. Im Bereich der Musik ist das derzeit aufgrund des Urheberrechts leider nur mit Werken möglich, deren Urheber länger als 70 Jahre tot und deren Erstveröffentlichungen vor 1963 erfolgt sind. Weitere Infomationen entnehmen Sie bitte den Seiten zum <a href="/urheberrecht/">Urheberrecht</a> und zum <a href="/leistungsschutzrecht/">Leistungsschutzrecht</a>. Mehr über dieses Projekt können Sie über das nachfolgende Video und die Präsentation erfahren:
</p>
<div class="videoContainer">
  <video controls>
    <source src="/files/cc0.oer-musik.de.mp4" type="video/mp4" />
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
</p>`;
  return layout('Zum Projekt', '/about/', body);
}

function genDsgvo() {
  const body = `<p class="dsgvo-annotation">
  <b>Bitte beachten Sie:</b> Diese Webseite dient ausschließlich als Interface zum Anhören und Herunterladen von Sounddateien via Deeplinking sowie der Kontaktaufnahme mit dem Verantwortlichen für die Domain cc0-oer-musik.de (Prof. Dr. Ulrich Kaiser). Die Sounddateien liegen auf einem Servern der <a href="http://www.musikhochschule-muenchen.de">Hochschule für Musik und Theater München</a> bzw. der <a href="https://www.bsb-muenchen.de/">Bayerischen Staatsbiliothek</a>. Wenn Sie Fragen an die Verantwortlichen dieser beiden Institutionen zu den Soundfiles haben, wenden Sie sich bitte an die <a href="https://www.hmtm.de/de/hochschule/organisation/hochschulleitung">Vertretung des Kanzlers</a> der Hochschule für Musik und Theater München oder an die <a href="https://www.bsb-muenchen.de/recherche-und-service/fragen-und-antworten/online-auskunft/">Bayerische Staatsbibliothek</a>.<br />
  Informationen zur Rechtmäßigkeit dieses Angebots finden Sie in den Ausführungen zum <a href="/urheberrecht/">Urheberrecht</a> und zum <a href="/leistungsschutzrecht/">Leistungsschutzrecht</a>.<br />
  Falls Sie darüber hinausgehende Informationen zum Datenschutz auf <i>cc0.oer-musik.de</i> haben, können Sie mich über die nachstehend angegebenen Möglichkeiten kontaktieren.
</p>
<h1>DSGVO / Impressum</h1>
<h2>Datenschutzerklärung (nach DSGVO)</h2>
<p>
  Unsere Website ist ein Angebot im Sinne des <a href="https://www.gesetze-im-internet.de/tmg/TMG.pdf" rel="noopener">Telemediengesetzes (TMG)</a>.<br />
  Durch Aufruf und Nutzung dieser Seite übermitteln Sie auch Daten an uns. Der Umgang mit diesen Daten wird geregelt durch das TMG, die <a href="https://eur-lex.europa.eu/legal-content/DE/TXT/PDF/?uri=CELEX:32016R0679&rid=1" rel="noopener">Datenschutz-Grundverordnung der EU (DSGVO – VO(EU)2016/679)</a>, die <a href="https://eur-lex.europa.eu/legal-content/DE/TXT/PDF/?uri=CELEX:32002L0058&from=DE" rel="noopener">Richtlinie 2002/58/EG</a> und das <a href="https://www.bgbl.de/xaver/bgbl/start.xav?start=%2F%2F*%5B%40attr_id%3D%27bgbl117s2097.pdf%27%5D#__bgbl__%2F%2F*%5B%40attr_id%3D%27bgbl117s2097.pdf%27%5D__1527175363895" rel="noopener">Bundesdatenschutzgesetz (BDSG)</a>.<br />
  Eine dieser Vorschriften ist die Information der Nutzer über den Datenschutz bei der Erhebung und Verarbeitung personenbezogener Daten. Ihr entsprechen wir ausführlich auf dieser Seite, Stand 1. Januar 2021.
</p>
<ol>
  <li>Name und Kontaktdaten des für die Verarbeitung Verantwortlichen und Ihres Ansprechpartners</li>
  <li>Umfang und Zweck der Datenerhebung</li>
  <li>wie und wo wir Ihre Daten verarbeiten und speichern</li>
  <li>Ihre Rechte (Betroffenenrechte)</li>
  <li>mehr über unsere Links und Dienste Dritter</li>
</ol>
<h3>1) Name und Anschrift des für die Verarbeitung Verantwortlichen und Ihres Ansprechpartners</h3>
<p>Der für die Verarbeitung Verantwortliche und Ihr Ansprechpartner ist Prof. Dr. Ulrich Kaiser.</p>
<p>
  dienstl: <a href="http://www.musikhochschule-muenchen.de/">Hochschule für Musik und Theater München</a><br />
  Arcisstr. 12, 80333 München<br />
  Telefon: +49 89 289 27427<br />
  E-Mail: Bitte verwenden Sie das <a href="http://website.musikhochschule-muenchen.de/de/index.php?option=com_contact&task=view&contact_id=92&Itemid=813">Formular</a><br />
  oder schreiben Sie eine Mail an <a href="mailto:ulrich.kaiser@hmtm.de">ulrich.kaiser[at]hmtm.de</a>
</p>
<h3>2) Umfang und Zweck der Datenerhebung</h3>
<h4>Bereitstellung der Website und Erstellung von Logfiles</h4>
<p>
  Diese Seite wird über Cloudflare Pages bereitgestellt. Bei jedem Aufruf unserer Internetseite können folgende Daten durch Serverlogfiles erhoben werden:
</p>
<ol>
  <li>IP-Adresse und Hostname</li>
  <li>Zugriffszeitpunkt</li>
  <li>vom Besucher verwendeter Browser</li>
  <li>vom Besucher verwendetes Betriebssystem</li>
  <li>Herkunftslink bzw. -URL</li>
  <li>Verweildauer</li>
  <li>Anzahl aufgerufener Seiten</li>
  <li>zuletzt geöffnete Seite vor dem Verlassen der Website</li>
</ol>
<h4>Rechtsgrundlage für die Datenverarbeitung</h4>
<p>
  Rechtsgrundlage für die vorübergehende Speicherung der Daten und der Logfiles ist Art. 6 Abs. 1 lit. f DSGVO.<br />
  Die vorübergehende Speicherung der IP-Adresse durch das System ist notwendig, um eine Auslieferung der Website an den Rechner des Nutzers zu ermöglichen. Hierfür muss die IP-Adresse des Nutzers für die Dauer der Sitzung gespeichert bleiben.<br />
  In diesen Zwecken liegt auch unser berechtigtes Interesse an der Datenverarbeitung nach Art. 6 Abs. 1 lit. f DSGVO.
</p>
<h4>Umfang der Verarbeitung personenbezogener Daten</h4>
<p>
  Personenbezogene Daten von Nutzern werden grundsätzlich nur verarbeitet, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie der Inhalte und Leistungen erforderlich ist.
</p>
<h3>3) Wie und wo wir Ihre Daten verarbeiten und speichern</h3>
<p>
  Die vorübergehende Speicherung der IP-Adresse durch das System ist notwendig, um eine Auslieferung der Website an den Rechner des Nutzers zu ermöglichen. Hierfür muss die IP-Adresse des Nutzers für die Dauer der Sitzung gespeichert bleiben.<br />
  Die Speicherung in Logfiles erfolgt, um die Funktionsfähigkeit der Website sicherzustellen.
</p>
<h4>Dauer der Speicherung</h4>
<p>
  Die Daten werden gelöscht, sobald sie für die Erreichung des Zweckes ihrer Erhebung nicht mehr erforderlich sind. Im Falle der Erfassung der Daten zur Bereitstellung der Website ist dies der Fall, wenn die jeweilige Sitzung beendet ist.
</p>
<h3>4) Ihre Rechte (Rechte der betroffenen Person)</h3>
<p>Sie haben das Recht auf Auskunft, Berichtigung, Einschränkung der Verarbeitung, Löschung, Datenübertragbarkeit und Widerspruch. Außerdem haben Sie das Recht auf Beschwerde bei einer Aufsichtsbehörde.</p>
<h2>Impressum</h2>
<h3>Angaben gemäß § 5 TMG und verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</h3>
<address>
  <span>Prof. Dr. Ulrich Kaiser</span><br />
  <span>Birkenstr. 39c</span><br />
  <span>85757 Karlsfeld</span>
</address>
<h4>Kontakt:</h4>
<address>
  <span>Telefon: +49 8131 272918</span><br />
  <span>Mail: s.o.</span>
</address>
<h4>Steuer Nr. 107/234/30440</h4>
<p>
  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="http://ec.europa.eu/consumers/odr">http://ec.europa.eu/consumers/odr</a><br />
  Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
</p>
<h4>Haftung für Links</h4>
<p>Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>
<h4>Widerspruch Werbe-Mails</h4>
<p>
  Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten zur Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit widersprochen.
</p>
<p>Quelle: <a href="https://www.e-recht24.de/">eRecht24</a></p>`;
  return layout('DSGVO / Impressum', '/dsgvo/', body);
}

function genUrheberrecht() {
  const body = `<h1>Zum Urheberrecht (in Deutschland und der EU)</h1>
<p>
  Informationen zu dem für die Tonträgerdigitalisierung wichtigen Leistungsschutzrecht finden Sie <a href="/leistungsschutzrecht/">hier</a>.
</p>
<p>
  Das Urheberrecht soll in dem Interessenskonflikt vermitteln, der zwischen den Rechten von Urhebern sowie dem Interesse der Allgemeinheit an freiem Umgang mit Inhalten besteht. Die Rechte und der Schutz geistigen Eigentums in ideeller und materieller Hinsicht wird deshalb und im Unterschied zu zivilrechtlichem Eigentum nicht absolut, sondern nur für eine bestimmte Zeit gewährt. Diese ›Zeitschranke‹ wiederum soll gewährleisten, dass geistige Schöpfungen nicht aus ihrem Kontext bzw. der sie umgebenden Kultur herausgehalten werden können, sondern auf Dauer Teil des gesellschaftlichen Diskurses bleiben. Es wurde daher festgelegt, dass geistige Schöpfungen als Mitteilungsgut nach Ablauf einer gewissen Zeitspanne gemeinfrei werden sollen. Materialien zur Entwicklung des Urheberrecht werden vom <a href="https://www.urheberrecht.org/institut/">Institut für Urheberrecht und Medienrecht</a> auf der Seite <a href="http://www.urheberrecht.org/law/normen/urhg/">Urheberrechtsgesetz</a> bereitgestellt.<br />
  Im folgenden finden Sie eine Synopse der für meine Open-Educational-Resources-Projekte wichtigen Paragraphen des Urheberrechts. Dabei ist auffällig, dass in Deutschland der Schutz des Urhebers von Anfang an ein hohes Schutzniveau hatte (70 Jahre nach dem Tode des Urhebers), während die ›Verwandten Schutzrechte‹ wie das Leistungsschutzrecht für die Hersteller eines Tonträgers wiederholt verlängert und aktuell auf das Schutzniveau des Urhebers gebracht worden sind.
</p>
<hr />
<div class="threeColumns">
  <div>
    <b>§ 64 Allgemeines (UrhG vom 9. September 1965)</b><br />
    <i>
      (1) Das Urheberrecht erlischt <span class="highlighted">siebzig Jahre</span> nach dem Tode des Urhebers.<br />
      (2) Wird ein nachgelassenes Werk nach Ablauf von sechzig, aber vor Ablauf von siebzig Jahren nach dem Tode des Urhebers veröffentlicht, so erlischt das Urheberrecht erst 10 Jahre nach Veröffentlichung.
    </i>
  </div>
  <div>
    <b>§ 64 Allgemeines (Drittes Gesetz zur Änderung des Urheberrechts 1995)</b><br />
    <i>
      Das Urheberrecht erlischt <span class="highlighted">siebzig Jahre</span> nach dem Tode des Urhebers.<br />
      § 64 geändert durch das Gesetz vom 23.06.1995, BGBI. S S. 842.
    </i>
  </div>
  <div>
    <b>§ 64 Allgemeines (Neuntes Gesetz zur Änderung des Urheberrechts 2013)</b><br />
    <i>
      Das Urheberrecht erlischt <span class="highlighted">siebzig Jahre</span> nach dem Tode des Urhebers.
    </i>
  </div>
</div>
<hr />
<div class="threeColumns">
  <div>
    <b>§ 69 Berechnung der Fristen (UrhG vom 9. September 1965)</b><br />
    <i>Die Fristen dieses Abschnitts beginnen mit dem Ablauf des Kalenderjahres, in dem das für den Beginn der Frist maßgebende Ereignis eingetreten ist.</i>
  </div>
  <div>
    <b>§ 69 Berechnung der Fristen (Drittes Gesetz zur Änderung des Urheberrechts 1995)</b><br />
    <i>Die Fristen dieses Abschnitts beginnen mit dem Ablauf des Kalenderjahres, in dem das für den Beginn der Frist maßgebende Ereignis eingetreten ist.</i>
  </div>
  <div>
    <b>§ 69 Berechnung der Fristen (Neuntes Gesetz zur Änderung des Urheberrechts 2013)</b><br />
    <i>Die Fristen dieses Abschnitts beginnen mit dem Ablauf des Kalenderjahres, in dem das für den Beginn der Frist maßgebende Ereignis eingetreten ist.</i>
  </div>
</div>
<hr />
<div class="threeColumns">
  <div>
    <b>§ 85 Vervielfältigungs- und Verbreitungsrecht (UrhG vom 9. September 1965)</b><br />
    <i>
      (1) Der Hersteller eines Tonträgers hat das ausschließliche Recht, den Tonträger zu vervielfältigen und zu verbreiten. Ist der Tonträger in einem Unternehmen hergestellt worden, so gilt der Inhaber des Unternehmens als Hersteller. Das Recht entsteht nicht durch Vervielfältigung eines Tonträgers.<br />
      (2) Das Recht erlischt <span class="highlighted">fünfundzwanzig Jahre nach dem Erscheinen des Tonträgers</span>, jedoch bereits fünfundzwanzig Jahre nach der Herstellung, wenn der Tonträger innerhalb dieser Frist nicht erschienen ist. Die Frist ist nach § 69 zu berechnen.<br />
      (3) Die Vorschriften des Sechsten Abschnitts des Ersten Teils mit Ausnahme des § 61 sind sinngemäß anzuwenden.
    </i>
  </div>
  <div>
    <b>§ 85 Vervielfältigungs- und Verbreitungsrecht (Drittes Gesetz zur Änderung des Urheberrechts 1995)</b><br />
    <i>
      (1) Der Hersteller eines Tonträgers hat das ausschließliche Recht, den Tonträger zu vervielfältigen und zu verbreiten. Ist der Tonträger in einem Unternehmen hergestellt worden, so gilt der Inhaber des Unternehmens als Hersteller. Das Recht entsteht nicht durch Vervielfältigung eines Tonträgers.<br />
      (2) Das Recht erlischt <span class="highlighted">fünfzig Jahre nach dem Erscheinen des Tonträgers</span> oder, wenn seine erste erlaubte Benutzung zur öffentlichen Wiedergabe früher erfolgt ist, nach dieser, jedoch bereits fünfzig Jahre nach der Herstellung, wenn der Tonträger innerhalb dieser Frist nicht erschienen oder erlaubterweise zur öffentlichen Wiedergabe benutzt worden ist. Die Frist ist nach § 69 zu berechnen.<br />
      (3) § 27 Abs. 2 und 3 sowie die Vorschriften des Sechsten Abschnitts des Ersten Teils mit Ausnahme des § 61 sind entsprechend anzuwenden.
    </i>
  </div>
  <div>
    <b>§ 85 Vervielfältigungs- und Verbreitungsrecht (Neuntes Gesetz zur Änderung des Urheberrechts 2013)</b><br />
    <i>
      (1) Der Hersteller eines Tonträgers hat das ausschließliche Recht, den Tonträger zu vervielfältigen, zu verbreiten und öffentlich zugänglich zu machen. Ist der Tonträger in einem Unternehmen hergestellt worden, so gilt der Inhaber des Unternehmens als Hersteller. Das Recht entsteht nicht durch Vervielfältigung eines Tonträgers.<br />
      (2) Das Recht ist übertragbar. Der Tonträgerhersteller kann einem anderen das Recht einräumen, den Tonträger auf einzelne oder alle der ihm vorbehaltenen Nutzungsarten zu nutzen. § 31 und die §§ 33 und 38 gelten entsprechend.<br />
      (3) Das Recht erlischt <span class="highlighted">70 Jahre nach dem Erscheinen des Tonträgers</span>. Ist der Tonträger innerhalb von 50 Jahren nach der Herstellung nicht erschienen, aber erlaubterweise zur öffentlichen Wiedergabe benutzt worden, so erlischt das Recht 70 Jahre nach dieser. Ist der Tonträger innerhalb dieser Frist nicht erschienen oder erlaubterweise zur öffentlichen Wiedergabe benutzt worden, so erlischt das Recht 50 Jahre nach der Herstellung des Tonträgers. Die Frist ist nach § 69 zu berechnen.<br />
      (4) § 10 Abs. 1 und § 27 Abs. 2 und 3 sowie die Vorschriften des Teils 1 Abschnitt 6 gelten entsprechend.
    </i>
  </div>
</div>
<div>
  <p><b>Anmerkung zur Fristberechnung § 69:</b> Die Frist beginnt nicht mit dem Todesdatum des Urhebers, sondern es handelt sich um eine Jahresfrist, die erst mit dem darauf folgenden Kalenderjahr zu zählen beginnt. Dementsprechend endet ein Urheberrecht immer mit dem 31.12. Beispiel: Richard Strauß ist am 8. September 1949 gestorben, die Schutzfrist von 70 Jahren beginnt mit dem 01.01.1950 und endet aufgrund der Jahresfrist in der Silvesternacht am 31.12.2019.</p>
</div>
<hr />`;
  return layout('Urheberrecht', '/urheberrecht/', body);
}

function genLeistungsschutzrecht() {
  const body = `<h1>Zum Leistungsschutzrecht (in Deutschland und der EU)</h1>
<p>
  Teil des Urheberrechts sind die sogenannten ›Verwandten Schutzrechte‹ (§§ 70 ff.) wie beispielsweise die Rechte für die Hersteller von Tonträgern, die für dieses Projekt von besonderer Bedeutung sind. Das Recht der ausübenden Künstler und der Tonträgerhersteller wurde dabei maßgeblich durch Richtlinien der Europäischen Union beeinflusst.<br />
  Eine Richtlinie ist ein Rechtsakt der Europäischen Union, der in den EU-Mitgliedländern nicht unmittelbar gilt, sondern der innerhalb einer Frist von derzeit zwei Jahren in nationales Recht umgesetzt werden muss. Für die Fristen der »Verwandten Schutzrechte« im deutschen Urheberrecht waren die <a href="https://de.wikipedia.org/wiki/Richtlinie_93/98/EWG_zur_Harmonisierung_der_Schutzdauer_des_Urheberrechts">Richtlinie 93/98/EWG</a> (neu bekannt gemacht als RL 2006/116/EG) und die <a href="https://de.wikipedia.org/wiki/Richtlinie_2011/77/EU_(K%C3%BCnstler-Schutzfristen-Richtlinie)">Richtlinie 2011/77/EU</a> von weitreichender Bedeutung.
</p>
<p>
  Die folgende Tabelle können Sie <a href="/files/2019-07-20_kaiser-leistungsschutzrecht.pdf">hier</a> als PDF herunterladen.
</p>
<div class="twoColumns">
  <div>
    <img src="/images/Leistungsschutzrecht-5.png" style="margin-top: 10px; margin-bottom: 20px" alt="Leistungsschutzrecht Legende" />
  </div>
  <div>&nbsp;</div>
</div>
<div class="twoColumns">
  <div>
    <img src="/images/Leistungsschutzrecht-1.png" alt="Zeit vor 1966" />
  </div>
  <div>
    <b>Anmerkungen für die Zeit vor 1966:</b><br />
    <i>
      Vor dem Inkrafttreten des Urheberrechtsgesetzes von 1965 am 1. Januar 1966 gab es in Deutschland keine verwandten Schutzrechte bzw. ein Leistungsschutzrecht für den Schutz einer Tonaufnahme. Für die Zeit vor 1966 wurden künstlerische Darbietungen jedoch über das allgemeine Persönlichkeitsrecht bzw. »fiktive Bearbeiterurheberrecht« geschützt, das sich auf § 2 Abs. 2 des <a href="https://de.wikisource.org/wiki/Gesetz_betreffend_das_Urheberrecht_an_Werken_der_Literatur_und_der_Tonkunst">LUG (= Gesetz betreffend das Urheberrecht an Werken der Literatur und der Tonkunst)</a> stützte und für das eine Schutzdauer von 50 Jahren vorgesehen war.<br />
      Für das Beispiel 1 eines 1949 veröffentlichten Tonträgers sowie für das Beispiel 2 eines 1962 veröffentlichten Tonträgers ergibt sich daraus, dass diese Aufnahmen auch vor dem Inkrafttreten des Urheberrechtsgesetzes (UrhG) durch das »fiktive Bearbeiterurheberrecht« geschützt sind (= <span style="color: goldenrod">gelber Balken</span>).
    </i>
  </div>
</div>
<div class="twoColumns">
  <div>
    <img src="/images/Leistungsschutzrecht-2.png" style="margin-top: -4px" alt="Zeit nach 1966 (1)" />
  </div>
  <div>
    <b>Anmerkungen für die Zeit nach Einführung des UrhG 1966:</b><br />
    <i>
      Die ›Verwandten Schutzrechte‹ wurden in Deutschland mit dem Inkrafttreten des Urheberrechtsgesetzes zum 1. Januar 1966 (§§ 70 ff.) eingeführt. Die Schutzdauer für Tonträger wurde auf 25 Jahre festgelegt.<br />
      Die sich aus dem Leistungsschutzrecht (25 Jahre) ergebende Fristverkürzung gegenüber dem fiktiven Bearbeiterurheberrecht (50 Jahre) wurde vom BVerfG grundsätzlich als verfassungsmäßig, § 135 UrhG jedoch als verfassungswidrig beurteilt (<a href="https://openjur.de/u/196260.html">Beschluss vom 08.07.1971 - 1 BvR 766/66</a>). Die 1972 eingeführt Übergangsvorschrift § <a href="https://www.gesetze-im-internet.de/urhg/__135a.html">135a UrhG</a> trägt dem Urteil Rechnung und legt fest, dass Aufnahmen, an denen das fiktive Bearbeiterurheberrecht bei Einführung des Urheberrechts noch nicht erloschen war, eine Frist von 25 Jahren ab Einführung des UrhG gewährt wird. Das fiktive Bearbeiterurheberrecht (= <span style="color: goldenrod">gelber Balken</span>) wird daher verkürzt und durch ein 25-jähriges Leistungsschutzrecht ersetzt. Für die Beispiele 1 und 2 ergeben sich daraus, dass diese Aufnahmen über das Leistungsschutzrecht bis zum Ende des Jahres 1991 geschützt (= <span style="color: red">roter Balken</span> bis 1991/1993) und ab diesem Zeitpunkt gemeinfrei sind (= <span style="color: green">grüner Balken</span>).<br />
      Für alle drei Beispiele gilt jedoch, dass die Verlängerung der Leistungsschutzrechte im Rahmen des dritten Gesetzes zur Änderung des Urheberrechts 1995 in Verbindung mit der Übergangsregelung <a href="https://www.gesetze-im-internet.de/urhg/__137f.html">§ 137f Abs. 2</a> ein Wiederaufleben des Schutzes und Verlängerung der Schutzfrist bedeutet (= durchgehende <span style="color: red">rote Balken</span>).
    </i>
  </div>
</div>
<div class="twoColumns">
  <div>
    <img src="/images/Leistungsschutzrecht-3.png" style="margin-top: -4px" alt="Zeit nach 1966 (2)" />
  </div>
  <div>
    <b>Anmerkung zum ›Dritten Gesetz zur Änderung des Urheberrechts‹ 1995:</b><br />
    <i>
      Im Rahmen der dritten Änderung des UrhG 1995 aufgrund der <a href="https://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=OJ:L:2006:372:0012:0018:DE:PDF">Richtlinie 93/98/EWG</a> wurde der Leistungsschutz für Tonträger auf 50 Jahre erhöht. Eine 1995 veröffentlichte Aufnahme ist seither für die Dauer von 50 Jahren bis zum 31.12.2045 geschützt. Die Übergangsregelung des <a href="https://www.gesetze-im-internet.de/urhg/__137f.html">§ 137f UrhG</a> besagt zudem, dass Länder in der EU, die vor 1995 ein längeres Leistungsschutzrecht für Tonträger als 50 Jahre gehabt haben, dieses nicht verkürzen müssen und dass erloschene Rechte wiederaufleben, wenn der Schutzgegenstand in einem anderen Land in der EU zur Einführung der Fristverlängerung für Tonträgerhersteller noch geschützt war.<br />
      Für die Beispiele 1 und 2 bedeutet die Änderung des Urheberrechts 1995 ein Wiederaufleben des Leistungschutzes bis zum 31.12.1999 bzw. bis zum 31.12.2012. Beide Aufnahmen sind jedoch am 01.01.2013 ohne Schutz bzw. gemeinfrei.<br />
      Für das Beispiel 3 eines 1968 veröffentlichten Tonträgers bedeutet die Änderung des Urheberrechts 1995 ein Wiederaufleben des Leistungschutzes bis zum 31.12.2018.
    </i>
  </div>
</div>
<div class="twoColumns">
  <div>
    <img src="/images/Leistungsschutzrecht-4.png" style="margin-top: -4px" alt="Zeit nach 1966 (3)" />
  </div>
  <div>
    <b>Anmerkung zum ›Neunten Gesetz zur Änderung des Urheberrechts‹ 2013:</b><br />
    <i>
      Im Rahmen der neunten Änderung des UrhG 2013 aufgrund der <a href="https://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=OJ:L:2011:265:0001:0005:DE:PDF">Richtlinie 2011/77/EU</a> wurde der Leistungsschutz für Tonträger auf 70 Jahre erhöht. Die Übergangsregelung des <a href="https://www.gesetze-im-internet.de/urhg/__137m.html">§ 137m</a> allerdings schränkt ein, dass Aufzeichnungen von Darbietungen und für Tonträger, deren Schutzdauer am 1. November 2013 bereits erloschen war, nicht von der Verlängerung profitieren.<br />
      Für die Beispiele 1 und 2 bedeutet die Änderung des Urheberrechts 2013, dass sie gemeinfrei bleiben (= <span style="color: green">grüner Balken</span>).<br />
      Für das Beispiel 3 eines 1968 veröffentlichten und bis zum 31.12.2018 geschützten Tonträgers bedeutet die Änderung des Urheberrechts 2013 eine wiederholte Verlängerung bis zum 31.12.2038 (= <span style="color: red">roter Balken</span>).
    </i>
  </div>
</div>
<div style="margin-top: 60px; border-top: 1px solid gray">
  <h2>Die entscheidende Frage</h2>
  <p>
    Die für Digitalisierungsprojekte gemeinfreier Musik letztendlich entscheidende Frage lautet, ob die Digitalisierung eines Tonträgers von nicht mehr urheberrechtlich geschützten Kompositionen, der vor 1963 erschienen ist, eventuell noch geschützt und deren Verbreitung als gemeinfreie Aufnahmen daher rechtswidrig sein könnte. Dass die <a href="https://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=OJ:L:2006:372:0012:0018:DE:PDF">Richtlinie 93/98/EWG</a> (RL 2006/116/EG) auch für vor 1966 und im Ausland veröffentlichte Aufnahmen gilt, wurde durch den Europäischen Gerichtshof 2009 anlässlich eines Streits zwischen der Sony Music Entertainment (Germany) GmbH und Falcon Neue Medien Vertrieb GmbH entschieden (<a href="http://curia.europa.eu/juris/document/document.jsf?text=&docid=74016&pageIndex=0&doclang=DE&mode=req&dir=&occ=first&part=1">EuGH Rechtssache C‑240/07</a>).
  </p>
  <div class="blockquote">
    Damit gilt für alle EU/EWG-Tonträgerhersteller, dass ihnen auch für ihre Leistungen vor 1966 erschienene Tonträgeraufnahmen Leistungsschutzrechte gemäß §§ 85 f., 129 Abs. 1, 137 f Abs. 2 UrhG in Deutschland zustehen, und zwar für die Dauer von 50 Jahren.
  </div>
  <div class="reference">
    Albrecht Klutmann, Rechtsanwalt und Director Legal Affairs<br />
    bei Sony BMG Music Entertainment (Germany) GmbH, München,<br />
    in: Zeitschrift für Urheber- und Medienrecht 50 (7/2006), S. 540.
  </div>
  <p>
    Da es sich bei der Berechnung der Frist gemäß § 69 um eine Jahresfrist handelt, die mit dem darauf folgenden Kalenderjahr zu zählen beginnt und am 31.12. des Schutzablaufjahres endet, besagt diese Tatsache für einen 1962 veröffentlichten Tonträger, dass der Schutz des Tonträgerherstellers gemäß der Directive 2006/116/EG am 31.12.2012 endete oder allgemein ausgedrückt: Für alle vor 1963 erschienenen Aufnahmen gilt, dass ihr Leistungsschutzrecht in Deutschland spätestens ab dem 1. Januar 2013 erloschen war. Mithin kann ausgeschlossen werden, dass ein Tonträger aus dem Jahr 1962 von der im <a href="/urheberrecht/#urhg">Neunten Gesetz zur Änderung des Urheberrechts</a> 2013 eingeführten Fristverlängerung profitiert.
  </p>
  <div class="blockquote">
    (1) Die Vorschriften über die Schutzdauer nach den §§ 82 und 85 Absatz 3 sowie über die Rechte und Ansprüche des ausübenden Künstlers nach § 79 Absatz 3 sowie § 79a gelten für Aufzeichnungen von Darbietungen und für Tonträger, deren Schutzdauer für den ausübenden Künstler und den Tonträgerhersteller am 1. November 2013 nach den Vorschriften dieses Gesetzes in der bis 6. Juli 2013 geltenden Fassung noch nicht erloschen war, und für Aufzeichnungen von Darbietungen und für Tonträger, die nach dem 1. November 2013 entstehen.
  </div>
</div>
<div style="margin-top: 60px; border-top: 1px solid gray">
  <h2>Jüngere Platten und aktuelle CD's mit gemeinfreien Aufnahmen</h2>
  <p>Eine weitere Frage bestand darin, ob für dieses Projekt auch nach 1963 erschienene Schallplatten digitalisiert sowie die Aufnahmen aktuell vertriebener CD's bereit gestellt werden dürfen, wenn die auf diesen Tonträgern zu hörenden Aufnahmen bereits vor 1963 veröffentlicht worden sind. In diesen Fällen erwies sich die Rechtslage als eindeutig, da seit der Einführung des Urheberrechtsgesetzes im § 85 Abs. 1 Satz 3 steht:</p>
  <div class="blockquote">Das Recht entsteht nicht durch Vervielfältigung eines Tonträgers.</div>
  <p>Dieser Satz wird im Kommentar zum UrhG von Prof. Dr. Dreier und Dr. Schulze wie folgt kommentiert:</p>
  <div class="blockquote">
    <b>Erstfixierung (Abs. 1 Satz 3):</b> Nur die <b>erstmalige Aufnahme</b> auf einen Tonträger ist geschützt, <b>nicht dessen Vervielfältigung</b>. Schutzgegenstand ist z.B. das <b>Masterband</b> oder der digitale Speicher, mit welchem die Darbietung oder das sonstige Tonmaterial erstmalig festgehalten wird. Die weiteren Matrizen, Disketten oder sonstige Vorrichtungen sowie die Schallplatten, CDs und andere Tonträger, die hiervon hergestellt werden, sind lediglich Vervielfältigungsstücke.
  </div>
  <div class="reference">
    Thomas Dreier und Gernot Schulze (unter Mitwirkung von Louisa Specht).<br />
    Urheberrechtsgesetz, Verwertungsgesellschaftsgesetz, Kunsturhebergesetz.<br />
    Kommentar, 6. Aufl. München 2018, S. 1430 (Hervorhebung im Original).
  </div>
  <p>Demnach besteht spätestens seit 2013 kein Leistungsschutz mehr für Aufnahmen, die vor 1963 aufgenommen worden sind bzw. deren Leistungsschutz vor der Verlängerung der Fristen auf 70 Jahre im Jahr 2013 abgelaufen war. Diese Aufnahmen sind mithin gemeinfrei, wenn der Urheber der auf dem Tonträger zu hörenden Werke länger als 70 Jahre tot ist.</p>
</div>
<div style="margin-top: 60px; border-top: 1px solid gray">
  <h2>Anmerkungen</h2>
  <div class="twoColumns">
    <div>
      <h3 id="wiederaufleben">Zum Wiederaufleben des Schutzes</h3>
      <p>
        Aus Sicht der Allgemeinheit ist die Tatsache bedauerlich, dass in Deutschland erloschene Leistungsschutzrechte gemäß der Übergangsvorschrift § 137f Abs. 2 wiederaufleben. Denn andernfalls wären Aufnahmen nicht mehr geschützter Komponisten, die bis zum Jahr 1969 veröffentlicht worden sind, gemeinfrei und könnten für pädagogische Zwecke frei genutzt werden. Dazu schreibt <a href="https://www.itm.nrw/organisation/prof-dr-thomas-hoeren/">Prof. Dr. Hoeren</a> in einem für die <a href="https://www.hmtm.de/de/">Hochschule für Musik und Theater</a> erstellten Gutachten:
      </p>
    </div>
    <div>
      <div class="blockquote">
        § 137f Abs. 2 UrhG greift letztlich ungerechtfertigterweise in legitime Vertrauenstatbestände ein, indem es einen zuvor geschaffenen rechtlichen Zustand ändert. Er ist damit als verfassungswidrig zu werten [...] Daraus folgt, dass eventuelle Gerichtsverfahren gegen Archive und Bibliotheken wegen der Nutzung von Tonträgern, deren Schutz nach § 137f Abs. 2 UrhG wiederaufgelebt sein soll, spätestens am Bundesverfassungsgericht scheitern müssen.
      </div>
      <div class="reference">
        Rechtsgutachten von Thomas Hoeren,<br />
        erstellt für die <a href="https://www.hmtm.de/de/">HMTM</a> am 28.01.2019 (Tag der Rechnungslegung)
      </div>
    </div>
  </div>
  <div class="twoColumns">
    <div>
      <h3 id="harmonisierung">Zur Harmonisierung</h3>
      <p>
        Anders, als es die umgangssprachliche Bezeichnung nahe legen würde, ist mit einer »Harmonisierung der Schutzdauer des Urheberrechts und bestimmter verwandter Schutzrechte« in der Sprache der EU keine Angleichung von Schutzfristen gemeint. Das macht Punkt 3 der Richtlinie 93/98/EWG deutlich, wo es heißt: »Die Harmonisierung darf sich nicht auf die Schutzdauer als solche erstrecken, sondern muß auch einige ihrer Modalitäten wie den Zeitpunkt, ab dem sie berechnet wird, betreffen.« Punkt 9 wiederum führt aus, warum das so ist:
      </p>
    </div>
    <div>
      <div class="blockquote">
        Die Wahrung erworbener Rechte gehört zu den allgemeinen Rechtsgrundsätzen, die von der Gemeinschaftsrechtsordnung geschützt werden. Eine Harmonisierung der Schutzdauer des Urheberrechts und der verwandten Schutzrechte darf daher nicht zur Folge haben, daß der Schutz, den die Rechtsinhaber gegenwärtig in der Gemeinschaft genießen, beeinträchtigt wird. Damit sich die Auswirkungen der Übergangsmaßnahmen auf ein Mindestmaß beschränken lassen und der Binnenmarkt in der Praxis funktionieren kann, ist die Harmonisierung auf eine lange Schutzdauer auszurichten.
      </div>
      <div class="reference">
        Richtlinie 93/98/EWG, Punkt 9.
      </div>
    </div>
  </div>
</div>`;
  return layout('Leistungsschutzrecht', '/leistungsschutzrecht/', body);
}

function main() {
  if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true });
  mkdirp(DIST);

  copyDir(STATIC, DIST);

  const recordings = loadRecordings();
  console.log(`Loaded ${recordings.length} recordings`);

  writeHtml(path.join(DIST, 'index.html'), genIndex(recordings));

  for (const rec of recordings) {
    writeHtml(path.join(DIST, rec.id, 'index.html'), genRecording(rec));
  }
  console.log(`  ${recordings.length} recording pages`);

  writeHtml(path.join(DIST, 'about',                'index.html'), genAbout());
  writeHtml(path.join(DIST, 'dsgvo',                'index.html'), genDsgvo());
  writeHtml(path.join(DIST, 'urheberrecht',         'index.html'), genUrheberrecht());
  writeHtml(path.join(DIST, 'leistungsschutzrecht', 'index.html'), genLeistungsschutzrecht());
  console.log('Done!');
}

main();
