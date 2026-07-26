
import { Table, type Column } from "@/shared/presentation/components/Table/Table";
import type { EvidenceAttachmentResponse, MaterialResponse, WorkerResponse, WorkOrderObservationResponse } from "../../domain/dto/WorkOrderReportResponse";
import { EmptyState } from "@/shared/presentation/components/common/EmptyState";
import { Box, File, FileText, Users } from "lucide-react";
import './WorkOrderDetails.css'
import { Alert } from "@/shared/presentation/components/Alert";
import { MdMessage } from "react-icons/md";
import { EvidenceFiles } from "@/shared/files";
import { ConverDateTime } from "@/shared/utils/datetime/ConverDate";
import { truncateText } from "@/shared/utils/text/truncate-text";
import { useMemo } from "react";




interface WorkOrderDetailsProps {
  materialList: MaterialResponse[];
  workersList: WorkerResponse[];
  evidenceAttachmentsList: EvidenceAttachmentResponse[];
  observationsList: WorkOrderObservationResponse[];
  className?: string;
}

const WorkOrderDetails = ({ materialList, workersList, evidenceAttachmentsList, observationsList, className }: WorkOrderDetailsProps) => {



  // Table for workers
  const columns: Column<WorkerResponse>[] = [
    {
      header: 'Nombre Completo',
      accessor: (worker: WorkerResponse) => `${truncateText(worker.fullName, 20)}`,
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Teléfono',
      accessor: 'phone',
    },
    {
      header: 'Fecha de Asignación',
      accessor: (worker: WorkerResponse) => ConverDateTime(worker.assignmentDate),
    }
  ]


  const columns2: Column<MaterialResponse>[] = [
    {
      header: 'Nombre',
      accessor: (material: MaterialResponse) => `${truncateText(material.name, 20)}`,
    },
    {
      header: 'Código',
      accessor: 'code',
    },
    {
      header: 'Cantidad',
      accessor: 'quantity',
    },
    {
      header: 'Precio unitario',
      accessor: (material: MaterialResponse) => material.unitCost.toFixed(2),
    },
    {
      header: 'Subtotal',
      accessor: (material: MaterialResponse) => material.subtotal.toFixed(2),
    },
  ]

  const totalMaterialCost = useMemo(() => {
    return materialList.reduce((acc, material) => acc + material.subtotal, 0);
  }, [materialList]);


  return (
    <div className="">
      {/* Workers Table */}
      <div className={`${className} table-detail-work-order `}>
        <span className="detail-work-order__title">
          <Users size={15} /> Trabajadores Asignados
        </span>
        <Table<WorkerResponse> data={workersList} columns={columns} emptyState={
          <>
            <EmptyState message="No hay trabajadores asignados" description="No se encontraron trabajadores asignados a esta solicitud." />
          </>
        }
        />
      </div>

      {/* Materiales Table */}
      <div className="table-detail-work-order">
        <span className="detail-work-order__title">
          <Box size={15} /> Materiales Asignados
        </span>
        <Table<MaterialResponse> data={materialList} columns={columns2} emptyState={
          <>
            <EmptyState message="No hay materiales asignados" description="No se encontraron materiales asignados a esta solicitud." />
          </>
        }
          totalRows={[{ label: 'Subtotal', value: totalMaterialCost, highlight: true }]}
        />
      </div>

      {/* Evidence Table */}
      <div className="table-detail-work-order">
        <span className="detail-work-order__title">
          <File size={15} /> Evidencias
        </span>
        <div className="evidence-files-grid">
          {evidenceAttachmentsList.map((evidenceAttachment) => (
            <EvidenceFiles
              key={evidenceAttachment.id}
              fileId={evidenceAttachment.id}
              category="work_orders"
              filePath={evidenceAttachment.fileUrl}
              type={evidenceAttachment.type}
            />
          ))}
        </div>
      </div>

      {/* Observations Table */}
      <div className="table-detail-work-order">
        <span className="detail-work-order__title">
          <FileText size={15} /> Observaciones en la Orden de Trabajo
        </span>
        {observationsList.length === 0 && (
          <Alert icon={<MdMessage size={12} />} type='info' dismissible={false} size='xsmall' message="No hay observaciones en la orden de trabajo." />
        )}
        {observationsList.map((observation, index) => (
          <Alert icon={<MdMessage size={12} />} key={index} type='info' dismissible={false} size='xsmall' message={observation.text} />
        ))}
      </div>

    </div>
  );
};

export default WorkOrderDetails;
