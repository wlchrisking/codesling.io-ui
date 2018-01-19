import React, { Component } from 'react';
import randomstring from 'randomstring';
import axios from 'axios';

import Button from '../globals/Button';
import Logo from '../globals/Logo';

import './LandingPage.css';

let slingId;

class Home extends Component {
  state = {
    allChallenges: [],
    selectedChallenge: {}
   }

   async componentDidMount() {
    const id = localStorage.getItem('id');
    const { data } = await axios.get(`http://localhost:3396/api/usersChallenges/${id}`)
    this.setState({ allChallenges: data.rows, selectedChallenge: data.rows[0] });
   }

  randomSlingId = () => {
    slingId = `${randomstring.generate()}`;
  }

  handleDuelClick = async () => {
    try {
      const data = await axios.get(`http://localhost:3396/api/testCases/${this.state.selectedChallenge.id}`);
      console.log('result of fetching test cases based on specific challenge id:', data.data.rows)

      this.randomSlingId();

      this.props.history.push({
        pathname: `/${slingId}`,
        state: {
          challenge: this.state.selectedChallenge,
          testCases: data.data.rows
        }
      });
    }

    catch (e) {
      console.log('error fetching test cases: ', e)
    }
  }

  handleAddChallengeClick = () => {
    this.props.history.push('/addChallenge');
  }

  handleChallengeSelect = (e) => {
    e.preventDefault();
    const { value } = e.target;
    this.setState({ selectedChallenge: JSON.parse(value) }, ()=>{console.log('Home/Index.jsx - this.state is now: ', this.state)});
  }

  render() {
    return (
      <div className="landing-page-container">
        <Logo
          className="landing-page-logo"
        />
        <br />
        <select onChange={(e) => this.handleChallengeSelect(e)}>
          {this.state.allChallenges.map(challenge => {
            return (
            <option
              value={JSON.stringify(challenge)}
            >
              {challenge.title}
            </option>)
          }
          )}
        </select>
        <br />
        <br />
        <Button
          backgroundColor="red"
          color="white"
          text="Create Challenge"
          onClick={() => this.handleAddChallengeClick()}
        />
        <br />
        <Button
          backgroundColor="red"
          color="white"
          text="Duel"
          onClick={() => this.handleDuelClick()}
        />

        <Button
          backgroundColor="blue"
          color="white"
          text="Log states"
          onClick={() => console.log('\n\nthis.state in index:', this.state, '\n\nthis.props', this.props, '\n\nthis.props.location.state in index', this.props.location.state)}
        />
      </div>
    );
  }
}

export default Home;
