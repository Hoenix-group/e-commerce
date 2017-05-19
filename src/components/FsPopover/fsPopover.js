import React, {PropTypes} from 'react';
import {View, Text, TouchableHighlight, Platform, Modal} from 'react-native';
// import Modal from 'react-native-root-modal';
import Styles from './fsPopoverStyle';

class FsPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  hideModal = ({callbackHide = undefined}) => {
    this.setState({
      visible: false
    });
    if (callbackHide) {
      callbackHide();
    }
  };

  render() {
    const {modalBoxRight, modalBoxtop, modalBoxheight, modalBoxwidth, modalBoxbackgroundColor} = this.props;
    const {arrowBoxRight, arrowBoxtop, arrowBoxheight, arrowBoxwidth, arrowBoxbackgroundColor} = this.props;
    const {maskColor, maskOpacity} = this.props;
    const {renderContent, opacity, callbackHide} = this.props;
    const modalRight = modalBoxRight || 10;
    const modaltopTemp = modalBoxtop || 60;
    const madaltop = Platform.OS === 'ios' ? modaltopTemp : modaltopTemp - 20;
    const modalheight = modalBoxheight || 150;
    const modalwidth = modalBoxwidth || 110;
    const modalbackgroundColor = modalBoxbackgroundColor || 'black';
    const arrowRight = arrowBoxRight || 25;
    const arrowtopTemp = arrowBoxtop || -4;
    const arrowtop = Platform.OS === 'ios' ? arrowtopTemp + 44 : arrowtopTemp + 24;
    const arrowheight = arrowBoxheight || 20;
    const arrowwidth = arrowBoxwidth || 20;
    const arrowbackgroundColor = arrowBoxbackgroundColor || 'black';
    const allOpacity = opacity || 0.6;
    const maskStyleColor = maskColor || 'black';
    const maskStyleOpacity = maskOpacity || 0.2;
    return (
      <View style={Styles.container}>
        <Modal visible={this.state.visible} animationType={'none'} transparent onRequestClose={() => {this.hideModal({callbackHide})}}>
          <View style={[Styles.arrow, {right: arrowRight, top: arrowtop, borderBottomColor: 'rgba(0,0,0,0)', borderLeftColor: 'rgba(0,0,0,0)', borderRightColor: 'rgba(0,0,0,0)', borderTopColor:'rgba(0,0,0,0.6)', borderWidth: arrowheight, width: arrowwidth}]}/>
          <View style={{flex: 1}}>
            <View style={[Styles.modalContainer, {right: modalRight, top: madaltop, height: modalheight, width: modalwidth, backgroundColor: modalbackgroundColor, opacity: allOpacity}]}>
              
              {renderContent}
            </View>
            <TouchableHighlight style={[Styles.maskStyle, {backgroundColor: maskStyleColor, opacity: maskStyleOpacity}]} underlayColor="#fff" onPress={() => { this.hideModal({callbackHide}) }}>
              <View/>
            </TouchableHighlight>
          </View>
        </Modal>
      </View>);
  }
}
FsPopover.propTypes = {
  // renderContent: PropTypes.func || PropTypes.element,
  modalBoxRight: PropTypes.number,
  modalBoxtop: PropTypes.number,
  modalBoxheight: PropTypes.number,
  modalBoxwidth: PropTypes.number,
  modalBoxbackgroundColor: PropTypes.string,
  arrowBoxRight: PropTypes.number,
  arrowBoxtop: PropTypes.number,
  arrowBoxheight: PropTypes.number,
  arrowBoxwidth: PropTypes.number,
  arrowBoxbackgroundColor: PropTypes.string,
  opacity: PropTypes.number,
  maskColor: PropTypes.string,
  maskOpacity: PropTypes.number,
  callbackHide: PropTypes.func
}
export default FsPopover;
