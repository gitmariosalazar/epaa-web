import { useState, useEffect } from 'react';
import { useConnectionsContext } from '@/modules/connections/presentation/context/ConnectionContext';

/**
 * useIncidentConnection
 * 
 * SRP (Single Responsibility Principle):
 * Encapsula exclusivamente la lógica para recuperar los detalles de una acometida
 * en base a su clave catastral, manteniendo la Vista (Page) limpia de la lógica de fetch.
 * 
 * DIP (Dependency Inversion Principle):
 * Consume el caso de uso a través del contexto de abstracción (ConnectionContext), 
 * sin depender de repositorios concretos.
 */
export const useIncidentConnection = (cadastralKey?: string | null) => {
  const { findConnectionWithPropertyByCadastralKeyUseCase } = useConnectionsContext();
  
  // No defino el tipado estricto aquí para evitar dependencias innecesarias si no lo tienes a mano, 
  // pero idealmente deberías tiparlo con ConnectionWithPropertyResponse o similar.
  const [connection, setConnection] = useState<any | null>(null);
  const [isLoadingConnection, setIsLoadingConnection] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    // Si no hay clave catastral (puede ser un incidente sin acometida), limpiamos el estado
    if (!cadastralKey) {
      setConnection(null);
      return;
    }

    const fetchConnection = async () => {
      try {
        setIsLoadingConnection(true);
        setConnectionError(null);
        
        // Ejecutamos el caso de uso inyectado desde el contexto
        const result = await findConnectionWithPropertyByCadastralKeyUseCase.execute(cadastralKey);
        setConnection(result);
      } catch (error) {
        console.error('Error fetching incident connection details:', error);
        setConnectionError('Ocurrió un error al cargar los datos de la acometida.');
        setConnection(null);
      } finally {
        setIsLoadingConnection(false);
      }
    };

    fetchConnection();
  }, [cadastralKey, findConnectionWithPropertyByCadastralKeyUseCase]);

  return {
    connection,
    isLoadingConnection,
    connectionError,
  };
};
