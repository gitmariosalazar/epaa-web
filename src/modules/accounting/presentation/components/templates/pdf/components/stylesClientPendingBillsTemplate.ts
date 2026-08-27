import { StyleSheet } from '@react-pdf/renderer';

// Font registration can be added if needed, but defaults are usually sufficient for standard text.
// Default Helvetica is provided by react-pdf.

export const colors = {
  primary: '#0f172a',    // For titles and main texts
  secondary: '#334155',  // For subtexts
  accent: '#0369a1',     // For table headers, EPAA branding color
  border: '#cbd5e1',     // Light borders
  backgroundAlt: '#f8fafc', // Alternate row colors
  muted: '#64748b',      // Muted text
  grandTotalBg: '#f1f5f9',
  grandTotalText: '#0f766e',
};

export const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: colors.primary,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 'auto',
  },
  headerTextContainer: {
    alignItems: 'flex-end',
  },
  companyName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    textAlign: 'right',
  },
  rucText: {
    fontSize: 9,
    color: colors.secondary,
    marginTop: 2,
    textAlign: 'right',
  },
  documentTitleContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  documentTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 16,
    color: '#1e3a8a', // Dark blue
    textTransform: 'uppercase',
  },
  clientInfoCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clientInfoCol: {
    flex: 1,
  },
  clientInfoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  clientInfoLabel: {
    fontFamily: 'Helvetica-Bold',
    width: 90,
  },
  clientInfoValue: {
    flex: 1,
    color: colors.secondary,
  },
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: '#0284c7', // Sky blue
    marginBottom: 6,
    marginTop: 10,
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0ea5e9', // Blue header background
    color: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableHeaderSecondary: {
    flexDirection: 'row',
    backgroundColor: '#fde047', // Yellow header background (for Tasa Basura)
    color: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableHeaderTertiary: {
    flexDirection: 'row',
    backgroundColor: '#93c5fd', // Light blue (for Mejoras)
    color: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableRowAlt: {
    backgroundColor: colors.backgroundAlt,
  },
  tableColHeader: {
    padding: 6,
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.1)',
  },
  tableCol: {
    padding: 6,
    fontSize: 9,
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  tableColRight: {
    padding: 6,
    fontSize: 9,
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    textAlign: 'right',
  },
  colPeriod: { flex: 2 },
  colLast: { borderRightWidth: 0 },
  grandTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  grandTotalBox: {
    flexDirection: 'row',
    backgroundColor: colors.grandTotalBg,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  grandTotalLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    marginRight: 15,
  },
  grandTotalValue: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 14,
    color: colors.grandTotalText,
  }
});
