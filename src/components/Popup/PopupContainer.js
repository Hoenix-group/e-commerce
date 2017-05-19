import React from 'react';
import styles from './styles';
import Modal from 'rc-dialog/lib/Modal';

export default class PopupContainer extends React.Component {
  constructor(props) {
    super(props);
    this.onMaskClose = () => {
      const onMaskClose = this.props.onMaskClose;
      if (onMaskClose) {
        const res = onMaskClose();
        if (res && res.then) {
          res.then(() => {
            this.hide();
          });
        } else {
          this.hide();
        }
      }
    };
    this.state = {
      visible: props.visible || false,
    };
  }
  hide() {
    this.setState({
      visible: false,
    });
  }
  render() {
    return (<Modal onAnimationEnd={this.props.onAnimationEnd} animationType={this.props.animationType} wrapStyle={this.props.animationType === 'slide-up' ? styles.wrap : styles.wrapTop} visible={this.state.visible} maskClosable={this.props.maskClosable} onClose={this.onMaskClose}>
      {this.props.children}
    </Modal>);
  }
}
