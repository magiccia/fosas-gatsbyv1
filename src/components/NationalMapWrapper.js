import React from 'react';

import StateMap from './StateMap';
import StateMapSlider from './StateMapSlider';
import StateMapButtons from './StateMapButtons';
import StateMapChart from './StateMapChart';

import * as d3Scale from 'd3-scale';
import * as d3ScaleChromatic from 'd3-scale-chromatic';

const VARS = ['fosas', 'cuerpos'];

// The MINYEAR constant represents the "total" in the range. This is because
// rc-slider wants discrete, continuous ranges.
// @TODO fix this ugly hack
const MINYEAR = 2005;
const MAXYEAR = 2016;

class NationalMapWrapper extends React.Component {
  state = {
    selectedState: {},
    selectedStateData: null,
    selectedVar: 'fosas',
    selectedYear: MINYEAR,
    minYear: MINYEAR,
    maxYear: MAXYEAR,
    mapFilter: null,
    negativeFilter: null,
    showPGR: false,
    yearColorScale: d3Scale.scaleOrdinal(
      [
       '#453581',
       '#481c6e',
       '#98d83e',
       '#67cc5c',
       '#40bd72',
       '#25ac82',
       '#1f998a',
       '#24878e',
       '#2b748e',
       '#34618d',
       '#3d4d8a'
      ])
      .domain([MINYEAR, MAXYEAR]),
  }

  constructor(props) {
    super(props);
    this.state.selectedState = props.selectedState;
    this.state.mapFilter = (props.mapFilter === undefined) ? ["==", "CVE_ENT", props.selectedState.state_code] : props.mapFilter;
    this.state.circleSteps = props.circleSteps || null;
  }

  setYear = (selectedYear) => {
    this.setState({
      selectedYear
    });
  }

  setVar = (selectedVar) => {
    this.setState({
      selectedVar
    });
  }

  setSelectedStateData = (selectedStateData) => {
    this.setState({
      selectedStateData
    });
  }

  togglePGR = () => {
    const { showPGR } = this.state;
    this.setState({
      showPGR: !showPGR
    });
  }

  render() {
    const { selectedState, showPGR } = this.state;

    return (
      <div className="state-details national">
        <div className="controls">
          <StateMapSlider
            {...this.state}
            onYearChange={this.setYear}
          />

          <div className="controls-content">
            <p>De 2006 a 2016 en México las autoridades estatales encontraron 1978 fosas, la PGR 232.</p>
            <p>Al menos 2880 cuerpos. Esta información fue obtenida a través de solicitudes de acceso a información pública realizadas a cada uno de los estados del país.</p>
            <p>24 fiscalías estatales reconocieron que en su territorio encontraron fosas clandestinas: esfuerzos humanos por desaparecer a otras personas enterrándolas, o -en algunos casos- quemándolas con materiales combustibles. Ocho estados -Baja California, Chiapas, Ciudad de México, Guanajuato, Hidalgo, Puebla, Querétaro y Yucatán- no reconocieron la existencia de fosas.</p>
            <p>En esos 11 años encontraron fosas en 15% de los municipios del país.</p>
            <p>La explicación detallada de esta información, la evolución histórica estado por estado, municipio por municipio, año por año, y los hallazgos en estas fosas los puedes consultar aquí.</p>
            <p><a href="https://adondevanlosdesaparecidos.org">https://adondevanlosdesaparecidos.org</a></p>

            <p onClick={this.togglePGR}>
              {showPGR ? (<span>Hide PGR</span>) : (<span>Show PGR</span>)}
            </p>
          </div>
        </div>
        <StateMap
          {...this.state}
          bounds={[selectedState.bounds.slice(0, 2), selectedState.bounds.slice(2)]}
          hideStateOutline={true}
          beforeLayer="water-label"
          onDataChange={this.setSelectedStateData}
          showPGR={showPGR}
          onMunicipioLoad={() => {}}
        />
      </div>
    )
  }
}

export default NationalMapWrapper;

