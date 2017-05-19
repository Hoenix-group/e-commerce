import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Animated,
  Image
} from 'react-native';

const styles = StyleSheet.create({
  background: {
    height: 100,
    alignItems: 'center',
    overflow: 'hidden'
  },
  gear: {
    marginTop: 10
  }
})

export default class RefreshingIndicator extends Component {
  constructor(props) {
    super(props)
    this.state = { animating: false }
  }

  componentWillMount() {
    this._gearRotate = new Animated.Value(0)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.refreshing && !this.state.animating) {
      return this.triggerAnimation(() => {
        this._gearRotate.setValue(0)
        this.setState({ animating: false })
      })
    }
  }

  triggerAnimation(cb) {
    this.setState({ animating: true })
    Animated.parallel([
      Animated.timing(this._gearRotate, {
        toValue: 200,
        duration: 3000
      })
    ]).start(cb)
  }

  render() {

    const {isHolding} = this.props;
    const interpolatedGearRotation = this._gearRotate.interpolate({
      inputRange: [0, 200],
      outputRange: ['0deg', '3000deg']
    })

    return (
      <View style={styles.background}>
        <Animated.Image
          style={[styles.gear, {
            height: 40,
            width: 40,
            transform: [
              {rotate: interpolatedGearRotation }
            ]
          }]}
          source={require('../../../images/common/GearThree.png')}
        />
        {isHolding?<Text>松手刷新</Text>:null}
      </View>
    )
  }
}
