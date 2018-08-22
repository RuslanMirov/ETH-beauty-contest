import React from 'react'
import {Bar} from 'react-chartjs-2'

class Chart extends React.Component{
    render() {
    this.arrayVotes = []
    this.arrayLabels = []
    this.props.candidates.map((candidate) => {
      return(
      this.arrayVotes.push(candidate.voteCount.toNumber()),
      this.arrayLabels.push(candidate.name)
     )
    })

    return (
      <div className="chart">
      <Bar
        data={{
          labels:this.arrayLabels,
          datasets:[
            {
              label:"Voiting chart",
              data:this.arrayVotes,
              backgroundColor:[
                'red',
                'blue',
                'yellow'
              ]
            }
          ]
        }}
        options={{
        }}
      />
      </div>
    )
  }
}

export default Chart
