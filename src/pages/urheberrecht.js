import React from 'react';
import { Link } from 'gatsby';
import Layout from '../components/layout';

export default ({ data }) => (

  <Layout>
    <h1>Zum Urheberrecht (in Deutschland und der EU)</h1>
    <p>
    	Informationen zu dem für die Tonträgerdigitalisierung wichtigen Leistungsschutzrecht finden Sie <Link to="leistungsschutzrecht">hier</Link>.
    	<br />
    	Das Urheberrecht soll in dem Interessenskonflikt vermitteln, der zwischen den Rechten von Urhebern sowie dem Interesse der Allgemeinheit an freiem Umgang mit Inhalten besteht. Die Rechte und der Schutz geistigen Eigentums in ideeller und materieller Hinsicht wird deshalb und im Unterschied zu zivilrechtlichem Eigentum nicht absolut, sondern nur für eine bestimmte Zeit gewährt. Diese ›Zeitschranke‹ wiederum soll gewährleisten, dass geistige Schöpfungen nicht aus ihrem Kontext bzw. der sie umgebenden Kultur herausgehalten werden können, sondern auf Dauer Teil des gesellschaftlichen Diskurses bleiben. Es wurde daher festgelegt, dass geistige Schöpfungen als Mitteilungsgut nach Ablauf einer gewissen Zeitspanne gemeinfrei werden sollen. Materialien zur Entwicklung des Urheberrecht werden vom <a href="https://www.urheberrecht.org/institut/">Institut für Urheberrecht und Medienrecht</a> auf der Seite <a href="http://www.urheberrecht.org/law/normen/urhg/">Urheberrechtsgesetz</a> bereitgestellt.
    	<br />
    	Im folgenden finden Sie eine Synopse der für meine Open-Educational-Resources-Projekte wichtigen Paragraphen des Urheberrechts. Dabei ist auffällig, dass in Deutschland der Schutz des Urhebers von Anfang an ein hohes Schutzniveau hatte (70 Jahre nach dem Tode des Urhebers), während die ›Verwandten Schutzrechte‹ wie das Leistungsschutzrecht für die Hersteller eines Tonträgers wiederholt verlängert und aktuell auf das Schutzniveau des Urhebers gebracht worden sind. Man kann daher feststellen, dass insbesondere durch die Umsetzung europäischer Richtlinien bzw. Direktiven im Interessenskonflikt zwischen Urhebern und Allgemeinheit immer wieder zugunsten der Individualinteressen und gegen die Allgemeininteressen entschieden worden ist.
    </p>
    <hr />
    <div className="threeColumns">
    	<div style={{ 'width': '33%', 'vertical-align': 'top' }}>
    		<b>§ 64 Allgemeines (UrhG vom 9. September 1965)</b><br/>
    			<i>
    				(1) Das Urheberrecht erlischt <span className="highlighted">siebzig Jahre</span> nach dem Tode des Urhebers.<br />
    				(2) Wird ein nachgelassenes Werk nach Ablauf von sechzig, aber vor Ablauf von siebzig Jahren nach dem Tode des Urhebers veröffentlicht, so erlischt das Urheberrecht erst 10 Jahre nach Veröffentlichung.
    			</i>
    	</div>
    	<div style={{ 'width': '33%', 'vertical-align': 'top' }}>
    		<b>§ 69 Berechnung der Fristen (Drittes Gesetz zur Änderung des Urheberrechts 1995)</b><br />
    		<i>
    			Das Urheberrecht erlischt <span className="highlighted">siebzig Jahre</span> nach dem Tode des Urhebers.<br />
    			§ 64 geändert durch das Gesetz vom 23.06.1995, BGBI. S S. 842.
    		</i>
    	</div>
    	<div style={{ 'width': '33%', 'vertical-align': 'top' }}>
    		<b>§ 64 Allgemeines (Neuntes Gesetz zur Änderung des Urheberrechts 2013)</b><br />
    			<i>
    				Das Urheberrecht erlischt <span className="highlighted">siebzig Jahre</span> nach dem Tode des Urhebers.
    			</i>
    	</div>
    </div>
    <hr />
  </Layout>
)