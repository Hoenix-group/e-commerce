import createStyle from './../../themes/baseStyle';

export default createStyle({
  containerWithNav: {
    flex: 11,
  },
  deviceName: {
    marginTop: 8,
  },
  image: {
    height: 100,
    width: 100,
    marginTop: 20,
    marginBottom: 15,
    marginLeft: 15,
  },
  type: {
    width: 110,
    color: '#108EE9',
    borderWidth: 2,
    borderColor: '#108EE9',
    fontSize: 18,
    textAlign: 'center',
    marginLeft: 20,
    marginTop: 10,
    paddingTop: 3,
    paddingRight: 7,
    paddingBottom: 3,
    paddingLeft: 7,
  },
  bottomArea: {
    flex: 1,
    flexDirection: 'row',
    bottom: 0,
  },
  button: {
    flex: 1,
    height: 50,
    backgroundColor: '#108EE9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
