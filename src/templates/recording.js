import React from 'react';
import Layout from '../components/layout';

export default ({ pageContext: { recording } }) => {
  return (
    <Layout>
      <div className="track">
        <a type="button" className="closeX" href="/recordings"><span>X</span></a>
        <h2>{recording.meta.display}</h2>
        <hr />
        <div><span className="metaInfo">Tonträger-Nummer:</span> {recording.meta.cdId}</div>
        <div><span className="metaInfo">Tonträger-Titel:</span> {recording.meta.title}</div>
        <div><span className="metaInfo">Label:</span> {recording.meta.label}</div>
        <div><span className="metaInfo">Erstveröffentlichung:</span> {recording.meta.firstPublished}</div>
        <div><span className="metaInfo">Erscheinungsdatum:</span> {recording.meta.published}</div>
        <div><span className="metaInfo">Format:</span> {recording.meta.format}, Land: {recording.meta.country}</div>
        <div><span className="metaInfo">Lizenz:</span> {recording.meta.license}</div>
        <hr />
        <div className="trackAudioContainer">   
          {recording.tracks.map(track => (
            <div className="trackAudio">
              <div>
                <audio src={track.hmtLink.url} controls />
              </div>
              <div className="trackTitle">{track.name}</div>
              {track.bsbLink.url ? <div>Archiviert durch die Bayerische Staatsbibliothek: <a href={track.bsbLink.url}>Link</a></div> : null }
            </div>
          ))}
        </div>
        <hr/>
        <p><span className="metaInfo">Angabe zu den Ausführenden:</span><br/>{recording.meta.artists}.</p>
      </div>
    </Layout>
  );
};