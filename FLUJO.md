# Flujo completo de la aplicación web RadioTaxi

## 1. Descripción general

La aplicación web de RadioTaxi tiene como objetivo modernizar la gestión de servicios de transporte, permitiendo administrar clientes, choferes, vehículos, solicitudes de taxi, pagos, usuarios, roles y reportes desde una plataforma centralizada.

El sistema será responsive, por lo que podrá utilizarse desde computadoras, tablets y teléfonos móviles. Esto permitirá que los diferentes usuarios de la empresa puedan acceder según su rol y realizar las acciones correspondientes.

La aplicación estará conectada a un backend mediante una API y utilizará una base de datos central para almacenar la información de clientes, servicios, vehículos, choferes, pagos y reportes.

---

## 2. Actores principales del sistema

### 2.1 Cliente

Es la persona que solicita un servicio de taxi, transporte de productos o compra por encargo. Puede acceder desde una aplicación web o móvil para registrar solicitudes, consultar el estado del servicio y realizar pagos.

### 2.2 Operadora

Es la persona encargada de recibir solicitudes, registrar servicios, consultar taxis disponibles y asignar un móvil al cliente.

### 2.3 Chofer

Es el conductor del radio móvil. Puede consultar los servicios asignados, aceptar o actualizar el estado del servicio y registrar la finalización de la carrera.

### 2.4 Administrador

Es el usuario con control total del sistema. Puede administrar clientes, choferes, vehículos, usuarios, roles, sucursales, pagos y configuraciones generales.

### 2.5 Supervisor

Es el usuario encargado de revisar reportes, controlar la operación diaria, verificar pagos y analizar el rendimiento de la empresa.

---

## 3. Inicio del flujo del sistema

El flujo general comienza cuando un usuario ingresa a la plataforma.

```text
Usuario ingresa a la aplicación
        |
        v
Pantalla de inicio de sesión
        |
        v
Validación de credenciales
        |
        v
Redirección según el rol del usuario
```

Cada usuario accede a un panel diferente según sus permisos.

```text
Cliente       -> Panel de cliente
Operadora     -> Panel de operadora
Chofer        -> Panel de chofer
Administrador -> Panel administrativo
Supervisor    -> Panel de reportes
```

---

## 4. Flujo de autenticación

El sistema debe contar con un módulo de autenticación para proteger el acceso a la información.

### Pasos del flujo

1. El usuario ingresa su correo o nombre de usuario.
2. El usuario ingresa su contraseña.
3. El frontend envía las credenciales al backend.
4. El backend valida los datos.
5. Si las credenciales son correctas, se genera un token de sesión.
6. El usuario es redirigido al panel correspondiente.
7. Si las credenciales son incorrectas, el sistema muestra un mensaje de error.

```text
Login
  |
  |-- Credenciales correctas --> Dashboard según rol
  |
  |-- Credenciales incorrectas --> Mensaje de error
```

### Reglas de seguridad

* Las contraseñas deben almacenarse cifradas.
* El sistema debe usar tokens de autenticación.
* Las rutas deben estar protegidas según el rol.
* El usuario no debe acceder a módulos para los que no tiene permiso.

---

## 5. Flujo del cliente

El cliente puede solicitar un servicio desde la aplicación.

### 5.1 Registro o ingreso del cliente

El cliente puede ingresar con una cuenta existente o registrarse si aún no tiene usuario.

```text
Cliente entra a la app
        |
        v
Inicia sesión o se registra
        |
        v
Accede al panel de cliente
```

### 5.2 Solicitud de servicio

Desde el panel de cliente, el usuario puede solicitar un taxi o servicio especial.

Datos que puede registrar:

* Dirección de origen.
* Dirección de destino.
* Tipo de servicio.
* Método de pago.
* Observaciones adicionales.
* Fecha y hora del servicio, si desea programarlo.

Tipos de servicio posibles:

* Carrera normal.
* Servicio por hora.
* Transporte de productos.
* Compra o pedido por encargo.

```text
Cliente solicita servicio
        |
        v
Completa origen, destino y tipo de servicio
        |
        v
Selecciona método de pago
        |
        v
Confirma solicitud
        |
        v
La solicitud queda en estado "Pendiente"
```

### 5.3 Seguimiento del servicio

Después de crear la solicitud, el cliente puede ver el estado del servicio.

Estados posibles:

| Estado      | Descripción                                               |
| ----------- | --------------------------------------------------------- |
| Pendiente   | La solicitud fue creada, pero aún no tiene taxi asignado. |
| Asignado    | La operadora asignó un vehículo y chofer.                 |
| En camino   | El chofer se dirige al punto de origen.                   |
| En servicio | El cliente está siendo atendido.                          |
| Finalizado  | El servicio terminó.                                      |
| Cancelado   | El servicio fue cancelado.                                |

```text
Solicitud pendiente
        |
        v
Taxi asignado
        |
        v
Chofer en camino
        |
        v
Servicio iniciado
        |
        v
Servicio finalizado
```

---

## 6. Flujo de la operadora

La operadora es uno de los roles principales del sistema, ya que gestiona las solicitudes y asigna móviles.

### 6.1 Recepción de solicitudes

La operadora puede recibir solicitudes desde dos fuentes:

1. Solicitudes creadas directamente por clientes desde la app.
2. Solicitudes recibidas por llamada telefónica, WhatsApp o atención presencial.

```text
Solicitud del cliente
        |
        v
Panel de operadora
        |
        v
Lista de solicitudes pendientes
```

Si la solicitud llega por llamada, la operadora registra manualmente los datos del cliente.

### 6.2 Registro manual de solicitud

Datos registrados por la operadora:

* Cliente.
* Número de teléfono.
* Dirección de origen.
* Dirección de destino.
* Tipo de servicio.
* Observaciones.
* Método de pago.
* Sucursal o zona cercana.

```text
Operadora recibe llamada
        |
        v
Busca o registra cliente
        |
        v
Registra datos del servicio
        |
        v
Guarda solicitud
        |
        v
Solicitud queda pendiente
```

### 6.3 Consulta de móviles disponibles

La operadora consulta los vehículos disponibles por sucursal, zona o estado.

Estados de vehículos:

| Estado            | Descripción                          |
| ----------------- | ------------------------------------ |
| Disponible        | Puede ser asignado a un servicio.    |
| Ocupado           | Está atendiendo una carrera.         |
| En camino         | Fue asignado y se dirige al cliente. |
| Fuera de servicio | No está disponible temporalmente.    |
| Mantenimiento     | El vehículo no puede operar.         |

```text
Operadora revisa solicitud pendiente
        |
        v
Consulta móviles disponibles
        |
        v
Selecciona vehículo y chofer
        |
        v
Asigna servicio
```

### 6.4 Asignación de taxi

Cuando la operadora encuentra un taxi disponible, asigna el servicio a un chofer y vehículo.

El sistema actualiza:

* Estado de la solicitud: `Asignado`.
* Estado del vehículo: `En camino` u `Ocupado`.
* Servicio asignado al chofer.
* Historial del cliente.
* Registro operativo de la empresa.

```text
Solicitud pendiente
        |
        v
Operadora asigna vehículo
        |
        v
Sistema notifica al chofer
        |
        v
Cliente ve el servicio asignado
```

---

## 7. Flujo del chofer

El chofer accede al sistema para ver los servicios asignados.

### 7.1 Consulta de servicios asignados

El chofer ingresa a su panel y puede ver:

* Cliente asignado.
* Dirección de origen.
* Dirección de destino.
* Tipo de servicio.
* Observaciones.
* Método de pago.
* Estado actual del servicio.

```text
Chofer inicia sesión
        |
        v
Consulta servicios asignados
        |
        v
Acepta o visualiza el servicio
```

### 7.2 Actualización del estado del servicio

El chofer puede actualizar el estado del servicio durante el proceso.

Flujo de estados:

```text
Asignado
   |
   v
En camino
   |
   v
En servicio
   |
   v
Finalizado
```

Cada cambio de estado queda registrado en el sistema para mantener trazabilidad.

### 7.3 Finalización del servicio

Al terminar la carrera, el chofer registra la finalización del servicio.

Datos que pueden registrarse:

* Hora de finalización.
* Monto cobrado.
* Método de pago.
* Observaciones.
* Confirmación del servicio realizado.

```text
Chofer finaliza servicio
        |
        v
Registra monto y forma de pago
        |
        v
Servicio cambia a "Finalizado"
        |
        v
Vehículo vuelve a "Disponible"
```

---

## 8. Flujo de pagos

El sistema permite registrar diferentes modalidades de pago.

Métodos de pago propuestos:

* Efectivo.
* QR.
* Transferencia bancaria.
* Pago acumulado.
* Pago posterior.

### 8.1 Pago inmediato

El cliente paga al finalizar el servicio.

```text
Servicio finalizado
        |
        v
Se registra el monto
        |
        v
Se selecciona método de pago
        |
        v
Pago queda registrado
        |
        v
Servicio queda cerrado
```

### 8.2 Pago acumulado

Algunos clientes pueden acumular servicios para pagar semanal, quincenal o mensualmente.

```text
Servicio finalizado
        |
        v
Pago marcado como acumulado
        |
        v
Se suma a la cuenta del cliente
        |
        v
Cliente paga después
        |
        v
Se registra el pago acumulado
```

### 8.3 Estados del pago

| Estado    | Descripción                                        |
| --------- | -------------------------------------------------- |
| Pendiente | El servicio aún no fue pagado.                     |
| Pagado    | El pago fue registrado correctamente.              |
| Acumulado | El pago queda pendiente para un periodo posterior. |
| Anulado   | El pago fue cancelado o corregido.                 |

---

## 9. Flujo del administrador

El administrador tiene acceso completo al sistema.

### 9.1 Gestión de usuarios

El administrador puede:

* Crear usuarios.
* Editar usuarios.
* Bloquear usuarios.
* Asignar roles.
* Cambiar permisos.
* Restablecer contraseñas.

```text
Administrador ingresa
        |
        v
Gestiona usuarios
        |
        v
Asigna roles y permisos
```

### 9.2 Gestión de choferes

El administrador registra y actualiza información de los choferes.

Datos principales:

* Nombre completo.
* Documento de identidad.
* Teléfono.
* Licencia de conducir.
* Estado.
* Vehículos asociados.

### 9.3 Gestión de vehículos

El administrador registra los radio móviles de la empresa.

Datos principales:

* Número de radio móvil.
* Placa.
* Marca.
* Modelo.
* Color.
* Propietario.
* Sucursal.
* Estado.

### 9.4 Gestión de sucursales

El administrador puede registrar las sedes o paradas de RadioTaxi.

Datos principales:

* Nombre de la sucursal.
* Dirección.
* Teléfono.
* Responsable.
* Estado.

---

## 10. Flujo del supervisor

El supervisor se encarga de revisar la operación y generar reportes.

### 10.1 Consulta de reportes

El supervisor puede generar reportes por:

* Fecha.
* Sucursal.
* Chofer.
* Vehículo.
* Cliente.
* Método de pago.
* Estado del servicio.

Reportes principales:

| Reporte                | Descripción                                              |
| ---------------------- | -------------------------------------------------------- |
| Servicios por día      | Muestra la cantidad de servicios realizados diariamente. |
| Servicios por sucursal | Permite comparar el rendimiento de cada sucursal.        |
| Servicios por chofer   | Muestra los servicios realizados por cada chofer.        |
| Pagos realizados       | Lista los pagos confirmados.                             |
| Pagos pendientes       | Muestra servicios todavía no pagados.                    |
| Clientes frecuentes    | Identifica los clientes con mayor uso del servicio.      |
| Vehículos más activos  | Muestra los móviles con más servicios realizados.        |

```text
Supervisor ingresa
        |
        v
Selecciona tipo de reporte
        |
        v
Aplica filtros
        |
        v
Visualiza resultados
        |
        v
Exporta o imprime reporte
```

---

## 11. Flujo completo de una carrera

Este es el flujo principal del sistema desde el inicio hasta el cierre del servicio.

```text
Cliente solicita taxi
        |
        v
Sistema registra solicitud
        |
        v
Solicitud queda pendiente
        |
        v
Operadora revisa solicitud
        |
        v
Operadora consulta móviles disponibles
        |
        v
Operadora asigna chofer y vehículo
        |
        v
Sistema notifica al chofer
        |
        v
Cliente ve taxi asignado
        |
        v
Chofer cambia estado a "En camino"
        |
        v
Chofer llega al punto de origen
        |
        v
Servicio cambia a "En servicio"
        |
        v
Chofer realiza la carrera
        |
        v
Servicio finaliza
        |
        v
Se registra el pago
        |
        v
Vehículo vuelve a estar disponible
        |
        v
El servicio aparece en reportes
```

---

## 12. Estados principales del sistema

### 12.1 Estados de solicitud

```text
Pendiente -> Asignado -> En camino -> En servicio -> Finalizado
```

También puede pasar a:

```text
Cancelado
```

### 12.2 Estados de vehículo

```text
Disponible -> En camino -> Ocupado -> Disponible
```

Estados alternativos:

```text
Fuera de servicio
Mantenimiento
Inactivo
```

### 12.3 Estados de pago

```text
Pendiente -> Pagado
Pendiente -> Acumulado -> Pagado
Pendiente -> Anulado
```

---

## 13. Flujo técnico entre frontend, backend y base de datos

La aplicación funcionará mediante una arquitectura cliente-servidor.

```text
Usuario
  |
  v
Frontend React
  |
  v
API Backend
  |
  v
Base de datos PostgreSQL
```

### Ejemplo: registrar solicitud de taxi

```text
Cliente completa formulario
        |
        v
React valida los datos
        |
        v
React envía solicitud al backend
        |
        v
Backend valida permisos y datos
        |
        v
Backend guarda la solicitud en la base de datos
        |
        v
Backend responde al frontend
        |
        v
React muestra confirmación al usuario
```

### Ejemplo de endpoint

```text
POST /servicios
```

Datos enviados:

```json
{
  "clienteId": 1,
  "origen": "Av. Principal #123",
  "destino": "Centro de la ciudad",
  "tipoServicio": "CARRERA",
  "metodoPago": "QR",
  "observaciones": "Cliente espera en la puerta principal"
}
```

Respuesta esperada:

```json
{
  "id": 25,
  "estado": "PENDIENTE",
  "mensaje": "Solicitud registrada correctamente"
}
```

---

## 14. Diseño responsive del flujo

La aplicación debe adaptarse a diferentes dispositivos.

### En computadora

La vista puede usar:

* Menú lateral.
* Tablas grandes.
* Paneles de resumen.
* Formularios amplios.
* Reportes detallados.

```text
Sidebar | Contenido principal | Panel de detalles
```

### En celular

La vista debe simplificarse:

* Menú hamburguesa.
* Tarjetas en lugar de tablas grandes.
* Botones grandes.
* Formularios de una columna.
* Información resumida.

```text
Menú superior
Tarjetas de información
Botones principales
Formulario vertical
```

### Ejemplo

En computadora, la operadora puede ver una tabla completa de solicitudes pendientes.

En móvil, cada solicitud puede mostrarse como una tarjeta con botones:

```text
Cliente: Juan Pérez
Origen: Av. Principal
Destino: Centro
Estado: Pendiente

[Asignar taxi] [Ver detalle]
```

---

## 15. Flujo de permisos por rol

Cada rol tendrá acceso solo a las funciones necesarias.

| Módulo                  | Cliente | Operadora | Chofer | Admin | Supervisor |
| ----------------------- | ------- | --------- | ------ | ----- | ---------- |
| Solicitar servicio      | Sí      | Sí        | No     | Sí    | No         |
| Asignar taxi            | No      | Sí        | No     | Sí    | No         |
| Ver servicios asignados | No      | No        | Sí     | Sí    | Sí         |
| Registrar pago          | Sí      | Sí        | Sí     | Sí    | No         |
| Gestionar usuarios      | No      | No        | No     | Sí    | No         |
| Gestionar vehículos     | No      | No        | No     | Sí    | Sí         |
| Ver reportes            | No      | No        | No     | Sí    | Sí         |
| Gestionar roles         | No      | No        | No     | Sí    | No         |

---

## 16. Flujo de auditoría

El sistema debe registrar acciones importantes para mejorar la seguridad y trazabilidad.

Acciones que deberían registrarse:

* Inicio de sesión.
* Creación de usuario.
* Registro de cliente.
* Registro de servicio.
* Asignación de taxi.
* Cambio de estado del servicio.
* Registro de pago.
* Modificación de datos importantes.
* Anulación de pago.
* Cancelación de servicio.

Ejemplo:

```text
Usuario: operadora01
Acción: Asignó taxi
Servicio: #25
Vehículo: Móvil 104
Fecha: 12/06/2026
Hora: 15:30
```

---

## 17. Flujo de respaldo y seguridad

Para proteger la información, el sistema debe contar con medidas de seguridad.

### Seguridad de acceso

* Inicio de sesión obligatorio.
* Roles y permisos.
* Contraseñas cifradas.
* Cierre de sesión.
* Protección de rutas.

### Seguridad de datos

* Comunicación mediante HTTPS.
* Validación de datos.
* Auditoría de acciones.
* Respaldos periódicos.
* Control de acceso a la base de datos.

### Respaldos

```text
Respaldo completo: semanal
Respaldo incremental: diario
Prueba de restauración: mensual
```

---

## 18. Resumen del flujo general

El sistema inicia con el acceso del usuario mediante login. Luego, según su rol, el usuario puede realizar diferentes acciones dentro de la plataforma.

El cliente puede solicitar servicios y consultar su estado. La operadora puede registrar solicitudes, revisar móviles disponibles y asignar taxis. El chofer puede consultar servicios asignados y actualizar el estado de la carrera. El administrador puede gestionar usuarios, choferes, vehículos y sucursales. El supervisor puede revisar reportes y controlar la operación.

El flujo principal termina cuando el servicio es finalizado, el pago es registrado y la información queda disponible para reportes administrativos.

```text
Login
  |
  v
Panel según rol
  |
  v
Gestión de solicitudes
  |
  v
Asignación de taxi
  |
  v
Atención del servicio
  |
  v
Registro de pago
  |
  v
Reportes y auditoría
```

---

## 19. Conclusión

El flujo completo de la aplicación RadioTaxi permite representar de manera ordenada cómo funcionará el sistema desde el punto de vista del cliente, la operadora, el chofer, el administrador y el supervisor.

La solución propuesta permite reemplazar procesos manuales por una plataforma digital centralizada, mejorar la atención al cliente, controlar la disponibilidad de vehículos, registrar pagos, generar reportes y proteger la información mediante roles, permisos y auditoría.

Además, al ser una aplicación responsive, podrá utilizarse desde computadoras y dispositivos móviles, facilitando su uso en oficinas, sucursales y operaciones de campo.
