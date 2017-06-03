import React, {PureComponent} from 'react';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import ReactSpinner from 'react-spinjs';

const ipcRenderer = window.require('electron').ipcRenderer;

const styles = {
    cancelBtn: {
        display: 'inline-block',
        boxShadow: 'none'
    },
    submitBtn: {
        display: 'inline-block',
        backgroundColor: 'rgb(140, 212, 245)',
        boxShadow: 'rgba(140, 212, 245, 0.8) 0px 0px 2px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset'
    }
}

const wrap = ComposedComponent => class extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            pinCode: '',
            isNew: true
        }
    }

    componentWillMount = () => {
        ipcRenderer.on('wrong-pin', () => {
            this.setState({isLoading: false});
        });
    }

    handleChange = (e) => {
        this.setState({pinCode: e.target.value});
    }

    submit = () => {
        this.setState({isLoading: true, isNew: false});
        ipcRenderer.send('pin-code', this.state.pinCode, this.props.left);
    }

    render() {
        return <ComposedComponent
            {...this.props}
            {...this.state}
            handleChange={this.handleChange}
            submit={this.submit}
        />
    }
}

const Prompt = ({handleClick, handleClose, handleChange, isLoading, submit, left, isNew}) => (
    <ModalContainer onClose={handleClose}>
        {isLoading ?
            <ReactSpinner/> :
            <ModalDialog onClose={handleClose} className="prompt">
                <p>Press PIN code to continue! ({left} tries left)</p>
                <fieldset>
                    <input type="password" onChange={handleChange}/>
                    <div className={left < 3 ? "sa-input-error show" : "sa-input-error"}></div>
                </fieldset>
                {!isNew && (
                    <div className="sa-error-container">
                        <div className="icon">!</div>
                        <p style={{display: 'inline'}}>Wrong PIN Code!</p>
                    </div>
                )}

                <div className="sa-button-container">
                    <button className="cancel" tabindex="2" style={styles.cancelBtn} onClick={handleClose}>
                        Cancel
                    </button>
                    <div className="sa-confirm-button-container">
                        <button className="confirm" tabindex="1"
                                style={styles.submitBtn}
                                onClick={submit}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </ModalDialog>
        }
    </ModalContainer>
)

export default wrap(Prompt);