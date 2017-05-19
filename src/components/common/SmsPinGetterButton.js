import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { Button } from 'antd-mobile';
import { Text } from 'react-native';
import Util from './../../utils/utils';
import formStyles from './../../routes/appointment/formStyles';

class SmsPinGetterButton extends Component {

  componentDidMount() {
    // this.props.dispatch({ type: 'smsPinGetter/initButtonState' });
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'smsPinGetter/resetButtonState' });
  }

  onButtonClicked() {
    const result = this.props.getValidate();
    if (result) {
      const timerCode = setInterval(() => {
        this.props.dispatch({ type: 'smsPinGetter/updateSeconds', seconds: this.props.seconds - 1 });
      }, 1000);
      this.props.dispatch({ type: 'smsPinGetter/setTimerCode', timerCode });
    }
  }

  render() {
    Util.consoleLog('this.props.disabled: ', this.props.disabled);
    return (
      <Button
        type="primary"
        size="small"
        style={formStyles.buttonSmall}
        disabled={this.props.disabled}
        onClick={() => this.onButtonClicked()}
      >
        <Text style={formStyles.buttonSmallText}>{this.props.disabled ? `(${this.props.seconds})` : '获取验证码'}</Text>
      </Button>
    );
  }
}

SmsPinGetterButton.propTypes = {
  dispatch: PropTypes.func,
  seconds: PropTypes.number,
  disabled: PropTypes.bool,
  getValidate: PropTypes.func,
};


const mapStateToProps = state => ({
  seconds: state.smsPinGetter.seconds,
  disabled: state.smsPinGetter.disabled,
});

export default connect(mapStateToProps)(SmsPinGetterButton);
