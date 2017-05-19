import Dimensions from 'Dimensions';
import createStyle from './../../themes/baseStyle';

export default createStyle({
  containerWithNav: {
    flex: 11,
  },
  container: {
    marginTop: 10,
  },
  content: {
    marginTop: 2,
    marginBottom: 0,
  },
  receiverName: {
    marginTop: -12,
    color: 'black',
    fontSize: 16,
  },
  textSelected: {
    borderColor: '#108EE9',
    color: '#108EE9',
  },
  popupTitleContainer: {
    width: Dimensions.get('window').width,
    borderBottomWidth: 1,
    borderBottomColor: '#ADADAD',
    marginBottom: 5,
  },
  popupTitle: {
    color: '#ADADAD',
    fontSize: 18,
    lineHeight: 30,
    marginBottom: 5,
    marginLeft: 10,
  },
  closeIcon: {
    width: 30,
    height: 30,
    position: 'absolute',
    right: 3,
    top: 3,
  },
  eInvoiceItem: {
    width: 339,
    height: 44,
    backgroundColor: '#0083e0',
    marginBottom: 5,
  },
  bottomArea: {
    flex: 1,
    flexDirection: 'row',
    bottom: 0,
  },
  bottomLeft: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'grey',
  },
  bottomRight: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    height: 50,
    backgroundColor: '#108EE9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
