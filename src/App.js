import React, {Component} from 'react';
import logo from './logo.svg';
import Prompt from './Prompt';

const ipcRenderer = window.require('electron').ipcRenderer;

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isShowPrompt: false,
            left: 3
        }
    }

    componentWillMount = () => {
        ipcRenderer.on('interrupt', () => {
            this.setState({isShowPrompt: true});
        });

        ipcRenderer.on('wrong-pin', () => {
            this.setState({left: this.state.left - 1});
        });
    }

    exit = () => {
        this.setState({isShowPrompt: true})
    }

    closePrompt = () => {
        this.setState({isShowPrompt: false})
    }

    render() {
        return (
            <div className="App">
                {this.state.isShowPrompt && (
                    <Prompt
                        handleClose={this.closePrompt}
                        left={this.state.left}
                    />
                )}

                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Welcome to React</h2>
                </div>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
                <button className="enjoy-css" onClick={this.exit}>Exit</button>
            </div>
        );
    }
}

export default App;
