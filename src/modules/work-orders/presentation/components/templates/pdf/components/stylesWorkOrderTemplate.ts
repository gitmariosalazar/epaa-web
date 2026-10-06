import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    fontFamily: 'Courier',
    fontSize: 9,
    color: '#000000',
    backgroundColor: '#ffffff',
    paddingTop: 12,
    paddingBottom: 20,
    paddingLeft: 30,
    paddingRight: 30
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'column'
  },
  // Header Logo & Company Text
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 4
  },
  epaaBrandBox: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 10
  },
  epaaText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 20,
    color: '#1e3a5f',
    letterSpacing: 1
  },
  epaaSubText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
    color: '#1e3a5f',
    marginTop: -2
  },
  waterIconContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20
  },
  companyTitleBox: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  companyName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.5,
    color: '#1e3a5f',
    textAlign: 'right',
    marginBottom: 1
  },
  // Document Main Title
  orderTitle: {
    fontFamily: 'Courier-Bold',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8
  },
  // Dotted Line Separator
  dottedDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'dotted',
    marginTop: 3,
    marginBottom: 5,
    width: '100%'
  },
  // Metadata Section
  metaSection: {
    marginBottom: 2
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 2,
    alignItems: 'center'
  },
  metaRowTwoCol: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 2,
    alignItems: 'center'
  },
  metaColLeft: {
    flexDirection: 'row',
    width: '58%',
    alignItems: 'center'
  },
  metaColRight: {
    flexDirection: 'row',
    width: '42%',
    alignItems: 'center'
  },
  metaLabel: {
    fontFamily: 'Courier-Bold',
    fontSize: 9,
    width: 135
  },
  metaLabelWide: {
    fontFamily: 'Courier-Bold',
    fontSize: 9,
    width: 215
  },
  metaLabelLeft: {
    fontFamily: 'Courier-Bold',
    fontSize: 9,
    width: 135
  },
  metaLabelRight: {
    fontFamily: 'Courier-Bold',
    fontSize: 9,
    width: 90
  },
  metaValue: {
    fontFamily: 'Courier',
    fontSize: 9,
    flex: 1
  },
  metaInlineGroup: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  metaInlineLabel: {
    fontFamily: 'Courier-Bold',
    fontSize: 9,
    marginLeft: 10,
    marginRight: 4
  },
  metaInlineValue: {
    fontFamily: 'Courier',
    fontSize: 9
  },
  // Description of Work
  descHeader: {
    fontFamily: 'Courier-Bold',
    fontSize: 9,
    marginTop: 2,
    marginBottom: 2
  },
  descText: {
    fontFamily: 'Courier-Bold',
    fontSize: 8.5,
    marginBottom: 4
  },
  // Table Section
  tableContainer: {
    marginTop: 4,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#000000',
    borderStyle: 'solid',
    flexDirection: 'column'
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    backgroundColor: '#ffffff'
  },
  tableHeaderCellLeft: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.5,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 4,
    paddingRight: 4,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderRightStyle: 'solid'
  },
  tableHeaderCroquisCell: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.5,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 4,
    paddingRight: 4,
    textAlign: 'center',
    letterSpacing: 4,
    width: '40%'
  },
  tableBodyContainer: {
    flexDirection: 'row'
  },
  tableLeftColumns: {
    width: '60%',
    flexDirection: 'column'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    height: 18
  },
  tableRowLast: {
    flexDirection: 'row',
    height: 18
  },
  tableRowGray: {
    backgroundColor: '#d1d5db'
  },
  tableRowWhite: {
    backgroundColor: '#ffffff'
  },
  cellCantidad: {
    width: '23%',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
    justifyContent: 'center',
    paddingLeft: 4,
    paddingRight: 4
  },
  cellDescripcion: {
    width: '54%',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
    justifyContent: 'center',
    paddingLeft: 4,
    paddingRight: 4
  },
  cellCaract: {
    width: '23%',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
    justifyContent: 'center',
    paddingLeft: 4,
    paddingRight: 4
  },
  croquisBoxRight: {
    width: '40%',
    backgroundColor: '#ffffff'
  },
  cellText: {
    fontFamily: 'Courier',
    fontSize: 8
  },
  // Execution & Observation Block
  executionSection: {
    marginTop: 2,
    marginBottom: 6
  },
  dotsLine: {
    fontFamily: 'Courier',
    fontSize: 9,
    marginTop: 1,
    marginBottom: 1
  },
  // Signatures Section — Pushed to the bottom of the page
  signaturesSection: {
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingTop: 15,
    paddingBottom: 15
  },
  signatureBox: {
    width: '40%',
    alignItems: 'center'
  },
  signatureDottedLine: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'dotted',
    marginBottom: 4
  },
  signatureLabel: {
    fontFamily: 'Courier-Bold',
    fontSize: 9,
    textAlign: 'center'
  }
});
