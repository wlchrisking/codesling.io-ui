import React, { Component } from 'react';
import Button from '../../globals/Button/';
import Input from '../../globals/forms/Input';

class List extends Component {
  

    state = {
      testName: '',
      testInput: '',
      testOutput: '',
      testList: []
    }
  


  addTest = (e) => {
   e.preventDefault()
    const { testName, testInput, testOutput } = this.state;
    var test = [];
    test.push(testName, testInput, testOutput)
  
    let newStateArr = this.state.testList
    newStateArr.push(test)
    console.log('newStateArr', newStateArr)
    console.log('this.state.testList', this.state.testList)
    this.setState({testList: newStateArr})
  }

  handleTestInput = (event) => {
    const {name, value} = event.target;
    this.setState({ [name]: value})
  }


  render () {
   return ( <div>
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
    { this.state.testList.length > 0
    ?
    <div>
    <ul>
      {this.state.testList.map(test => {
        return 
          <li>
          <div>
          {test[0]}
          {test[1]}
          {test[2]}
          </div>
        </li>
      })}
    </ul>
  </div>
  : 
  null
    }
 
  </div>
  </div>)
  }
};

export default List;