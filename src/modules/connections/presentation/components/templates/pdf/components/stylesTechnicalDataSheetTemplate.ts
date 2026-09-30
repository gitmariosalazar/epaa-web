import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 11,
    color: '#000000',
    backgroundColor: '#ffffff'
  },
  contentWrapper: {
    paddingTop: 75,
    paddingBottom: 80,
    paddingLeft: 50,
    paddingRight: 50,
    flex: 1
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    objectFit: 'fill'
  },
  documentTitle: {
    fontSize: 16,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  infoSection: {
    marginBottom: 15,
    lineHeight: 0.75
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5
  },
  infoLabel: {
    width: 100,
    fontFamily: 'Times-Roman'
  },
  infoValue: {
    flex: 1
  },
  infoValueEmpty: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'dotted'
  },
  bodyText: {
    marginTop: 0,
    lineHeight: 1,
    textAlign: 'justify'
  },
  articleText: {
    marginTop: 10,
    lineHeight: 1,
    textAlign: 'justify',
    fontFamily: 'Times-BoldItalic'
  },
  footerText: {
    marginTop: 15,
    lineHeight: 1,
    textAlign: 'justify'
  },
  signaturesContainer: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  signatureBox: {
    width: '45%',
    alignItems: 'center'
  },
  signatureSpace: {
    height: 50,
    width: '100%'
  },
  signatureLineDotted: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'dotted',
    marginBottom: 10
  },
  signatureLabel: {
    fontFamily: 'Times-Bold'
  },
  signatureSubLine: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-end' // align text to the bottom of the line
  },
  signatureSubLabel: {
    fontFamily: 'Times-Bold',
    marginRight: 5
  },
  dottedFill: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'dotted',
    marginBottom: 2 // adjust alignment to text baseline
  },
  bold: {
    fontFamily: 'Times-Bold'
  },
  boldItalic: {
    fontFamily: 'Times-BoldItalic'
  },
  dateText: {
    fontFamily: 'Times-Roman',
    textAlign: 'right',
    marginBottom: 0
  },
  signatureValue: {
    flex: 1
  },
  signatureValueEmpty: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'dotted'
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    position: 'relative'
  },

  documentControl: {
    position: 'absolute',
    right: 0,
    width: 200,
    textAlign: 'right',
    fontSize: 13,
    fontFamily: 'Times-Bold',
    fontWeight: 'bold',
    color: 'red'
  }
});
