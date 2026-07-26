const fs = require('fs');
let file = 'src/modules/processes/solicitudes/presentation/components/SubmitInspectionReportModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace props interface
content = content.replace(/interface SubmitInspectionReportModalProps \{\n  isOpen: boolean;\n  onClose: \(\) => void;\n  solicitud: RequestDetailByClientResponse;\n  workOrder: SolicitudOrdenTrabajoResponse \| undefined;\n  technicianId: string;\n  onSuccess: \(\) => void;\n  allowInconsistentSuccess\?: boolean;\n\}/g,
`interface SubmitInspectionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  solicitudId: string;
  solicitudNumero: string;
  workOrderId: string;
  codigoOrden?: string;
  technicianId: string;
  onSuccess: () => void;
  allowInconsistentSuccess?: boolean;
}`);

// Destructure new props
content = content.replace(/const \{\n    isOpen,\n    onClose,\n    solicitud,\n    technicianId,\n    onSuccess,\n    allowInconsistentSuccess\n  \} = props;/g,
`const {
    isOpen,
    onClose,
    solicitudId,
    solicitudNumero,
    workOrderId,
    codigoOrden,
    technicianId,
    onSuccess,
    allowInconsistentSuccess
  } = props;`);

// Replace dependencies in hook call
content = content.replace(/useSubmitInspectionReportViewModel\(\{\n    solicitud,\n    workOrder: props\.workOrder,\n    technicianId,\n    onSuccess,\n    allowInconsistentSuccess,\n    onClose\n  \}\);/g,
`useSubmitInspectionReportViewModel({
    solicitudId,
    solicitudNumero,
    workOrderId,
    codigoOrden,
    technicianId,
    onSuccess,
    allowInconsistentSuccess,
    onClose
  });`);

fs.writeFileSync(file, content);
console.log('Fixed Modal Props');
