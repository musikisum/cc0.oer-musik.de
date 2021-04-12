import React from 'react';
import { Link } from 'gatsby';
import Layout from '../components/layout';

export default ({ pageContext: { recording } }) => {

  return (
    <Layout>
      <div className="track">
        <Link to="/" className="closeX"><span>X</span></Link>
        <h2>{recording.meta.display}</h2>
        <hr />
        <div><span className="metaInfo">ID:</span> {recording.meta.filename}</div>
        <div><span className="metaInfo">Tonträger-Titel:</span> {recording.meta.title}</div>
        <div><span className="metaInfo">Label:</span> {recording.meta.label}</div>
        {recording.meta.firstPublished && <div><span className="metaInfo">Erstveröffentlichung/-aufnahme:</span> {recording.meta.firstPublished}</div>}
        <div><span className="metaInfo">Erscheinungsdatum:</span> {recording.meta.published}</div>
        <div><span className="metaInfo">Format:</span> {recording.meta.format}, Land: {recording.meta.country}</div>
        <div><span className="metaInfo">Trackliste:</span> {recording.meta.composition}</div>
        <div>
          <span className="metaInfo">Lizenz:</span>&nbsp;
          <a href="https://creativecommons.org/publicdomain/zero/1.0/deed.de">{recording.meta.license}</a>
        </div>
        <hr />
        <div className="trackAudioContainer">
          {recording.tracks.map((track, index) => (
            <div key={index} className="trackAudio">
              <div>
                <audio src={track.hmtLink?.url} controls />
              </div>
              <div className="trackTitle"><b>{track.name}</b></div>
              {track.bsbLink?.url ? <div>archiviert durch die Bayerische Staatsbibliothek: <a href={track.bsbLink.url}>Link</a></div> : null }
            </div>
          ))}
        </div>
        <hr/>
        <p><span className="metaInfo">Angabe zu den Ausführenden:</span><br/>{recording.meta.artists}</p>
      </div>
    </Layout>
  );
};
