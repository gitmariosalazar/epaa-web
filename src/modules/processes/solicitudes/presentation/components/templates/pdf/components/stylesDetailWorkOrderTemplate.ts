import { StyleSheet } from '@react-pdf/renderer';
export const colors = {
  primary: '#1a5276',
  primaryLight: '#2980b9',
  accent: '#c0392b',
  accentSoft: '#e74c3c',
  dark: '#2c3e50',
  muted: '#7f8c8d',
  lightBg: '#f4f7f9',
  border: '#d5d8dc',
  white: '#ffffff',
  green: '#1e8449'
};

export const styles = StyleSheet.create({
  page: {
    paddingTop: 103,
    paddingBottom: 85,
    paddingHorizontal: 35,
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    color: colors.dark,
    lineHeight: 1.4
  },

  // ========== HEADER ==========
  header: {
    position: 'absolute',
    top: 22,
    left: 35,
    right: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 0
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  logo: {
    width: 32 + 15,
    height: 58 + 15,
    objectFit: 'contain'
  },
  companyName: {
    fontSize: 8.5,
    color: colors.primary,
    fontFamily: 'Helvetica-Bold',
    width: 280,
    lineHeight: 1.3
  },
  generatedDate: {
    fontSize: 7.5,
    color: colors.muted,
    textAlign: 'right'
  },

  // ========== SOLICITUD BOX ==========
  solicitudWrapper: {
    alignItems: 'flex-end',
    marginBottom: 2
  },
  solicitudBox: {
    borderWidth: 0.5,
    borderColor: colors.dark,
    borderRadius: 3,
    paddingVertical: 0,
    paddingHorizontal: 10,
    minWidth: 210,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightBg
  },
  solicitudTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
    letterSpacing: 0.5,
    marginTop: 5
  },
  reqNumber: {
    color: colors.accent,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    marginTop: 3,
    letterSpacing: 0.8
  },
  labelNumber: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    marginTop: 3,
    color: colors.dark
  },
  reqDate: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    marginTop: 0,
    color: colors.dark
  },

  // ========== ESPECIE VALORADA ==========
  especieContainer: {
    alignItems: 'center',
    marginBottom: 14
  },
  especieLabel: {
    fontSize: 8.5,
    color: colors.muted,
    letterSpacing: 0.3
  },
  especieValue: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    marginTop: 2,
    color: colors.dark
  },

  // ========== CLIENT INFO ==========
  clientInfoContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 3,
    padding: 8,
    marginBottom: 10,
    marginTop: 6,
    backgroundColor: '#fdfefe' // Un blanco muy sutil
  },
  clientTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: colors.primary,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 3
  },
  clientInfoRow: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'center'
  },
  clientInfoLabel: {
    width: 80,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: colors.muted
  },
  clientInfoValue: {
    flex: 1,
    fontSize: 7.5,
    color: colors.dark
  },

  bannerInspectionMain: {
    backgroundColor: colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 2,
    marginTop: 2,
    marginBottom: 8
  },

  // ========== BANNERS ==========
  banner: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 2,
    marginTop: 2,
    marginBottom: 8
  },
  bannerText: {
    color: colors.white,
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    letterSpacing: 0.6,
    textAlign: 'center'
  },

  sectionNote: {
    fontSize: 7.5,
    color: colors.muted,
    marginBottom: 8,
    fontStyle: 'italic'
  },

  // ========== FORM ROWS ==========
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkbox: {
    width: 11,
    height: 11,
    borderWidth: 1,
    borderColor: colors.dark,
    borderRadius: 1.5,
    marginRight: 8,
    marginBottom: 4
  },
  label: {
    fontSize: 9
  },
  inputBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 2,
    width: 90,
    marginLeft: 'auto',
    backgroundColor: '#fafbfc',
    marginBottom: 2,
    paddingVertical: 1,
    minHeight: 18
  },
  inputBoxValue: {
    textAlign: 'center',
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: colors.dark,
    width: '100%',
    marginTop: 4
  },
  inputLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexGrow: 1,
    height: 12,
    marginHorizontal: 6,
    marginBottom: 2
  },

  // ========== OBSERVACIONES ==========
  observationsBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 3,
    minHeight: 45,
    padding: 6,
    marginTop: 8,
    marginBottom: 12,
    backgroundColor: colors.lightBg
  },

  observationsAdditionalBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 3,
    minHeight: 150,
    padding: 6,
    marginTop: 8,
    marginBottom: 12,
    backgroundColor: colors.lightBg
  },
  obsTitle: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: colors.muted,
    marginBottom: 4,
    letterSpacing: 0.4
  },
  obsContent: {
    fontSize: 9,
    fontStyle: 'italic',
    color: colors.dark
  },

  // ========== TABLES ==========
  table: {
    width: '100%',
    marginBottom: 10
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.muted,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2
  },
  tableHeaderText: {
    color: colors.white,
    fontFamily: 'Helvetica-Bold',
    fontSize: 7.5,
    marginTop: 5
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eaecee',
    borderRightWidth: 1,
    borderLeftWidth: 1,
    paddingVertical: 3, // Aumentado ligeramente para mejor lectura sin el margen
    paddingHorizontal: 4
  },
  tableRowAlt: {
    backgroundColor: '#f8f9fa'
  },
  tableCell: {
    fontSize: 7.5,
    marginTop: 4
  },
  colCode: { width: '14%' },
  colMaterial: { width: '42%' },
  colQty: { width: '12%', textAlign: 'center' },
  colUnit: { width: '16%', textAlign: 'right' },
  colSub: { width: '16%', textAlign: 'right' },
  colName: { width: '75%' },
  colResp: { width: '25%', textAlign: 'center' },

  tableTotal: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2
  },
  tableTotalText: {
    color: colors.white,
    fontFamily: 'Helvetica-Bold',
    fontSize: 7.5,
    marginTop: 5
  },

  // ========== SIGNATURES ==========
  signatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 5
  },
  sigBox: {
    width: '24%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 3,
    height: 85,
    padding: 4,
    justifyContent: 'space-between',
    backgroundColor: '#fafbfc',
    marginTop: 25
  },
  sigTitle: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    color: colors.primary,
    letterSpacing: 0.3
  },
  sigLine: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 4,
    fontSize: 6,
    textAlign: 'center',
    color: colors.muted
  },

  // ========== FOOTER ==========
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 35,
    right: 35
  },
  footerLine: {
    borderTopWidth: 1.5,
    borderTopColor: colors.accent,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerBadge: {
    backgroundColor: colors.green,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 2
  },
  footerBadgeTitle: {
    color: colors.white,
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.5
  },
  footerBadgeSub: {
    color: colors.white,
    fontSize: 5.5,
    marginTop: 1
  },
  footerInfo: {
    fontSize: 6.5,
    color: colors.muted,
    textAlign: 'right',
    lineHeight: 1.45
  }
});

export interface ConnectionInfo {
  cadastralKey?: string;
  meterNumber?: string;
  address?: string;
  status?: string;
  rateType?: string;
  diameter?: string;
  distanceToNetwork?: number;
  installationDate: Date | string;
  location: {
    longitude: number;
    latitude: number;
  };
  securitySeals?: string;
}
