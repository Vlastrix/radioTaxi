# Flujo de la Aplicación Web RadioTaxi

## 1. Descripción general
La aplicación de RadioTaxi busca gestionar de forma rápida y sencilla las solicitudes de transporte, conectando clientes, operadoras y choferes en una plataforma centralizada sin complejidades innecesarias.

## 2. Actores principales
El sistema se reduce a los **3 roles clave** de la operación diaria, más 1 de gestión:

1. **Cliente**: Solicita un taxi mediante la app (o llamando a la central).
2. **Operadora**: Recibe la solicitud, busca un taxi disponible y lo asigna.
3. **Chofer**: Recibe el viaje asignado, recoge al cliente y finaliza el servicio.
4. **Administrador**: Gestiona los usuarios, choferes y vehículos.

---

## 3. Flujo Core de una Carrera (Paso a Paso)

Este es el proceso central y más importante del sistema:

1. **Solicitud**: El Cliente entra a la app y pide un taxi indicando origen y destino (o llama por teléfono y la Operadora registra el pedido). La solicitud entra en estado **Pendiente**.
2. **Asignación**: La Operadora ve el pedido en su panel, busca un móvil "Disponible" y se lo asigna. La solicitud cambia a **Asignado**.
3. **Realización del Viaje**: El Chofer recibe la notificación en su panel, se dirige al origen y realiza el viaje. El estado del chofer pasa a **Ocupado**.
4. **Finalización y Pago**: El Chofer llega al destino, cobra el monto correspondiente (Efectivo o QR) y marca el servicio como **Finalizado**. El chofer vuelve a estar **Disponible**.

```text
[Cliente Pide] ---> [Operadora Asigna] ---> [Chofer Viaja] ---> [Cobro y Fin]
```

---

## 4. Estados del Sistema (Simplificados)

Para mantener la base de datos y la programación de la app simples, usaremos los estados mínimos viables:

### Estados del Viaje (Solicitud):
* **Pendiente**: Esperando a que la operadora asigne un móvil.
* **En curso**: Móvil asignado y viaje realizándose.
* **Finalizado**: Viaje terminado y pagado.
* **Cancelado**: Si el viaje se aborta.

### Estados del Chofer / Móvil:
* **Disponible**: Listo para recibir un nuevo viaje.
* **Ocupado**: En un viaje actualmente.
* **Inactivo**: Fuera de su turno de trabajo.

---

## 5. Vistas / Permisos por Rol (Lo básico)

Cada usuario tendrá una interfaz directa al grano:

* **Cliente**: 
  - Pantalla para pedir taxi (Origen, Destino, Pedir).
  - Ver el estado de su pedido actual.
* **Operadora**: 
  - Panel principal con 2 columnas: "Viajes Pendientes" y "Choferes Disponibles".
  - Botón rápido para cruzar un viaje pendiente con un chofer libre.
* **Chofer**: 
  - Pantalla principal con el viaje actual (Dirección de recogida y destino).
  - Botón gigante de "Finalizar Viaje".
  - Switch para ponerse "Disponible" / "Inactivo".
* **Administrador**: 
  - Tablas para agregar, editar y eliminar (CRUD) Choferes, Vehículos y Operadoras.
  - Historial básico de viajes realizados.
