# Requerimientos del Sistema - Radio Taxi

## 1. Especificaciones Técnicas

**Stack Tecnológico Requerido:**
- **Backend:** NestJS, TypeScript
- **Base de Datos:** PostgreSQL
- **ORM:** Prisma
- **Frontend:** React, TypeScript

**Justificación Técnica:**
- **NestJS** garantiza una arquitectura API REST modular, organizada y escalable mediante Node.js y tipado estricto (TypeScript).
- **Prisma** provee un acceso seguro a la base de datos con modelos consistentes, migraciones automatizadas y consultas tipadas.
- **PostgreSQL** se define como el motor de persistencia debido a su fiabilidad para sistemas transaccionales, manejo de pagos, reportes financieros y mantenimiento de integridad referencial (relaciones complejas entre clientes, choferes, vehículos y servicios).

---

## 2. Arquitectura del Sistema

El sistema sigue un modelo Cliente/Servidor comunicado a través de API REST:

```text
Cliente Web / Móvil (Frontend en React)
        |
        | [Protocolo HTTPS / API REST]
        |
Servidor de Aplicación (Backend en NestJS)
        |
        | [Prisma ORM]
        |
Capa de Persistencia (PostgreSQL)
```

### 2.1. Estructura de Módulos (Frontend)
- Autenticación (Login)
- Panel de Control (Dashboard)
- Gestión de Clientes
- Consola de Operadora
- Gestión de Choferes
- Gestión de Vehículos
- Gestión de Servicios (Carreras)
- Gestión de Pagos
- Reportes e Indicadores
- Administración de Usuarios y Roles

### 2.2. Estructura de Módulos (Backend)
- **Auth:** Autenticación y control de sesión.
- **Users:** Gestión de cuentas de usuario.
- **Roles:** Autorización y permisos.
- **Clients:** Directorio de clientes.
- **Drivers:** Registro de conductores.
- **Vehicles:** Inventario de radio móviles.
- **Branches:** Administración de sucursales o bases.
- **Services:** Lógica de negocio para asignación de carreras.
- **Payments:** Procesamiento de cobros.
- **Reports:** Agregación de datos operativos.

---

## 3. Plan de Implementación por Fases

### Fase 1: Análisis y Definición de Dominio

**Roles del Sistema:**
| Rol | Privilegios y Responsabilidades |
| :--- | :--- |
| **Administrador** | Control total sobre la parametrización del sistema, usuarios y auditoría. |
| **Operadora** | Recepción de solicitudes, registro de clientes y asignación de unidades móviles. |
| **Chofer** | Consulta de historial de servicios y visualización de carreras asignadas en curso. |
| **Cliente** | Emisión de solicitudes de servicio y seguimiento. |
| **Supervisor** | Acceso de solo lectura a métricas operativas y reportes financieros. |

**Alcance de Interfaz de Usuario (UI):**
Debe existir cobertura visual y funcional para:
1. Acceso seguro (Login).
2. Panel principal de métricas operativas.
3. Formularios de registro (Cliente, Chofer, Vehículo).
4. Interfaz de despacho (Solicitud y asignación de taxi).
5. Módulo de facturación/pagos.
6. Pantallas de reportes consolidados.

### Fase 2: Diseño del Modelo de Datos (BBDD)

**Entidades Principales:**
`usuarios`, `roles`, `clientes`, `choferes`, `vehiculos`, `sucursales`, `servicios`, `pagos`, `reportes`, `auditoria`.

**Reglas de Multiplicidad y Relaciones:**
- **Cliente (1) a Servicios (N):** Un cliente puede registrar múltiples solicitudes de servicio.
- **Chofer (1) a Servicios (N):** Un chofer puede atender múltiples servicios a lo largo del tiempo.
- **Vehículo (1) a Servicios (N):** Un vehículo está asociado al historial de servicios en los que operó.
- **Sucursal (1) a Vehículos (N):** Toda unidad móvil debe estar asignada a una sucursal o parada base.
- **Servicio (1) a Pagos (N):** Un servicio puede ser fraccionado o estar asociado a múltiples transacciones.
- **Usuario (N) a Rol (1):** Cada usuario opera bajo un único perfil de acceso definido.

### Fase 3: Construcción de la API (Backend)

El sistema debe exponer endpoints RESTful securizados para cada entidad operativa.

**Endpoints Mínimos Requeridos:**
- `POST /auth/login` (Autenticación y emisión de token)
- `GET /clientes` (Listado con filtros y paginación)
- `POST /clientes` (Alta de cliente)
- `GET /vehiculos/disponibles` (Consulta de unidades en estado libre)
- `POST /servicios` (Apertura de nueva carrera)
- `PATCH /servicios/:id/asignar` (Cambio de estado y vinculación a un móvil)
- `PATCH /servicios/:id/finalizar` (Cierre de la carrera)
- `POST /pagos` (Registro de transacción)
- `GET /reportes/servicios` (Extracción de data agregada)

### Fase 4: Construcción de Interfaz Gráfica (Frontend)

El frontend debe garantizar la operabilidad bajo un diseño **Responsive Design**, adaptándose al dispositivo del usuario. 

**Requisitos de UI/UX:**
- **Tecnología CSS:** Se utilizará el framework **Tailwind CSS** para agilizar y mantener un sistema de diseño consistente.
- **Resolución Escritorio (PC/Laptop):** Interfaz maximizada con menú lateral (Sidebar) persistente, tablas de datos extensas y paneles de detalles contextuales (Dos a tres columnas).
- **Resolución Móvil/Tablet:** Navegación colapsable (Menú hamburguesa), visualización de datos basada en "Tarjetas" (Cards), botones de acción de gran tamaño (Touch-friendly) y distribución en una sola columna.

### Fase 5: Estándares de Seguridad

El sistema debe cumplir estrictamente con los siguientes controles:
1. **Autenticación Stateless:** Todo acceso debe requerir un JWT (JSON Web Token) válido.
2. **Encriptación de Credenciales:** Obligatorio el uso de algoritmos de hashing (ej. bcrypt) para contraseñas; prohibido el almacenamiento en texto plano.
3. **Control de Acceso Basado en Roles (RBAC):** Las rutas del frontend y los endpoints del backend deben restringirse según el rol del usuario (Ej: Operadora no debe tener acceso a eliminación de usuarios).
4. **Validación de Entradas:** Toda información recibida por la API debe ser sanitizada y validada estructuralmente antes del procesamiento.
5. **Comunicaciones Seguras:** Obligatoriedad de protocolo HTTPS en entornos productivos.
6. **Trazabilidad:** Sistema de bitácora (auditoría) para el registro de acciones destructivas o críticas (ej. eliminación de registros financieros).
7. **Principio de Mínimo Privilegio:** Los usuarios solo tendrán visibilidad sobre los datos estrictamente necesarios para su rol (ej. el Chofer solo visualiza sus propias carreras).

### Fase 6: Criterios de Aceptación y Pruebas

Para dar el sistema por completado, deberá superar satisfactoriamente las siguientes pruebas funcionales:

**A. Flujo Operativo Core:**
- Registro exitoso de entidades base (Cliente, Chofer, Vehículo).
- Creación de solicitud de servicio por parte de la Operadora.
- Asignación exitosa de un Taxi disponible al servicio.
- Finalización de servicio y correcta generación del cobro (Pago).
- Generación de reporte estadístico con la información procesada.

**B. Pruebas de Adaptabilidad (Responsive):**
- Operatividad sin pérdida de información en PC (Monitor 1080p).
- Operatividad en Laptop (Resolución 720p).
- Operatividad táctil en Tablets.
- Operatividad en Celulares (Layout adaptado a tarjetas).

**C. Pruebas de Seguridad (Pen-testing básico):**
- Bloqueo de acceso y redirección a login frente a peticiones no autenticadas.
- Bloqueo de acceso a módulos administrativos para roles operativos.
- Rechazo (HTTP 400/422) frente a cargas de datos malformados.
- Prevención de fuga de datos (Chofer A no puede consultar detalles de pagos del Chofer B).
