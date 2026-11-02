import React, { createContext, useContext, useMemo } from 'react';
import { ReadingRouteCatalogRepositoryImpl } from '../../infrastructure/repositories/ReadingRouteCatalogRepositoryImpl';
import { RouteDispatchRepositoryImpl } from '../../infrastructure/repositories/RouteDispatchRepositoryImpl';
import { RouteResolutionRepositoryImpl } from '../../infrastructure/repositories/RouteResolutionRepositoryImpl';

// Catalog Use Cases
import { GetReadingRoutesUseCase } from '../../application/usecases/catalog/GetReadingRoutesUseCase';
import { GetRouteByIdUseCase } from '../../application/usecases/catalog/GetRouteByIdUseCase';
import { GetRoutesGeoJsonUseCase } from '../../application/usecases/catalog/GetRoutesGeoJsonUseCase';
import { GetRouteCentroidsUseCase } from '../../application/usecases/catalog/GetRouteCentroidsUseCase';
import { GetRouteConnectionsUseCase } from '../../application/usecases/catalog/GetRouteConnectionsUseCase';
import { OptimizeRouteSequenceUseCase } from '../../application/usecases/catalog/OptimizeRouteSequenceUseCase';

// Dispatch Use Cases
import { ExecuteBatchMorningDispatchUseCase } from '../../application/usecases/dispatch/ExecuteBatchMorningDispatchUseCase';
import { AssignSingleRouteUseCase } from '../../application/usecases/dispatch/AssignSingleRouteUseCase';
import { ReassignRouteSegmentUseCase } from '../../application/usecases/dispatch/ReassignRouteSegmentUseCase';
import { GetLiveTrackingAssignmentsUseCase } from '../../application/usecases/dispatch/GetLiveTrackingAssignmentsUseCase';
import { CancelRouteAssignmentUseCase } from '../../application/usecases/dispatch/CancelRouteAssignmentUseCase';
import { ResumeRouteAssignmentUseCase } from '../../application/usecases/dispatch/ResumeRouteAssignmentUseCase';

// Resolution Use Cases
import { ResolveRouteForConnectionUseCase } from '../../application/usecases/resolution/ResolveRouteForConnectionUseCase';
import { InsertConnectionIntoRouteUseCase } from '../../application/usecases/resolution/InsertConnectionIntoRouteUseCase';

interface ReadingRoutesContextType {
  getReadingRoutesUseCase: GetReadingRoutesUseCase;
  getRouteByIdUseCase: GetRouteByIdUseCase;
  getRoutesGeoJsonUseCase: GetRoutesGeoJsonUseCase;
  getRouteCentroidsUseCase: GetRouteCentroidsUseCase;
  getRouteConnectionsUseCase: GetRouteConnectionsUseCase;
  optimizeRouteSequenceUseCase: OptimizeRouteSequenceUseCase;
  executeBatchMorningDispatchUseCase: ExecuteBatchMorningDispatchUseCase;
  assignSingleRouteUseCase: AssignSingleRouteUseCase;
  reassignRouteSegmentUseCase: ReassignRouteSegmentUseCase;
  getLiveTrackingAssignmentsUseCase: GetLiveTrackingAssignmentsUseCase;
  cancelRouteAssignmentUseCase: CancelRouteAssignmentUseCase;
  resumeRouteAssignmentUseCase: ResumeRouteAssignmentUseCase;
  resolveRouteForConnectionUseCase: ResolveRouteForConnectionUseCase;
  insertConnectionIntoRouteUseCase: InsertConnectionIntoRouteUseCase;
}

const ReadingRoutesContext = createContext<ReadingRoutesContextType | null>(
  null,
);

export const ReadingRoutesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const catalogRepo = useMemo(() => new ReadingRouteCatalogRepositoryImpl(), []);
  const dispatchRepo = useMemo(() => new RouteDispatchRepositoryImpl(), []);
  const resolutionRepo = useMemo(() => new RouteResolutionRepositoryImpl(), []);

  const value = useMemo(
    () => ({
      getReadingRoutesUseCase: new GetReadingRoutesUseCase(catalogRepo),
      getRouteByIdUseCase: new GetRouteByIdUseCase(catalogRepo),
      getRoutesGeoJsonUseCase: new GetRoutesGeoJsonUseCase(catalogRepo),
      getRouteCentroidsUseCase: new GetRouteCentroidsUseCase(catalogRepo),
      getRouteConnectionsUseCase: new GetRouteConnectionsUseCase(catalogRepo),
      optimizeRouteSequenceUseCase: new OptimizeRouteSequenceUseCase(catalogRepo),
      executeBatchMorningDispatchUseCase:
        new ExecuteBatchMorningDispatchUseCase(dispatchRepo),
      assignSingleRouteUseCase: new AssignSingleRouteUseCase(dispatchRepo),
      reassignRouteSegmentUseCase: new ReassignRouteSegmentUseCase(dispatchRepo),
      getLiveTrackingAssignmentsUseCase:
        new GetLiveTrackingAssignmentsUseCase(dispatchRepo),
      cancelRouteAssignmentUseCase: new CancelRouteAssignmentUseCase(dispatchRepo),
      resumeRouteAssignmentUseCase: new ResumeRouteAssignmentUseCase(dispatchRepo),
      resolveRouteForConnectionUseCase:
        new ResolveRouteForConnectionUseCase(resolutionRepo),
      insertConnectionIntoRouteUseCase:
        new InsertConnectionIntoRouteUseCase(resolutionRepo),
    }),
    [catalogRepo, dispatchRepo, resolutionRepo],
  );

  return (
    <ReadingRoutesContext.Provider value={value}>
      {children}
    </ReadingRoutesContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useReadingRoutesContext = (): ReadingRoutesContextType => {
  const context = useContext(ReadingRoutesContext);
  if (!context) {
    throw new Error(
      'useReadingRoutesContext must be used within a ReadingRoutesProvider',
    );
  }
  return context;
};
