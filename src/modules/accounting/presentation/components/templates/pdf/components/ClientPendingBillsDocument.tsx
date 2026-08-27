import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
} from '@react-pdf/renderer';
import { styles } from './stylesClientPendingBillsTemplate';
import { type ClientPendingBillGroup } from '../../../../hooks/pending-readings/useClientPendingBills';

interface Props {
  groups: ClientPendingBillGroup[];
}

export const ClientPendingBillsDocument: React.FC<Props> = ({ groups }) => {
  const fmt = (num: number) => `$${num.toFixed(2)}`;

  return (
    <Document>
      {groups.map((group, index) => (
        <Page key={`page-${index}`} size="A4" style={styles.page}>
          
          {/* HEADER */}
          <View style={styles.headerRow} fixed>
            <View style={styles.logoContainer}>
              <Image source="/epaa.png" style={styles.logo} />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.companyName}>
                EMPRESA PÚBLICA DE AGUA POTABLE{'\n'}
                Y ALCANTARILLADO ANTONIO ANTE
              </Text>
              <Text style={styles.rucText}>RUC: 1060000280001</Text>
            </View>
          </View>

          {/* DOCUMENT TITLE */}
          <View style={styles.documentTitleContainer}>
            <Text style={styles.documentTitle}>DETALLE DE PLANILLA Y DEUDA</Text>
          </View>

          {/* CLIENT INFO BOX */}
          <View style={styles.clientInfoCard}>
            <View style={styles.clientInfoCol}>
              <View style={styles.clientInfoRow}>
                <Text style={styles.clientInfoLabel}>Contribuyente:</Text>
                <Text style={styles.clientInfoValue}>{group.clientName || 'CONSUMIDOR FINAL'}</Text>
              </View>
              <View style={styles.clientInfoRow}>
                <Text style={styles.clientInfoLabel}>Identificación:</Text>
                <Text style={styles.clientInfoValue}>{group.clientId || '9999999999'}</Text>
              </View>
              <View style={styles.clientInfoRow}>
                <Text style={styles.clientInfoLabel}>Dirección:</Text>
                <Text style={styles.clientInfoValue}>{group.address || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.clientInfoCol}>
              <View style={styles.clientInfoRow}>
                <Text style={styles.clientInfoLabel}>Clave Catastral:</Text>
                <Text style={styles.clientInfoValue}>{group.cadastralKey}</Text>
              </View>
              <View style={styles.clientInfoRow}>
                <Text style={styles.clientInfoLabel}>Tarifa:</Text>
                <Text style={styles.clientInfoValue}>{group.rate || 'RESIDENCIAL'}</Text>
              </View>
              <View style={styles.clientInfoRow}>
                <Text style={styles.clientInfoLabel}>Estado:</Text>
                <Text style={styles.clientInfoValue}>ACTIVO</Text>
              </View>
            </View>
          </View>

          {/* PLANILLA GENERAL TABLE */}
          <Text style={styles.sectionTitle}>Planilla General</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableColHeader, styles.colPeriod]}>Periodo</Text>
              <Text style={[styles.tableColHeader, { textAlign: 'center' }]}>Consumo (m³)</Text>
              <Text style={[styles.tableColHeader, { textAlign: 'right' }]}>Valor EPAA</Text>
              <Text style={[styles.tableColHeader, { textAlign: 'right' }]}>Interés</Text>
              <Text style={[styles.tableColHeader, { textAlign: 'right' }]}>Recargo</Text>
              <Text style={[styles.tableColHeader, styles.colLast, { textAlign: 'right' }]}>Total</Text>
            </View>
            
            {group.bills.map((bill, i) => (
              <View key={`general-${i}`} style={[styles.tableRow, i % 2 !== 0 ? styles.tableRowAlt : {}]} wrap={false}>
                <Text style={[styles.tableCol, styles.colPeriod]}>{bill.month} - {bill.year}</Text>
                <Text style={[styles.tableCol, { textAlign: 'center' }]}>{bill.consumption.toFixed(1)}</Text>
                <Text style={styles.tableColRight}>{fmt(Number(bill.epaaValue))}</Text>
                <Text style={styles.tableColRight}>{fmt(Number(bill.interestValue))}</Text>
                <Text style={styles.tableColRight}>{Number(bill.surcharge) === 0 ? '-' : fmt(Number(bill.surcharge))}</Text>
                <Text style={[styles.tableColRight, styles.colLast]}>{fmt(Number(bill.total))}</Text>
              </View>
            ))}
          </View>

          {/* DETALLE TASA BASURA TABLE */}
          <Text style={styles.sectionTitle}>Detalle Tasa Basura</Text>
          <View style={styles.table}>
            <View style={styles.tableHeaderSecondary}>
              <Text style={[styles.tableColHeader, styles.colPeriod]}>Periodo</Text>
              <Text style={[styles.tableColHeader, { textAlign: 'center' }]}>TB Actual</Text>
              <Text style={[styles.tableColHeader, { textAlign: 'center' }]}>TB Anterior</Text>
              <Text style={[styles.tableColHeader, { textAlign: 'center' }]}>Saldo a Favor</Text>
              <Text style={[styles.tableColHeader, { textAlign: 'center' }]}>Saldo (Próx. Mes)</Text>
              <Text style={[styles.tableColHeader, styles.colLast, { textAlign: 'right' }]}>Total a Pagar</Text>
            </View>
            
            {group.bills.map((bill, i) => (
              <View key={`trash-${i}`} style={[styles.tableRow, i % 2 !== 0 ? styles.tableRowAlt : {}]} wrap={false}>
                <Text style={[styles.tableCol, styles.colPeriod]}>{bill.month} - {bill.year}</Text>
                <Text style={[styles.tableColRight, { textAlign: 'center' }]}>{fmt(Number(bill.trashRateOfficial))}</Text>
                <Text style={[styles.tableColRight, { textAlign: 'center' }]}>{fmt(Number(bill.trashRatePrevious))}</Text>
                <Text style={[styles.tableColRight, { textAlign: 'center' }]}>{Number(bill.balanceInFavorCurrentMonth) === 0 ? '-' : fmt(Number(bill.balanceInFavorCurrentMonth))}</Text>
                <Text style={[styles.tableColRight, { textAlign: 'center' }]}>{Number(bill.balanceInFavorNextMonth) === 0 ? '-' : fmt(Number(bill.balanceInFavorNextMonth))}</Text>
                <Text style={[styles.tableColRight, styles.colLast]}>{fmt(Number(bill.totalTrashRate))}</Text>
              </View>
            ))}
          </View>

          {/* MEJORAS MUNICIPIO TABLE */}
          <Text style={styles.sectionTitle}>Mejoras Municipio Antonio Ante</Text>
          <View style={styles.table}>
            <View style={styles.tableHeaderTertiary}>
              <Text style={[styles.tableColHeader, { flex: 2 }]}>Periodo</Text>
              <Text style={[styles.tableColHeader, { flex: 1, textAlign: 'center' }]}>Valor Mejoras</Text>
              <Text style={[styles.tableColHeader, styles.colLast, { flex: 1, textAlign: 'right' }]}>Total a Pagar</Text>
            </View>
            
            {group.bills.map((bill, i) => (
              <View key={`improvements-${i}`} style={[styles.tableRow, i % 2 !== 0 ? styles.tableRowAlt : {}]} wrap={false}>
                <Text style={[styles.tableCol, { flex: 2 }]}>{bill.month} - {bill.year}</Text>
                <Text style={[styles.tableColRight, { flex: 1, textAlign: 'center' }]}>$0.00</Text>
                <Text style={[styles.tableColRight, styles.colLast, { flex: 1 }]}>$0.00</Text>
              </View>
            ))}
          </View>

          {/* GRAN TOTAL */}
          <View style={styles.grandTotalContainer} wrap={false}>
            <View style={styles.grandTotalBox}>
              <Text style={styles.grandTotalLabel}>GRAN TOTAL:</Text>
              <Text style={styles.grandTotalValue}>{fmt(group.totalToPay)}</Text>
            </View>
          </View>

        </Page>
      ))}
    </Document>
  );
};
