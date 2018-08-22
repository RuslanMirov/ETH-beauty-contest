import React, {
  Component
} from 'react'
import BeautyContestContract from '../build/contracts/BeautyContest.json'
import getWeb3 from './utils/getWeb3'
import Content from './Content'


class App extends Component {
  constructor(props) {
    super(props)
    this.castVote = this.castVote.bind(this)

    this.state = {
      storageValue: 0,
      account: '0x0',
      candidates: [],
      hasVoted: false,
      loading: true,
      voting: false,
      web3: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        })

        // Instantiate contract once web3 provided.
        this.instantiateContract()
      })
      .catch(() => {
        console.log('Error finding web3.')
      })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const BeautyContest = contract(BeautyContestContract)
    BeautyContest.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on BeautyContest.


    this.state.web3.eth.getAccounts((error, accounts) => {
      this.setState({ account: accounts[0]})
      BeautyContest.deployed().then((instance) => {
        this.BeautyContestInstance = instance
        this.watchEvents()
        this.BeautyContestInstance.candidatesCount().then((candidatesCount) => {
          for (var i = 1; i <= candidatesCount; i++) {
            this.BeautyContestInstance.candidates(i).then((candidate) => {
              const candidates = [...this.state.candidates]
              candidates.push({
                id: candidate[0],
                name: candidate[1],
                voteCount: candidate[2]
              });
              this.setState({
                candidates: candidates
              })
            });
          }
        })
        this.BeautyContestInstance.voters(this.state.account).then((hasVoted) => {
          this.setState({
            hasVoted,
            loading: false
          })
        })
      })
    })
  }


  watchEvents() {
    // TODO: trigger event when vote is counted, not when component renders
    this.BeautyContestInstance.votedEvent({}, {
      fromBlock: 0,
      toBlock: 'latest'
    }).watch((error, event) => {
      this.setState({
        voting: false
      })
    })
  }

  castVote(candidateId) {
    this.setState({
      voting: true
    })
    this.BeautyContestInstance.vote(candidateId, {
      from: this.state.account
    }).then((result) =>
      this.setState({
        hasVoted: true
      })
    )
  }

  render() {
      return (
        <div className='row'>
          <div className='col-lg-12 text-center' >
            <h1>Beauty contest voting in the ETH network</h1>
            <br/>
            { this.state.loading || this.state.voting
              ? <p className='text-center'>Loading...</p>
              : <Content
                  account={this.state.account}
                  candidates={this.state.candidates}
                  hasVoted={this.state.hasVoted}
                  castVote={this.castVote} />
            }
          </div>
        </div>
      )
    }
}

export default App
