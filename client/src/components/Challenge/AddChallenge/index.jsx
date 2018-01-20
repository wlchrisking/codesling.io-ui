import React, { Component } from 'react';
import axios from 'axios';

import Input from '../../globals/forms/Input';
import Button from '../../globals/Button/';
import Logo from '../../globals/Logo';
//import List from './testList.jsx'

import './Auth.css';

class AddChallenge extends Component {
  
    state = { 
      title: '',
      content: '',
      difficulty: null,
      challenge_id: null,
      awaitingTestCase: null,
      testName: '',
      testInput: '',
      testOutput: '',
      testList: []
     }
    

  submitChallenge = async (e) => {
    e.preventDefault();
    const { title, content, difficulty } = this.state;
    const id = localStorage.getItem('id');
    const body = {
      title,
      content,
      difficulty,
      user_id: id,
      type: 0
    }

    try {
      const result = await axios.post('http://localhost:3396/api/challenges', body);
      console.log('You made a challenge. Here is your challenge ID: ', result.data.id)
      this.setState({
        challenge_id: result.data.id,
        awaitingTestCase: true
      })
    }
    catch (e) {
      console.log('Error creating challenge. Error: ', e)
    }
  }

  addTest = (e) => {
    e.preventDefault()
    let {testName, testInput, testOutput} = this.state;
    let test = [];

    // if (testInput[0] === '{' && testInput[testInput.length - 1] === '}') {

    //   function strToObj(str){
    //     var obj = {};
    //     if(str||typeof str ==='string'){
    //         var objStr = str.match(/\{(.)+\}/g);
    //         eval("obj ="+objStr);
    //     }
    //     return JSON.stringify(obj)
    //  }

    //   testInput = strToObj(testInput)
    // }

    // if (testOutput[0] === '{' && testOutput[testOutput.length - 1] === '}') {

    //   function strToObj(str){
    //     var obj = {};
    //     if(str||typeof str ==='string'){
    //         var objStr = str.match(/\{(.)+\}/g);
    //         eval("obj ="+objStr);
    //     }
    //     return JSON.stringify(obj)
    //  }

    //   testOutput = strToObj(testOutput)
      
    // }
    
    test.push(testName, JSON.parse(testInput), JSON.parse(testOutput))
    let newStateArr = this.state.testList
    newStateArr.push(test)
    console.log('newStateArr', newStateArr)
    console.log('this.state.testList', this.state.testList)
    this.setState({testList: newStateArr})
  }

  submitTest = async (e) => {
    e.preventDefault();
    // create payload, which contains [name, input, output], and challenge id.
    
    const content = this.state.testList;
   
    console.log('this.state.testList', this.state.testList);
    console.log('content', content);
    // const {testName, testInput, testOutput} = this.state;
    // content.push(testName, testInput, testOutput)

    const payload = {
      content: content,
      challenge_id: this.state.challenge_id
    }

    try {
      const result = await axios.post('http://localhost:3396/api/testCases', payload);
      console.log('You added a test! Here is the data back from the server:', result)

      this.setState({
        awaitingTestCase: false,
      })

      this.props.history.push({
        pathname: `/home`,
        state: {
          challenge_id: this.state.challenge_id
        }
      });
    }

    catch(e) {
      console.log('Error creating a test. Error: ', e)
    }
  }

  handleChallengeInput = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleTestInput = (event) => {
    const {name, value} = event.target;
    this.setState({ [name]: value})
  }

  render() {
    return (
      <div className="login-form-container">
        <Logo
          className="landing-page-logo"
        />
        
        <form className="auth-form">
          <Input
            name='title'
            type='title'
            placeholder={'enter title'}
            onChange={this.handleChallengeInput}
            />
          <Input
            name='content'
            type='content'
            placeholder={'enter content'}
            onChange={this.handleChallengeInput}
            />
          <Input 
            name='difficulty'
            type='difficulty'
            placeholder={'enter your difficulty'}
            onChange={this.handleChallengeInput}
            />
          <Button
            backgroundColor="red"
            color="white"
            text="Add Challenge"
            onClick={(e) => this.submitChallenge(e)}
            />

          {this.state.awaitingTestCase ? 
          
            <div>
            <div>
            <Input
            name='testName'
            type='testName'
            placeholder={'Enter test name'}
            onChange={this.handleTestInput}
            />
          <Input
            name='testInput'
            type='testInput'
            placeholder={'Enter test input'}
            onChange={this.handleTestInput}
            />
          <Input 
            name='testOutput'
            type='testOutput'
            placeholder={'Enter test output'}
            onChange={this.handleTestInput}
            />
        
            
            <Button
            backgroundColor="blue"
            color="white"
            text="Add Test to List"
            onClick={(e) => this.addTest(e)}
            />
        
           
        
        
            <div>
            <Button
            backgroundColor="green"
            color="white"
            text="Submit static tests."
            onClick={(e) => this.submitTest(e)}          
            /> 
            </div>
            </div>
            <div>
            { (this.state.testList.length > 0)
            ?
            <div>
            <ul>
              {this.state.testList.map(test => {
                return <li>  
                <div>
                  <div style={{listStyleType: 'square'}} > Test Name: {test[0]}</div>
                  <div> Test Input: {test[1]}</div>
                  <div> Test Output: {test[2]}</div>
                  </div>
                  </li>
              })}
            </ul>
          </div>
          : null
          
            }
         
          </div>
          </div>
            : null}
          

        </form>
        
        
        
      </div>
    );
  }
}

export default AddChallenge;
