# Informe del Proyecto EPAA-WEB

Este informe detalla la estructura, funcionalidades y arquitectura del sistema EPAA-WEB, diseñado para la gestión eficiente de lecturas y análisis de datos.

## 1. Introducción

El proyecto EPAA-WEB es una plataforma moderna y robusta construida con tecnologías de vanguardia. Su diseño se enfoca en la escalabilidad, el mantenimiento y una experiencia de usuario fluida. El sistema se divide en dos componentes principales: el **Frontend** (la interfaz visual interactiva) y el **Backend** (el motor lógico y de datos), ambos estructurados siguiendo las mejores prácticas de la industria.

### 1.1. Stack Tecnológico

El proyecto utiliza una selección de tecnologías modernas que garantizan rendimiento y mantenibilidad:

- **Backend (Lógica del Servidor):** Construido sobre **NestJS**, un framework progresivo de Node.js que implementa TypeScript de forma nativa. Facilita la inyección de dependencias y una estructura modular robusta.
- **Frontend (Interfaz de Usuario):** Desarrollado con **React 19** y **Vite**, proporcionando una experiencia de usuario ultra-rápida y reactiva. Utiliza componentes modernos y hooks para la gestión del estado.
- **Base de Datos:** **PostgreSQL**, un motor de base de datos relacional potente y confiable para almacenar millones de registros de lecturas con integridad transaccional.
- **Estilos:** Implementación de **Tailwind CSS** (o CSS Modular) para un diseño responsivo que se adapta a móviles y escritorios.

## 2. Funcionalidades Principales

El sistema ofrece un conjunto completo de herramientas para la gestión operativa y analítica:

### Gestión de Lecturas (Readings Module - App Mobile)

El módulo central del sistema permite el registro y consulta detallada de lecturas.

- **Captura de Datos:** Registro preciso de valores de lectura.
- **Imágenes y Ubicación:** Asociación de evidencia fotográfica y coordenadas geográficas a cada lectura para auditoría y verificación.
- **Observaciones:** Capacidad de agregar notas o novedades sobre el estado de la lectura.

### Seguridad y Administración (Security Module)

Un módulo dedicado garantiza el control de acceso y la integridad del sistema.

- **Autenticación Robusta:** Sistema seguro de inicio de sesión.
- **Gestión de Usuarios y Roles:** Administración granular de permisos, definiendo qué puede ver y hacer cada usuario en el sistema.

### Reportes Avanzados

El sistema genera reportes detallados que permiten visualizar el progreso por sectores y analizar datos históricos para la toma de decisiones.

## 3. Arquitectura de Software: Clean Architecture

El núcleo del diseño del proyecto se basa en **Clean Architecture (Arquitectura Limpia)**. Este enfoque garantiza que el sistema sea independiente de frameworks, bases de datos o interfaces de usuario, lo que facilita su evolución a largo plazo.

La estructura se divide en capas concéntricas, donde las dependencias fluyen hacia adentro:

1.  **Capa de Dominio (Domain Layer):** Es el corazón del sistema. Aquí residen las reglas de negocio y las "Entidades" fundamentales (como _Lectura_, _Usuario_, _Rol_). Esta capa no depende de nada externo y contiene la lógica pura del negocio.
2.  **Capa de Aplicación (Application Layer):** Contiene los "Casos de Uso" (_Use Cases_). Estos orquestan la lógica de negocio para cumplir tareas específicas, como "Crear una Lectura" (`CreateReadingUseCase`) o "Buscar Lectura" (`FindReadingUseCase`). Actúa como intermediario entre la interfaz y el dominio.
3.  **Capa de Infraestructura (Infrastructure Layer):** Maneja las conexiones con el mundo exterior, como bases de datos, servicios de terceros o sistemas de archivos. Aquí se implementan los detalles técnicos necesarios para que la aplicación funcione.
4.  **Capa de Presentación (Presentation Layer):** Es la cara visible del sistema. En el Backend, son los controladores API que reciben las peticiones; en el Frontend, son los componentes visuales (como los Dashboards) que interactúan con el usuario.

En el Backend, esta separación permite, por ejemplo, cambiar la base de datos sin afectar las reglas de negocio, o modificar la interfaz visual sin tocar la lógica de la aplicación.

En el Frontend, esta separación permite, por ejemplo, cambiar el cliente http de axios por otro sin afectar la lógica de la aplicación.

## 4. Dashboards Analíticos y Componentes Visuales

Una de las características más destacadas es el **Dashboard Analítico**, diseñado para proporcionar una visión "a vuelo de pájaro" del estado del sistema.

### Componentes Clave:

- **Estadísticas Globales (Global Stats):** Tarjetas de resumen que muestran los indicadores clave de rendimiento (KPIs) de todo el sistema de un vistazo.
- **Actividad Diaria (Daily Stats):** Una tabla dinámica que permite monitorear el progreso de las lecturas día a día, facilitando la identificación de patrones.
- **Estadísticas por Sector (Sector Stats):** Desglose del rendimiento por zonas geográficas o lógicas, permitiendo comparar la eficiencia entre diferentes áreas.
- **Distribución de Novedades (Novelty Distribution):** Gráficos que resaltan anomalías o reportes de incidencias, crucial para el mantenimiento preventivo.
- **Reportes Visuales (Sector Progress):** Gráficos de progreso visuales para una comprensión rápida e intuitiva del avance por sectores.
- **Tablas Detalladas (Advanced Readings):** Datos granulares accesibles mediante pestañas para un análisis profundo cuando es necesario.

### Interactividad

El dashboard es altamente interactivo, con selectores de fecha (mensual) y navegación por pestañas que permiten a los usuarios filtrar y enfocar la información relevante según sus necesidades.

## 6. Manual de Módulos (Guía Detallada)

Esta sección sirve como un manual de referencia práctico para los usuarios del sistema, detallando el flujo de trabajo de los módulos principales (`src/modules`) con ejemplos de uso.

### 6.1. Módulo de Autenticación (Auth)

El módulo de seguridad es la primera línea de defensa.

- **Acceso:** El sistema redirige automáticamente al Login si no hay una sesión válida.
- **Guía Paso a Paso:**
  1.  Ingrese su **Usuario** o **Correo Electrónico** registrado.
  2.  Ingrese su **Contraseña**.
  3.  Pulse "Ingresar".
- **Seguridad Técnica:** Implementa Tokens JWT (JSON Web Tokens) que expiran automáticamente para proteger la sesión si el usuario olvida cerrar el sistema.

### 6.2. Módulo de Dashboard (Panel de Control)

Diseñado para la toma de decisiones basada en datos en tiempo real.

#### 6.2.1. Navegación y Filtros

- **Selector de Periodo:** Icono de calendario en la esquina superior derecha. Permite cambiar la visualización entre datos del mes actual o datos históricos.
  - _Uso:_ Seleccione "Enero 2025" para ver el rendimiento de ese ciclo específico.
- **Pestañas de Visualización:**
  - _Visual:_ Gráficos de barras intuitivos para presentaciones.
  - _Detallado:_ Tablas con datos precisos para exportación.

#### 6.2.2. Interpretación de Datos

- **Global Stats:** Tarjetas superiores con KPIs críticos.
  - _Total Readings:_ Volumen total de trabajo.
  - _Novelties:_ Cantidad de problemas reportados (fugas, medidores dañados).
- **Sector Stats:** Gráficos de progreso por zona geográfica.
  - _Verde (100%):_ Sector completado.
  - _Amarillo (1-99%):_ En proceso.
  - _Gris (0%):_ No iniciado.

### 6.3. Módulo de Usuarios (Users)

Herramienta administrativa para gestión de personal.

#### 6.3.1. Caso de Uso: Registrar Nuevo Empleado

1.  Vaya al menú "Usuarios" -> "Nuevo".
2.  **Información Personal:** Ingrese Nombres, Apellidos y Cédula.
3.  **Credenciales:** Asigne un correo corporativo y una contraseña temporal.
4.  **Rol:** Seleccione el nivel de acceso (ver 6.4).
5.  Pulse "Guardar". El usuario queda activo inmediatamente.

#### 6.3.2. Caso de Uso: Desactivar Acceso

Si un empleado deja la empresa, no borre el usuario. Use el botón "Desactivar" para revocar el acceso manteniendo el historial de sus lecturas pasadas.

### 6.4. Módulo de Roles y Permisos (Roles)

Define la jerarquía del sistema.

- **Administrador:** Control total (Configuración, Usuarios, Reportes, Lecturas).
- **Supervisor:** Control operativo (Reportes, Monitoreo de Lecturas). No puede crear usuarios.
- **Lecturista:** Acceso restringido. Solo puede usar la App Móvil para registrar datos.
- **Auditor (Personalizado):** Ejemplo de rol a medida con permisos de "Solo Lectura" para verificar datos sin riesgo de modificarlos.

## 7. Conclusión

El proyecto EPAA-WEB no es solo una herramienta de registro, sino una plataforma integral de gestión. Su arquitectura limpia asegura que el sistema pueda crecer y adaptarse a futuros requerimientos sin deuda técnica, mientras que sus dashboards y funcionalidades avanzadas empoderan a los usuarios con información clara y accionable.

## 8. Recomendaciones Técnicas y de Escalabilidad

Para garantizar que el sistema mantenga su alto rendimiento a medida que crece el volumen de datos (se estima un crecimiento mensual del 15% en lecturas), se sugieren las siguientes mejoras técnicas:

### 8.1. Optimización del Backend (NestJS)

- **Cacheo con Redis:** Implementar una capa de caché en memoria (Redis) para endpoints de consulta frecuentes, reduciendo la carga directa sobre la base de datos PostgreSQL.
- **Rate Limiting:** Activar `ThrottlerModule` de NestJS para prevenir ataques de denegación de servicio (DDoS) o abusos de la API.
- **Logs Estructurados:** Implementar un sistema de logging centralizado (como Winston o Pino) para un monitoreo más efectivo en producción.

### 8.2. Mejoras en Frontend (React/Vite)

- **Lazy Loading:** Implementar carga perezosa (`React.lazy`) en los módulos de reportes históricos para disminuir el tiempo de carga inicial de la aplicación.
- **PWA (Progressive Web App):** Habilitar capacidades PWA en Vite para permitir que los lecturistas instalen la web como una app nativa en sus dispositivos móviles, facilitando el trabajo en campo con conectividad intermitente.

### 8.3. Seguridad Avanzada

- **Autenticación de Dos Factores (2FA):** Integrar un segundo paso de verificación (Google Authenticator) para cuentas de Administrador, protegiendo funciones críticas.
- **Auditoría de Cambios:** Crear una tabla de historial (`audit_logs`) que registre _quién_ cambió _qué_ y _cuándo_ en las lecturas, vital para la transparencia operativa.

## 9. Repositorio y Link de Acceso

El repositorio del proyecto se encuentra en GitHub en el siguiente enlace:

- Repositorio: https://github.com/mariosalazar/epaa-web.git
- Link de Acceso: https://web.sigepaa.com:8443

## 10. Anexos
