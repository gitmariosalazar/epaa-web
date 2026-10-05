import { StyleSheet } from '@react-pdf/renderer';

// Font registration can be added if needed, but defaults are usually sufficient for standard text.
// Default Helvetica is provided by react-pdf.

export const colors = {
  primary: '#0f172a', // For titles and main texts
  secondary: '#334155', // For subtexts
  accent: '#0369a1', // For table headers, EPAA branding color
  border: '#cbd5e1', // Light borders
  backgroundAlt: '#f8fafc', // Alternate row colors
  muted: '#64748b', // Muted text
  grandTotalBg: '#f1f5f9',
  grandTotalText: '#0f766e'
};

export const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: colors.primary,
    backgroundColor: '#ffffff',
    padding: 0,
    margin: 0
  },
  contentWrapper: {
    paddingTop: 5,
    paddingBottom: 120,
    paddingLeft: 45,
    paddingRight: 45,
    flex: 1
  },
  headerSpacer: {
    height: 85
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 595.28,
    height: 841.89,
    zIndex: -1,
    objectFit: 'fill'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  headerTextContainer: {
    alignItems: 'center'
  },
  companyName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    textAlign: 'center'
  },
  rucText: {
    fontSize: 9,
    color: colors.secondary,
    marginTop: 2,
    textAlign: 'center'
  },
  documentTitleContainer: {
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center'
  },
  documentTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 16,
    color: '#1e3a8a', // Dark blue
    textTransform: 'uppercase'
  },
  clientInfoCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  clientInfoCol: {
    flex: 1
  },
  clientInfoRow: {
    flexDirection: 'row',
    marginBottom: 6
  },
  clientInfoLabel: {
    fontFamily: 'Helvetica-Bold',
    width: 90
  },
  clientInfoValue: {
    flex: 1,
    color: colors.secondary
  },
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: '#0284c7', // Sky blue
    marginBottom: 6,
    marginTop: 5
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: colors.border,
    borderLeftColor: colors.border,
    marginBottom: 15
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0ea5e9', // Blue header background
    color: '#ffffff'
  },
  tableHeaderSecondary: {
    flexDirection: 'row',
    backgroundColor: '#fde047', // Yellow header background (for Tasa Basura)
    color: '#0f172a'
  },
  tableHeaderTertiary: {
    flexDirection: 'row',
    backgroundColor: '#93c5fd', // Light blue (for Mejoras)
    color: '#0f172a'
  },
  tableRow: {
    flexDirection: 'row'
  },
  tableRowAlt: {
    backgroundColor: colors.backgroundAlt
  },
  tableColHeader: {
    padding: 6,
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    flex: 1,
    borderStyle: 'solid',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderRightColor: colors.border,
    borderBottomColor: colors.border
  },
  tableCol: {
    padding: 6,
    fontSize: 9,
    flex: 1,
    borderStyle: 'solid',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderRightColor: colors.border,
    borderBottomColor: colors.border
  },
  tableColRight: {
    padding: 6,
    fontSize: 9,
    flex: 1,
    borderStyle: 'solid',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderRightColor: colors.border,
    borderBottomColor: colors.border,
    textAlign: 'right'
  },
  colPeriod: { flex: 2 },
  grandTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10
  },
  grandTotalBox: {
    flexDirection: 'row',
    backgroundColor: colors.grandTotalBg,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  grandTotalLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    marginRight: 15
  },
  grandTotalValue: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 14,
    color: colors.grandTotalText
  }
});
