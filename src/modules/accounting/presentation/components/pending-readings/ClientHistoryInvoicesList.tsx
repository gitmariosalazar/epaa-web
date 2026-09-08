import React, { useState } from 'react';
import { Droplets, MapPin, Recycle, FileText, Download, CheckCircle, Building } from 'lucide-react';
import { type ClientHistoryInvoiceGroup } from '../../hooks/pending-readings/useClientHistoryInvoices';
import { CurrencyFormatter } from '@/shared/utils/formatters/CurrencyFormatter';
import { Button } from '@/shared/presentation/components/Button/Button';
import '../pending-readings/ClientPendingBillsList.css'; // Reusing CSS
import { ClientPendingBillsPdfGenerator } from '../templates/pdf/ClientPendingBillsPdfGenerator';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { DataList, type Column } from '@/shared/presentation/components/Table/DataList';
import { useHistoryInvoicesSummary } from '../../hooks/pending-readings/useHistoryInvoicesSummary';
import { PendingBillsStatCards } from '../pending-readings/PendingBillsStatCards';
import { PendingBillsGlobalFooter } from './PendingBillsGlobalFooter';

interface ClientHistoryInvoicesListProps {
  groups: ClientHistoryInvoiceGroup[];
  isLoading: boolean;
}

export const ClientHistoryInvoicesList: React.FC<ClientHistoryInvoicesListProps> = ({
  groups,
  isLoading
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const pdfGenerator = new ClientPendingBillsPdfGenerator();

  const handleDownloadGlobal = async () => {
    if (groups.length === 0) return;
    setIsGeneratingPdf(true);
    try {
      const adaptedGroups = groups.map(group => ({
        ...group,
        bills: group.invoices,
        totalToPay: group.totalPaid
      }));
      await pdfGenerator.downloadPdf(adaptedGroups as any, 'Historial_Pagos_Todos.pdf');
    } catch (error) {
      console.error('Error generating global PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadIndividual = async (group: ClientHistoryInvoiceGroup) => {
    setIsGeneratingPdf(true);
    try {
      const adaptedGroup = {
        ...group,
        bills: group.invoices,
        totalToPay: group.totalPaid
      };
      await pdfGenerator.downloadPdf([adaptedGroup as any], `Historial_Pagos_${group.cadastralKey}.pdf`);
    } catch (error) {
      console.error('Error generating individual PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const { connectionSummaries, globalSummary } = useHistoryInvoicesSummary(groups);

  const columns: Column<ClientHistoryInvoiceGroup>[] = [
    {
      header: 'Historial de Pagos',
      accessor: (group) => group.cadastralKey,
      id: 'planillas',
    }
  ];

  const renderItem = (group: ClientHistoryInvoiceGroup) => {
    return (
      <div className="pending-bill-card">
        {/* Header */}
        <div className="pending-bill-header">
          <div className="header-left">
            <Droplets size={16} className="icon-blue" />
            <span className="clave-text">Clave: {group.cadastralKey}</span>
            <MapPin size={16} className="icon-gray ml-4" />
            <span className="address-text">Direc: {group.address}</span>
          </div>
          <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ColorChip
              label={group.rate}
              size="xs"
              variant='soft'
              color="teal"
            />
            <Button
              variant="outline"
              size="xs"
              isLoading={isGeneratingPdf}
              onClick={() => handleDownloadIndividual(group)}
              leftIcon={<Download size={14} />}
            >
              Descargar Historial
            </Button>
          </div>
        </div>

        {/* Planilla General Table */}
        <div className="pending-bill-section">
          <div className="section-title">
            <FileText size={16} className="icon-blue" />
            <h4>Planilla General (Pagada)</h4>
          </div>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Periodo</th>
                  <th className="text-center">Consumo (m³)</th>
                  <th className="text-right">Valor EPAA</th>
                  <th className="text-right">Interés</th>
                  <th className="text-right">Recargo</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {group.invoices.map((bill, idx) => (
                  <tr key={`general-${idx}`}>
                    <td>
                      <div className="period-cell">
                        <span className="period-month">{bill.month} - {bill.year}</span>
                        {bill.previousReading !== undefined && bill.currentReading !== undefined && (
                          <span className="period-readings">
                            {bill.previousReading} → {bill.currentReading} m³
                          </span>
                        )}
                        <span className="period-due text-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={12} /> Pagado: {bill.paymentDate ? new Date(bill.paymentDate).toISOString().split('T')[0] : 'No'}
                        </span>
                      </div>
                    </td>
                    <td className="text-center font-semibold">{bill.consumption} <span className="text-sm">m³</span></td>
                    <td className="text-right">{CurrencyFormatter.format(Number(bill.epaaValue) || 0)}</td>
                    <td className="text-right">{CurrencyFormatter.format(Number(bill.interestValue) || 0)}</td>
                    <td className="text-right">{CurrencyFormatter.format(Number(bill.surcharge) || 0)}</td>
                    <td className="text-right font-semibold">{CurrencyFormatter.format(Number(bill.total) || 0)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5} className="text-right font-bold text-total">TOTAL PAGADO:</td>
                  <td className="text-right font-bold text-lg text-total">{CurrencyFormatter.format(group.totalGeneral)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Detalle Tasa Basura Table */}
        <div className="pending-bill-section">
          <div className="section-title">
            <Recycle size={16} className="icon-brown" />
            <h4>Detalle Tasa Basura</h4>
          </div>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Periodo</th>
                  <th className="text-right">TB Actual</th>
                  <th className="text-right">TB Anterior</th>
                  <th className="text-right">Total Pagado</th>
                </tr>
              </thead>
              <tbody>
                {group.invoices.map((bill, idx) => (
                  <tr key={`trash-${idx}`}>
                    <td>{bill.month} - {bill.year}</td>
                    <td className="text-right">{CurrencyFormatter.format(Number(bill.trashRateOfficial) || 0)}</td>
                    <td className="text-right">{CurrencyFormatter.format(Number(bill.trashRatePrevious) || 0)}</td>
                    <td className="text-right font-semibold">{CurrencyFormatter.format(Number(bill.totalTrashRate) || 0)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-right font-bold text-total">TOTAL TASA BASURA:</td>
                  <td className="text-right font-bold text-lg text-total">{CurrencyFormatter.format(group.totalTrash)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Mejoras Municipio Table */}
        <div className="pending-bill-section">
          <div className="section-title">
            <Building size={16} className="icon-teal" />
            <h4>Mejoras Municipio Antonio Ante</h4>
          </div>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Periodo</th>
                  <th className="text-right">Valor Mejoras</th>
                  <th className="text-right">Total a Pagar</th>
                </tr>
              </thead>
              <tbody>
                {group.invoices.map((bill, idx) => (
                  <tr key={`improvements-${idx}`}>
                    <td>{bill.month} - {bill.year}</td>
                    {/* Hardcoded 0 for improvements since not in model yet */}
                    <td className="text-right">{CurrencyFormatter.format(0)}</td>
                    <td className="text-right font-semibold">{CurrencyFormatter.format(0)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} className="text-right font-bold text-total">TOTAL MEJORAS:</td>
                  <td className="text-right font-bold text-lg text-total">{CurrencyFormatter.format(group.totalImprovements)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* StatCards por acometida */}
        {(() => {
          const connSummary = connectionSummaries.find(c => c.cadastralKey === group.cadastralKey);
          if (!connSummary) return null;
          const mappedSummary = {
            ...connSummary,
            totalToPay: connSummary.totalPaid,
            billCount: connSummary.invoiceCount,
          };
          return <PendingBillsStatCards summary={mappedSummary as any} />;
        })()}

      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <DataList
        data={groups}
        columns={columns}
        renderItem={(group) => renderItem(group)}
        isLoading={isLoading}
        pagination={true}
        showColumnModal={false}
        showFilters={false}
        showTotalRecords={false}
        showRowsPerPage={true}
        pageSize={1}
        containerClassName="client-pending-bills-container"
        gridClassName="client-pending-bills-grid"
        onExportPdf={handleDownloadGlobal}
      />
      {groups.length > 0 && (
        <div style={{ flexShrink: 0 }}>
          {(() => {
            const mappedGlobalSummary = {
              ...globalSummary,
              totalBills: globalSummary.totalInvoices,
              totalToPay: globalSummary.totalPaid,
            };
            return <PendingBillsGlobalFooter summary={mappedGlobalSummary as any} />;
          })()}
        </div>
      )}
    </div>
  );
};
