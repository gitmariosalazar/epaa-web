import React, { useState } from 'react';
import { Droplets, MapPin, Recycle, Building, FileText, Download } from 'lucide-react';
import { type ClientPendingBillGroup } from '../../hooks/pending-readings/useClientPendingBills';
import { CurrencyFormatter } from '@/shared/utils/formatters/CurrencyFormatter';
import { Button } from '@/shared/presentation/components/Button/Button';
import './ClientPendingBillsList.css';
import { ClientPendingBillsPdfGenerator } from '../templates/pdf/ClientPendingBillsPdfGenerator';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { usePendingBillsSummary } from '../../hooks/pending-readings/usePendingBillsSummary';
import { PendingBillsGlobalFooter } from './PendingBillsGlobalFooter';
import { DataList, type Column } from '@/shared/presentation/components/Table/DataList';
import { PendingBillsStatCards } from './PendingBillsStatCards';

interface ClientPendingBillsListProps {
  groups: ClientPendingBillGroup[];
  isLoading: boolean;
}

export const ClientPendingBillsList: React.FC<ClientPendingBillsListProps> = ({
  groups,
  isLoading
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const pdfGenerator = new ClientPendingBillsPdfGenerator();

  const handleDownloadGlobal = async () => {
    if (groups.length === 0) return;
    setIsGeneratingPdf(true);
    try {
      await pdfGenerator.downloadPdf(groups, 'Planillas_Completas_Todas.pdf');
    } catch (error) {
      console.error('Error generating global PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadIndividual = async (group: ClientPendingBillGroup) => {
    setIsGeneratingPdf(true);
    try {
      await pdfGenerator.downloadPdf([group], `Planillas_Completas_${group.cadastralKey}.pdf`);
    } catch (error) {
      console.error('Error generating individual PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Calculamos todos los totales en el hook dedicado (SRP)
  const { connectionSummaries, globalSummary } = usePendingBillsSummary(groups);

  // DataList solo necesita una columna como contenedor; el render real es custom.
  const columns: Column<ClientPendingBillGroup>[] = [
    {
      header: 'Planillas Pendientes',
      accessor: (group) => group.cadastralKey,
      id: 'planillas',
    }
  ];

  const renderItem = (group: ClientPendingBillGroup) => {
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
              Descargar Planilla
            </Button>
          </div>
        </div>

        {/* Planilla General Table */}
        <div className="pending-bill-section">
          <div className="section-title">
            <FileText size={16} className="icon-blue" />
            <h4>Planilla General</h4>
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
                {group.bills.map((bill, idx) => (
                  <tr key={`general-${idx}`}>
                    <td>
                      <div className="period-cell">
                        <span className="period-month">{bill.month} - {bill.year}</span>
                        {bill.previousReading !== undefined && bill.currentReading !== undefined && (
                          <span className="period-readings">
                            {bill.previousReading} → {bill.currentReading} m³
                          </span>
                        )}
                        <span className="period-due text-error">
                          Vence: {bill.dueDate ? new Date(bill.dueDate).toISOString().split('T')[0] : '-'}
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
                  <td colSpan={5} className="text-right font-bold text-total">TOTAL A PAGAR:</td>
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
                  <th className="text-right">Saldo a Favor</th>
                  <th className="text-right">Saldo (Próx. Mes)</th>
                  <th className="text-right">Total a Pagar</th>
                </tr>
              </thead>
              <tbody>
                {group.bills.map((bill, idx) => (
                  <tr key={`trash-${idx}`}>
                    <td>{bill.month} - {bill.year}</td>
                    <td className="text-right">{CurrencyFormatter.format(Number(bill.trashRateOfficial) || 0)}</td>
                    <td className="text-right">{CurrencyFormatter.format(Number(bill.trashRatePrevious) || 0)}</td>
                    <td className="text-right">{CurrencyFormatter.format(Number(bill.balanceInFavorCurrentMonth) || 0)}</td>
                    <td className="text-right">{CurrencyFormatter.format(Number(bill.balanceInFavorNextMonth) || 0)}</td>
                    <td className="text-right font-semibold">{CurrencyFormatter.format(Number(bill.totalTrashRate) || 0)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5} className="text-right font-bold text-total">TOTAL TASA BASURA:</td>
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
                {group.bills.map((bill, idx) => (
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

        {/* StatCards por acometida — totales individuales */}
        {(() => {
          const connSummary = connectionSummaries.find(c => c.cadastralKey === group.cadastralKey);
          return connSummary ? <PendingBillsStatCards summary={connSummary} /> : null;
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
          <PendingBillsGlobalFooter summary={globalSummary} />
        </div>
      )}
    </div>
  );
};
