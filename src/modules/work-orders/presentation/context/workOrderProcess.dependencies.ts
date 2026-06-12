import { AddAdditionalCostUseCase } from '../../application/usecases/AddAdditionalCostUseCase';
import { AddPreparationInspectionDetailUseCase } from '../../application/usecases/AddPreparationInspectionDetailUseCase';
import { AddQualityControlDetailUseCase } from '../../application/usecases/AddQualityControlDetailUseCase';
import { AddWorkOrderAttachmentUseCase } from '../../application/usecases/AddWorkOrderAttachmentUseCase';
import { AddWorkOrderMaterialUseCase } from '../../application/usecases/AddWorkOrderMaterialUseCase';
import { AssignWorkOrderToCrewUseCase } from '../../application/usecases/AssignWorkOrderToCrewUseCase';
import { AssignWorkOrderToWorkerUseCase } from '../../application/usecases/AssignWorkOrderToWorkerUseCase';
import { CompleteWorkOrderUseCase } from '../../application/usecases/CompleteWorkOrderUseCase';
import { CreatePreparationInspectionUseCase } from '../../application/usecases/CreatePreparationInspectionUseCase';
import { CreateQualityControlUseCase } from '../../application/usecases/CreateQualityControlUseCase';
import { CreateWorkOrderUseCase } from '../../application/usecases/CreateWorkOrderUseCase';
import { GetOrdenesTrabajoBySolicitudIdUseCase } from '../../application/usecases/GetOrdenesTrabajoBySolicitudIdUseCase';
import { GetOrdenTrabajoDetalleByNumeroOrdenUseCase } from '../../application/usecases/GetOrdenTrabajoDetalleByNumeroOrdenUseCase';
import { GetOrdenTrabajoTrackingByNumeroOrdenUseCase } from '../../application/usecases/GetOrdenTrabajoTrackingByNumeroOrdenUseCase';
import { MarkWorkOrderExecutionStartedUseCase } from '../../application/usecases/MarkWorkOrderExecutionStartedUseCase';
import { ReceiveWorkOrderUseCase } from '../../application/usecases/ReceiveWorkOrderUseCase';
import { RegisterSatisfactionSurveyUseCase } from '../../application/usecases/RegisterSatisfactionSurveyUseCase';
import { ResolvePreparationInspectionUseCase } from '../../application/usecases/ResolvePreparationInspectionUseCase';
import { ResolveQualityControlUseCase } from '../../application/usecases/ResolveQualityControlUseCase';
import { StartPreparationUseCase } from '../../application/usecases/StartPreparationUseCase';
import { ProcessWorkOrderRepositoryImpl } from '../../infrastructure/repositories/ProcessWorkOrderRepositoryImpl';

export interface WorkOrderProcessDependencies {
  createWorkOrderUseCase: CreateWorkOrderUseCase;
  receiveWorkOrderUseCase: ReceiveWorkOrderUseCase;
  assignWorkOrderToCrewUseCase: AssignWorkOrderToCrewUseCase;
  assignWorkOrderToWorkerUseCase: AssignWorkOrderToWorkerUseCase;
  startPreparationUseCase: StartPreparationUseCase;
  createPreparationInspectionUseCase: CreatePreparationInspectionUseCase;
  addPreparationInspectionDetailUseCase: AddPreparationInspectionDetailUseCase;
  resolvePreparationInspectionUseCase: ResolvePreparationInspectionUseCase;
  markWorkOrderExecutionStartedUseCase: MarkWorkOrderExecutionStartedUseCase;
  addWorkOrderMaterialUseCase: AddWorkOrderMaterialUseCase;
  addAdditionalCostUseCase: AddAdditionalCostUseCase;
  addWorkOrderAttachmentUseCase: AddWorkOrderAttachmentUseCase;
  createQualityControlUseCase: CreateQualityControlUseCase;
  addQualityControlDetailUseCase: AddQualityControlDetailUseCase;
  resolveQualityControlUseCase: ResolveQualityControlUseCase;
  completeWorkOrderUseCase: CompleteWorkOrderUseCase;
  registerSatisfactionSurveyUseCase: RegisterSatisfactionSurveyUseCase;
  getOrdenTrabajoDetalleByNumeroOrdenUseCase: GetOrdenTrabajoDetalleByNumeroOrdenUseCase;
  getOrdenTrabajoTrackingByNumeroOrdenUseCase: GetOrdenTrabajoTrackingByNumeroOrdenUseCase;
  getOrdenesTrabajoBySolicitudIdUseCase: GetOrdenesTrabajoBySolicitudIdUseCase;
}

export const createWorkOrderProcessDependencies =
  (): WorkOrderProcessDependencies => {
    const repository = new ProcessWorkOrderRepositoryImpl();

    return {
      createWorkOrderUseCase: new CreateWorkOrderUseCase(repository),
      receiveWorkOrderUseCase: new ReceiveWorkOrderUseCase(repository),
      assignWorkOrderToCrewUseCase: new AssignWorkOrderToCrewUseCase(
        repository
      ),
      assignWorkOrderToWorkerUseCase: new AssignWorkOrderToWorkerUseCase(
        repository
      ),
      startPreparationUseCase: new StartPreparationUseCase(repository),
      createPreparationInspectionUseCase:
        new CreatePreparationInspectionUseCase(repository),
      addPreparationInspectionDetailUseCase:
        new AddPreparationInspectionDetailUseCase(repository),
      resolvePreparationInspectionUseCase:
        new ResolvePreparationInspectionUseCase(repository),
      markWorkOrderExecutionStartedUseCase:
        new MarkWorkOrderExecutionStartedUseCase(repository),
      addWorkOrderMaterialUseCase: new AddWorkOrderMaterialUseCase(repository),
      addAdditionalCostUseCase: new AddAdditionalCostUseCase(repository),
      addWorkOrderAttachmentUseCase: new AddWorkOrderAttachmentUseCase(
        repository
      ),
      createQualityControlUseCase: new CreateQualityControlUseCase(repository),
      addQualityControlDetailUseCase: new AddQualityControlDetailUseCase(
        repository
      ),
      resolveQualityControlUseCase: new ResolveQualityControlUseCase(
        repository
      ),
      completeWorkOrderUseCase: new CompleteWorkOrderUseCase(repository),
      registerSatisfactionSurveyUseCase: new RegisterSatisfactionSurveyUseCase(
        repository
      ),
      getOrdenTrabajoDetalleByNumeroOrdenUseCase:
        new GetOrdenTrabajoDetalleByNumeroOrdenUseCase(repository),
      getOrdenTrabajoTrackingByNumeroOrdenUseCase:
        new GetOrdenTrabajoTrackingByNumeroOrdenUseCase(repository),
      getOrdenesTrabajoBySolicitudIdUseCase:
        new GetOrdenesTrabajoBySolicitudIdUseCase(repository)
    };
  };
