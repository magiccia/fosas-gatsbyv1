import React from 'react';
import ContainerDimensions from 'react-container-dimensions'

class StateMapChart extends React.Component {

  render() {
    const { onYearChange, selectedYear, yearColorScale, selectedStateData, selectedVar } = this.props;
    let total = '';
    if (selectedStateData) {
      total = (selectedYear == 2005) ? selectedStateData['num_' + selectedVar + '_total'] : selectedStateData.yearlyFosasData[selectedYear - 2006]['num_' + selectedVar];
      total = (total === -1) ? 'No data' : total;
    }

    return (
      <div className="chart-wrapper">
        <h2>
          {selectedVar} 
          <span className="number">
            {(selectedStateData &&
              (total)
            )}
          </span>
        </h2>

        {selectedStateData && (
        <ContainerDimensions>
          { ({ height }) =>
            <div className="chart">
              <div
                className={"bar-container year-tot"}
                style={{
                  height: height,
                  backgroundColor: (selectedYear == 2005) ? '#ffffff' : 'transparent',
                  paddingTop: (selectedYear == 2005) ? '38px' : 0,
                  marginTop: (selectedYear == 2005) ? '-38px' : 0,
                }}
              >
                <span className="indicator-label" />
                <span
                  className="year-label"
                  style={{
                    backgroundColor: '#999'
                  }}
                >
                  TOT
                </span>
              </div>

              {selectedStateData.yearlyFosasData.map( (yearRow, i) => (
                <div
                  key={"yearrow"+i}
                  className={"bar-container year-" + yearRow.year}
                  style={{
                    height: height,
                    backgroundColor: (yearRow.year == selectedYear) ? '#ffffff' : 'transparent',
                    paddingTop: (yearRow.year == selectedYear) ? '38px' : 0,
                    marginTop: (yearRow.year == selectedYear) ? '-38px' : 0,
                  }}
                >
                  {(yearRow['num_' + selectedVar] < 0) ?
                    <span className="indicator-label indicator-no-data"></span> :
                    <span className="indicator-label">{yearRow['num_' + selectedVar]}</span>
                  }
                  <div
                    className="bar"
                    style={{
                      height: (yearRow['num_' + selectedVar] / selectedStateData['num_' + selectedVar + '_max']) * (height - 58),
                      backgroundColor: yearColorScale(yearRow.year)
                    }}
                  />
                  <span
                    className="year-label"
                    style={{
                      backgroundColor: yearColorScale(yearRow.year)
                    }}
                  >
                    '{yearRow.year.toString().slice(2)}
                  </span>
                </div>
              ))}
            </div>
          }
        </ContainerDimensions>
        )}
      </div>
    )
  }
}


export default StateMapChart;
