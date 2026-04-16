export const es = {
  translation: {
    sidebar: {
      dashboard: 'Panel Principal',
      reports: 'Reportes',
      security: 'Seguridad',
      profile: 'Perfil',
      general: 'General',
      administration: 'Administración',
      user: 'Usuario',
      users: 'Usuarios',
      roles: 'Roles',
      permissions: 'Permisos',
      settings: 'Configuración',
      signOut: 'Cerrar Sesión',
      customers: 'Clientes',
      naturalPersons: 'Personas Naturales',
      companies: 'Empresas',
      generalCustomers: 'Clientes Generales'
    },
    dashboard: {
      title: 'Panel Principal',
      sectorProgress: {
        title: 'Progreso por Sector',
        searchPlaceholder: 'Buscar sector...',
        loading: 'Cargando Progreso del Sector...',
        emptyTitle: 'Sin Datos de Sector',
        emptyDescription: 'No hay sectores que coincidan con su búsqueda.',
        legend: {
          completed: 'Completado',
          remaining: 'Restante'
        },
        readings: 'Lecturas',
        pending: 'Pendientes',
        sector: 'Sector'
      },
      sectorStats: {
        title: 'Análisis de Sector',
        searchPlaceholder: 'Buscar...',
        loading: 'Cargando estadísticas del sector...',
        empty: 'No hay datos del sector disponibles.',
        columns: {
          sector: 'Sector',
          count: 'Cantidad',
          avgConsumption: 'Consumo Promedio',
          activeDays: 'Días Activos'
        },
        totals: {
          readings: 'Lecturas Totales',
          averageConsumption: 'Promedio de Consumo Total',
          activeDays: 'Días Activos Totales'
        }
      },
      dailyStats: {
        title: 'Rendimiento Diario',
        searchPlaceholder: 'Buscar fecha...',
        loading: 'Cargando estadísticas diarias...',
        empty: 'No hay datos diarios disponibles.',
        columns: {
          date: 'Fecha',
          readings: 'Lecturas',
          avgValue: 'Valor Prom.',
          avgConsumption: 'Consumo Prom.',
          sectors: 'Sectores'
        },
        totals: {
          readings: 'Lecturas Totales',
          sectors: 'Sectores Totales',
          avgValue: 'Valor Promedio Total',
          avgConsumption: 'Consumo Promedio Total'
        }
      },
      floatingNav: {
        changePeriod: 'Cambiar Período',
        prevWidget: 'Widget Anterior',
        exitFullscreen: 'Salir de Pantalla Completa (Esc)',
        exit: 'Salir',
        nextWidget: 'Siguiente Widget'
      },
      reports: {
        connection: {
          columns: {
            date: 'Fecha',
            readingValue: 'Valor de Lectura',
            consumption: 'Consumo',
            client: 'Cliente',
            meter: 'Medidor',
            status: 'Estado'
          },
          filters: {
            searchLabel: 'Clave Catastral / ID Conexión',
            searchPlaceholder: 'ej. 1-2-3-4',
            limit: 'Últimos {{count}}'
          }
        },
        daily: {
          columns: {
            time: 'Hora',
            dateTime: 'Fecha/Hora',
            cadastralKey: 'Clave Catastral',
            block: 'Manzana',
            client: 'Cliente',
            average: 'Consumo Promedio',
            preview: 'Lectura Previa',
            current: 'Lectura Actual',
            value: 'Valor de Lectura',
            consumption: 'Consumo',
            type: 'Tipo de Medida',
            status: 'Estado',
            observation: 'Observación'
          }
        },
        sectorReadings: {
          columns: {
            ck: 'C.C.',
            client: 'Cliente',
            prevReading: 'Lect. Anterior',
            currReading: 'Lect. Actual',
            calculatedConsumption: 'Consumo Calc.',
            novelty: 'Novedad'
          }
        }
      },
      tabs: {
        visual: 'Progreso Visual',
        detailed: 'Tabla Detallada',
        detailedReports: 'Reportes Detallados'
      },
      advancedReadings: {
        title: 'Rendimiento Diario',
        searchPlaceholder: 'Buscar...',
        loading: 'Cargando lecturas avanzadas...',
        empty: 'No hay lecturas avanzadas disponibles.',
        columns: {
          sector: 'Sector',
          totalConnections: 'Conexiones Totales',
          readingsCompleted: 'Lecturas Completadas',
          missingReadings: 'Lecturas Faltantes',
          progress: 'Porcentaje de Progreso'
        }
      }
    },
    accounting: {
      tabs: {
        generalPayments: 'Pagos por Orden',
        paymentReadings: 'Pagos de Lecturas',
        dateRangeReport: 'Pagos por Rango de Fechas',
        groupedReport: 'Reporte Diario Agrupado',
        collectorSummary: 'Resumen por Cobrador',
        paymentMethod: 'Por Método de Pago',
        fullBreakdown: 'Desglose Completo'
      },
      columns: {
        date: 'Fecha',
        collector: 'Cobrador',
        titleCode: 'Código T.',
        paymentMethod: 'Mét. Pago',
        status: 'Estado',
        epaaValue: 'V. EPAA',
        thirdPartyValue: 'V. Terc.',
        surcharge: 'Recargo',
        trashRateDt: 'TB D.I.',
        trashRateVal: 'TB Valor',
        incomes: 'Ingresos',
        total: 'Total',
        cadastralKey: 'Clave Catastral',
        user: 'Usuario',
        records: 'Registros'
      }
    },
    customers: {
      pageTitle: 'Clientes Generales',
      newClient: 'Nuevo Cliente',
      newCompany: 'Nueva Empresa',
      columns: {
        nameReason: 'Nombre / Razón Social',
        type: 'Tipo',
        address: 'Dirección',
        email: 'Correo',
        phone: 'Teléfono',
        actions: 'Acciones'
      },
      actions: {
        viewDetails: 'Ver Detalles',
        edit: 'Editar',
        delete: 'Eliminar'
      },
      modals: {
        clientDetails: 'Detalles del Cliente',
        editClient: 'Editar Cliente',
        newClient: 'Nuevo Cliente',
        companyDetails: 'Detalles de Empresa',
        editCompany: 'Editar Empresa',
        newCompany: 'Nueva Empresa',
        confirmDelete: 'Confirmar Eliminación',
        deleteMessage: '¿Está seguro que desea eliminar a'
      },
      filters: {
        allFields: 'Todos los Campos',
        name: 'Nombre',
        nameOrSocialReason: 'Nombre o Razón Social'
      },
      form: {
        firstName: 'Nombre',
        lastName: 'Apellido',
        identityId: 'Cédula de Identidad',
        dob: 'Fecha de Nacimiento',
        email: 'Correo',
        phone: 'Teléfono',
        address: 'Dirección',
        parishId: 'ID Parroquia',
        sex: 'Sexo',
        male: 'Masculino',
        female: 'Femenino',
        civilStatus: 'Estado Civil',
        single: 'Soltero/a',
        married: 'Casado/a',
        divorced: 'Divorciado/a',
        widowed: 'Viudo/a',
        freeUnion: 'Unión Libre',
        professionId: 'ID Profesión',
        deceased: 'Fallecido',
        companyName: 'Nombre Comercial',
        socialReason: 'Razón Social',
        ruc: 'RUC',
        country: 'País',
        idTypeCED: 'Cédula',
        idTypeRUC: 'RUC',
        idTypePAS: 'Pasaporte',
        phones: 'Teléfonos',
        emails: 'Correos',
        location: 'UBICACIÓN (Parroquia)',
        dateOfBirth: 'Fecha de Nacimiento'
      },
      details: {
        activeAccount: 'Cuenta Activa',
        activeCompany: 'Empresa Activa',
        deceasedStatus: 'Fallecido',
        generalInfo: 'INFORMACIÓN GENERAL',
        companyInfo: 'INFORMACIÓN DE LA EMPRESA',
        contactInfo: 'INFORMACIÓN DE CONTACTO',
        locationDetails: 'DETALLES DE UBICACIÓN',
        additionalDetails: 'DETALLES ADICIONALES',
        unknown: 'Desconocido',
        originCountry: 'País de Origen'
      }
    },
    readings: {
      tabs: {
        pending: 'Lecturas Pendientes',
        completed: 'Lecturas Tomadas',
        estimated: 'Tomadas (Estimadas)',
        all: 'Todas'
      },
      columns: {
        cadastralKey: 'Clave Catastral',
        meter: 'Medidor',
        client: 'Cliente',
        sector: 'Sector',
        account: 'Cuenta',
        address: 'Dirección',
        average: 'Promedio',
        readingDate: 'Fecha Lectura',
        prevReading: 'Lect. Ant.',
        currReading: 'Lect. Act.',
        consumption: 'Consumo',
        novelty: 'Novedad',
        noMeter: 'S/M',
        none: 'Ninguna'
      },
      filters: {
        searchMode: 'Modo de Búsqueda',
        monthAndSector: 'Mes y Sector',
        cadastralKey: 'Clave Catastral',
        month: 'Mes',
        sectorOptional: 'Sector (Opcional)',
        allSectors: 'Todos los sectores',
        exactCadastralKey: 'Clave Catastral Exacta'
      },
      summaryCards: {
        connectionId: 'Conexión ID',
        cadastralDesc: 'Clave Catastral de la Acometida',
        avgConsumption: 'Consumo Prom.',
        avgDesc: 'Promedio de los últimos 10 periodos',
        prevConsumption: 'Consumo Anterior',
        date: 'Fecha:',
        currentConsumption: 'Consumo Actual'
      },
      historyTable: {
        monthYear: 'Mes/Año',
        readingDate: 'Fecha Lect.',
        readingTime: 'Hora Lect.',
        prevReading: 'Lectura Ant.',
        currReading: 'Lectura Act.',
        consumption: 'Consumo (m³)',
        observation: 'Observación',
        none: 'Ninguna',
        title: 'Historial de Lecturas Recientes'
      },
      additionalInfo: {
        viewMore: 'Ver Información Adicional',
        cardId: 'Cédula de Ciudadanía',
        meterNumber: 'Número de Medidor',
        owner: 'Propietario de la Conexión',
        address: 'Dirección de la Conexión',
        period: 'Periodo de Lectura',
        start: 'Inicio',
        end: 'Fin'
      }
    },
    header: {
      profile: 'Perfil',
      settings: 'Configuración',
      signOut: 'Cerrar Sesión',
      switchTheme: 'Cambiar Tema',
      switchLang: 'Idioma',
      english: 'Inglés',
      spanish: 'Español'
    },
    pages: {
      roles: {
        title: 'Roles',
        createRole: 'Crear Rol',
        columns: {
          id: 'ID',
          name: 'Nombre',
          description: 'Descripción',
          active: 'Activo',
          actions: 'Acciones'
        }
      },
      common: {
        user: 'Usuario'
      },
      login: {
        welcome: 'Bienvenido',
        subtitle: 'Inicie sesión en su cuenta EPAA',
        username: 'Usuario',
        usernamePlaceholder: 'Ingrese su usuario',
        password: 'Contraseña',
        passwordPlaceholder: 'Ingrese su contraseña',
        signIn: 'Iniciar Sesión',
        error: 'Usuario o contraseña inválidos'
      }
    },
    common: {
      pagination: {
        page: 'Página {{current}} de {{total}}'
      },
      exportPdf: 'Exportar PDF',
      table: {
        totalRecords: 'Total Registros: {{count}}',
        rowsPerPage: 'Filas por página:',
        loading: 'Cargando...',
        noData: 'No se encontraron datos'
      },
      datePicker: {
        cancel: 'Cancelar',
        clear: 'Limpiar',
        selectDate: 'Seleccionar Fecha'
      },
      days: {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miercoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sabado',
        sunday: 'Domingo'
      },
      monthName: 'Mes',
      monthsNames: 'Meses',
      months: {
        january: 'Enero',
        february: 'Febrero',
        march: 'Marzo',
        april: 'Abril',
        may: 'Mayo',
        june: 'Junio',
        july: 'Julio',
        august: 'Agosto',
        september: 'Septiembre',
        october: 'Octubre',
        november: 'Noviembre',
        december: 'Diciembre'
      },
      years: {
        year: 'Año',
        years: 'Años'
      },
      all: 'Todos',
      yes: 'Sí',
      no: 'No',
      yesNo: 'Sí/No',
      paymentStatus: 'Estado de Pago',
      paymentMethod: 'Método de Pago',
      actions: 'Acciones',
      save: 'Guardar',
      cancel: 'Cancelar',
      close: 'Cerrar',
      delete: 'Eliminar',
      edit: 'Editar',
      search: 'Buscar',
      searching: 'Buscando...',
      searchMode: 'Buscar por',
      searchPlaceholder: 'Buscar registros...',
      refresh: 'Refrescar',
      loading: 'Cargando...',
      noData: 'No se encontraron registros',
      success: 'Éxito',
      error: 'Error',
      details: 'Detalles',
      cadastralPlaceholder: 'Ej: 1-125 o 40-5',
      add: 'Agregar',
      saving: 'Guardando...',
      back: 'Atrás',
      next: 'Siguiente',
      paid: 'Pagado',
      pending: 'Pendiente',
      status: 'Estado',
      diagnostic: 'Diagnóstico',
      integrity: 'Integridad',
      noValue: 'Sin Valor',
      trashRateDt: 'Tasa de Basura D.I.',
      trashRateVal: 'Tasa de Basura Valor',
      trashRate: 'Tasa de Basura',
      incomeCode: 'Código de Ingreso',
      cadastralKey: 'Clave Catastral',
      customerName: 'Cliente',
      dataTitleCode: 'Código Título',
      issueDate: 'Fecha de Emisión',

      paymentDate: 'Fecha de Pago',
      dataNotFound: 'No se encontraron datos',
      dataNotFoundDescription:
        'No se encontraron datos con los filtros actuales.',
      fetch: 'Consultar',
      unauthorizedTitle: 'Acceso Restringido',
      unauthorizedDesc:
        'No tienes los permisos necesarios para acceder a este recurso. Por favor, contacta con el administrador del sistema.',
      backToHome: 'Ir al Inicio',
      login: 'Iniciar Sesión',
      goToBack: 'Volver Atrás',
      goToLogin: 'Iniciar Sesión'
    },
    connections: {
      create: 'Nueva Conexión',
      deleteTitle: 'Eliminar Conexión',
      table: {
        reportTitle: 'REPORTE DE CONEXIONES',
        reportDescription: 'Listado de conexiones del sistema',
        noData: 'Sin conexiones',
        noDataDescription:
          'No se encontraron conexiones con los filtros actuales.',
        sector: 'Sector',
        client: 'Cliente',
        meterNumber: 'Nº Medidor',
        cadastralKey: 'Clave Catastral',
        contractNumber: 'Contrato Nº',
        rate: 'Tarifa',
        sewerage: 'Alcantarillado',
        status: 'Estado',
        options: 'Opciones',
        edit: 'Editar Conexión',
        delete: 'Eliminar Conexión',
        viewDetails: 'Ver Detalles',
        totalConnections: 'TOTAL CONEXIONES',
        active: 'Activo',
        inactive: 'Inactivo',
        yes: 'Sí',
        no: 'No',
        detailsTitle: 'Detalle de Conexión',
        connectionId: 'ID Conexión',
        clientId: 'Cliente ID',
        zone: 'Zona',
        people: 'Personas',
        latitude: 'Latitud',
        longitude: 'Longitud',
        altitude: 'Altitud',
        installationDate: 'Fecha Instalación'
      },
      deleteConfirm:
        '¿Está seguro que desea eliminar esta conexión? Esta acción no se puede deshacer.',
      noDataDescription:
        'No se encontraron conexiones con los filtros actuales. Usa Consultar para cargar datos.',
      tabs: {
        all: 'Todas las Conexiones',
        sector: 'Por Sector',
        client: 'Por Cliente'
      },
      wizard: {
        title: 'Asistente de Nueva Conexión',
        stepInfo: 'Paso {{current}} de {{total}}',
        steps: {
          client: 'Cliente',
          basic: 'Detalles básicos',
          technical: 'Técnico',
          property: 'Propiedad'
        },
        clientSelection: {
          title: 'Paso 1: Selección del Cliente',
          description:
            'Ingrese la identificación del cliente para encontrar registros automáticamente o registrar uno nuevo.',
          person: 'Persona',
          company: 'Empresa',
          idCed: 'Identificación (CED)',
          idPlaceholder: 'Ingrese identificación (10 dígitos)',
          rucNumber: 'Número de RUC',
          rucPlaceholder: 'Ingrese RUC (13 dígitos)',
          firstName: 'Nombres',
          lastName: 'Apellidos',
          companyName: 'Nombre Comercial',
          socialReason: 'Razón Social',
          address: 'Dirección',
          dob: 'Fecha de Nacimiento',
          gender: 'Género',
          civilStatus: 'Estado Civil',
          location: 'UBICACIÓN (Parroquia)',
          profession: 'Profesión ID',
          deceased: 'Fallecido',
          emails: 'Correos Electrónicos',
          addEmail: 'Agregar Correo',
          phones: 'Números de Teléfono',
          addPhone: 'Agregar Teléfono',
          processing: 'Procesando...',
          updateContinue: 'Actualizar y Continuar',
          createContinue: 'Crear y Continuar',
          clear: 'Limpiar'
        },
        basicDetails: {
          title: 'Paso 2: Detalles Básicos de Conexión',
          rateType: 'Tipo de Tarifa',
          selectRate: 'Seleccione una tarifa...',
          meterNumber: 'Número de Medidor',
          contractNumber: 'Número de Contrato',
          installationDate: 'Fecha de Instalación',
          sewerage: 'Incluye Alcantarillado',
          activeStatus: 'Estado Activo',
          nextTechnical: 'Siguiente: Detalles Técnicos'
        },
        technicalDetails: {
          title: 'Paso 3: Detalles Técnicos y Ubicación',
          longitude: 'Longitud',
          latitude: 'Latitud',
          zoneId: 'ID de Zona',
          cadastralKey: 'Clave Catastral',
          cadastralInfo: "Formato: 1-400 seguido de '-' y >5000",
          geometricZone: 'Zona Geométrica',
          altitude: 'Altitud',
          precision: 'Precisión',
          reference: 'Referencia'
        },
        propertySelection: 'Selección de Propiedad',
        propertySelectionDesc:
          'Selecciona una propiedad existente o continúa sin asignar una.',
        noProperties:
          'El cliente seleccionado no tiene propiedades registradas.',
        saveWithProperty: 'Crear con propiedad',
        saveWithoutProperty: 'Crear sin propiedad'
      }
    },
    trashRate: {
      title: 'Tasa de Basura',
      trashRateDt: 'Tasa de Basura D.I.',
      trashRateVal: 'Tasa de Basura Valor',
      finalDiagnosis: 'Diagnóstico Final',
      paymentStatus: 'Estado de Pago',
      paid: 'Pagado',
      pending: 'Pendiente',
      all: 'Todos',
      noAnomalies: 'Sin Anomalías',
      finalDiagnosisCritical:
        'Crítico: Tasa de Basura NO AGREGADA a esta factura',
      finalDiagnosisWarning:
        'Advertencia: No hay registro en la Tabla de Valores (Orden 10)',
      finalDiagnosisDiscrepancy:
        'Crítico: Diferente cantidad cargada en la factura'
    }
  }
};
