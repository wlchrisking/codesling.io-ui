import React, { Component } from 'react';
import CodeMirror from 'react-codemirror2';
import io from 'socket.io-client/dist/socket.io.js';
import axios from 'axios';
import { throttle } from 'lodash';

import Stdout from './StdOut/index.jsx';
import EditorHeader from './EditorHeader';
import ClassicButton from '../globals/Button';
import { Modal, Button } from 'react-bootstrap';

import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/base16-dark.css';
import './Sling.css';

class Sling extends Component {
  constructor() {
    super();
    this.state = {
      id: null,
      ownerText: null, //the text in user's code editor
      challengerText: null, //the text in opponent's code editor
      text: '', //I think this is not used? 
      challenge: '', //the challenge selected from the challenge table.
      stdout: '', //the user's console-logged text that appears above Run Code when click Run Code
      challengeWinner: 'none' // added. once someone wins the challenge, the appropriate 'winner' or 'loser' modal
                              //will display to let the users know.
    }
  }

  
  componentDidMount() {
    const { socket, challenge } = this.props;
    const startChall = typeof challenge === 'string' ? JSON.parse(challenge) : {}
    socket.on('connect', () => {
      socket.emit('client.ready', startChall);
    });
    
    socket.on('server.initialState', ({ id, text, challenge }) => {
      console.log('this is challenge', challenge);
      this.setState({
        id,
        ownerText: text,
        challengerText: text,
        challenge
      });
    });
    
    socket.on('server.changed', ({ text, email }) => {
      console.log('text and email', text, email);
      if (localStorage.getItem('email') === email) {
        this.setState({ ownerText: text });
      } else {
        this.setState({ challengerText: text });
      }
    });
    
    //here is where client is receiving output of running code. so this is most likely where'd get if all tests pass.
    //to update challengeWinnerstate.
    //this gets the output for both challenge users. it just only sets state for stdout
    //when the email on the data matches this users email addy
    socket.on('server.run', ({ stdout, email }) => {
      const ownerEmail = localStorage.getItem('email');
      email === ownerEmail ? this.setState({ stdout }) : null;
    });
    
    window.addEventListener('resize', this.setEditorSize);
  }
  
  submitCode = () => {
    const { socket } = this.props;
    const { ownerText } = this.state;
    const email = localStorage.getItem('email');
    socket.emit('client.run', { text: ownerText, email });
  }
  
  handleChange = throttle((editor, metadata, value) => {
    const email = localStorage.getItem('email');
    this.props.socket.emit('client.update', { text: value, email });
  }, 250)
  
  setEditorSize = throttle(() => {
    this.editor.setSize(null, `${window.innerHeight - 80}px`);
  }, 100);
  
  initializeEditor = (editor) => {
    this.editor = editor;
    this.setEditorSize();
  }
  
  //for testing buttons and to reset challenge winner to 'none' once modal is closed just in case that will be useful
  setChallengeWinner(arg){
      this.setState({challengeWinner: arg});
  }

  render() {
    
    const { socket } = this.props;
    return (
      <div className="sling-container">
        <EditorHeader />
        <div className="code1-editor-container">
          <CodeMirror
            editorDidMount={this.initializeEditor}
            value={this.state.ownerText}
            options={{
              mode: 'javascript',
              lineNumbers: true,
              theme: 'base16-dark',
            }}
            onChange={this.handleChange}
            />
        </div>
        <div className="stdout-container">
           
      <div>
				<Modal
					show={this.state.challengeWinner === 'winner' ? true : false}
          animation={true}
          className="modal"
          bsSize="large"
				>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Title>Congrats!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              You won the challenge! Woohoo!!!
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => this.setChallengeWinner('none')}>Close</Button>
            </Modal.Footer>
          </Modal.Dialog>
				</Modal>
        <Modal
					show={this.state.challengeWinner === 'loser' ? true : false}
          animation={true}
          className="modal"
          bsSize="large"
				>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Title>Sorry!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              You lose. Your opponent beat you.
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => this.setChallengeWinner('none')}>Close</Button>
            </Modal.Footer>
          </Modal.Dialog>
				</Modal>
			</div>
            {this.state.challenge.title || this.props.challenge.title}
            <br/>
            {this.state.challenge.content || this.props.challenge.content}
          <Stdout text={this.state.stdout}/>
          <ClassicButton
            className="run-btn"
            text="Run Code"
            backgroundColor="red"
            color="white"
            onClick={() => this.submitCode()}
          />
        </div>
        <div className="code2-editor-container">
          <CodeMirror 
            editorDidMount={this.initializeEditor}
            value={this.state.challengerText}
            options={{
              mode: 'javascript',
              lineNumbers: true,
              theme: 'base16-dark',
              readOnly: true,
            }}
          />
        </div>
      </div>
    )
  }
}

export default Sling;
