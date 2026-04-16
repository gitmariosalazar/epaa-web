export const en = {
  translation: {
    sidebar: {
      dashboard: 'Dashboard',
      reports: 'Reports',
      security: 'Security',
      profile: 'Profile',
      general: 'General',
      administration: 'Administration',
      user: 'User',
      users: 'Users',
      roles: 'Roles',
      permissions: 'Permissions',
      settings: 'Settings',
      signOut: 'Sign Out',
      customers: 'Customers',
      naturalPersons: 'Natural Persons',
      companies: 'Companies',
      generalCustomers: 'General Customers'
    },
    dashboard: {
      title: 'Dashboard',
      sectorProgress: {
        title: 'Sector Progress',
        searchPlaceholder: 'Search sector...',
        loading: 'Loading Sector Progress...',
        emptyTitle: 'No Sector Data',
        emptyDescription: 'There are no sectors matching your search.',
        legend: {
          completed: 'Completed',
          remaining: 'Remaining'
        },
        readings: 'Readings',
        pending: 'Pending',
        sector: 'Sector'
      },
      sectorStats: {
        title: 'Sector Analysis',
        searchPlaceholder: 'Search...',
        loading: 'Loading sector stats...',
        empty: 'No sector data available.',
        columns: {
          sector: 'Sector',
          count: 'Count',
          avgConsumption: 'Avg Consumption',
          activeDays: 'Active Days'
        },
        totals: {
          readings: 'Total Readings',
          averageConsumption: 'Total Average Consumption',
          activeDays: 'Total Active Days'
        }
      },
      dailyStats: {
        title: 'Daily Performance',
        searchPlaceholder: 'Search date...',
        loading: 'Loading daily stats...',
        empty: 'No daily data available.',
        columns: {
          date: 'Date',
          readings: 'Readings',
          avgValue: 'Avg Value',
          avgConsumption: 'Consumption (Avg)',
          sectors: 'Sectors'
        },
        totals: {
          readings: 'Total Readings',
          sectors: 'Total Sectors',
          avgValue: 'Total Avg Value',
          avgConsumption: 'Total Avg Consumption'
        }
      },
      floatingNav: {
        changePeriod: 'Change Period',
        prevWidget: 'Previous Widget',
        exitFullscreen: 'Exit Fullscreen (Esc)',
        exit: 'Exit',
        nextWidget: 'Next Widget'
      },
      reports: {
        connection: {
          columns: {
            date: 'Date',
            readingValue: 'Reading Value',
            consumption: 'Consumption',
            client: 'Client',
            meter: 'Meter',
            status: 'Status'
          },
          filters: {
            searchLabel: 'Cadastral Key / Connection ID',
            searchPlaceholder: 'e.g. 1-2-3-4',
            limit: 'Last {{count}}'
          }
        },
        daily: {
          columns: {
            time: 'Time',
            dateTime: 'Date/Time',
            cadastralKey: 'Cadastral Key',
            block: 'Block',
            client: 'Client',
            average: 'Average Consumption',
            preview: 'Preview Reading',
            current: 'Current Reading',
            value: 'Reading Value',
            consumption: 'Consumption',
            type: 'Measure Type',
            status: 'Status',
            observation: 'Observation'
          }
        },
        sectorReadings: {
          columns: {
            ck: 'C.K.',
            client: 'Client',
            prevReading: 'Prev. Reading',
            currReading: 'Curr. Reading',
            calculatedConsumption: 'Calc. Cons.',
            novelty: 'Novelty'
          }
        }
      },
      tabs: {
        visual: 'Visual Progress',
        detailed: 'Detailed Table',
        detailedReports: 'Detailed Reports'
      },
      advancedReadings: {
        title: 'Daily Performance',
        searchPlaceholder: 'Search...',
        loading: 'Loading advanced readings...',
        empty: 'No advanced readings available.',
        columns: {
          sector: 'Sector',
          totalConnections: 'Total Connections',
          readingsCompleted: 'Readings Completed',
          missingReadings: 'Missing Readings',
          progress: 'Progress Percentage'
        }
      }
    },
    accounting: {
      tabs: {
        generalPayments: 'Order Payments',
        paymentReadings: 'Reading Payments',
        dateRangeReport: 'Payments by Date Range',
        groupedReport: 'Grouped Daily Report',
        collectorSummary: 'Collector Summary',
        paymentMethod: 'By Payment Method',
        fullBreakdown: 'Full Breakdown'
      },
      columns: {
        date: 'Date',
        collector: 'Collector',
        titleCode: 'T. Code',
        paymentMethod: 'Payment Meth.',
        status: 'Status',
        epaaValue: 'EPAA Val.',
        thirdPartyValue: '3rd Party Val.',
        surcharge: 'Surcharge',
        trashRateDt: 'TR D.I.',
        trashRateVal: 'TR Value',
        incomes: 'Incomes',
        total: 'Total',
        cadastralKey: 'Cadastral Key',
        user: 'User',
        records: 'Records'
      }
    },
    customers: {
      pageTitle: 'General Customers',
      newClient: 'New Client',
      newCompany: 'New Company',
      columns: {
        nameReason: 'Name / Reason',
        type: 'Type',
        address: 'Address',
        email: 'Email',
        phone: 'Phone',
        actions: 'Actions'
      },
      actions: {
        viewDetails: 'View Details',
        edit: 'Edit',
        delete: 'Delete'
      },
      modals: {
        clientDetails: 'Client Details',
        editClient: 'Edit Client',
        newClient: 'New Client',
        companyDetails: 'Company Details',
        editCompany: 'Edit Company',
        newCompany: 'New Company',
        confirmDelete: 'Confirm Deletion',
        deleteMessage: 'Are you sure you want to delete'
      },
      filters: {
        allFields: 'All Fields',
        name: 'Name',
        nameOrSocialReason: 'Name or Social Reason'
      },
      form: {
        firstName: 'First Name',
        lastName: 'Last Name',
        identityId: 'Identity ID (Cedula)',
        dob: 'Date of Birth',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        parishId: 'Parish ID',
        sex: 'Sex',
        male: 'Male',
        female: 'Female',
        civilStatus: 'Civil Status',
        single: 'Single',
        married: 'Married',
        divorced: 'Divorced',
        widowed: 'Widowed',
        freeUnion: 'Free Union',
        professionId: 'Profession ID',
        deceased: 'Deceased',
        companyName: 'Company Name',
        socialReason: 'Social Reason',
        ruc: 'RUC',
        country: 'Country',
        idTypeCED: 'Citizen ID (Cedula)',
        idTypeRUC: 'Tax ID (RUC)',
        idTypePAS: 'Passport',
        phones: 'Phones',
        emails: 'Emails',
        location: 'LOCATION (Parish)',
        dateOfBirth: 'Date of Birth'
      },
      details: {
        activeAccount: 'Active Account',
        activeCompany: 'Active Company',
        deceasedStatus: 'Deceased',
        generalInfo: 'GENERAL INFORMATION',
        companyInfo: 'COMPANY INFORMATION',
        contactInfo: 'CONTACT INFORMATION',
        locationDetails: 'LOCATION DETAILS',
        additionalDetails: 'ADDITIONAL DETAILS',
        unknown: 'Unknown',
        originCountry: 'Origin Country'
      }
    },
    readings: {
      tabs: {
        pending: 'Pending Readings',
        completed: 'Taken Readings',
        estimated: 'Taken (Estimated)',
        all: 'All'
      },
      columns: {
        cadastralKey: 'Cadastral Key',
        meter: 'Meter',
        client: 'Client',
        sector: 'Sector',
        account: 'Account',
        address: 'Address',
        average: 'Average',
        readingDate: 'Reading Date',
        prevReading: 'Prev. Reading',
        currReading: 'Curr. Reading',
        consumption: 'Consumption',
        novelty: 'Novelty',
        noMeter: 'N/M',
        none: 'None'
      },
      filters: {
        searchMode: 'Search Mode',
        monthAndSector: 'Month and Sector',
        cadastralKey: 'Cadastral Key',
        month: 'Month',
        sectorOptional: 'Sector (Optional)',
        allSectors: 'All sectors',
        exactCadastralKey: 'Exact Cadastral Key'
      },
      summaryCards: {
        connectionId: 'Connection ID',
        cadastralDesc: 'Cadastral Key of the Connection',
        avgConsumption: 'Avg. Consumption',
        avgDesc: 'Average of the last 10 periods',
        prevConsumption: 'Previous Consumption',
        date: 'Date:',
        currentConsumption: 'Current Consumption'
      },
      historyTable: {
        monthYear: 'Month/Year',
        readingDate: 'Reading Date',
        readingTime: 'Reading Time',
        prevReading: 'Prev. Reading',
        currReading: 'Curr. Reading',
        consumption: 'Consumption (m³)',
        observation: 'Observation',
        none: 'None',
        title: 'Recent Readings History'
      },
      additionalInfo: {
        viewMore: 'View Additional Information',
        cardId: 'Citizen ID',
        meterNumber: 'Meter Number',
        owner: 'Connection Owner',
        address: 'Connection Address',
        period: 'Reading Period',
        start: 'Start',
        end: 'End'
      }
    },
    header: {
      profile: 'Profile',
      settings: 'Settings',
      signOut: 'Sign Out',
      switchTheme: 'Switch Theme',
      switchLang: 'Language',
      english: 'English',
      spanish: 'Spanish'
    },
    pages: {
      roles: {
        title: 'Roles',
        createRole: 'Create Role',
        columns: {
          id: 'ID',
          name: 'Name',
          description: 'Description',
          active: 'Active',
          actions: 'Actions'
        }
      },
      common: {
        user: 'User'
      },
      login: {
        welcome: 'Welcome Back',
        subtitle: 'Sign in to your EPAA account',
        username: 'Username',
        usernamePlaceholder: 'Enter your username',
        password: 'Password',
        passwordPlaceholder: 'Enter your password',
        signIn: 'Sign In',
        error: 'Invalid username or password'
      }
    },
    common: {
      pagination: {
        page: 'Page {{current}} of {{total}}'
      },
      exportPdf: 'Export PDF',
      table: {
        totalRecords: 'Total Records: {{count}}',
        rowsPerPage: 'Rows per page:',
        loading: 'Loading...',
        noData: 'No data found'
      },
      datePicker: {
        cancel: 'Cancel',
        clear: 'Clear',
        selectDate: 'Select Date'
      },
      days: {
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday'
      },
      monthName: 'Month',
      monthsNames: 'Months',
      months: {
        january: 'January',
        february: 'February',
        march: 'March',
        april: 'April',
        may: 'May',
        june: 'June',
        july: 'July',
        august: 'August',
        september: 'September',
        october: 'October',
        november: 'November',
        december: 'December'
      },
      years: {
        year: 'Year',
        years: 'Years'
      },
      all: 'All',
      yes: 'Yes',
      no: 'No',
      yesNo: 'Yes/No',
      paymentStatus: 'Payment Status',
      paymentMethod: 'Payment Method',
      actions: 'Actions',
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      delete: 'Delete',
      edit: 'Edit',
      search: 'Search',
      searching: 'Searching...',
      searchMode: 'Search By',
      searchPlaceholder: 'Search records...',
      refresh: 'Refresh',
      loading: 'Loading...',
      noData: 'No records found',
      success: 'Success',
      error: 'Error',
      details: 'Details',
      cadastralPlaceholder: 'Ex: 1-125 or 40-5',
      add: 'Add',
      saving: 'Saving...',
      back: 'Back',
      next: 'Next',
      paid: 'Paid',
      pending: 'Pending',
      status: 'Status',
      diagnostic: 'Diagnostic',
      integrity: 'Integrity',
      noValue: 'No Value',
      trashRateDt: 'Waste Rate D.I.',
      trashRateVal: 'Waste Rate (Valor Table)',
      trashRate: 'Waste Rate',
      incomeCode: 'Income Code',
      cadastralKey: 'Cadastral Key',
      customerName: 'Customer',
      issueDate: 'Issue Date',
      paymentDate: 'Payment Date',
      dataNotFound: 'No data found',
      dataNotFoundDescription: 'No data found with the current filters.',
      fetch: 'Fetch Data'
    },
    connections: {
      create: 'New Connection',
      deleteTitle: 'Delete Connection',
      table: {
        reportTitle: 'CONNECTIONS REPORT',
        reportDescription: 'List of system connections',
        noData: 'No connections',
        noDataDescription: 'No connections found with the current filters.',
        sector: 'Sector',
        client: 'Client',
        meterNumber: 'Meter No.',
        cadastralKey: 'Cadastral Key',
        contractNumber: 'Contract No.',
        rate: 'Rate',
        sewerage: 'Sewerage',
        status: 'Status',
        options: 'Options',
        edit: 'Edit Connection',
        delete: 'Delete Connection',
        viewDetails: 'View Details',
        totalConnections: 'TOTAL CONNECTIONS',
        active: 'Active',
        inactive: 'Inactive',
        yes: 'Yes',
        no: 'No',
        detailsTitle: 'Connection Details',
        connectionId: 'Connection ID',
        clientId: 'Client ID',
        zone: 'Zone',
        people: 'People',
        latitude: 'Latitude',
        longitude: 'Longitude',
        altitude: 'Altitude',
        installationDate: 'Installation Date'
      },
      deleteConfirm:
        'Are you sure you want to delete this connection? This action cannot be undone.',
      noDataDescription:
        'No connections found with current filters. Use Fetch to load data.',
      tabs: {
        all: 'All Connections',
        sector: 'By Sector',
        client: 'By Client'
      },
      wizard: {
        title: 'New Connection Wizard',
        stepInfo: 'Step {{current}} of {{total}}',
        steps: {
          client: 'Client',
          basic: 'Basic Details',
          technical: 'Technical',
          property: 'Property'
        },
        clientSelection: {
          title: 'Step 1: Client Selection',
          description:
            "Enter the client's identification to automatically find existing records or register a new one.",
          person: 'Person',
          company: 'Company',
          idCed: 'Identification (CED)',
          idPlaceholder: 'Enter identification (10 digits)',
          rucNumber: 'RUC Number',
          rucPlaceholder: 'Enter RUC (13 digits)',
          firstName: 'First Name',
          lastName: 'Last Name',
          companyName: 'Company Name',
          socialReason: 'Social Reason',
          address: 'Address',
          dob: 'Date of Birth',
          gender: 'Gender',
          civilStatus: 'Civil Status',
          location: 'LOCATION (Parish)',
          profession: 'Profession ID',
          deceased: 'Deceased',
          emails: 'Email Addresses',
          addEmail: 'Add Email',
          phones: 'Phone Numbers',
          addPhone: 'Add Phone',
          processing: 'Processing...',
          updateContinue: 'Update and Continue',
          createContinue: 'Create and Continue',
          clear: 'Clear'
        },
        basicDetails: {
          title: 'Step 2: Basic Connection Details',
          rateType: 'Rate Type',
          selectRate: 'Select a rate...',
          meterNumber: 'Meter Number',
          contractNumber: 'Contract Number',
          installationDate: 'Installation Date',
          sewerage: 'Includes Sewerage',
          activeStatus: 'Active Status',
          nextTechnical: 'Next: Technical Details'
        },
        technicalDetails: {
          title: 'Step 3: Technical & Location Details',
          longitude: 'Longitude',
          latitude: 'Latitude',
          zoneId: 'Zone ID',
          cadastralKey: 'Cadastral Key',
          cadastralInfo: "Format: 1-400 followed by '-' and >5000",
          geometricZone: 'Geometric Zone',
          altitude: 'Altitude',
          precision: 'Precision',
          reference: 'Reference'
        },
        propertySelection: 'Property Selection',
        propertySelectionDesc:
          'Select an existing property or continue without assigning one.',
        noProperties: 'The selected client has no registered properties.',
        saveWithProperty: 'Create with property',
        saveWithoutProperty: 'Create without property'
      }
    },
    trashRate: {
      title: 'Waste Collection Rate',
      trashRateDt: 'Waste Rate D.I.',
      trashRateVal: 'Waste Rate (Valor Table)',
      finalDiagnosis: 'Final Diagnosis',
      paymentStatus: 'Payment Status',
      paid: 'Paid',
      pending: 'Pending',
      all: 'All',
      noAnomalies: 'No Anomalies',
      finalDiagnosisCritical: 'Critical: Waste Rate NOT ADDED to this invoice',
      finalDiagnosisWarning: 'Warning: No record in Valor Table (Ord 10)',
      finalDiagnosisDiscrepancy: 'Critical: Different amount charged in invoice'
    }
  }
};
