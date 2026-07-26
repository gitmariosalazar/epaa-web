--
-- PostgreSQL database dump
--

\restrict 4xi8fdhWdq0jCikdZWdAFMRza2i1eUnXQMQst9gOzI1NapdXDFzgh8eypoHSZ9L

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP POLICY IF EXISTS audit_superuser_full ON audit.registro;
DROP POLICY IF EXISTS audit_reader_full ON audit.registro;
DROP POLICY IF EXISTS audit_admin_full ON audit.registro;
DROP POLICY IF EXISTS alerta_reader ON audit.alerta;
DROP POLICY IF EXISTS alerta_admin ON audit.alerta;
ALTER TABLE IF EXISTS ONLY work_orders.tipo_trabajo DROP CONSTRAINT IF EXISTS tipo_trabajo_id_departamento_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.orden_trabajo DROP CONSTRAINT IF EXISTS orden_trabajo_usuario_completacion_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.orden_trabajo DROP CONSTRAINT IF EXISTS orden_trabajo_usuario_asignado_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.orden_trabajo DROP CONSTRAINT IF EXISTS orden_trabajo_usuario_asignacion_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.orden_trabajo DROP CONSTRAINT IF EXISTS orden_trabajo_origen_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.orden_trabajo DROP CONSTRAINT IF EXISTS orden_trabajo_id_tipo_trabajo_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.orden_trabajo DROP CONSTRAINT IF EXISTS orden_trabajo_id_prioridad_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.orden_trabajo DROP CONSTRAINT IF EXISTS orden_trabajo_id_orden_padre_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.orden_trabajo DROP CONSTRAINT IF EXISTS orden_trabajo_id_cliente_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.orden_trabajo DROP CONSTRAINT IF EXISTS orden_trabajo_estado_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.orden_trabajo DROP CONSTRAINT IF EXISTS orden_trabajo_created_by_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.observaciones_orden_trabajo DROP CONSTRAINT IF EXISTS observaciones_orden_trabajo_id_orden_trabajo_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.observaciones_orden_trabajo DROP CONSTRAINT IF EXISTS observaciones_orden_trabajo_created_by_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.inspeccion_preparacion DROP CONSTRAINT IF EXISTS inspeccion_preparacion_id_orden_trabajo_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.inspeccion_preparacion_detalle DROP CONSTRAINT IF EXISTS inspeccion_preparacion_detalle_id_inspeccion_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.inspeccion_preparacion_detalle DROP CONSTRAINT IF EXISTS inspeccion_preparacion_detalle_created_by_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.inspeccion_preparacion_detalle DROP CONSTRAINT IF EXISTS inspeccion_preparacion_detalle_codigo_item_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.inspeccion_preparacion DROP CONSTRAINT IF EXISTS inspeccion_preparacion_created_by_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.historial_estado_orden_trabajo DROP CONSTRAINT IF EXISTS historial_estado_orden_trabajo_id_usuario_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.historial_estado_orden_trabajo DROP CONSTRAINT IF EXISTS historial_estado_orden_trabajo_id_orden_trabajo_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.historial_estado_orden_trabajo DROP CONSTRAINT IF EXISTS historial_estado_orden_trabajo_estado_nuevo_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.historial_estado_orden_trabajo DROP CONSTRAINT IF EXISTS historial_estado_orden_trabajo_estado_anterior_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.encuesta_satisfaccion DROP CONSTRAINT IF EXISTS encuesta_satisfaccion_id_orden_trabajo_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.encuesta_satisfaccion DROP CONSTRAINT IF EXISTS encuesta_satisfaccion_created_by_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.detalle_orden_trabajo_material DROP CONSTRAINT IF EXISTS detalle_orden_trabajo_material_id_orden_trabajo_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.detalle_orden_trabajo_material DROP CONSTRAINT IF EXISTS detalle_orden_trabajo_material_created_by_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.costo_adicional_orden DROP CONSTRAINT IF EXISTS costo_adicional_orden_id_orden_trabajo_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.costo_adicional_orden DROP CONSTRAINT IF EXISTS costo_adicional_orden_created_by_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.corte_servicio DROP CONSTRAINT IF EXISTS corte_servicio_id_orden_trabajo_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.corte_servicio DROP CONSTRAINT IF EXISTS corte_servicio_created_by_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.control_calidad DROP CONSTRAINT IF EXISTS control_calidad_id_orden_trabajo_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.control_calidad_detalle DROP CONSTRAINT IF EXISTS control_calidad_detalle_id_control_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.control_calidad_detalle DROP CONSTRAINT IF EXISTS control_calidad_detalle_created_by_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.control_calidad_detalle DROP CONSTRAINT IF EXISTS control_calidad_detalle_codigo_item_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.control_calidad DROP CONSTRAINT IF EXISTS control_calidad_created_by_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.asignacion_trabajador_orden DROP CONSTRAINT IF EXISTS asignacion_trabajador_orden_id_trabajador_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.asignacion_trabajador_orden DROP CONSTRAINT IF EXISTS asignacion_trabajador_orden_id_rol_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.asignacion_trabajador_orden DROP CONSTRAINT IF EXISTS asignacion_trabajador_orden_id_orden_trabajo_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.asignacion_trabajador_orden DROP CONSTRAINT IF EXISTS asignacion_trabajador_orden_created_by_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.adjuntos_orden_trabajo DROP CONSTRAINT IF EXISTS adjuntos_orden_trabajo_id_orden_trabajo_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.adjuntos_orden_trabajo DROP CONSTRAINT IF EXISTS adjuntos_orden_trabajo_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.usuario_roles DROP CONSTRAINT IF EXISTS usuario_roles_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.usuario_roles DROP CONSTRAINT IF EXISTS usuario_roles_rol_id_fkey;
ALTER TABLE IF EXISTS ONLY public.usuario_permisos DROP CONSTRAINT IF EXISTS usuario_permisos_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.usuario_permisos DROP CONSTRAINT IF EXISTS usuario_permisos_permiso_id_fkey;
ALTER TABLE IF EXISTS ONLY public.tarifa DROP CONSTRAINT IF EXISTS tarifa_categoria_id_fkey;
ALTER TABLE IF EXISTS ONLY public.siguiente_lectura DROP CONSTRAINT IF EXISTS siguiente_lectura_ultima_lectura_id_fkey;
ALTER TABLE IF EXISTS ONLY public.siguiente_lectura DROP CONSTRAINT IF EXISTS siguiente_lectura_acometida_id_fkey;
ALTER TABLE IF EXISTS ONLY public.seguimiento_lectura DROP CONSTRAINT IF EXISTS seguimiento_lectura_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.seguimiento_lectura DROP CONSTRAINT IF EXISTS seguimiento_lectura_lectura_id_fkey;
ALTER TABLE IF EXISTS ONLY public.seguimiento_lectura DROP CONSTRAINT IF EXISTS seguimiento_lectura_lectura_estado_id_fkey;
ALTER TABLE IF EXISTS ONLY public.seguimiento_lectura DROP CONSTRAINT IF EXISTS seguimiento_lectura_lectura_estado_anterior_id_fkey;
ALTER TABLE IF EXISTS ONLY public.seguimiento_lectura DROP CONSTRAINT IF EXISTS seguimiento_lectura_acometida_id_fkey;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_parent_rol_id_fkey;
ALTER TABLE IF EXISTS ONLY public.rol_permisos DROP CONSTRAINT IF EXISTS rol_permisos_rol_id_fkey;
ALTER TABLE IF EXISTS ONLY public.rol_permisos DROP CONSTRAINT IF EXISTS rol_permisos_permiso_id_fkey;
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.rangos_variables DROP CONSTRAINT IF EXISTS rangos_variables_tarifa_id_fkey;
ALTER TABLE IF EXISTS ONLY public.rangos_variables DROP CONSTRAINT IF EXISTS rangos_variables_servicio_id_fkey;
ALTER TABLE IF EXISTS ONLY public.qrcode DROP CONSTRAINT IF EXISTS qrcode_acometida_id_fkey;
ALTER TABLE IF EXISTS ONLY public.historial_medidores DROP CONSTRAINT IF EXISTS historial_medidores_id_cliente_fkey;
ALTER TABLE IF EXISTS ONLY public.historial_medidores DROP CONSTRAINT IF EXISTS historial_medidores_id_acometida_fkey;
ALTER TABLE IF EXISTS ONLY public.historial_estados_acometida DROP CONSTRAINT IF EXISTS historial_estados_acometida_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.historial_estados_acometida DROP CONSTRAINT IF EXISTS historial_estados_acometida_estado_id_fkey;
ALTER TABLE IF EXISTS ONLY public.historial_estados_acometida DROP CONSTRAINT IF EXISTS historial_estados_acometida_acometida_id_fkey;
ALTER TABLE IF EXISTS ONLY public.verificar_cuenta_cliente DROP CONSTRAINT IF EXISTS fk_verificar_cuenta_tipo;
ALTER TABLE IF EXISTS ONLY public.verificar_cuenta_cliente DROP CONSTRAINT IF EXISTS fk_verificar_cuenta_cliente_usuario;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS fk_usuarios_estado_usuario;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS fk_usuarios_cliente_id;
ALTER TABLE IF EXISTS ONLY public.usuario_lectura DROP CONSTRAINT IF EXISTS fk_usuario_lectura_usuario;
ALTER TABLE IF EXISTS ONLY public.usuario_lectura DROP CONSTRAINT IF EXISTS fk_usuario_lectura_lectura;
ALTER TABLE IF EXISTS ONLY public.usuario_factura DROP CONSTRAINT IF EXISTS fk_usuario_factura_usuario;
ALTER TABLE IF EXISTS ONLY public.usuario_factura DROP CONSTRAINT IF EXISTS fk_usuario_factura_factura;
ALTER TABLE IF EXISTS ONLY public.usuario_lectura DROP CONSTRAINT IF EXISTS fk_user_reading_action;
ALTER TABLE IF EXISTS ONLY public.titulo_dato DROP CONSTRAINT IF EXISTS fk_titulo_dato_tipo;
ALTER TABLE IF EXISTS ONLY public.titulo_dato DROP CONSTRAINT IF EXISTS fk_titulo_dato_cliente;
ALTER TABLE IF EXISTS ONLY public.tipo_incidente_medidor DROP CONSTRAINT IF EXISTS fk_tipo_incidente_categoria;
ALTER TABLE IF EXISTS ONLY public.telefono DROP CONSTRAINT IF EXISTS fk_telefono_tipo;
ALTER TABLE IF EXISTS ONLY public.telefono_persona_natural DROP CONSTRAINT IF EXISTS fk_telefono_persona_natural_telefono;
ALTER TABLE IF EXISTS ONLY public.telefono_persona_natural DROP CONSTRAINT IF EXISTS fk_telefono_persona_natural_cliente;
ALTER TABLE IF EXISTS ONLY public.telefono_empresa DROP CONSTRAINT IF EXISTS fk_telefono_empresa_telefono;
ALTER TABLE IF EXISTS ONLY public.telefono_empresa DROP CONSTRAINT IF EXISTS fk_telefono_empresa_empresa;
ALTER TABLE IF EXISTS ONLY public.telefono DROP CONSTRAINT IF EXISTS fk_telefono_cliente;
ALTER TABLE IF EXISTS ONLY public.provincia DROP CONSTRAINT IF EXISTS fk_provincia_pais;
ALTER TABLE IF EXISTS ONLY public.predio DROP CONSTRAINT IF EXISTS fk_predio_tipo_predio;
ALTER TABLE IF EXISTS ONLY public.permisos DROP CONSTRAINT IF EXISTS fk_permisos_categoria;
ALTER TABLE IF EXISTS ONLY public.parroquia DROP CONSTRAINT IF EXISTS fk_parroquia_tipo;
ALTER TABLE IF EXISTS ONLY public.parroquia DROP CONSTRAINT IF EXISTS fk_parroquia_canton;
ALTER TABLE IF EXISTS ONLY public.observacion_lectura DROP CONSTRAINT IF EXISTS fk_observacion_lectura_observacion;
ALTER TABLE IF EXISTS ONLY public.observacion_lectura DROP CONSTRAINT IF EXISTS fk_observacion_lectura_lectura;
ALTER TABLE IF EXISTS ONLY public.observacion_factura DROP CONSTRAINT IF EXISTS fk_observacion_factura_observacion;
ALTER TABLE IF EXISTS ONLY public.observacion_factura DROP CONSTRAINT IF EXISTS fk_observacion_factura_factura;
ALTER TABLE IF EXISTS ONLY public.observacion_acometida DROP CONSTRAINT IF EXISTS fk_observacion_acometida_observacion;
ALTER TABLE IF EXISTS ONLY public.observacion_acometida DROP CONSTRAINT IF EXISTS fk_observacion_acometida_acometida;
ALTER TABLE IF EXISTS ONLY public.lectura DROP CONSTRAINT IF EXISTS fk_lectura_tipo_novedad_lectura;
ALTER TABLE IF EXISTS ONLY public.lectura DROP CONSTRAINT IF EXISTS fk_lectura_lectura_estado;
ALTER TABLE IF EXISTS ONLY public.lectura_estado DROP CONSTRAINT IF EXISTS fk_lectura_estado_tipo_estado_lectura;
ALTER TABLE IF EXISTS ONLY public.lectura DROP CONSTRAINT IF EXISTS fk_lectura_acometida;
ALTER TABLE IF EXISTS ONLY public.incidente_medidor DROP CONSTRAINT IF EXISTS fk_incidente_usuario_resuelve;
ALTER TABLE IF EXISTS ONLY public.incidente_medidor DROP CONSTRAINT IF EXISTS fk_incidente_usuario_reporta;
ALTER TABLE IF EXISTS ONLY public.incidente_medidor DROP CONSTRAINT IF EXISTS fk_incidente_tipo;
ALTER TABLE IF EXISTS ONLY public.incidente_medidor DROP CONSTRAINT IF EXISTS fk_incidente_lectura;
ALTER TABLE IF EXISTS ONLY public.incidente_medidor DROP CONSTRAINT IF EXISTS fk_incidente_cliente_usuario_reporta;
ALTER TABLE IF EXISTS ONLY public.incidente_medidor DROP CONSTRAINT IF EXISTS fk_incidente_acometida;
ALTER TABLE IF EXISTS ONLY public.historial_incidente DROP CONSTRAINT IF EXISTS fk_historial_incidente_usuario;
ALTER TABLE IF EXISTS ONLY public.historial_incidente DROP CONSTRAINT IF EXISTS fk_historial_incidente_incidente;
ALTER TABLE IF EXISTS ONLY public.foto_lectura DROP CONSTRAINT IF EXISTS fk_foto_lectura_lectura;
ALTER TABLE IF EXISTS ONLY public.foto_incidente DROP CONSTRAINT IF EXISTS fk_foto_incidente_incidente;
ALTER TABLE IF EXISTS ONLY public.foto_acometida DROP CONSTRAINT IF EXISTS fk_foto_acometida_acometida;
ALTER TABLE IF EXISTS ONLY public.factura DROP CONSTRAINT IF EXISTS fk_factura_forma_pago;
ALTER TABLE IF EXISTS ONLY public.factura DROP CONSTRAINT IF EXISTS fk_factura_estado_pago;
ALTER TABLE IF EXISTS ONLY public.factura DROP CONSTRAINT IF EXISTS fk_factura_cliente;
ALTER TABLE IF EXISTS ONLY public.empresa DROP CONSTRAINT IF EXISTS fk_empresa_parroquia;
ALTER TABLE IF EXISTS ONLY public.empresa DROP CONSTRAINT IF EXISTS fk_empresa_cliente;
ALTER TABLE IF EXISTS ONLY public.empleados DROP CONSTRAINT IF EXISTS fk_empleados_usuario;
ALTER TABLE IF EXISTS ONLY public.empleados DROP CONSTRAINT IF EXISTS fk_empleados_ciudadano;
ALTER TABLE IF EXISTS ONLY public.direccion DROP CONSTRAINT IF EXISTS fk_direccion_parroquia;
ALTER TABLE IF EXISTS ONLY public.correo_persona_natural DROP CONSTRAINT IF EXISTS fk_correo_persona_natural_correo;
ALTER TABLE IF EXISTS ONLY public.correo_persona_natural DROP CONSTRAINT IF EXISTS fk_correo_persona_natural_cliente;
ALTER TABLE IF EXISTS ONLY public.correo_empresa DROP CONSTRAINT IF EXISTS fk_correo_empresa_empresa;
ALTER TABLE IF EXISTS ONLY public.correo_empresa DROP CONSTRAINT IF EXISTS fk_correo_empresa_correo;
ALTER TABLE IF EXISTS ONLY public.correo_electronico DROP CONSTRAINT IF EXISTS fk_correo_electronico_cliente;
ALTER TABLE IF EXISTS ONLY public.consumo_promedio DROP CONSTRAINT IF EXISTS fk_consumo_promedio_acometida;
ALTER TABLE IF EXISTS ONLY public.cliente_usuario_roles DROP CONSTRAINT IF EXISTS fk_cliente_usuario_roles_usuario;
ALTER TABLE IF EXISTS ONLY public.cliente_usuario_roles DROP CONSTRAINT IF EXISTS fk_cliente_usuario_roles_rol;
ALTER TABLE IF EXISTS ONLY public.cliente_usuario_permisos DROP CONSTRAINT IF EXISTS fk_cliente_usuario_permisos_usuario;
ALTER TABLE IF EXISTS ONLY public.cliente_usuario_permisos DROP CONSTRAINT IF EXISTS fk_cliente_usuario_permisos_permiso;
ALTER TABLE IF EXISTS ONLY public.cliente_usuario DROP CONSTRAINT IF EXISTS fk_cliente_usuario_cliente;
ALTER TABLE IF EXISTS ONLY public.cliente DROP CONSTRAINT IF EXISTS fk_cliente_tipo_identificacion;
ALTER TABLE IF EXISTS ONLY public.predio DROP CONSTRAINT IF EXISTS fk_cliente_predio;
ALTER TABLE IF EXISTS ONLY public.cliente_persona_natural DROP CONSTRAINT IF EXISTS fk_cliente_persona_natural_cliente;
ALTER TABLE IF EXISTS ONLY public.cliente_persona_natural DROP CONSTRAINT IF EXISTS fk_cliente_persona_natural_ciudadano;
ALTER TABLE IF EXISTS ONLY public.ciudadano DROP CONSTRAINT IF EXISTS fk_ciudadano_sexo;
ALTER TABLE IF EXISTS ONLY public.ciudadano DROP CONSTRAINT IF EXISTS fk_ciudadano_profesion;
ALTER TABLE IF EXISTS ONLY public.ciudadano DROP CONSTRAINT IF EXISTS fk_ciudadano_parroquia;
ALTER TABLE IF EXISTS ONLY public.ciudadano DROP CONSTRAINT IF EXISTS fk_ciudadano_estado_civil;
ALTER TABLE IF EXISTS ONLY public.canton DROP CONSTRAINT IF EXISTS fk_canton_provincia;
ALTER TABLE IF EXISTS ONLY public.acometida DROP CONSTRAINT IF EXISTS fk_acometida_zona;
ALTER TABLE IF EXISTS ONLY public.acometida DROP CONSTRAINT IF EXISTS fk_acometida_tipo_acometida;
ALTER TABLE IF EXISTS ONLY public.acometida DROP CONSTRAINT IF EXISTS fk_acometida_tarifa;
ALTER TABLE IF EXISTS ONLY public.acometida DROP CONSTRAINT IF EXISTS fk_acometida_predio;
ALTER TABLE IF EXISTS ONLY public.acometida DROP CONSTRAINT IF EXISTS fk_acometida_cliente;
ALTER TABLE IF EXISTS ONLY public.empleados DROP CONSTRAINT IF EXISTS empleados_updated_by_fkey;
ALTER TABLE IF EXISTS ONLY public.empleados DROP CONSTRAINT IF EXISTS empleados_tipo_contrato_id_fkey;
ALTER TABLE IF EXISTS ONLY public.empleados DROP CONSTRAINT IF EXISTS empleados_supervisor_id_fkey;
ALTER TABLE IF EXISTS ONLY public.empleados DROP CONSTRAINT IF EXISTS empleados_sexo_id_fkey;
ALTER TABLE IF EXISTS ONLY public.empleados DROP CONSTRAINT IF EXISTS empleados_estado_empleado_id_fkey;
ALTER TABLE IF EXISTS ONLY public.empleados DROP CONSTRAINT IF EXISTS empleados_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.empleados DROP CONSTRAINT IF EXISTS empleados_ciudadano_id_fkey;
ALTER TABLE IF EXISTS ONLY public.empleados DROP CONSTRAINT IF EXISTS empleados_cargo_id_fkey;
ALTER TABLE IF EXISTS ONLY public.empleado_zona DROP CONSTRAINT IF EXISTS empleado_zona_zona_id_fkey;
ALTER TABLE IF EXISTS ONLY public.empleado_zona DROP CONSTRAINT IF EXISTS empleado_zona_empleado_id_fkey;
ALTER TABLE IF EXISTS ONLY public.componentes_fijos DROP CONSTRAINT IF EXISTS componentes_fijos_tarifa_id_fkey;
ALTER TABLE IF EXISTS ONLY public.componentes_fijos DROP CONSTRAINT IF EXISTS componentes_fijos_servicio_id_fkey;
ALTER TABLE IF EXISTS ONLY public.cliente_usuario DROP CONSTRAINT IF EXISTS cliente_usuario_updated_by_fkey;
ALTER TABLE IF EXISTS ONLY public.cliente_usuario DROP CONSTRAINT IF EXISTS cliente_usuario_estado_cliente_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.cliente_usuario DROP CONSTRAINT IF EXISTS cliente_usuario_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.acometida DROP CONSTRAINT IF EXISTS acometida_estado_id_fkey;
ALTER TABLE IF EXISTS ONLY notifications.template DROP CONSTRAINT IF EXISTS fk_template_prioridad;
ALTER TABLE IF EXISTS ONLY notifications.template DROP CONSTRAINT IF EXISTS fk_template_canal;
ALTER TABLE IF EXISTS ONLY notifications.user_notification DROP CONSTRAINT IF EXISTS fk_notif_prioridad;
ALTER TABLE IF EXISTS ONLY notifications.user_notification DROP CONSTRAINT IF EXISTS fk_notif_estado;
ALTER TABLE IF EXISTS ONLY notifications.user_notification DROP CONSTRAINT IF EXISTS fk_notif_canal;
ALTER TABLE IF EXISTS ONLY notifications.user_notification_dispatch_log DROP CONSTRAINT IF EXISTS fk_dispatch_notification;
ALTER TABLE IF EXISTS ONLY notifications.user_notification_dispatch_log DROP CONSTRAINT IF EXISTS fk_dispatch_estado;
ALTER TABLE IF EXISTS ONLY documents.relacion_usuarios DROP CONSTRAINT IF EXISTS relacion_usuarios_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY documents.relacion_usuarios DROP CONSTRAINT IF EXISTS relacion_usuarios_documento_id_fkey;
ALTER TABLE IF EXISTS ONLY documents.relacion_solicitud DROP CONSTRAINT IF EXISTS relacion_solicitud_solicitud_id_fkey;
ALTER TABLE IF EXISTS ONLY documents.relacion_solicitud DROP CONSTRAINT IF EXISTS relacion_solicitud_documento_id_fkey;
ALTER TABLE IF EXISTS ONLY documents.relacion_predio DROP CONSTRAINT IF EXISTS relacion_predio_predio_id_fkey;
ALTER TABLE IF EXISTS ONLY documents.relacion_predio DROP CONSTRAINT IF EXISTS relacion_predio_documento_id_fkey;
ALTER TABLE IF EXISTS ONLY documents.relacion_orden_trabajo DROP CONSTRAINT IF EXISTS relacion_orden_trabajo_documento_id_fkey;
ALTER TABLE IF EXISTS ONLY documents.relacion_lectura DROP CONSTRAINT IF EXISTS relacion_lectura_lectura_id_fkey;
ALTER TABLE IF EXISTS ONLY documents.relacion_lectura DROP CONSTRAINT IF EXISTS relacion_lectura_documento_id_fkey;
ALTER TABLE IF EXISTS ONLY documents.relacion_factura DROP CONSTRAINT IF EXISTS relacion_factura_factura_id_fkey;
ALTER TABLE IF EXISTS ONLY documents.relacion_factura DROP CONSTRAINT IF EXISTS relacion_factura_documento_id_fkey;
ALTER TABLE IF EXISTS ONLY documents.relacion_acometida DROP CONSTRAINT IF EXISTS relacion_acometida_documento_id_fkey;
ALTER TABLE IF EXISTS ONLY documents.relacion_acometida DROP CONSTRAINT IF EXISTS relacion_acometida_acometida_id_fkey;
ALTER TABLE IF EXISTS ONLY documents.historial_documento DROP CONSTRAINT IF EXISTS historial_documento_estado_nuevo_fkey;
ALTER TABLE IF EXISTS ONLY documents.historial_documento DROP CONSTRAINT IF EXISTS historial_documento_estado_anterior_fkey;
ALTER TABLE IF EXISTS ONLY documents.historial_documento DROP CONSTRAINT IF EXISTS historial_documento_documento_id_fkey;
ALTER TABLE IF EXISTS ONLY documents.documento DROP CONSTRAINT IF EXISTS documento_tipo_documento_id_fkey;
ALTER TABLE IF EXISTS ONLY documents.documento DROP CONSTRAINT IF EXISTS documento_nivel_acceso_fkey;
ALTER TABLE IF EXISTS ONLY documents.documento DROP CONSTRAINT IF EXISTS documento_estado_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.solicitud DROP CONSTRAINT IF EXISTS solicitud_uso_predio_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.solicitud DROP CONSTRAINT IF EXISTS solicitud_tipo_persona_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.solicitud DROP CONSTRAINT IF EXISTS solicitud_tipo_acometida_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.solicitud_orden_trabajo DROP CONSTRAINT IF EXISTS solicitud_orden_trabajo_tipo_orden_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.solicitud_orden_trabajo DROP CONSTRAINT IF EXISTS solicitud_orden_trabajo_id_solicitud_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.solicitud DROP CONSTRAINT IF EXISTS solicitud_id_tipo_solicitud_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.solicitud DROP CONSTRAINT IF EXISTS solicitud_id_cliente_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.solicitud DROP CONSTRAINT IF EXISTS solicitud_id_analista_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.solicitud DROP CONSTRAINT IF EXISTS solicitud_estado_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.registro_catastral DROP CONSTRAINT IF EXISTS registro_catastral_id_solicitud_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.registro_catastral DROP CONSTRAINT IF EXISTS registro_catastral_id_registrador_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.registro_catastral DROP CONSTRAINT IF EXISTS registro_catastral_id_contrato_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.informe_instalacion DROP CONSTRAINT IF EXISTS informe_instalacion_solicitud_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.informe_instalacion DROP CONSTRAINT IF EXISTS informe_instalacion_aprobador_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.informe_inspeccion DROP CONSTRAINT IF EXISTS informe_inspeccion_resultado_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.informe_inspeccion DROP CONSTRAINT IF EXISTS informe_inspeccion_id_solicitud_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.informe_inspeccion DROP CONSTRAINT IF EXISTS informe_inspeccion_id_aprobador_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.historial_estado DROP CONSTRAINT IF EXISTS historial_estado_id_solicitud_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.historial_estado DROP CONSTRAINT IF EXISTS historial_estado_estado_nuevo_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.historial_estado DROP CONSTRAINT IF EXISTS historial_estado_estado_anterior_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.solicitud DROP CONSTRAINT IF EXISTS fk_solicitud_tipo_acometida;
ALTER TABLE IF EXISTS ONLY acometidas.factura_inspeccion DROP CONSTRAINT IF EXISTS factura_inspeccion_id_solicitud_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.factura_inspeccion DROP CONSTRAINT IF EXISTS factura_inspeccion_id_concepto_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.factura_inspeccion DROP CONSTRAINT IF EXISTS factura_inspeccion_id_cajero_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.factura_inspeccion DROP CONSTRAINT IF EXISTS factura_inspeccion_estado_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.documento_adjunto DROP CONSTRAINT IF EXISTS documento_adjunto_id_validador_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.documento_adjunto DROP CONSTRAINT IF EXISTS documento_adjunto_id_tipo_documento_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.documento_adjunto DROP CONSTRAINT IF EXISTS documento_adjunto_id_solicitud_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.documento_adjunto DROP CONSTRAINT IF EXISTS documento_adjunto_estado_validacion_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.contrato_servicio DROP CONSTRAINT IF EXISTS contrato_servicio_id_tarifa_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.contrato_servicio DROP CONSTRAINT IF EXISTS contrato_servicio_id_solicitud_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.contrato_servicio DROP CONSTRAINT IF EXISTS contrato_servicio_id_medidor_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.contrato_servicio DROP CONSTRAINT IF EXISTS contrato_servicio_id_generador_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.contrato_servicio DROP CONSTRAINT IF EXISTS contrato_servicio_estado_firma_fkey;
DROP TRIGGER IF EXISTS trg_state_machine_ot ON work_orders.orden_trabajo;
DROP TRIGGER IF EXISTS trg_registrar_historial_creacion_ot ON work_orders.orden_trabajo;
DROP TRIGGER IF EXISTS trg_orden_trabajo_updated_at ON work_orders.orden_trabajo;
DROP TRIGGER IF EXISTS trg_observaciones_updated_at ON work_orders.observaciones_orden_trabajo;
DROP TRIGGER IF EXISTS trg_inspeccion_updated_at ON work_orders.inspeccion_preparacion;
DROP TRIGGER IF EXISTS trg_inspeccion_det_updated_at ON work_orders.inspeccion_preparacion_detalle;
DROP TRIGGER IF EXISTS trg_generar_codigo_orden ON work_orders.orden_trabajo;
DROP TRIGGER IF EXISTS trg_encuesta_satisfaccion_updated_at ON work_orders.encuesta_satisfaccion;
DROP TRIGGER IF EXISTS trg_detalle_material_updated_at ON work_orders.detalle_orden_trabajo_material;
DROP TRIGGER IF EXISTS trg_costo_adicional_updated_at ON work_orders.costo_adicional_orden;
DROP TRIGGER IF EXISTS trg_corte_servicio_updated_at ON work_orders.corte_servicio;
DROP TRIGGER IF EXISTS trg_control_calidad_updated_at ON work_orders.control_calidad;
DROP TRIGGER IF EXISTS trg_control_calidad_det_updated_at ON work_orders.control_calidad_detalle;
DROP TRIGGER IF EXISTS trg_asignacion_trabajador_updated_at ON work_orders.asignacion_trabajador_orden;
DROP TRIGGER IF EXISTS trg_adjuntos_updated_at ON work_orders.adjuntos_orden_trabajo;
DROP TRIGGER IF EXISTS update_cat_action_types_modtime ON public.cat_action_types;
DROP TRIGGER IF EXISTS trg_verificar_cuenta_cliente_updated ON public.verificar_cuenta_cliente;
DROP TRIGGER IF EXISTS trg_usuarios_lockout ON public.usuarios;
DROP TRIGGER IF EXISTS trg_usuarios_lifecycle ON public.usuarios;
DROP TRIGGER IF EXISTS trg_update_timestamp_siguiente_lectura ON public.siguiente_lectura;
DROP TRIGGER IF EXISTS trg_update_timestamp_seguimiento_lectura ON public.seguimiento_lectura;
DROP TRIGGER IF EXISTS trg_update_meter_reading ON public.acometida;
DROP TRIGGER IF EXISTS trg_update_empleados_timestamp ON public.empleados;
DROP TRIGGER IF EXISTS trg_update_consumo_promedio ON public.lectura;
DROP TRIGGER IF EXISTS trg_update_cliente_usuario_timestamp ON public.cliente_usuario;
DROP TRIGGER IF EXISTS trg_sync_lectura_auditoria ON public.lectura;
DROP TRIGGER IF EXISTS trg_registrar_historial_incidente ON public.incidente_medidor;
DROP TRIGGER IF EXISTS trg_insert_initial_reading_full ON public.acometida;
DROP TRIGGER IF EXISTS trg_insert_cambio_medidor_reading ON public.acometida;
DROP TRIGGER IF EXISTS trg_historial_medidores_update ON public.acometida;
DROP TRIGGER IF EXISTS trg_historial_medidores_insert ON public.acometida;
DROP TRIGGER IF EXISTS trg_gestionar_estados ON public.historial_estados_acometida;
DROP TRIGGER IF EXISTS trg_control_siguiente_mensual ON public.lectura;
DROP TRIGGER IF EXISTS trg_cliente_usuario_lockout ON public.cliente_usuario;
DROP TRIGGER IF EXISTS trg_cliente_usuario_lifecycle ON public.cliente_usuario;
DROP TRIGGER IF EXISTS trg_block_duplicate_lectura ON public.lectura;
DROP TRIGGER IF EXISTS trg_auto_cierre_auditoria ON public.auditoria_lectura_sector;
DROP TRIGGER IF EXISTS trg_auditar_lectura ON public.lectura;
DROP TRIGGER IF EXISTS trg_audit_zona ON public.zona;
DROP TRIGGER IF EXISTS trg_audit_verificar_cuenta_cliente ON public.verificar_cuenta_cliente;
DROP TRIGGER IF EXISTS trg_audit_usuarios ON public.usuarios;
DROP TRIGGER IF EXISTS trg_audit_usuario_roles ON public.usuario_roles;
DROP TRIGGER IF EXISTS trg_audit_usuario_permisos ON public.usuario_permisos;
DROP TRIGGER IF EXISTS trg_audit_usuario_lectura ON public.usuario_lectura;
DROP TRIGGER IF EXISTS trg_audit_usuario_factura ON public.usuario_factura;
DROP TRIGGER IF EXISTS trg_audit_titulo_dato ON public.titulo_dato;
DROP TRIGGER IF EXISTS trg_audit_tipo_verificacion ON public.tipo_verificacion;
DROP TRIGGER IF EXISTS trg_audit_tipo_titulo_dato ON public.tipo_titulo_dato;
DROP TRIGGER IF EXISTS trg_audit_tipo_telefono ON public.tipo_telefono;
DROP TRIGGER IF EXISTS trg_audit_tipo_relacion_familiar ON public.tipo_relacion_familiar;
DROP TRIGGER IF EXISTS trg_audit_tipo_predio ON public.tipo_predio;
DROP TRIGGER IF EXISTS trg_audit_tipo_parroquia ON public.tipo_parroquia;
DROP TRIGGER IF EXISTS trg_audit_tipo_novedad_lectura ON public.tipo_novedad_lectura;
DROP TRIGGER IF EXISTS trg_audit_tipo_identificacion ON public.tipo_identificacion;
DROP TRIGGER IF EXISTS trg_audit_tipo_estado_lectura ON public.tipo_estado_lectura;
DROP TRIGGER IF EXISTS trg_audit_tipo_contrato ON public.tipo_contrato;
DROP TRIGGER IF EXISTS trg_audit_temp_correo_electronico ON public.temp_correo_electronico;
DROP TRIGGER IF EXISTS trg_audit_temp_acometida_update ON public.temp_acometida_update;
DROP TRIGGER IF EXISTS trg_audit_telefono_persona_natural ON public.telefono_persona_natural;
DROP TRIGGER IF EXISTS trg_audit_telefono_empresa ON public.telefono_empresa;
DROP TRIGGER IF EXISTS trg_audit_telefono ON public.telefono;
DROP TRIGGER IF EXISTS trg_audit_tarifa ON public.tarifa;
DROP TRIGGER IF EXISTS trg_audit_siguiente_lectura ON public.siguiente_lectura;
DROP TRIGGER IF EXISTS trg_audit_sexo ON public.sexo;
DROP TRIGGER IF EXISTS trg_audit_servicio ON public.servicio;
DROP TRIGGER IF EXISTS trg_audit_seguimiento_lectura ON public.seguimiento_lectura;
DROP TRIGGER IF EXISTS trg_audit_roles ON public.roles;
DROP TRIGGER IF EXISTS trg_audit_rol_permisos ON public.rol_permisos;
DROP TRIGGER IF EXISTS trg_audit_refresh_tokens ON public.refresh_tokens;
DROP TRIGGER IF EXISTS trg_audit_rangos_variables ON public.rangos_variables;
DROP TRIGGER IF EXISTS trg_audit_qrcode ON public.qrcode;
DROP TRIGGER IF EXISTS trg_audit_provincia ON public.provincia;
DROP TRIGGER IF EXISTS trg_audit_profesion ON public.profesion;
DROP TRIGGER IF EXISTS trg_audit_predio ON public.predio;
DROP TRIGGER IF EXISTS trg_audit_permisos ON public.permisos;
DROP TRIGGER IF EXISTS trg_audit_permiso_categoria ON public.permiso_categoria;
DROP TRIGGER IF EXISTS trg_audit_parroquia ON public.parroquia;
DROP TRIGGER IF EXISTS trg_audit_pais ON public.pais;
DROP TRIGGER IF EXISTS trg_audit_observacion_lectura ON public.observacion_lectura;
DROP TRIGGER IF EXISTS trg_audit_observacion_factura ON public.observacion_factura;
DROP TRIGGER IF EXISTS trg_audit_observacion_acometida ON public.observacion_acometida;
DROP TRIGGER IF EXISTS trg_audit_observacion ON public.observacion;
DROP TRIGGER IF EXISTS trg_audit_lectura_estado ON public.lectura_estado;
DROP TRIGGER IF EXISTS trg_audit_lectura ON public.lectura;
DROP TRIGGER IF EXISTS trg_audit_historial_medidores ON public.historial_medidores;
DROP TRIGGER IF EXISTS trg_audit_historial_estados_acometida ON public.historial_estados_acometida;
DROP TRIGGER IF EXISTS trg_audit_foto_lectura_copia ON public.foto_lectura_copia;
DROP TRIGGER IF EXISTS trg_audit_foto_lectura ON public.foto_lectura;
DROP TRIGGER IF EXISTS trg_audit_foto_acometida ON public.foto_acometida;
DROP TRIGGER IF EXISTS trg_audit_forma_pago ON public.forma_pago;
DROP TRIGGER IF EXISTS trg_audit_factura ON public.factura;
DROP TRIGGER IF EXISTS trg_audit_estado_pago ON public.estado_pago;
DROP TRIGGER IF EXISTS trg_audit_estado_empleado ON public.estado_empleado;
DROP TRIGGER IF EXISTS trg_audit_estado_cliente_usuario ON public.estado_cliente_usuario;
DROP TRIGGER IF EXISTS trg_audit_estado_civil ON public.estado_civil;
DROP TRIGGER IF EXISTS trg_audit_empresa ON public.empresa;
DROP TRIGGER IF EXISTS trg_audit_empleados ON public.empleados;
DROP TRIGGER IF EXISTS trg_audit_empleado_zona ON public.empleado_zona;
DROP TRIGGER IF EXISTS trg_audit_direccion ON public.direccion;
DROP TRIGGER IF EXISTS trg_audit_correo_persona_natural ON public.correo_persona_natural;
DROP TRIGGER IF EXISTS trg_audit_correo_empresa ON public.correo_empresa;
DROP TRIGGER IF EXISTS trg_audit_correo_electronico ON public.correo_electronico;
DROP TRIGGER IF EXISTS trg_audit_consumo_promedio ON public.consumo_promedio;
DROP TRIGGER IF EXISTS trg_audit_componentes_fijos ON public.componentes_fijos;
DROP TRIGGER IF EXISTS trg_audit_cliente_usuario_roles ON public.cliente_usuario_roles;
DROP TRIGGER IF EXISTS trg_audit_cliente_usuario_permisos ON public.cliente_usuario_permisos;
DROP TRIGGER IF EXISTS trg_audit_cliente_usuario ON public.cliente_usuario;
DROP TRIGGER IF EXISTS trg_audit_cliente_persona_natural ON public.cliente_persona_natural;
DROP TRIGGER IF EXISTS trg_audit_cliente ON public.cliente;
DROP TRIGGER IF EXISTS trg_audit_claves_sql2000 ON public.claves_sql2000;
DROP TRIGGER IF EXISTS trg_audit_ciudadano ON public.ciudadano;
DROP TRIGGER IF EXISTS trg_audit_categoria ON public.categoria;
DROP TRIGGER IF EXISTS trg_audit_cat_estados_acometida ON public.cat_estados_acometida;
DROP TRIGGER IF EXISTS trg_audit_cat_action_types ON public.cat_action_types;
DROP TRIGGER IF EXISTS trg_audit_cargo ON public.cargo;
DROP TRIGGER IF EXISTS trg_audit_canton ON public.canton;
DROP TRIGGER IF EXISTS trg_audit_auditoria_lectura_sector ON public.auditoria_lectura_sector;
DROP TRIGGER IF EXISTS trg_audit_acometida ON public.acometida;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at_tipo_incidente ON public.tipo_incidente_medidor;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at_incidente ON public.incidente_medidor;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at_foto_incidente ON public.foto_incidente;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at_categoria_incidente ON public.categoria_incidente_medidor;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.zona;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.usuarios;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.usuario_roles;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.usuario_permisos;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.usuario_lectura;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.usuario_factura;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.titulo_dato;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.tipo_titulo_dato;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.tipo_telefono;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.tipo_relacion_familiar;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.tipo_predio;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.tipo_parroquia;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.tipo_novedad_lectura;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.tipo_identificacion;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.tipo_estado_lectura;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.tipo_contrato;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.telefono_persona_natural;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.telefono_empresa;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.telefono;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.tarifa;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.siguiente_lectura;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.sexo;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.servicio;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.seguimiento_lectura;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.roles;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.rol_permisos;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.refresh_tokens;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.rangos_variables;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.qrcode;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.provincia;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.profesion;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.predio;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.permisos;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.permiso_categoria;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.parroquia;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.pais;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.observacion_lectura;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.observacion_factura;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.observacion_acometida;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.observacion;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.lectura_estado;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.lectura;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.foto_lectura;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.foto_acometida;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.forma_pago;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.factura;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.estado_pago;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.estado_empleado;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.estado_cliente_usuario;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.estado_civil;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.empresa;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.empleados;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.empleado_zona;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.direccion;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.correo_persona_natural;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.correo_empresa;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.correo_electronico;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.consumo_promedio;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.componentes_fijos;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.cliente_usuario;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.cliente_persona_natural;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.cliente;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.claves_sql2000;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.ciudadano;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.categoria;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.cargo;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.canton;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.acometida;
DROP TRIGGER IF EXISTS tr_asign_rol_for_client_user ON public.cliente_usuario;
DROP TRIGGER IF EXISTS trg_validar_usuario_notificacion ON notifications.user_notification;
DROP TRIGGER IF EXISTS trg_user_notification_updated ON notifications.user_notification;
DROP TRIGGER IF EXISTS trg_emit_realtime_notification ON notifications.user_notification;
DROP TRIGGER IF EXISTS trg_tipo_doc_updated_at ON documents.tipo_documento;
DROP TRIGGER IF EXISTS trg_documento_updated_at ON documents.documento;
DROP TRIGGER IF EXISTS trg_config_updated_at ON audit.tabla_config;
DROP TRIGGER IF EXISTS trg_validar_usuario_accion ON acometidas.historial_estado;
DROP TRIGGER IF EXISTS trg_sync_catastro_definitivo ON acometidas.registro_catastral;
DROP TRIGGER IF EXISTS trg_state_machine ON acometidas.solicitud;
DROP TRIGGER IF EXISTS trg_solicitud_updated_at ON acometidas.solicitud;
DROP TRIGGER IF EXISTS trg_sincronizar_acometida_legacy ON acometidas.registro_catastral;
DROP TRIGGER IF EXISTS trg_medidor_updated_at ON acometidas.inventario_medidor;
DROP TRIGGER IF EXISTS trg_informe_updated_at ON acometidas.informe_inspeccion;
DROP TRIGGER IF EXISTS trg_informe_instalacion_updated_at ON acometidas.informe_instalacion;
DROP TRIGGER IF EXISTS trg_generar_numero_solicitud ON acometidas.solicitud;
DROP TRIGGER IF EXISTS trg_factura_updated_at ON acometidas.factura_inspeccion;
DROP TRIGGER IF EXISTS trg_factura_inspeccion_updated ON acometidas.factura_inspeccion;
DROP TRIGGER IF EXISTS trg_factura_inspeccion_created ON acometidas.factura_inspeccion;
DROP TRIGGER IF EXISTS trg_documento_updated_at ON acometidas.documento_adjunto;
DROP TRIGGER IF EXISTS trg_documento_resubmitted ON acometidas.documento_adjunto;
DROP TRIGGER IF EXISTS trg_contrato_updated_at ON acometidas.contrato_servicio;
DROP TRIGGER IF EXISTS trg_catastro_updated_at ON acometidas.registro_catastral;
DROP TRIGGER IF EXISTS trg_audit_solicitud_orden_trabajo ON acometidas.solicitud_orden_trabajo;
DROP TRIGGER IF EXISTS trg_audit_solicitud ON acometidas.solicitud;
DROP TRIGGER IF EXISTS trg_audit_registro_catastral ON acometidas.registro_catastral;
DROP TRIGGER IF EXISTS trg_audit_inventario_medidor ON acometidas.inventario_medidor;
DROP TRIGGER IF EXISTS trg_audit_informe_instalacion ON acometidas.informe_instalacion;
DROP TRIGGER IF EXISTS trg_audit_informe_inspeccion ON acometidas.informe_inspeccion;
DROP TRIGGER IF EXISTS trg_audit_historial_estado ON acometidas.historial_estado;
DROP TRIGGER IF EXISTS trg_audit_factura_inspeccion ON acometidas.factura_inspeccion;
DROP TRIGGER IF EXISTS trg_audit_documento_adjunto ON acometidas.documento_adjunto;
DROP TRIGGER IF EXISTS trg_audit_contrato_servicio ON acometidas.contrato_servicio;
DROP TRIGGER IF EXISTS trg_audit_catalogo_tipo_documento ON acometidas.catalogo_tipo_documento;
DROP TRIGGER IF EXISTS trg_audit_catalogo_concepto_factura ON acometidas.catalogo_concepto_factura;
DROP TRIGGER IF EXISTS trg_audit_cat_uso_predio ON acometidas.cat_uso_predio;
DROP TRIGGER IF EXISTS trg_audit_cat_tipo_persona ON acometidas.cat_tipo_persona;
DROP TRIGGER IF EXISTS trg_audit_cat_tipo_orden ON acometidas.cat_tipo_orden;
DROP TRIGGER IF EXISTS trg_audit_cat_tipo_acometida ON acometidas.cat_tipo_acometida;
DROP TRIGGER IF EXISTS trg_audit_cat_resultado_inspeccion ON acometidas.cat_resultado_inspeccion;
DROP TRIGGER IF EXISTS trg_audit_cat_estado_validacion_doc ON acometidas.cat_estado_validacion_doc;
DROP TRIGGER IF EXISTS trg_audit_cat_estado_solicitud ON acometidas.cat_estado_solicitud;
DROP TRIGGER IF EXISTS trg_audit_cat_estado_pago ON acometidas.cat_estado_pago;
DROP TRIGGER IF EXISTS trg_audit_cat_estado_orden ON acometidas.cat_estado_orden;
DROP TRIGGER IF EXISTS trg_audit_cat_estado_firma ON acometidas.cat_estado_firma;
DROP INDEX IF EXISTS work_orders.idx_ot_padre;
DROP INDEX IF EXISTS work_orders.idx_ot_metadata;
DROP INDEX IF EXISTS work_orders.idx_ot_individual;
DROP INDEX IF EXISTS work_orders.idx_ot_geom_trazado;
DROP INDEX IF EXISTS work_orders.idx_ot_geom_punto;
DROP INDEX IF EXISTS work_orders.idx_ot_geom_area;
DROP INDEX IF EXISTS work_orders.idx_ot_estado;
DROP INDEX IF EXISTS work_orders.idx_ot_cliente;
DROP INDEX IF EXISTS work_orders.idx_oot_orden;
DROP INDEX IF EXISTS work_orders.idx_ip_orden;
DROP INDEX IF EXISTS work_orders.idx_heot_orden;
DROP INDEX IF EXISTS work_orders.idx_heot_fecha;
DROP INDEX IF EXISTS work_orders.idx_esot_orden;
DROP INDEX IF EXISTS work_orders.idx_dotm_orden;
DROP INDEX IF EXISTS work_orders.idx_cs_orden;
DROP INDEX IF EXISTS work_orders.idx_cc_orden;
DROP INDEX IF EXISTS work_orders.idx_caot_orden;
DROP INDEX IF EXISTS work_orders.idx_ato_trabajador;
DROP INDEX IF EXISTS work_orders.idx_ato_responsable;
DROP INDEX IF EXISTS work_orders.idx_ato_orden;
DROP INDEX IF EXISTS work_orders.idx_aot_orden;
DROP INDEX IF EXISTS public.idx_zona_nombre;
DROP INDEX IF EXISTS public.idx_zona_codigo;
DROP INDEX IF EXISTS public.idx_verificar_cuenta_token_unico;
DROP INDEX IF EXISTS public.idx_verificar_cuenta_cliente_usuario_activo;
DROP INDEX IF EXISTS public.idx_usuarios_username;
DROP INDEX IF EXISTS public.idx_usuarios_locked_out;
DROP INDEX IF EXISTS public.idx_usuarios_is_active;
DROP INDEX IF EXISTS public.idx_usuarios_failed_att;
DROP INDEX IF EXISTS public.idx_usuarios_estado;
DROP INDEX IF EXISTS public.idx_usuarios_email;
DROP INDEX IF EXISTS public.idx_usuarios_deleted_at;
DROP INDEX IF EXISTS public.idx_usuarios_created_at;
DROP INDEX IF EXISTS public.idx_usuario_roles_usuario_id;
DROP INDEX IF EXISTS public.idx_usuario_roles_rol_id;
DROP INDEX IF EXISTS public.idx_usuario_permisos_usuario_id;
DROP INDEX IF EXISTS public.idx_usuario_permisos_permiso_id;
DROP INDEX IF EXISTS public.idx_usuario_lectura_usuario_id;
DROP INDEX IF EXISTS public.idx_usuario_lectura_lectura_id;
DROP INDEX IF EXISTS public.idx_usuario_factura_usuario_id;
DROP INDEX IF EXISTS public.idx_usuario_factura_fecha_registro;
DROP INDEX IF EXISTS public.idx_usuario_factura_factura_id;
DROP INDEX IF EXISTS public.idx_titulo_dato_tipo_titulo_dato_id;
DROP INDEX IF EXISTS public.idx_titulo_dato_fecha_vencimiento;
DROP INDEX IF EXISTS public.idx_titulo_dato_fecha_emision;
DROP INDEX IF EXISTS public.idx_titulo_dato_estado;
DROP INDEX IF EXISTS public.idx_titulo_dato_cliente_id;
DROP INDEX IF EXISTS public.idx_tipo_titulo_dato_nombre;
DROP INDEX IF EXISTS public.idx_tipo_telefono_nombre;
DROP INDEX IF EXISTS public.idx_tipo_relacion_familiar_parentesco;
DROP INDEX IF EXISTS public.idx_tipo_parroquia_nombre;
DROP INDEX IF EXISTS public.idx_tipo_novedad_lectura_nombre;
DROP INDEX IF EXISTS public.idx_tipo_incidente_categoria;
DROP INDEX IF EXISTS public.idx_tipo_identificacion_nombre;
DROP INDEX IF EXISTS public.idx_tipo_estado_lectura_nombre;
DROP INDEX IF EXISTS public.idx_tipo_estado_lectura_codigo;
DROP INDEX IF EXISTS public.idx_telefono_tipo_telefono_id;
DROP INDEX IF EXISTS public.idx_telefono_persona_natural_telefono_id;
DROP INDEX IF EXISTS public.idx_telefono_persona_natural_cliente_persona_natural_id;
DROP INDEX IF EXISTS public.idx_telefono_numero;
DROP INDEX IF EXISTS public.idx_telefono_empresa_telefono_id;
DROP INDEX IF EXISTS public.idx_telefono_empresa_empresa_id;
DROP INDEX IF EXISTS public.idx_telefono_cliente_id;
DROP INDEX IF EXISTS public.idx_tarifa_effective_date;
DROP INDEX IF EXISTS public.idx_tarifa_categoria_id;
DROP INDEX IF EXISTS public.idx_siguiente_lectura_ultima_lectura_id;
DROP INDEX IF EXISTS public.idx_siguiente_lectura_fecha_siguiente_lectura;
DROP INDEX IF EXISTS public.idx_siguiente_lectura_created_at;
DROP INDEX IF EXISTS public.idx_siguiente_lectura_acometida_id;
DROP INDEX IF EXISTS public.idx_sexo_nombre;
DROP INDEX IF EXISTS public.idx_servicio_nombre;
DROP INDEX IF EXISTS public.idx_seguimiento_lectura_usuario_id;
DROP INDEX IF EXISTS public.idx_seguimiento_lectura_lectura_id;
DROP INDEX IF EXISTS public.idx_seguimiento_lectura_lectura_estado_id;
DROP INDEX IF EXISTS public.idx_seguimiento_lectura_lectura_estado_anterior_id;
DROP INDEX IF EXISTS public.idx_seguimiento_lectura_created_at;
DROP INDEX IF EXISTS public.idx_seguimiento_lectura_acometida_id;
DROP INDEX IF EXISTS public.idx_roles_parent_rol_id;
DROP INDEX IF EXISTS public.idx_roles_nombre;
DROP INDEX IF EXISTS public.idx_rol_permisos_rol_id;
DROP INDEX IF EXISTS public.idx_rol_permisos_permiso_id;
DROP INDEX IF EXISTS public.idx_refresh_user;
DROP INDEX IF EXISTS public.idx_refresh_revoked;
DROP INDEX IF EXISTS public.idx_refresh_expires;
DROP INDEX IF EXISTS public.idx_rangos_variables_tarifa_id;
DROP INDEX IF EXISTS public.idx_rangos_variables_servicio_id;
DROP INDEX IF EXISTS public.idx_qrcode_created_at;
DROP INDEX IF EXISTS public.idx_qrcode_acometida_id;
DROP INDEX IF EXISTS public.idx_provincia_pais_id;
DROP INDEX IF EXISTS public.idx_provincia_nombre;
DROP INDEX IF EXISTS public.idx_profesion_nombre;
DROP INDEX IF EXISTS public.idx_predio_zona_geometrica;
DROP INDEX IF EXISTS public.idx_predio_valor_terreno;
DROP INDEX IF EXISTS public.idx_predio_valor_construccion;
DROP INDEX IF EXISTS public.idx_predio_valor_comercial;
DROP INDEX IF EXISTS public.idx_predio_updated_at;
DROP INDEX IF EXISTS public.idx_predio_tipo_predio_id;
DROP INDEX IF EXISTS public.idx_predio_sector;
DROP INDEX IF EXISTS public.idx_predio_referencia;
DROP INDEX IF EXISTS public.idx_predio_precision;
DROP INDEX IF EXISTS public.idx_predio_fecha_geolocalizacion;
DROP INDEX IF EXISTS public.idx_predio_direccion;
DROP INDEX IF EXISTS public.idx_predio_created_at;
DROP INDEX IF EXISTS public.idx_predio_coordenadas;
DROP INDEX IF EXISTS public.idx_predio_cliente_id;
DROP INDEX IF EXISTS public.idx_predio_clave_catastral;
DROP INDEX IF EXISTS public.idx_predio_callejon;
DROP INDEX IF EXISTS public.idx_predio_area_terreno;
DROP INDEX IF EXISTS public.idx_predio_area_construccion;
DROP INDEX IF EXISTS public.idx_predio_altitud;
DROP INDEX IF EXISTS public.idx_permisos_nombre;
DROP INDEX IF EXISTS public.idx_parroquia_tipo_parroquia_id;
DROP INDEX IF EXISTS public.idx_parroquia_nombre;
DROP INDEX IF EXISTS public.idx_parroquia_canton_id;
DROP INDEX IF EXISTS public.idx_pais_nombre;
DROP INDEX IF EXISTS public.idx_observacion_titulo_observacion;
DROP INDEX IF EXISTS public.idx_observacion_lectura_observacion_id;
DROP INDEX IF EXISTS public.idx_observacion_lectura_lectura_id;
DROP INDEX IF EXISTS public.idx_observacion_lectura_fecha_registro;
DROP INDEX IF EXISTS public.idx_observacion_factura_observacion_id;
DROP INDEX IF EXISTS public.idx_observacion_factura_fecha_registro;
DROP INDEX IF EXISTS public.idx_observacion_factura_factura_id;
DROP INDEX IF EXISTS public.idx_observacion_acometida_observacion_id;
DROP INDEX IF EXISTS public.idx_observacion_acometida_fecha_registro;
DROP INDEX IF EXISTS public.idx_observacion_acometida_acometida_id;
DROP INDEX IF EXISTS public.idx_lectura_tipo_novedad_lectura_id;
DROP INDEX IF EXISTS public.idx_lectura_sector;
DROP INDEX IF EXISTS public.idx_lectura_mes_sector_acometida;
DROP INDEX IF EXISTS public.idx_lectura_mes_fecha;
DROP INDEX IF EXISTS public.idx_lectura_lectura_estado_id;
DROP INDEX IF EXISTS public.idx_lectura_fecha_lectura;
DROP INDEX IF EXISTS public.idx_lectura_estado_tipo_estado_lectura_id;
DROP INDEX IF EXISTS public.idx_lectura_estado_nombre;
DROP INDEX IF EXISTS public.idx_lectura_estado_codigo;
DROP INDEX IF EXISTS public.idx_lectura_cuenta;
DROP INDEX IF EXISTS public.idx_lectura_clave_fecha_desc;
DROP INDEX IF EXISTS public.idx_lectura_clave_catastral;
DROP INDEX IF EXISTS public.idx_lectura_acometida_id;
DROP INDEX IF EXISTS public.idx_incidente_medidor_origen;
DROP INDEX IF EXISTS public.idx_incidente_medidor_fecha;
DROP INDEX IF EXISTS public.idx_incidente_medidor_estado;
DROP INDEX IF EXISTS public.idx_incidente_medidor_acometida;
DROP INDEX IF EXISTS public.idx_foto_lectura_lectura_id;
DROP INDEX IF EXISTS public.idx_foto_lectura_created_at;
DROP INDEX IF EXISTS public.idx_foto_lectura_clave_catastral;
DROP INDEX IF EXISTS public.idx_foto_acometida_created_at;
DROP INDEX IF EXISTS public.idx_foto_acometida_acometida_id;
DROP INDEX IF EXISTS public.idx_forma_pago_nombre;
DROP INDEX IF EXISTS public.idx_factura_numero_factura;
DROP INDEX IF EXISTS public.idx_factura_forma_pago_id;
DROP INDEX IF EXISTS public.idx_factura_fecha_vencimiento;
DROP INDEX IF EXISTS public.idx_factura_fecha_registro;
DROP INDEX IF EXISTS public.idx_factura_estado_pago_id;
DROP INDEX IF EXISTS public.idx_factura_cliente_id;
DROP INDEX IF EXISTS public.idx_estado_pago_nombre;
DROP INDEX IF EXISTS public.idx_estado_civil_nombre;
DROP INDEX IF EXISTS public.idx_empresa_ruc;
DROP INDEX IF EXISTS public.idx_empresa_razon_social;
DROP INDEX IF EXISTS public.idx_empresa_parroquia_id;
DROP INDEX IF EXISTS public.idx_empresa_nombre_comercial;
DROP INDEX IF EXISTS public.idx_empresa_cliente_id;
DROP INDEX IF EXISTS public.idx_empleados_usuario_id;
DROP INDEX IF EXISTS public.idx_empleados_fecha_ingreso;
DROP INDEX IF EXISTS public.idx_empleados_estado_empleado_id;
DROP INDEX IF EXISTS public.idx_empleados_deleted_at;
DROP INDEX IF EXISTS public.idx_empleados_ciudadano_id;
DROP INDEX IF EXISTS public.idx_empleados_cargo_id;
DROP INDEX IF EXISTS public.idx_direccion_parroquia_id;
DROP INDEX IF EXISTS public.idx_correo_persona_natural_correo_electronico_id;
DROP INDEX IF EXISTS public.idx_correo_persona_natural_cliente_persona_natural_id;
DROP INDEX IF EXISTS public.idx_correo_empresa_empresa_id;
DROP INDEX IF EXISTS public.idx_correo_empresa_correo_electronico_id;
DROP INDEX IF EXISTS public.idx_correo_electronico_correo;
DROP INDEX IF EXISTS public.idx_correo_electronico_cliente_id;
DROP INDEX IF EXISTS public.idx_consumo_promedio_updated_at;
DROP INDEX IF EXISTS public.idx_componentes_fijos_tarifa_id;
DROP INDEX IF EXISTS public.idx_componentes_fijos_servicio_id;
DROP INDEX IF EXISTS public.idx_cliente_usuario_locked_out;
DROP INDEX IF EXISTS public.idx_cliente_usuario_is_active;
DROP INDEX IF EXISTS public.idx_cliente_usuario_failed_attempts;
DROP INDEX IF EXISTS public.idx_cliente_usuario_estado;
DROP INDEX IF EXISTS public.idx_cliente_usuario_email;
DROP INDEX IF EXISTS public.idx_cliente_usuario_deleted_at;
DROP INDEX IF EXISTS public.idx_cliente_usuario_created_at;
DROP INDEX IF EXISTS public.idx_cliente_usuario_cliente_id;
DROP INDEX IF EXISTS public.idx_cliente_tipo_identificacion_id;
DROP INDEX IF EXISTS public.idx_cliente_persona_natural_cliente_id;
DROP INDEX IF EXISTS public.idx_cliente_persona_natural_ciudadano_id;
DROP INDEX IF EXISTS public.idx_ciudadano_sexo_id;
DROP INDEX IF EXISTS public.idx_ciudadano_profesion_id;
DROP INDEX IF EXISTS public.idx_ciudadano_parroquia_id;
DROP INDEX IF EXISTS public.idx_ciudadano_nombres;
DROP INDEX IF EXISTS public.idx_ciudadano_estado_civil_id;
DROP INDEX IF EXISTS public.idx_ciudadano_apellidos;
DROP INDEX IF EXISTS public.idx_categoria_nombre;
DROP INDEX IF EXISTS public.idx_canton_provincia_id;
DROP INDEX IF EXISTS public.idx_canton_nombre;
DROP INDEX IF EXISTS public.idx_audit_busqueda;
DROP INDEX IF EXISTS public.idx_alerta_anomala_estado;
DROP INDEX IF EXISTS public.idx_alerta_anomala_created_at;
DROP INDEX IF EXISTS public.idx_alerta_anomala_acometida;
DROP INDEX IF EXISTS public.idx_acometida_zona_id;
DROP INDEX IF EXISTS public.idx_acometida_tarifa_id;
DROP INDEX IF EXISTS public.idx_acometida_sector;
DROP INDEX IF EXISTS public.idx_acometida_numero_medidor;
DROP INDEX IF EXISTS public.idx_acometida_fecha_instalacion;
DROP INDEX IF EXISTS public.idx_acometida_fecha_inicio_lecturas;
DROP INDEX IF EXISTS public.idx_acometida_estado_sector;
DROP INDEX IF EXISTS public.idx_acometida_estado_activo;
DROP INDEX IF EXISTS public.idx_acometida_cuenta;
DROP INDEX IF EXISTS public.idx_acometida_cliente_id;
DROP INDEX IF EXISTS public.idx_acometida_clave_catastral;
DROP INDEX IF EXISTS public.idx_acometida_acometida_id;
DROP INDEX IF EXISTS notifications.idx_notif_unread_by_user;
DROP INDEX IF EXISTS notifications.idx_notif_pending_delivery;
DROP INDEX IF EXISTS notifications.idx_notif_entidad;
DROP INDEX IF EXISTS documents.idx_rel_usuarios;
DROP INDEX IF EXISTS documents.idx_rel_solicitud;
DROP INDEX IF EXISTS documents.idx_rel_predio;
DROP INDEX IF EXISTS documents.idx_rel_orden;
DROP INDEX IF EXISTS documents.idx_rel_lectura;
DROP INDEX IF EXISTS documents.idx_rel_factura;
DROP INDEX IF EXISTS documents.idx_rel_acometida;
DROP INDEX IF EXISTS documents.idx_historial_doc;
DROP INDEX IF EXISTS documents.idx_documento_tipo;
DROP INDEX IF EXISTS documents.idx_documento_nivel;
DROP INDEX IF EXISTS documents.idx_documento_metadatos;
DROP INDEX IF EXISTS documents.idx_documento_hash;
DROP INDEX IF EXISTS documents.idx_documento_estado;
DROP INDEX IF EXISTS documents.idx_documento_created;
DROP INDEX IF EXISTS audit.idx_refresh_token_usuario;
DROP INDEX IF EXISTS audit.idx_refresh_token_hash;
DROP INDEX IF EXISTS audit.idx_refresh_token_expiration;
DROP INDEX IF EXISTS audit.idx_audit_sesion_usuario_ts;
DROP INDEX IF EXISTS audit.idx_audit_sesion_ip;
DROP INDEX IF EXISTS audit.idx_audit_sesion_evento;
DROP INDEX IF EXISTS audit.idx_audit_reg_usuario_ts;
DROP INDEX IF EXISTS audit.idx_audit_reg_ts_desc;
DROP INDEX IF EXISTS audit.idx_audit_reg_tabla_ts;
DROP INDEX IF EXISTS audit.idx_audit_reg_sesion;
DROP INDEX IF EXISTS audit.idx_audit_reg_pk_gin;
DROP INDEX IF EXISTS audit.idx_audit_reg_operacion;
DROP INDEX IF EXISTS audit.idx_audit_reg_diff_gin;
DROP INDEX IF EXISTS audit.idx_alerta_usuario;
DROP INDEX IF EXISTS audit.idx_alerta_tipo;
DROP INDEX IF EXISTS audit.idx_alerta_severidad_ts;
DROP INDEX IF EXISTS audit.idx_alerta_no_resuelta;
DROP INDEX IF EXISTS acometidas.idx_solicitud_ot_sol;
DROP INDEX IF EXISTS acometidas.idx_solicitud_ot_ot;
DROP INDEX IF EXISTS acometidas.idx_solicitud_numero;
DROP INDEX IF EXISTS acometidas.idx_solicitud_geom;
DROP INDEX IF EXISTS acometidas.idx_solicitud_estado;
DROP INDEX IF EXISTS acometidas.idx_solicitud_datos;
DROP INDEX IF EXISTS acometidas.idx_solicitud_cliente;
DROP INDEX IF EXISTS acometidas.idx_solicitud_catastral;
DROP INDEX IF EXISTS acometidas.idx_informe_instalacion_solicitud;
DROP INDEX IF EXISTS acometidas.idx_historial_solicitud;
DROP INDEX IF EXISTS acometidas.idx_historial_fecha;
DROP INDEX IF EXISTS acometidas.idx_doc_solicitud;
DROP INDEX IF EXISTS acometidas.idx_doc_estado;
DROP INDEX IF EXISTS acometidas.idx_contrato_servicio_solicitud;
DROP INDEX IF EXISTS acometidas.idx_catastro_medidor;
DROP INDEX IF EXISTS acometidas.idx_catastro_geom;
DROP INDEX IF EXISTS acometidas.idx_catastro_clave;
ALTER TABLE IF EXISTS ONLY work_orders.asignacion_trabajador_orden DROP CONSTRAINT IF EXISTS uq_asignacion_ot_trabajador;
ALTER TABLE IF EXISTS ONLY work_orders.tipo_trabajo DROP CONSTRAINT IF EXISTS tipo_trabajo_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.tipo_trabajo DROP CONSTRAINT IF EXISTS tipo_trabajo_nombre_key;
ALTER TABLE IF EXISTS ONLY work_orders.rol_trabajador DROP CONSTRAINT IF EXISTS rol_trabajador_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.rol_trabajador DROP CONSTRAINT IF EXISTS rol_trabajador_nombre_key;
ALTER TABLE IF EXISTS ONLY work_orders.prioridad_orden_trabajo DROP CONSTRAINT IF EXISTS prioridad_orden_trabajo_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.prioridad_orden_trabajo DROP CONSTRAINT IF EXISTS prioridad_orden_trabajo_nivel_key;
ALTER TABLE IF EXISTS ONLY work_orders.orden_trabajo DROP CONSTRAINT IF EXISTS orden_trabajo_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.orden_trabajo DROP CONSTRAINT IF EXISTS orden_trabajo_codigo_orden_key;
ALTER TABLE IF EXISTS ONLY work_orders.observaciones_orden_trabajo DROP CONSTRAINT IF EXISTS observaciones_orden_trabajo_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.inspeccion_preparacion DROP CONSTRAINT IF EXISTS inspeccion_preparacion_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.inspeccion_preparacion_detalle DROP CONSTRAINT IF EXISTS inspeccion_preparacion_detalle_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.historial_estado_orden_trabajo DROP CONSTRAINT IF EXISTS historial_estado_orden_trabajo_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.encuesta_satisfaccion DROP CONSTRAINT IF EXISTS encuesta_satisfaccion_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.encuesta_satisfaccion DROP CONSTRAINT IF EXISTS encuesta_satisfaccion_id_orden_trabajo_key;
ALTER TABLE IF EXISTS ONLY work_orders.detalle_orden_trabajo_material DROP CONSTRAINT IF EXISTS detalle_orden_trabajo_material_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.departamento_trabajo DROP CONSTRAINT IF EXISTS departamento_trabajo_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.departamento_trabajo DROP CONSTRAINT IF EXISTS departamento_trabajo_nombre_key;
ALTER TABLE IF EXISTS ONLY work_orders.costo_adicional_orden DROP CONSTRAINT IF EXISTS costo_adicional_orden_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.corte_servicio DROP CONSTRAINT IF EXISTS corte_servicio_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.control_calidad DROP CONSTRAINT IF EXISTS control_calidad_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.control_calidad_detalle DROP CONSTRAINT IF EXISTS control_calidad_detalle_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.cat_origen_orden DROP CONSTRAINT IF EXISTS cat_origen_orden_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.cat_item_calidad DROP CONSTRAINT IF EXISTS cat_item_calidad_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.cat_estado_orden DROP CONSTRAINT IF EXISTS cat_estado_orden_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.cat_checklist_item DROP CONSTRAINT IF EXISTS cat_checklist_item_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.asignacion_trabajador_orden DROP CONSTRAINT IF EXISTS asignacion_trabajador_orden_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.adjuntos_orden_trabajo DROP CONSTRAINT IF EXISTS adjuntos_orden_trabajo_pkey;
ALTER TABLE IF EXISTS ONLY public.zona DROP CONSTRAINT IF EXISTS zona_codigo_key;
ALTER TABLE IF EXISTS ONLY public.verificar_cuenta_cliente DROP CONSTRAINT IF EXISTS verificar_cuenta_cliente_pkey;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_username_key;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_pkey;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_email_key;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_cliente_id_key;
ALTER TABLE IF EXISTS ONLY public.usuario_roles DROP CONSTRAINT IF EXISTS usuario_roles_usuario_id_rol_id_key;
ALTER TABLE IF EXISTS ONLY public.usuario_roles DROP CONSTRAINT IF EXISTS usuario_roles_pkey;
ALTER TABLE IF EXISTS ONLY public.usuario_permisos DROP CONSTRAINT IF EXISTS usuario_permisos_usuario_id_permiso_id_key;
ALTER TABLE IF EXISTS ONLY public.usuario_permisos DROP CONSTRAINT IF EXISTS usuario_permisos_pkey;
ALTER TABLE IF EXISTS ONLY public.tipo_incidente_medidor DROP CONSTRAINT IF EXISTS uq_tipo_incidente_nombre;
ALTER TABLE IF EXISTS ONLY public.siguiente_lectura DROP CONSTRAINT IF EXISTS uq_siguiente_lectura_acometida;
ALTER TABLE IF EXISTS ONLY public.lectura_estado DROP CONSTRAINT IF EXISTS uq_lectura_estado_nombre;
ALTER TABLE IF EXISTS ONLY public.empresa DROP CONSTRAINT IF EXISTS uq_empresa_ruc;
ALTER TABLE IF EXISTS ONLY public.incidente_medidor DROP CONSTRAINT IF EXISTS uq_codigo_incidente;
ALTER TABLE IF EXISTS ONLY public.categoria_incidente_medidor DROP CONSTRAINT IF EXISTS uq_categoria_incidente_nombre;
ALTER TABLE IF EXISTS ONLY public.categoria_incidente_medidor DROP CONSTRAINT IF EXISTS uq_categoria_incidente_codigo;
ALTER TABLE IF EXISTS ONLY public.auditoria_lectura_sector DROP CONSTRAINT IF EXISTS uq_audit_mes_sector;
ALTER TABLE IF EXISTS ONLY public.tipo_predio DROP CONSTRAINT IF EXISTS tipopredio_nombre_key;
ALTER TABLE IF EXISTS ONLY public.tipo_verificacion DROP CONSTRAINT IF EXISTS tipo_verificacion_pkey;
ALTER TABLE IF EXISTS ONLY public.tipo_verificacion DROP CONSTRAINT IF EXISTS tipo_verificacion_codigo_key;
ALTER TABLE IF EXISTS ONLY public.tipo_novedad_lectura DROP CONSTRAINT IF EXISTS tipo_novedad_lectura_nombre_key;
ALTER TABLE IF EXISTS ONLY public.tipo_estado_lectura DROP CONSTRAINT IF EXISTS tipo_estado_lectura_nombre_key;
ALTER TABLE IF EXISTS ONLY public.tipo_estado_lectura DROP CONSTRAINT IF EXISTS tipo_estado_lectura_codigo_key;
ALTER TABLE IF EXISTS ONLY public.tipo_contrato DROP CONSTRAINT IF EXISTS tipo_contrato_pkey;
ALTER TABLE IF EXISTS ONLY public.tipo_contrato DROP CONSTRAINT IF EXISTS tipo_contrato_nombre_key;
ALTER TABLE IF EXISTS ONLY public.siguiente_lectura DROP CONSTRAINT IF EXISTS siguiente_lectura_pkey;
ALTER TABLE IF EXISTS ONLY public.servicio DROP CONSTRAINT IF EXISTS servicio_nombre_key;
ALTER TABLE IF EXISTS ONLY public.seguimiento_lectura DROP CONSTRAINT IF EXISTS seguimiento_lectura_pkey;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_pkey;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_nombre_key;
ALTER TABLE IF EXISTS ONLY public.rol_permisos DROP CONSTRAINT IF EXISTS rol_permisos_rol_id_permiso_id_key;
ALTER TABLE IF EXISTS ONLY public.rol_permisos DROP CONSTRAINT IF EXISTS rol_permisos_pkey;
ALTER TABLE IF EXISTS ONLY public.respaldo_acometidas_2026 DROP CONSTRAINT IF EXISTS respaldo_acometidas_2026_pkey;
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_token_hash_key;
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_pkey;
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_jti_key;
ALTER TABLE IF EXISTS ONLY public.rangos_variables DROP CONSTRAINT IF EXISTS rangos_variables_pkey;
ALTER TABLE IF EXISTS ONLY public.qrcode DROP CONSTRAINT IF EXISTS qrcode_pkey;
ALTER TABLE IF EXISTS ONLY public.qrcode DROP CONSTRAINT IF EXISTS qrcode_acometida_id_key;
ALTER TABLE IF EXISTS ONLY public.predio DROP CONSTRAINT IF EXISTS predio_clavecatastral_key;
ALTER TABLE IF EXISTS ONLY public.zona DROP CONSTRAINT IF EXISTS pk_zona;
ALTER TABLE IF EXISTS ONLY public.usuario_lectura DROP CONSTRAINT IF EXISTS pk_usuario_lectura;
ALTER TABLE IF EXISTS ONLY public.usuario_factura DROP CONSTRAINT IF EXISTS pk_usuario_factura;
ALTER TABLE IF EXISTS ONLY public.titulo_dato DROP CONSTRAINT IF EXISTS pk_titulo_dato;
ALTER TABLE IF EXISTS ONLY public.tipo_predio DROP CONSTRAINT IF EXISTS pk_tipopredio;
ALTER TABLE IF EXISTS ONLY public.tipo_titulo_dato DROP CONSTRAINT IF EXISTS pk_tipo_titulo_dato;
ALTER TABLE IF EXISTS ONLY public.tipo_telefono DROP CONSTRAINT IF EXISTS pk_tipo_telefono;
ALTER TABLE IF EXISTS ONLY public.tipo_relacion_familiar DROP CONSTRAINT IF EXISTS pk_tipo_relacion_familiar;
ALTER TABLE IF EXISTS ONLY public.tipo_parroquia DROP CONSTRAINT IF EXISTS pk_tipo_parroquia;
ALTER TABLE IF EXISTS ONLY public.tipo_novedad_lectura DROP CONSTRAINT IF EXISTS pk_tipo_novedad_lectura;
ALTER TABLE IF EXISTS ONLY public.tipo_incidente_medidor DROP CONSTRAINT IF EXISTS pk_tipo_incidente_medidor;
ALTER TABLE IF EXISTS ONLY public.tipo_identificacion DROP CONSTRAINT IF EXISTS pk_tipo_identificacion;
ALTER TABLE IF EXISTS ONLY public.tipo_estado_lectura DROP CONSTRAINT IF EXISTS pk_tipo_estado_lectura;
ALTER TABLE IF EXISTS ONLY public.telefono_persona_natural DROP CONSTRAINT IF EXISTS pk_telefono_persona_natural;
ALTER TABLE IF EXISTS ONLY public.telefono_empresa DROP CONSTRAINT IF EXISTS pk_telefono_empresa;
ALTER TABLE IF EXISTS ONLY public.telefono DROP CONSTRAINT IF EXISTS pk_telefono;
ALTER TABLE IF EXISTS ONLY public.tarifa DROP CONSTRAINT IF EXISTS pk_tarifa;
ALTER TABLE IF EXISTS ONLY public.sexo DROP CONSTRAINT IF EXISTS pk_sexo;
ALTER TABLE IF EXISTS ONLY public.servicio DROP CONSTRAINT IF EXISTS pk_servicio;
ALTER TABLE IF EXISTS ONLY public.provincia DROP CONSTRAINT IF EXISTS pk_provincia;
ALTER TABLE IF EXISTS ONLY public.profesion DROP CONSTRAINT IF EXISTS pk_profesion;
ALTER TABLE IF EXISTS ONLY public.predio DROP CONSTRAINT IF EXISTS pk_predio;
ALTER TABLE IF EXISTS ONLY public.parroquia DROP CONSTRAINT IF EXISTS pk_parroquia;
ALTER TABLE IF EXISTS ONLY public.pais DROP CONSTRAINT IF EXISTS pk_pais;
ALTER TABLE IF EXISTS ONLY public.observacion_lectura DROP CONSTRAINT IF EXISTS pk_observacion_lectura;
ALTER TABLE IF EXISTS ONLY public.observacion_factura DROP CONSTRAINT IF EXISTS pk_observacion_factura;
ALTER TABLE IF EXISTS ONLY public.observacion_acometida DROP CONSTRAINT IF EXISTS pk_observacion_acometida;
ALTER TABLE IF EXISTS ONLY public.observacion DROP CONSTRAINT IF EXISTS pk_observacion;
ALTER TABLE IF EXISTS ONLY public.lectura_estado DROP CONSTRAINT IF EXISTS pk_lectura_estado;
ALTER TABLE IF EXISTS ONLY public.lectura DROP CONSTRAINT IF EXISTS pk_lectura;
ALTER TABLE IF EXISTS ONLY public.incidente_medidor DROP CONSTRAINT IF EXISTS pk_incidente_medidor;
ALTER TABLE IF EXISTS ONLY public.historial_incidente DROP CONSTRAINT IF EXISTS pk_historial_incidente;
ALTER TABLE IF EXISTS ONLY public.foto_lectura DROP CONSTRAINT IF EXISTS pk_foto_lectura;
ALTER TABLE IF EXISTS ONLY public.foto_incidente DROP CONSTRAINT IF EXISTS pk_foto_incidente;
ALTER TABLE IF EXISTS ONLY public.foto_acometida DROP CONSTRAINT IF EXISTS pk_foto_acometida;
ALTER TABLE IF EXISTS ONLY public.forma_pago DROP CONSTRAINT IF EXISTS pk_forma_pago;
ALTER TABLE IF EXISTS ONLY public.factura DROP CONSTRAINT IF EXISTS pk_factura;
ALTER TABLE IF EXISTS ONLY public.estado_pago DROP CONSTRAINT IF EXISTS pk_estado_pago;
ALTER TABLE IF EXISTS ONLY public.estado_civil DROP CONSTRAINT IF EXISTS pk_estado_civil;
ALTER TABLE IF EXISTS ONLY public.empresa DROP CONSTRAINT IF EXISTS pk_empresa;
ALTER TABLE IF EXISTS ONLY public.direccion DROP CONSTRAINT IF EXISTS pk_direccion;
ALTER TABLE IF EXISTS ONLY public.correo_persona_natural DROP CONSTRAINT IF EXISTS pk_correo_persona_natural;
ALTER TABLE IF EXISTS ONLY public.correo_empresa DROP CONSTRAINT IF EXISTS pk_correo_empresa;
ALTER TABLE IF EXISTS ONLY public.correo_electronico DROP CONSTRAINT IF EXISTS pk_correo_electronico;
ALTER TABLE IF EXISTS ONLY public.cliente_persona_natural DROP CONSTRAINT IF EXISTS pk_cliente_persona_natural;
ALTER TABLE IF EXISTS ONLY public.cliente DROP CONSTRAINT IF EXISTS pk_cliente;
ALTER TABLE IF EXISTS ONLY public.ciudadano DROP CONSTRAINT IF EXISTS pk_ciudadano;
ALTER TABLE IF EXISTS ONLY public.categoria_incidente_medidor DROP CONSTRAINT IF EXISTS pk_categoria_incidente_medidor;
ALTER TABLE IF EXISTS ONLY public.categoria DROP CONSTRAINT IF EXISTS pk_categoria;
ALTER TABLE IF EXISTS ONLY public.canton DROP CONSTRAINT IF EXISTS pk_canton;
ALTER TABLE IF EXISTS ONLY public.acometida DROP CONSTRAINT IF EXISTS pk_acometida;
ALTER TABLE IF EXISTS ONLY public.permisos DROP CONSTRAINT IF EXISTS permisos_pkey;
ALTER TABLE IF EXISTS ONLY public.permisos DROP CONSTRAINT IF EXISTS permisos_nombre_key;
ALTER TABLE IF EXISTS ONLY public.permiso_categoria DROP CONSTRAINT IF EXISTS permiso_categoria_pkey;
ALTER TABLE IF EXISTS ONLY public.permiso_categoria DROP CONSTRAINT IF EXISTS permiso_categoria_nombre_key;
ALTER TABLE IF EXISTS ONLY public.lectura_estado DROP CONSTRAINT IF EXISTS lectura_estado_codigo_key;
ALTER TABLE IF EXISTS ONLY public.historial_medidores DROP CONSTRAINT IF EXISTS historial_medidores_pkey;
ALTER TABLE IF EXISTS ONLY public.historial_estados_acometida DROP CONSTRAINT IF EXISTS historial_estados_acometida_pkey;
ALTER TABLE IF EXISTS ONLY public.estado_empleado DROP CONSTRAINT IF EXISTS estado_empleado_pkey;
ALTER TABLE IF EXISTS ONLY public.estado_empleado DROP CONSTRAINT IF EXISTS estado_empleado_codigo_key;
ALTER TABLE IF EXISTS ONLY public.estado_cliente_usuario DROP CONSTRAINT IF EXISTS estado_cliente_usuario_pkey;
ALTER TABLE IF EXISTS ONLY public.estado_cliente_usuario DROP CONSTRAINT IF EXISTS estado_cliente_usuario_codigo_key;
ALTER TABLE IF EXISTS ONLY public.empleados DROP CONSTRAINT IF EXISTS empleados_usuario_id_key;
ALTER TABLE IF EXISTS ONLY public.empleados DROP CONSTRAINT IF EXISTS empleados_pkey;
ALTER TABLE IF EXISTS ONLY public.empleados DROP CONSTRAINT IF EXISTS empleados_cedula_key;
ALTER TABLE IF EXISTS ONLY public.empleado_zona DROP CONSTRAINT IF EXISTS empleado_zona_pkey;
ALTER TABLE IF EXISTS ONLY public.consumo_promedio DROP CONSTRAINT IF EXISTS consumo_promedio_pkey;
ALTER TABLE IF EXISTS ONLY public.componentes_fijos DROP CONSTRAINT IF EXISTS componentes_fijos_pkey;
ALTER TABLE IF EXISTS ONLY public.cliente_usuario_roles DROP CONSTRAINT IF EXISTS cliente_usuario_roles_pkey;
ALTER TABLE IF EXISTS ONLY public.cliente_usuario DROP CONSTRAINT IF EXISTS cliente_usuario_pkey;
ALTER TABLE IF EXISTS ONLY public.cliente_usuario_permisos DROP CONSTRAINT IF EXISTS cliente_usuario_permisos_pkey;
ALTER TABLE IF EXISTS ONLY public.cliente_usuario DROP CONSTRAINT IF EXISTS cliente_usuario_email_key;
ALTER TABLE IF EXISTS ONLY public.cliente_usuario DROP CONSTRAINT IF EXISTS cliente_usuario_cliente_id_key;
ALTER TABLE IF EXISTS ONLY public.claves_sql2000 DROP CONSTRAINT IF EXISTS claves_sql2000_pkey;
ALTER TABLE IF EXISTS ONLY public.categoria DROP CONSTRAINT IF EXISTS categoria_nombre_key;
ALTER TABLE IF EXISTS ONLY public.cat_estados_acometida DROP CONSTRAINT IF EXISTS cat_estados_acometida_pkey;
ALTER TABLE IF EXISTS ONLY public.cat_estados_acometida DROP CONSTRAINT IF EXISTS cat_estados_acometida_nombre_key;
ALTER TABLE IF EXISTS ONLY public.cat_action_types DROP CONSTRAINT IF EXISTS cat_action_types_pkey;
ALTER TABLE IF EXISTS ONLY public.cat_action_types DROP CONSTRAINT IF EXISTS cat_action_types_code_key;
ALTER TABLE IF EXISTS ONLY public.cargo DROP CONSTRAINT IF EXISTS cargo_pkey;
ALTER TABLE IF EXISTS ONLY public.cargo DROP CONSTRAINT IF EXISTS cargo_nombre_key;
ALTER TABLE IF EXISTS ONLY public.auditoria_lectura_sector DROP CONSTRAINT IF EXISTS auditoria_lectura_sector_pkey;
ALTER TABLE IF EXISTS ONLY public.alerta_lectura_anomala DROP CONSTRAINT IF EXISTS alerta_lectura_anomala_pkey;
ALTER TABLE IF EXISTS ONLY public.acometida DROP CONSTRAINT IF EXISTS acometida_clave_catastral_key;
ALTER TABLE IF EXISTS ONLY notifications.user_notification DROP CONSTRAINT IF EXISTS user_notification_pkey;
ALTER TABLE IF EXISTS ONLY notifications.user_notification_dispatch_log DROP CONSTRAINT IF EXISTS user_notification_dispatch_log_pkey;
ALTER TABLE IF EXISTS ONLY notifications.template DROP CONSTRAINT IF EXISTS template_pkey;
ALTER TABLE IF EXISTS ONLY notifications.template DROP CONSTRAINT IF EXISTS template_codigo_key;
ALTER TABLE IF EXISTS ONLY notifications.prioridad DROP CONSTRAINT IF EXISTS prioridad_pkey;
ALTER TABLE IF EXISTS ONLY notifications.prioridad DROP CONSTRAINT IF EXISTS prioridad_codigo_key;
ALTER TABLE IF EXISTS ONLY notifications.estado_envio DROP CONSTRAINT IF EXISTS estado_envio_pkey;
ALTER TABLE IF EXISTS ONLY notifications.estado_envio DROP CONSTRAINT IF EXISTS estado_envio_codigo_key;
ALTER TABLE IF EXISTS ONLY notifications.canal DROP CONSTRAINT IF EXISTS canal_pkey;
ALTER TABLE IF EXISTS ONLY notifications.canal DROP CONSTRAINT IF EXISTS canal_codigo_key;
ALTER TABLE IF EXISTS ONLY documents.tipo_documento DROP CONSTRAINT IF EXISTS tipo_documento_pkey;
ALTER TABLE IF EXISTS ONLY documents.tipo_documento DROP CONSTRAINT IF EXISTS tipo_documento_codigo_key;
ALTER TABLE IF EXISTS ONLY documents.relacion_usuarios DROP CONSTRAINT IF EXISTS relacion_usuarios_pkey;
ALTER TABLE IF EXISTS ONLY documents.relacion_solicitud DROP CONSTRAINT IF EXISTS relacion_solicitud_pkey;
ALTER TABLE IF EXISTS ONLY documents.relacion_predio DROP CONSTRAINT IF EXISTS relacion_predio_pkey;
ALTER TABLE IF EXISTS ONLY documents.relacion_orden_trabajo DROP CONSTRAINT IF EXISTS relacion_orden_trabajo_pkey;
ALTER TABLE IF EXISTS ONLY documents.relacion_lectura DROP CONSTRAINT IF EXISTS relacion_lectura_pkey;
ALTER TABLE IF EXISTS ONLY documents.relacion_factura DROP CONSTRAINT IF EXISTS relacion_factura_pkey;
ALTER TABLE IF EXISTS ONLY documents.relacion_acometida DROP CONSTRAINT IF EXISTS relacion_acometida_pkey;
ALTER TABLE IF EXISTS ONLY documents.nivel_acceso DROP CONSTRAINT IF EXISTS nivel_acceso_pkey;
ALTER TABLE IF EXISTS ONLY documents.historial_documento DROP CONSTRAINT IF EXISTS historial_documento_pkey;
ALTER TABLE IF EXISTS ONLY documents.estado_documento DROP CONSTRAINT IF EXISTS estado_documento_pkey;
ALTER TABLE IF EXISTS ONLY documents.documento DROP CONSTRAINT IF EXISTS documento_pkey;
ALTER TABLE IF EXISTS ONLY audit.usuario_refresh_tokens DROP CONSTRAINT IF EXISTS usuario_refresh_tokens_pkey;
ALTER TABLE IF EXISTS ONLY audit.tabla_config DROP CONSTRAINT IF EXISTS tabla_config_pkey;
ALTER TABLE IF EXISTS ONLY audit.sesion_default DROP CONSTRAINT IF EXISTS sesion_default_pkey;
ALTER TABLE IF EXISTS ONLY audit.sesion_2026_07 DROP CONSTRAINT IF EXISTS sesion_2026_07_pkey;
ALTER TABLE IF EXISTS ONLY audit.sesion_2026_06 DROP CONSTRAINT IF EXISTS sesion_2026_06_pkey;
ALTER TABLE IF EXISTS ONLY audit.sesion_2026_05 DROP CONSTRAINT IF EXISTS sesion_2026_05_pkey;
ALTER TABLE IF EXISTS ONLY audit.sesion_2026_04 DROP CONSTRAINT IF EXISTS sesion_2026_04_pkey;
ALTER TABLE IF EXISTS ONLY audit.sesion DROP CONSTRAINT IF EXISTS sesion_pkey;
ALTER TABLE IF EXISTS ONLY audit.regla_alerta DROP CONSTRAINT IF EXISTS regla_alerta_pkey;
ALTER TABLE IF EXISTS ONLY audit.regla_alerta DROP CONSTRAINT IF EXISTS regla_alerta_codigo_key;
ALTER TABLE IF EXISTS ONLY audit.registro_default DROP CONSTRAINT IF EXISTS registro_default_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2027_12 DROP CONSTRAINT IF EXISTS registro_2027_12_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2027_11 DROP CONSTRAINT IF EXISTS registro_2027_11_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2027_10 DROP CONSTRAINT IF EXISTS registro_2027_10_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2027_09 DROP CONSTRAINT IF EXISTS registro_2027_09_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2027_08 DROP CONSTRAINT IF EXISTS registro_2027_08_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2027_07 DROP CONSTRAINT IF EXISTS registro_2027_07_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2027_06 DROP CONSTRAINT IF EXISTS registro_2027_06_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2027_05 DROP CONSTRAINT IF EXISTS registro_2027_05_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2027_04 DROP CONSTRAINT IF EXISTS registro_2027_04_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2027_03 DROP CONSTRAINT IF EXISTS registro_2027_03_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2027_02 DROP CONSTRAINT IF EXISTS registro_2027_02_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2027_01 DROP CONSTRAINT IF EXISTS registro_2027_01_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2026_12 DROP CONSTRAINT IF EXISTS registro_2026_12_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2026_11 DROP CONSTRAINT IF EXISTS registro_2026_11_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2026_10 DROP CONSTRAINT IF EXISTS registro_2026_10_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2026_09 DROP CONSTRAINT IF EXISTS registro_2026_09_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2026_08 DROP CONSTRAINT IF EXISTS registro_2026_08_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2026_07 DROP CONSTRAINT IF EXISTS registro_2026_07_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2026_06 DROP CONSTRAINT IF EXISTS registro_2026_06_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2026_05 DROP CONSTRAINT IF EXISTS registro_2026_05_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2026_04 DROP CONSTRAINT IF EXISTS registro_2026_04_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2026_03 DROP CONSTRAINT IF EXISTS registro_2026_03_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2026_02 DROP CONSTRAINT IF EXISTS registro_2026_02_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2026_01 DROP CONSTRAINT IF EXISTS registro_2026_01_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2025_12 DROP CONSTRAINT IF EXISTS registro_2025_12_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2025_11 DROP CONSTRAINT IF EXISTS registro_2025_11_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2025_10 DROP CONSTRAINT IF EXISTS registro_2025_10_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2025_09 DROP CONSTRAINT IF EXISTS registro_2025_09_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2025_08 DROP CONSTRAINT IF EXISTS registro_2025_08_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2025_07 DROP CONSTRAINT IF EXISTS registro_2025_07_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2025_06 DROP CONSTRAINT IF EXISTS registro_2025_06_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2025_05 DROP CONSTRAINT IF EXISTS registro_2025_05_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2025_04 DROP CONSTRAINT IF EXISTS registro_2025_04_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2025_03 DROP CONSTRAINT IF EXISTS registro_2025_03_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2025_02 DROP CONSTRAINT IF EXISTS registro_2025_02_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2025_01 DROP CONSTRAINT IF EXISTS registro_2025_01_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2024_12 DROP CONSTRAINT IF EXISTS registro_2024_12_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2024_11 DROP CONSTRAINT IF EXISTS registro_2024_11_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2024_10 DROP CONSTRAINT IF EXISTS registro_2024_10_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2024_09 DROP CONSTRAINT IF EXISTS registro_2024_09_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2024_08 DROP CONSTRAINT IF EXISTS registro_2024_08_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2024_07 DROP CONSTRAINT IF EXISTS registro_2024_07_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2024_06 DROP CONSTRAINT IF EXISTS registro_2024_06_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2024_05 DROP CONSTRAINT IF EXISTS registro_2024_05_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2024_04 DROP CONSTRAINT IF EXISTS registro_2024_04_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2024_03 DROP CONSTRAINT IF EXISTS registro_2024_03_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2024_02 DROP CONSTRAINT IF EXISTS registro_2024_02_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2024_01 DROP CONSTRAINT IF EXISTS registro_2024_01_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro DROP CONSTRAINT IF EXISTS registro_pkey;
ALTER TABLE IF EXISTS ONLY audit.alerta DROP CONSTRAINT IF EXISTS alerta_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.solicitud DROP CONSTRAINT IF EXISTS uq_solicitud_numero_solicitud;
ALTER TABLE IF EXISTS ONLY acometidas.tipo_solicitud DROP CONSTRAINT IF EXISTS tipo_solicitud_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.tipo_solicitud DROP CONSTRAINT IF EXISTS tipo_solicitud_codigo_key;
ALTER TABLE IF EXISTS ONLY acometidas.tipo_acometida DROP CONSTRAINT IF EXISTS tipo_acometida_codigo_key;
ALTER TABLE IF EXISTS ONLY acometidas.solicitud DROP CONSTRAINT IF EXISTS solicitud_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.solicitud_orden_trabajo DROP CONSTRAINT IF EXISTS solicitud_orden_trabajo_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.registro_catastral DROP CONSTRAINT IF EXISTS registro_catastral_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.registro_catastral DROP CONSTRAINT IF EXISTS registro_catastral_numero_cuenta_key;
ALTER TABLE IF EXISTS ONLY acometidas.registro_catastral DROP CONSTRAINT IF EXISTS registro_catastral_id_solicitud_key;
ALTER TABLE IF EXISTS ONLY acometidas.tipo_acometida DROP CONSTRAINT IF EXISTS pk_tipo_acometida;
ALTER TABLE IF EXISTS ONLY acometidas.inventario_medidor DROP CONSTRAINT IF EXISTS inventario_medidor_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.inventario_medidor DROP CONSTRAINT IF EXISTS inventario_medidor_numero_serie_key;
ALTER TABLE IF EXISTS ONLY acometidas.informe_instalacion DROP CONSTRAINT IF EXISTS informe_instalacion_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.informe_instalacion DROP CONSTRAINT IF EXISTS informe_instalacion_id_orden_trabajo_key;
ALTER TABLE IF EXISTS ONLY acometidas.informe_inspeccion DROP CONSTRAINT IF EXISTS informe_inspeccion_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.informe_inspeccion DROP CONSTRAINT IF EXISTS informe_inspeccion_id_orden_trabajo_key;
ALTER TABLE IF EXISTS ONLY acometidas.historial_estado DROP CONSTRAINT IF EXISTS historial_estado_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.factura_inspeccion DROP CONSTRAINT IF EXISTS factura_inspeccion_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.factura_inspeccion DROP CONSTRAINT IF EXISTS factura_inspeccion_numero_factura_key;
ALTER TABLE IF EXISTS ONLY acometidas.factura_inspeccion DROP CONSTRAINT IF EXISTS factura_inspeccion_id_solicitud_key;
ALTER TABLE IF EXISTS ONLY acometidas.documento_adjunto DROP CONSTRAINT IF EXISTS documento_adjunto_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.contrato_servicio DROP CONSTRAINT IF EXISTS contrato_servicio_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.contrato_servicio DROP CONSTRAINT IF EXISTS contrato_servicio_numero_contrato_key;
ALTER TABLE IF EXISTS ONLY acometidas.contrato_servicio DROP CONSTRAINT IF EXISTS contrato_servicio_id_solicitud_key;
ALTER TABLE IF EXISTS ONLY acometidas.catalogo_tipo_documento DROP CONSTRAINT IF EXISTS catalogo_tipo_documento_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.catalogo_tipo_documento DROP CONSTRAINT IF EXISTS catalogo_tipo_documento_codigo_key;
ALTER TABLE IF EXISTS ONLY acometidas.catalogo_concepto_factura DROP CONSTRAINT IF EXISTS catalogo_concepto_factura_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.catalogo_concepto_factura DROP CONSTRAINT IF EXISTS catalogo_concepto_factura_codigo_key;
ALTER TABLE IF EXISTS ONLY acometidas.cat_uso_predio DROP CONSTRAINT IF EXISTS cat_uso_predio_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.cat_tipo_persona DROP CONSTRAINT IF EXISTS cat_tipo_persona_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.cat_tipo_orden DROP CONSTRAINT IF EXISTS cat_tipo_orden_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.cat_tipo_acometida DROP CONSTRAINT IF EXISTS cat_tipo_acometida_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.cat_resultado_inspeccion DROP CONSTRAINT IF EXISTS cat_resultado_inspeccion_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.cat_estado_validacion_doc DROP CONSTRAINT IF EXISTS cat_estado_validacion_doc_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.cat_estado_solicitud DROP CONSTRAINT IF EXISTS cat_estado_solicitud_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.cat_estado_pago DROP CONSTRAINT IF EXISTS cat_estado_pago_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.cat_estado_orden DROP CONSTRAINT IF EXISTS cat_estado_orden_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.cat_estado_firma DROP CONSTRAINT IF EXISTS cat_estado_firma_pkey;
ALTER TABLE IF EXISTS work_orders.tipo_trabajo ALTER COLUMN id_tipo_trabajo DROP DEFAULT;
ALTER TABLE IF EXISTS work_orders.rol_trabajador ALTER COLUMN id_rol DROP DEFAULT;
ALTER TABLE IF EXISTS work_orders.prioridad_orden_trabajo ALTER COLUMN id_prioridad DROP DEFAULT;
ALTER TABLE IF EXISTS work_orders.historial_estado_orden_trabajo ALTER COLUMN id_historial DROP DEFAULT;
ALTER TABLE IF EXISTS work_orders.departamento_trabajo ALTER COLUMN id_departamento DROP DEFAULT;
ALTER TABLE IF EXISTS public.zona ALTER COLUMN zona_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.usuario_roles ALTER COLUMN usuario_rol_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.usuario_permisos ALTER COLUMN usuario_permiso_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.usuario_lectura ALTER COLUMN usuario_lectura_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.usuario_factura ALTER COLUMN usuario_factura_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.titulo_dato ALTER COLUMN titulo_dato_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tipo_titulo_dato ALTER COLUMN tipo_titulo_dato_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tipo_telefono ALTER COLUMN tipo_telefono_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tipo_relacion_familiar ALTER COLUMN tipo_relacion_familiar_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tipo_predio ALTER COLUMN tipo_predio_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tipo_novedad_lectura ALTER COLUMN tipo_novedad_lectura_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tipo_incidente_medidor ALTER COLUMN tipo_incidente_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tipo_estado_lectura ALTER COLUMN tipo_estado_lectura_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tipo_contrato ALTER COLUMN tipo_contrato_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.telefono_persona_natural ALTER COLUMN telefono_persona_natural_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.telefono_empresa ALTER COLUMN telefono_empresa_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.telefono ALTER COLUMN telefono_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tarifa ALTER COLUMN tarifa_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.siguiente_lectura ALTER COLUMN siguiente_lectura_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.sexo ALTER COLUMN sexo_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.servicio ALTER COLUMN servicio_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.seguimiento_lectura ALTER COLUMN seguimiento_lectura_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.roles ALTER COLUMN rol_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.rol_permisos ALTER COLUMN rol_permiso_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.respaldo_acometidas_2026 ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.refresh_tokens ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.rangos_variables ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.qrcode ALTER COLUMN qrcode_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.profesion ALTER COLUMN profesion_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.permisos ALTER COLUMN permiso_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.permiso_categoria ALTER COLUMN categoria_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.observacion_lectura ALTER COLUMN observacion_lectura_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.observacion_factura ALTER COLUMN observacion_factura_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.observacion_acometida ALTER COLUMN observacion_acometida_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.observacion ALTER COLUMN observacion_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.lectura_estado ALTER COLUMN lectura_estado_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.lectura ALTER COLUMN lectura_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.historial_incidente ALTER COLUMN historial_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.historial_estados_acometida ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.foto_lectura ALTER COLUMN foto_lectura_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.foto_incidente ALTER COLUMN foto_incidente_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.foto_acometida ALTER COLUMN foto_acometida_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.forma_pago ALTER COLUMN forma_pago_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.factura ALTER COLUMN factura_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.estado_pago ALTER COLUMN estado_pago_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.estado_empleado ALTER COLUMN estado_empleado_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.estado_cliente_usuario ALTER COLUMN estado_cliente_usuario_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.estado_civil ALTER COLUMN estado_civil_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.direccion ALTER COLUMN direccion_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.correo_persona_natural ALTER COLUMN correo_persona_natural_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.correo_empresa ALTER COLUMN correo_empresa_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.correo_electronico ALTER COLUMN correo_electronico_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.componentes_fijos ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.cliente_persona_natural ALTER COLUMN cliente_persona_natural_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.claves_sql2000 ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.categoria_incidente_medidor ALTER COLUMN categoria_incidente_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.categoria ALTER COLUMN categoria_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.cat_action_types ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.cargo ALTER COLUMN cargo_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.auditoria_lectura_sector ALTER COLUMN audit_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.alerta_lectura_anomala ALTER COLUMN alerta_id DROP DEFAULT;
ALTER TABLE IF EXISTS documents.tipo_documento ALTER COLUMN tipo_documento_id DROP DEFAULT;
ALTER TABLE IF EXISTS documents.historial_documento ALTER COLUMN historial_id DROP DEFAULT;
ALTER TABLE IF EXISTS audit.regla_alerta ALTER COLUMN regla_id DROP DEFAULT;
ALTER TABLE IF EXISTS acometidas.tipo_solicitud ALTER COLUMN id_tipo_solicitud DROP DEFAULT;
ALTER TABLE IF EXISTS acometidas.tipo_acometida ALTER COLUMN id_tipo_acometida DROP DEFAULT;
ALTER TABLE IF EXISTS acometidas.catalogo_tipo_documento ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS acometidas.catalogo_concepto_factura ALTER COLUMN id DROP DEFAULT;
DROP VIEW IF EXISTS work_orders.view_work_order_key_statistics;
DROP VIEW IF EXISTS work_orders.view_work_order_history;
DROP VIEW IF EXISTS work_orders.view_work_order_attachments;
DROP VIEW IF EXISTS work_orders.view_ordenes_trabajo_pendientes;
DROP VIEW IF EXISTS work_orders.view_informe_instalacion;
DROP VIEW IF EXISTS work_orders.view_informe_inspeccion;
DROP VIEW IF EXISTS work_orders.view_historical_work_orders;
DROP VIEW IF EXISTS work_orders.view_dashboard_ordenes;
DROP VIEW IF EXISTS work_orders.view_all_work_orders_full_details;
DROP VIEW IF EXISTS work_orders.view_work_order_assignments;
DROP SEQUENCE IF EXISTS work_orders.tipo_trabajo_id_tipo_trabajo_seq;
DROP TABLE IF EXISTS work_orders.tipo_trabajo;
DROP SEQUENCE IF EXISTS work_orders.rol_trabajador_id_rol_seq;
DROP TABLE IF EXISTS work_orders.rol_trabajador;
DROP SEQUENCE IF EXISTS work_orders.prioridad_orden_trabajo_id_prioridad_seq;
DROP TABLE IF EXISTS work_orders.prioridad_orden_trabajo;
DROP TABLE IF EXISTS work_orders.orden_trabajo;
DROP SEQUENCE IF EXISTS work_orders.seq_orden_trabajo;
DROP TABLE IF EXISTS work_orders.observaciones_orden_trabajo;
DROP VIEW IF EXISTS work_orders.inspeccion_cuadrilla_detalle;
DROP TABLE IF EXISTS work_orders.inspeccion_preparacion_detalle;
DROP VIEW IF EXISTS work_orders.inspeccion_cuadrilla;
DROP TABLE IF EXISTS work_orders.inspeccion_preparacion;
DROP SEQUENCE IF EXISTS work_orders.historial_estado_orden_trabajo_id_historial_seq;
DROP TABLE IF EXISTS work_orders.historial_estado_orden_trabajo;
DROP TABLE IF EXISTS work_orders.encuesta_satisfaccion;
DROP TABLE IF EXISTS work_orders.detalle_orden_trabajo_material;
DROP SEQUENCE IF EXISTS work_orders.departamento_trabajo_id_departamento_seq;
DROP TABLE IF EXISTS work_orders.departamento_trabajo;
DROP TABLE IF EXISTS work_orders.costo_adicional_orden;
DROP TABLE IF EXISTS work_orders.corte_servicio;
DROP TABLE IF EXISTS work_orders.control_calidad_detalle;
DROP TABLE IF EXISTS work_orders.control_calidad;
DROP TABLE IF EXISTS work_orders.cat_origen_orden;
DROP TABLE IF EXISTS work_orders.cat_item_calidad;
DROP TABLE IF EXISTS work_orders.cat_estado_orden;
DROP TABLE IF EXISTS work_orders.cat_checklist_item;
DROP TABLE IF EXISTS work_orders.asignacion_trabajador_orden;
DROP TABLE IF EXISTS work_orders.adjuntos_orden_trabajo;
DROP SEQUENCE IF EXISTS public.zona_zona_id_seq;
DROP VIEW IF EXISTS public.vw_historial_lectura;
DROP VIEW IF EXISTS public.vw_calendario_lecturas;
DROP VIEW IF EXISTS public.vw_calendario_completo;
DROP VIEW IF EXISTS public.vw_avance_actualizacion_acometidas;
DROP VIEW IF EXISTS public.view_incidentes_detalle;
DROP VIEW IF EXISTS public.view_acometida_detalle;
DROP TABLE IF EXISTS public.zona;
DROP TABLE IF EXISTS public.verificar_cuenta_cliente;
DROP SEQUENCE IF EXISTS public.usuario_roles_usuario_rol_id_seq;
DROP TABLE IF EXISTS public.usuario_roles;
DROP SEQUENCE IF EXISTS public.usuario_permisos_usuario_permiso_id_seq;
DROP TABLE IF EXISTS public.usuario_permisos;
DROP SEQUENCE IF EXISTS public.usuario_lectura_usuario_lectura_id_seq;
DROP TABLE IF EXISTS public.usuario_lectura;
DROP SEQUENCE IF EXISTS public.usuario_factura_usuario_factura_id_seq;
DROP TABLE IF EXISTS public.usuario_factura;
DROP SEQUENCE IF EXISTS public.titulo_dato_titulo_dato_id_seq;
DROP TABLE IF EXISTS public.titulo_dato;
DROP TABLE IF EXISTS public.tipo_verificacion;
DROP SEQUENCE IF EXISTS public.tipo_titulo_dato_tipo_titulo_dato_id_seq;
DROP TABLE IF EXISTS public.tipo_titulo_dato;
DROP SEQUENCE IF EXISTS public.tipo_telefono_tipo_telefono_id_seq;
DROP TABLE IF EXISTS public.tipo_telefono;
DROP SEQUENCE IF EXISTS public.tipo_relacion_familiar_tipo_relacion_familiar_id_seq;
DROP TABLE IF EXISTS public.tipo_relacion_familiar;
DROP SEQUENCE IF EXISTS public.tipo_predio_tipo_predio_id_seq;
DROP TABLE IF EXISTS public.tipo_predio;
DROP TABLE IF EXISTS public.tipo_parroquia;
DROP SEQUENCE IF EXISTS public.tipo_novedad_lectura_tipo_novedad_lectura_id_seq;
DROP TABLE IF EXISTS public.tipo_novedad_lectura;
DROP SEQUENCE IF EXISTS public.tipo_incidente_medidor_tipo_incidente_id_seq;
DROP TABLE IF EXISTS public.tipo_incidente_medidor;
DROP TABLE IF EXISTS public.tipo_identificacion;
DROP SEQUENCE IF EXISTS public.tipo_estado_lectura_tipo_estado_lectura_id_seq;
DROP TABLE IF EXISTS public.tipo_estado_lectura;
DROP SEQUENCE IF EXISTS public.tipo_contrato_tipo_contrato_id_seq;
DROP TABLE IF EXISTS public.tipo_contrato;
DROP TABLE IF EXISTS public.temp_correo_electronico;
DROP TABLE IF EXISTS public.temp_acometida_update;
DROP SEQUENCE IF EXISTS public.telefono_telefono_id_seq;
DROP SEQUENCE IF EXISTS public.telefono_persona_natural_telefono_persona_natural_id_seq;
DROP TABLE IF EXISTS public.telefono_persona_natural;
DROP SEQUENCE IF EXISTS public.telefono_empresa_telefono_empresa_id_seq;
DROP TABLE IF EXISTS public.telefono_empresa;
DROP SEQUENCE IF EXISTS public.tarifa_tarifa_id_seq;
DROP TABLE IF EXISTS public.tarifa;
DROP SEQUENCE IF EXISTS public.siguiente_lectura_siguiente_lectura_id_seq;
DROP TABLE IF EXISTS public.siguiente_lectura;
DROP SEQUENCE IF EXISTS public.sexo_sexo_id_seq;
DROP TABLE IF EXISTS public.sexo;
DROP SEQUENCE IF EXISTS public.servicio_servicio_id_seq;
DROP TABLE IF EXISTS public.servicio;
DROP SEQUENCE IF EXISTS public.seq_codigo_incidente;
DROP SEQUENCE IF EXISTS public.seguimiento_lectura_seguimiento_lectura_id_seq;
DROP TABLE IF EXISTS public.seguimiento_lectura;
DROP SEQUENCE IF EXISTS public.roles_rol_id_seq;
DROP TABLE IF EXISTS public.roles;
DROP SEQUENCE IF EXISTS public.rol_permisos_rol_permiso_id_seq;
DROP TABLE IF EXISTS public.rol_permisos;
DROP SEQUENCE IF EXISTS public.respaldo_acometidas_2026_id_seq;
DROP TABLE IF EXISTS public.respaldo_acometidas_2026;
DROP SEQUENCE IF EXISTS public.refresh_tokens_id_seq;
DROP TABLE IF EXISTS public.refresh_tokens;
DROP SEQUENCE IF EXISTS public.rangos_variables_id_seq;
DROP TABLE IF EXISTS public.rangos_variables;
DROP SEQUENCE IF EXISTS public.qrcode_qrcode_id_seq;
DROP TABLE IF EXISTS public.qrcode;
DROP TABLE IF EXISTS public.provincia;
DROP SEQUENCE IF EXISTS public.profesion_profesion_id_seq;
DROP TABLE IF EXISTS public.profesion;
DROP TABLE IF EXISTS public.predio;
DROP SEQUENCE IF EXISTS public.permisos_permiso_id_seq;
DROP TABLE IF EXISTS public.permisos;
DROP SEQUENCE IF EXISTS public.permiso_categoria_categoria_id_seq;
DROP TABLE IF EXISTS public.permiso_categoria;
DROP TABLE IF EXISTS public.parroquia;
DROP TABLE IF EXISTS public.pais;
DROP SEQUENCE IF EXISTS public.observacion_observacion_id_seq;
DROP SEQUENCE IF EXISTS public.observacion_lectura_observacion_lectura_id_seq;
DROP TABLE IF EXISTS public.observacion_lectura;
DROP SEQUENCE IF EXISTS public.observacion_factura_observacion_factura_id_seq;
DROP TABLE IF EXISTS public.observacion_factura;
DROP SEQUENCE IF EXISTS public.observacion_acometida_observacion_acometida_id_seq;
DROP TABLE IF EXISTS public.observacion_acometida;
DROP TABLE IF EXISTS public.observacion;
DROP SEQUENCE IF EXISTS public.lectura_lectura_id_seq;
DROP SEQUENCE IF EXISTS public.lectura_estado_lectura_estado_id_seq;
DROP TABLE IF EXISTS public.lectura_estado;
DROP TABLE IF EXISTS public.lectura;
DROP TABLE IF EXISTS public.incidente_medidor;
DROP TABLE IF EXISTS public.historial_medidores;
DROP SEQUENCE IF EXISTS public.historial_incidente_historial_id_seq;
DROP TABLE IF EXISTS public.historial_incidente;
DROP SEQUENCE IF EXISTS public.historial_estados_acometida_id_seq;
DROP TABLE IF EXISTS public.historial_estados_acometida;
DROP SEQUENCE IF EXISTS public.foto_lectura_foto_lectura_id_seq;
DROP TABLE IF EXISTS public.foto_lectura_copia;
DROP TABLE IF EXISTS public.foto_lectura;
DROP SEQUENCE IF EXISTS public.foto_incidente_foto_incidente_id_seq;
DROP TABLE IF EXISTS public.foto_incidente;
DROP SEQUENCE IF EXISTS public.foto_acometida_foto_acometida_id_seq;
DROP TABLE IF EXISTS public.foto_acometida;
DROP SEQUENCE IF EXISTS public.forma_pago_forma_pago_id_seq;
DROP TABLE IF EXISTS public.forma_pago;
DROP SEQUENCE IF EXISTS public.factura_factura_id_seq;
DROP TABLE IF EXISTS public.factura;
DROP SEQUENCE IF EXISTS public.estado_pago_estado_pago_id_seq;
DROP TABLE IF EXISTS public.estado_pago;
DROP SEQUENCE IF EXISTS public.estado_empleado_estado_empleado_id_seq;
DROP TABLE IF EXISTS public.estado_empleado;
DROP SEQUENCE IF EXISTS public.estado_cliente_usuario_estado_cliente_usuario_id_seq;
DROP TABLE IF EXISTS public.estado_cliente_usuario;
DROP SEQUENCE IF EXISTS public.estado_civil_estado_civil_id_seq;
DROP TABLE IF EXISTS public.estado_civil;
DROP TABLE IF EXISTS public.empresa;
DROP TABLE IF EXISTS public.empleados;
DROP TABLE IF EXISTS public.empleado_zona;
DROP SEQUENCE IF EXISTS public.direccion_direccion_id_seq;
DROP TABLE IF EXISTS public.direccion;
DROP SEQUENCE IF EXISTS public.correo_persona_natural_correo_persona_natural_id_seq;
DROP TABLE IF EXISTS public.correo_persona_natural;
DROP SEQUENCE IF EXISTS public.correo_empresa_correo_empresa_id_seq;
DROP TABLE IF EXISTS public.correo_empresa;
DROP SEQUENCE IF EXISTS public.correo_electronico_correo_electronico_id_seq;
DROP TABLE IF EXISTS public.consumo_promedio;
DROP SEQUENCE IF EXISTS public.componentes_fijos_id_seq;
DROP TABLE IF EXISTS public.componentes_fijos;
DROP TABLE IF EXISTS public.cliente_usuario_roles;
DROP TABLE IF EXISTS public.cliente_usuario_permisos;
DROP TABLE IF EXISTS public.cliente_usuario;
DROP SEQUENCE IF EXISTS public.cliente_persona_natural_cliente_persona_natural_id_seq;
DROP TABLE IF EXISTS public.cliente_persona_natural;
DROP VIEW IF EXISTS public.cliente_contacto;
DROP TABLE IF EXISTS public.telefono;
DROP TABLE IF EXISTS public.correo_electronico;
DROP TABLE IF EXISTS public.cliente;
DROP SEQUENCE IF EXISTS public.claves_sql2000_id_seq;
DROP TABLE IF EXISTS public.claves_sql2000;
DROP TABLE IF EXISTS public.ciudadano;
DROP SEQUENCE IF EXISTS public.categoria_incidente_medidor_categoria_incidente_id_seq;
DROP TABLE IF EXISTS public.categoria_incidente_medidor;
DROP SEQUENCE IF EXISTS public.categoria_categoria_id_seq;
DROP TABLE IF EXISTS public.categoria;
DROP TABLE IF EXISTS public.cat_estados_acometida;
DROP SEQUENCE IF EXISTS public.cat_action_types_id_seq;
DROP TABLE IF EXISTS public.cat_action_types;
DROP SEQUENCE IF EXISTS public.cargo_cargo_id_seq;
DROP TABLE IF EXISTS public.cargo;
DROP TABLE IF EXISTS public.canton;
DROP SEQUENCE IF EXISTS public.auditoria_lectura_sector_audit_id_seq;
DROP TABLE IF EXISTS public.auditoria_lectura_sector;
DROP SEQUENCE IF EXISTS public.alerta_lectura_anomala_alerta_id_seq;
DROP TABLE IF EXISTS public.alerta_lectura_anomala;
DROP TABLE IF EXISTS public.acometida;
DROP TABLE IF EXISTS notifications.user_notification_dispatch_log;
DROP TABLE IF EXISTS notifications.user_notification;
DROP TABLE IF EXISTS notifications.template;
DROP TABLE IF EXISTS notifications.prioridad;
DROP TABLE IF EXISTS notifications.estado_envio;
DROP TABLE IF EXISTS notifications.canal;
DROP SEQUENCE IF EXISTS documents.tipo_documento_tipo_documento_id_seq;
DROP TABLE IF EXISTS documents.tipo_documento;
DROP TABLE IF EXISTS documents.relacion_usuarios;
DROP TABLE IF EXISTS documents.relacion_solicitud;
DROP TABLE IF EXISTS documents.relacion_predio;
DROP TABLE IF EXISTS documents.relacion_orden_trabajo;
DROP TABLE IF EXISTS documents.relacion_lectura;
DROP TABLE IF EXISTS documents.relacion_factura;
DROP TABLE IF EXISTS documents.relacion_acometida;
DROP TABLE IF EXISTS documents.nivel_acceso;
DROP SEQUENCE IF EXISTS documents.historial_documento_historial_id_seq;
DROP TABLE IF EXISTS documents.historial_documento;
DROP TABLE IF EXISTS documents.estado_documento;
DROP TABLE IF EXISTS documents.documento;
DROP VIEW IF EXISTS audit.vw_resumen_diario;
DROP VIEW IF EXISTS audit.vw_resumen_accesos;
DROP VIEW IF EXISTS audit.vw_permisos;
DROP VIEW IF EXISTS audit.vw_historial_fila;
DROP VIEW IF EXISTS audit.vw_estado_triggers;
DROP VIEW IF EXISTS audit.vw_estadisticas_generales;
DROP VIEW IF EXISTS audit.vw_config_resumen;
DROP VIEW IF EXISTS audit.vw_cambios_sensibles;
DROP VIEW IF EXISTS audit.vw_cambios_recientes;
DROP VIEW IF EXISTS audit.vw_alertas_activas;
DROP VIEW IF EXISTS audit.vw_actividad_usuario;
DROP VIEW IF EXISTS audit.vw_accesos_recientes;
DROP TABLE IF EXISTS audit.usuario_refresh_tokens;
DROP TABLE IF EXISTS audit.tabla_config;
DROP TABLE IF EXISTS audit.sesion_default;
DROP TABLE IF EXISTS audit.sesion_2026_07;
DROP TABLE IF EXISTS audit.sesion_2026_06;
DROP TABLE IF EXISTS audit.sesion_2026_05;
DROP TABLE IF EXISTS audit.sesion_2026_04;
DROP TABLE IF EXISTS audit.sesion;
DROP SEQUENCE IF EXISTS audit.regla_alerta_regla_id_seq;
DROP TABLE IF EXISTS audit.regla_alerta;
DROP TABLE IF EXISTS audit.registro_default;
DROP TABLE IF EXISTS audit.registro_2027_12;
DROP TABLE IF EXISTS audit.registro_2027_11;
DROP TABLE IF EXISTS audit.registro_2027_10;
DROP TABLE IF EXISTS audit.registro_2027_09;
DROP TABLE IF EXISTS audit.registro_2027_08;
DROP TABLE IF EXISTS audit.registro_2027_07;
DROP TABLE IF EXISTS audit.registro_2027_06;
DROP TABLE IF EXISTS audit.registro_2027_05;
DROP TABLE IF EXISTS audit.registro_2027_04;
DROP TABLE IF EXISTS audit.registro_2027_03;
DROP TABLE IF EXISTS audit.registro_2027_02;
DROP TABLE IF EXISTS audit.registro_2027_01;
DROP TABLE IF EXISTS audit.registro_2026_12;
DROP TABLE IF EXISTS audit.registro_2026_11;
DROP TABLE IF EXISTS audit.registro_2026_10;
DROP TABLE IF EXISTS audit.registro_2026_09;
DROP TABLE IF EXISTS audit.registro_2026_08;
DROP TABLE IF EXISTS audit.registro_2026_07;
DROP TABLE IF EXISTS audit.registro_2026_06;
DROP TABLE IF EXISTS audit.registro_2026_05;
DROP TABLE IF EXISTS audit.registro_2026_04;
DROP TABLE IF EXISTS audit.registro_2026_03;
DROP TABLE IF EXISTS audit.registro_2026_02;
DROP TABLE IF EXISTS audit.registro_2026_01;
DROP TABLE IF EXISTS audit.registro_2025_12;
DROP TABLE IF EXISTS audit.registro_2025_11;
DROP TABLE IF EXISTS audit.registro_2025_10;
DROP TABLE IF EXISTS audit.registro_2025_09;
DROP TABLE IF EXISTS audit.registro_2025_08;
DROP TABLE IF EXISTS audit.registro_2025_07;
DROP TABLE IF EXISTS audit.registro_2025_06;
DROP TABLE IF EXISTS audit.registro_2025_05;
DROP TABLE IF EXISTS audit.registro_2025_04;
DROP TABLE IF EXISTS audit.registro_2025_03;
DROP TABLE IF EXISTS audit.registro_2025_02;
DROP TABLE IF EXISTS audit.registro_2025_01;
DROP TABLE IF EXISTS audit.registro_2024_12;
DROP TABLE IF EXISTS audit.registro_2024_11;
DROP TABLE IF EXISTS audit.registro_2024_10;
DROP TABLE IF EXISTS audit.registro_2024_09;
DROP TABLE IF EXISTS audit.registro_2024_08;
DROP TABLE IF EXISTS audit.registro_2024_07;
DROP TABLE IF EXISTS audit.registro_2024_06;
DROP TABLE IF EXISTS audit.registro_2024_05;
DROP TABLE IF EXISTS audit.registro_2024_04;
DROP TABLE IF EXISTS audit.registro_2024_03;
DROP TABLE IF EXISTS audit.registro_2024_02;
DROP TABLE IF EXISTS audit.registro_2024_01;
DROP TABLE IF EXISTS audit.registro;
DROP TABLE IF EXISTS audit.alerta;
DROP VIEW IF EXISTS acometidas.v_panel_solicitudes;
DROP TABLE IF EXISTS public.usuarios;
DROP SEQUENCE IF EXISTS acometidas.tipo_solicitud_id_tipo_solicitud_seq;
DROP TABLE IF EXISTS acometidas.tipo_solicitud;
DROP SEQUENCE IF EXISTS acometidas.tipo_acometida_id_tipo_acometida_seq;
DROP TABLE IF EXISTS acometidas.tipo_acometida;
DROP TABLE IF EXISTS acometidas.solicitud_orden_trabajo;
DROP TABLE IF EXISTS acometidas.solicitud;
DROP SEQUENCE IF EXISTS acometidas.seq_solicitud;
DROP TABLE IF EXISTS acometidas.registro_catastral;
DROP TABLE IF EXISTS acometidas.inventario_medidor;
DROP TABLE IF EXISTS acometidas.informe_instalacion;
DROP TABLE IF EXISTS acometidas.informe_inspeccion;
DROP TABLE IF EXISTS acometidas.historial_estado;
DROP TABLE IF EXISTS acometidas.factura_inspeccion;
DROP TABLE IF EXISTS acometidas.documento_adjunto;
DROP TABLE IF EXISTS acometidas.contrato_servicio;
DROP SEQUENCE IF EXISTS acometidas.catalogo_tipo_documento_id_seq;
DROP TABLE IF EXISTS acometidas.catalogo_tipo_documento;
DROP SEQUENCE IF EXISTS acometidas.catalogo_concepto_factura_id_seq;
DROP TABLE IF EXISTS acometidas.catalogo_concepto_factura;
DROP TABLE IF EXISTS acometidas.cat_uso_predio;
DROP TABLE IF EXISTS acometidas.cat_tipo_persona;
DROP TABLE IF EXISTS acometidas.cat_tipo_orden;
DROP TABLE IF EXISTS acometidas.cat_tipo_acometida;
DROP TABLE IF EXISTS acometidas.cat_resultado_inspeccion;
DROP TABLE IF EXISTS acometidas.cat_estado_validacion_doc;
DROP TABLE IF EXISTS acometidas.cat_estado_solicitud;
DROP TABLE IF EXISTS acometidas.cat_estado_pago;
DROP TABLE IF EXISTS acometidas.cat_estado_orden;
DROP TABLE IF EXISTS acometidas.cat_estado_firma;
DROP FUNCTION IF EXISTS work_orders.fn_verificar_escalamiento_sla();
DROP FUNCTION IF EXISTS work_orders.fn_validar_transicion_estado(p_estado_actual character varying, p_nuevo_estado character varying);
DROP FUNCTION IF EXISTS work_orders.fn_update_timestamp();
DROP FUNCTION IF EXISTS work_orders.fn_registrar_historial_creacion_ot();
DROP FUNCTION IF EXISTS work_orders.fn_generar_codigo_orden();
DROP FUNCTION IF EXISTS work_orders.fn_enforce_state_machine();
DROP FUNCTION IF EXISTS work_orders.fn_cambiar_estado_orden(p_id_orden_trabajo uuid, p_nuevo_estado character varying, p_id_usuario uuid, p_comentario text);
DROP FUNCTION IF EXISTS work_orders.fn_buscar_ordenes_cercanas(p_latitud double precision, p_longitud double precision, p_radio_metros numeric);
DROP FUNCTION IF EXISTS public.update_updated_at_column();
DROP FUNCTION IF EXISTS public.update_timestamp();
DROP FUNCTION IF EXISTS public.update_empleados_timestamp();
DROP FUNCTION IF EXISTS public.update_consumo_promedio();
DROP FUNCTION IF EXISTS public.update_cliente_usuario_timestamp();
DROP FUNCTION IF EXISTS public.trg_update_is_locked_out();
DROP PROCEDURE IF EXISTS public.pr_generar_auditoria_mensual(IN p_fecha date);
DROP PROCEDURE IF EXISTS public.pr_generar_auditoria_mensual(IN p_mes character);
DROP FUNCTION IF EXISTS public.insert_rol_for_client_user_default();
DROP FUNCTION IF EXISTS public.generar_codigo_incidente();
DROP FUNCTION IF EXISTS public.fn_usuarios_lifecycle();
DROP FUNCTION IF EXISTS public.fn_update_meter_reading_initial();
DROP FUNCTION IF EXISTS public.fn_sync_lectura_auditoria();
DROP FUNCTION IF EXISTS public.fn_set_updated_at_verificar_cuenta();
DROP FUNCTION IF EXISTS public.fn_registrar_historial_medidor();
DROP FUNCTION IF EXISTS public.fn_registrar_historial_incidente();
DROP FUNCTION IF EXISTS public.fn_mes_lectura(ts timestamp without time zone);
DROP FUNCTION IF EXISTS public.fn_mes_lectura(p_fecha date);
DROP FUNCTION IF EXISTS public.fn_insert_initial_reading_full();
DROP FUNCTION IF EXISTS public.fn_insert_cambio_medidor_reading();
DROP FUNCTION IF EXISTS public.fn_inicializar_siguiente_lectura(p_acometida_id character varying, p_fecha_base date);
DROP FUNCTION IF EXISTS public.fn_control_siguiente_lectura_mensual();
DROP FUNCTION IF EXISTS public.fn_cliente_usuario_lifecycle();
DROP FUNCTION IF EXISTS public.fn_block_duplicate_lectura();
DROP FUNCTION IF EXISTS public.fn_auto_cierre_auditoria();
DROP FUNCTION IF EXISTS public.fn_auditar_cambio_estado();
DROP FUNCTION IF EXISTS public.fn_actualizar_estado_activo();
DROP FUNCTION IF EXISTS public.actualizar_updated_at();
DROP FUNCTION IF EXISTS notifications.set_updated_at();
DROP FUNCTION IF EXISTS notifications.fn_validar_usuario_notificacion();
DROP FUNCTION IF EXISTS notifications.enviar_notificacion(p_id_usuario uuid, p_titulo character varying, p_cuerpo text, p_codigo_canal character varying, p_codigo_prioridad character varying, p_entidad_tipo character varying, p_entidad_id uuid, p_metadata jsonb);
DROP FUNCTION IF EXISTS notifications.broadcast_realtime_notification();
DROP FUNCTION IF EXISTS documents.fn_update_timestamp();
DROP FUNCTION IF EXISTS audit.fn_set_contexto(p_usuario_id text, p_usuario_nom text, p_ip_address text, p_sesion_id text, p_app_nombre text);
DROP FUNCTION IF EXISTS audit.fn_resolver_alerta(p_alerta_id bigint, p_usuario_id uuid, p_nota text);
DROP FUNCTION IF EXISTS audit.fn_registrar_acceso(p_usuario_id uuid, p_usuario_name text, p_evento text, p_ip inet, p_user_agent text, p_motivo text, p_metadata jsonb);
DROP FUNCTION IF EXISTS audit.fn_registrar();
DROP FUNCTION IF EXISTS audit.fn_reactivar_tabla(p_tabla text);
DROP FUNCTION IF EXISTS audit.fn_pausar_tabla(p_tabla text);
DROP FUNCTION IF EXISTS audit.fn_obtener_pk(p_schema text, p_tabla text, p_fila jsonb);
DROP FUNCTION IF EXISTS audit.fn_limpiar_tokens_invalidos();
DROP FUNCTION IF EXISTS audit.fn_limpiar_particiones_antiguas(p_dry_run boolean);
DROP FUNCTION IF EXISTS audit.fn_generar_reporte_retencion();
DROP FUNCTION IF EXISTS audit.fn_evaluar_alertas();
DROP FUNCTION IF EXISTS audit.fn_estadisticas_particiones();
DROP FUNCTION IF EXISTS audit.fn_enmascarar_jsonb(p_datos jsonb, p_enmascarar text[], p_excluir text[]);
DROP FUNCTION IF EXISTS audit.fn_crear_proximas_particiones(p_meses integer);
DROP FUNCTION IF EXISTS audit.fn_crear_particion_sesion(p_fecha date);
DROP FUNCTION IF EXISTS audit.fn_crear_particion_mes(p_fecha date);
DROP FUNCTION IF EXISTS audit.fn_contexto_sesion();
DROP FUNCTION IF EXISTS audit.fn_config_updated_at();
DROP FUNCTION IF EXISTS audit.fn_auditar_esquema(p_esquema text, p_nivel audit.audit_nivel);
DROP FUNCTION IF EXISTS audit.fn_aplicar_triggers();
DROP FUNCTION IF EXISTS acometidas.fn_validar_usuario_accion();
DROP FUNCTION IF EXISTS acometidas.fn_validar_transicion(p_estado_actual character varying, p_nuevo_estado character varying);
DROP FUNCTION IF EXISTS acometidas.fn_trg_sincronizar_acometida_legacy();
DROP FUNCTION IF EXISTS acometidas.fn_trg_factura_inspeccion_updated();
DROP FUNCTION IF EXISTS acometidas.fn_trg_factura_inspeccion_created();
DROP FUNCTION IF EXISTS acometidas.fn_trg_documento_resubmitted();
DROP FUNCTION IF EXISTS acometidas.fn_sync_clave_catastral_definitiva();
DROP FUNCTION IF EXISTS acometidas.fn_set_updated_at();
DROP FUNCTION IF EXISTS acometidas.fn_generar_numero_solicitud();
DROP FUNCTION IF EXISTS acometidas.fn_enforce_state_machine();
DROP FUNCTION IF EXISTS acometidas.fn_cambiar_estado_solicitud(p_id_solicitud uuid, p_nuevo_estado character varying, p_id_usuario uuid, p_comentario text, p_datos_extra jsonb);
DROP TYPE IF EXISTS audit.audit_severidad;
DROP TYPE IF EXISTS audit.audit_operacion;
DROP TYPE IF EXISTS audit.audit_nivel;
DROP EXTENSION IF EXISTS "uuid-ossp";
DROP EXTENSION IF EXISTS postgres_fdw;
DROP EXTENSION IF EXISTS postgis_topology;
DROP EXTENSION IF EXISTS postgis_raster;
DROP EXTENSION IF EXISTS postgis;
DROP EXTENSION IF EXISTS pgcrypto;
DROP SCHEMA IF EXISTS work_orders;
DROP SCHEMA IF EXISTS topology;
DROP SCHEMA IF EXISTS notifications;
DROP SCHEMA IF EXISTS documents;
DROP SCHEMA IF EXISTS audit;
DROP SCHEMA IF EXISTS acometidas;
--
-- Name: acometidas; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA acometidas;


ALTER SCHEMA acometidas OWNER TO postgres;

--
-- Name: audit; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA audit;


ALTER SCHEMA audit OWNER TO postgres;

--
-- Name: SCHEMA audit; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA audit IS 'Schema de auditoría enterprise-grade para SIGEPAA. Registra INSERT/UPDATE/DELETE de todas las tablas críticas con diff JSONB, contexto de sesión, alertas automáticas y retención por particionado mensual.';


--
-- Name: documents; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA documents;


ALTER SCHEMA documents OWNER TO postgres;

--
-- Name: notifications; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA notifications;


ALTER SCHEMA notifications OWNER TO postgres;

--
-- Name: topology; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA topology;


ALTER SCHEMA topology OWNER TO postgres;

--
-- Name: SCHEMA topology; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA topology IS 'PostGIS Topology schema';


--
-- Name: work_orders; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA work_orders;


ALTER SCHEMA work_orders OWNER TO postgres;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: postgis_raster; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_raster WITH SCHEMA public;


--
-- Name: EXTENSION postgis_raster; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_raster IS 'PostGIS raster types and functions';


--
-- Name: postgis_topology; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_topology WITH SCHEMA topology;


--
-- Name: EXTENSION postgis_topology; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_topology IS 'PostGIS topology spatial types and functions';


--
-- Name: postgres_fdw; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgres_fdw WITH SCHEMA public;


--
-- Name: EXTENSION postgres_fdw; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgres_fdw IS 'foreign-data wrapper for remote PostgreSQL servers';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: audit_nivel; Type: TYPE; Schema: audit; Owner: postgres
--

CREATE TYPE audit.audit_nivel AS ENUM (
    'MINIMAL',
    'STANDARD',
    'FULL'
);


ALTER TYPE audit.audit_nivel OWNER TO postgres;

--
-- Name: audit_operacion; Type: TYPE; Schema: audit; Owner: postgres
--

CREATE TYPE audit.audit_operacion AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE'
);


ALTER TYPE audit.audit_operacion OWNER TO postgres;

--
-- Name: audit_severidad; Type: TYPE; Schema: audit; Owner: postgres
--

CREATE TYPE audit.audit_severidad AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);


ALTER TYPE audit.audit_severidad OWNER TO postgres;

--
-- Name: fn_cambiar_estado_solicitud(uuid, character varying, uuid, text, jsonb); Type: FUNCTION; Schema: acometidas; Owner: postgres
--

CREATE FUNCTION acometidas.fn_cambiar_estado_solicitud(p_id_solicitud uuid, p_nuevo_estado character varying, p_id_usuario uuid, p_comentario text DEFAULT NULL::text, p_datos_extra jsonb DEFAULT '{}'::jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_estado_anterior VARCHAR(50);
BEGIN
    -- Obtener estado actual con bloqueo para evitar condiciones de carrera
    SELECT estado INTO v_estado_anterior
    FROM acometidas.solicitud
    WHERE id_solicitud = p_id_solicitud
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Solicitud % no encontrada', p_id_solicitud;
    END IF;

    -- Actualizar estado en la solicitud
    UPDATE acometidas.solicitud
    SET estado = p_nuevo_estado
    WHERE id_solicitud = p_id_solicitud;

    -- Registrar en el historial
    INSERT INTO acometidas.historial_estado (
        id_solicitud, estado_anterior, estado_nuevo,
        id_usuario_accion, comentario, datos_extra
    ) VALUES (
        p_id_solicitud, v_estado_anterior, p_nuevo_estado,
        p_id_usuario, p_comentario, p_datos_extra
    );
END;
$$;


ALTER FUNCTION acometidas.fn_cambiar_estado_solicitud(p_id_solicitud uuid, p_nuevo_estado character varying, p_id_usuario uuid, p_comentario text, p_datos_extra jsonb) OWNER TO postgres;

--
-- Name: fn_enforce_state_machine(); Type: FUNCTION; Schema: acometidas; Owner: postgres
--

CREATE FUNCTION acometidas.fn_enforce_state_machine() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF OLD.estado <> NEW.estado THEN
        IF NOT acometidas.fn_validar_transicion(OLD.estado, NEW.estado) THEN
            RAISE EXCEPTION 'Transición de estado inválida: % → %', OLD.estado, NEW.estado;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION acometidas.fn_enforce_state_machine() OWNER TO postgres;

--
-- Name: fn_generar_numero_solicitud(); Type: FUNCTION; Schema: acometidas; Owner: postgres
--

CREATE FUNCTION acometidas.fn_generar_numero_solicitud() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Solo genera si no se envió uno manualmente
    IF NEW.numero_solicitud IS NULL THEN
        NEW.numero_solicitud :=
            'SOL-EPAA-'
            || TO_CHAR(NOW(), 'YYYY')
            || '-'
            || LPAD(nextval('acometidas.seq_solicitud')::TEXT, 7, '0');
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION acometidas.fn_generar_numero_solicitud() OWNER TO postgres;

--
-- Name: fn_set_updated_at(); Type: FUNCTION; Schema: acometidas; Owner: postgres
--

CREATE FUNCTION acometidas.fn_set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION acometidas.fn_set_updated_at() OWNER TO postgres;

--
-- Name: fn_sync_clave_catastral_definitiva(); Type: FUNCTION; Schema: acometidas; Owner: postgres
--

CREATE FUNCTION acometidas.fn_sync_clave_catastral_definitiva() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- A) Sincronizar en la orden de trabajo vinculada en la tabla puente
    UPDATE work_orders.orden_trabajo
    SET clave_catastral = NEW.clave_catastral,
        updated_at = NOW()
    WHERE id_orden_trabajo IN (
        SELECT id_orden_trabajo 
        FROM acometidas.solicitud_orden_trabajo 
        WHERE id_solicitud = NEW.id_solicitud
    );
    
    -- B) Sincronizar en la solicitud principal en acometidas
    UPDATE acometidas.solicitud
    SET clave_catastral = NEW.clave_catastral,
        updated_at = NOW()
    WHERE id_solicitud = NEW.id_solicitud;

    RETURN NEW;
END;
$$;


ALTER FUNCTION acometidas.fn_sync_clave_catastral_definitiva() OWNER TO postgres;

--
-- Name: fn_trg_documento_resubmitted(); Type: FUNCTION; Schema: acometidas; Owner: postgres
--

CREATE FUNCTION acometidas.fn_trg_documento_resubmitted() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_estado_solicitud VARCHAR(50);
    v_cliente_usuario_id UUID;
    v_id_cliente VARCHAR(13);
BEGIN
    -- Obtener estado actual de la solicitud
    SELECT estado, id_cliente INTO v_estado_solicitud, v_id_cliente
    FROM acometidas.solicitud
    WHERE id_solicitud = NEW.id_solicitud;

    -- Si la solicitud está en estado DOCS_REJECTED
    IF v_estado_solicitud = 'DOCS_REJECTED' THEN
        -- Si es INSERT (nuevo documento) o si es UPDATE y cambió el archivo o el hash
        IF (TG_OP = 'INSERT') OR 
           (TG_OP = 'UPDATE' AND (OLD.url_archivo IS DISTINCT FROM NEW.url_archivo OR OLD.hash_sha256 IS DISTINCT FROM NEW.hash_sha256)) THEN
            
            -- Resetear el estado de validación del documento a 'CORREGIDO' (en lugar de 'PENDIENTE' para denotar resubida)
            -- Limpiamos observaciones y auditorías del rechazo anterior
            NEW.estado_validacion := 'CORREGIDO';
            NEW.observacion := NULL;
            NEW.id_validador := NULL;
            NEW.fecha_validacion := NULL;

            -- Buscar el cliente_usuario_id del cliente para registrar la acción en el historial
            SELECT cliente_usuario_id INTO v_cliente_usuario_id
            FROM public.cliente_usuario
            WHERE cliente_id = v_id_cliente
            LIMIT 1;

            -- Si se encuentra el usuario, registrar la transición de estado a DOCS_SUBMITTED
            IF v_cliente_usuario_id IS NOT NULL THEN
                PERFORM acometidas.fn_cambiar_estado_solicitud(
                    NEW.id_solicitud,
                    'DOCS_SUBMITTED',
                    v_cliente_usuario_id,
                    'Documento corregido y resubido por el cliente (Trigger automático BD)'
                );
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION acometidas.fn_trg_documento_resubmitted() OWNER TO postgres;

--
-- Name: fn_trg_factura_inspeccion_created(); Type: FUNCTION; Schema: acometidas; Owner: postgres
--

CREATE FUNCTION acometidas.fn_trg_factura_inspeccion_created() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_estado_solicitud VARCHAR(50);
    v_id_analista UUID;
BEGIN
    -- Obtener estado actual de la solicitud y analista
    SELECT estado, id_analista INTO v_estado_solicitud, v_id_analista
    FROM acometidas.solicitud
    WHERE id_solicitud = NEW.id_solicitud;

    -- Si la solicitud está en estado DOCS_APPROVED y se inserta la factura
    IF v_estado_solicitud = 'DOCS_APPROVED' THEN
        -- Cambiar estado de la solicitud a FACTURA_INSPECCION_EMITIDA
        PERFORM acometidas.fn_cambiar_estado_solicitud(
            NEW.id_solicitud,
            'FACTURA_INSPECCION_EMITIDA',
            COALESCE(NEW.id_cajero, v_id_analista, 'e3400d18-86e1-4eee-9a8b-3e7eaf812a95'::UUID),
            'Factura de inspección generada (Trigger automático BD)'
        );
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION acometidas.fn_trg_factura_inspeccion_created() OWNER TO postgres;

--
-- Name: fn_trg_factura_inspeccion_updated(); Type: FUNCTION; Schema: acometidas; Owner: postgres
--

CREATE FUNCTION acometidas.fn_trg_factura_inspeccion_updated() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_estado_solicitud VARCHAR(50);
    v_cliente_usuario_id UUID;
    v_id_cliente VARCHAR(13);
    v_id_usuario_accion UUID;
BEGIN
    SELECT estado, id_cliente INTO v_estado_solicitud, v_id_cliente
    FROM acometidas.solicitud
    WHERE id_solicitud = NEW.id_solicitud;

    IF v_estado_solicitud = 'FACTURA_INSPECCION_EMITIDA' AND OLD.url_comprobante IS NULL AND NEW.url_comprobante IS NOT NULL THEN
        SELECT cliente_usuario_id INTO v_cliente_usuario_id
        FROM public.cliente_usuario
        WHERE cliente_id = v_id_cliente
        LIMIT 1;

        -- Usar el id_cajero o un id por defecto si no hay cliente_usuario_id
        v_id_usuario_accion := COALESCE(v_cliente_usuario_id, NEW.id_cajero, 'e3400d18-86e1-4eee-9a8b-3e7eaf812a95'::UUID);

        PERFORM acometidas.fn_cambiar_estado_solicitud(
            NEW.id_solicitud,
            'PAGO_PENDIENTE',
            v_id_usuario_accion,
            'Comprobante de pago subido (Trigger automático BD)'
        );
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION acometidas.fn_trg_factura_inspeccion_updated() OWNER TO postgres;

--
-- Name: fn_trg_sincronizar_acometida_legacy(); Type: FUNCTION; Schema: acometidas; Owner: postgres
--

CREATE FUNCTION acometidas.fn_trg_sincronizar_acometida_legacy() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_cliente_id VARCHAR(13);
    v_direccion VARCHAR(500);
    v_sector INTEGER;
    v_cuenta INTEGER;
    v_alcantarillado BOOLEAN;

    -- Nuevas variables para traer datos de otras tablas
    v_numero_contrato VARCHAR(50) := '0';
    v_tarifa_id INTEGER := 2;
    v_observaciones TEXT := '-';
BEGIN
    -- 1. Obtener datos clave de la solicitud original
    SELECT id_cliente, direccion INTO v_cliente_id, v_direccion
    FROM acometidas.solicitud
    WHERE id_solicitud = NEW.id_solicitud;

    -- 1.1 Obtener número de contrato y tarifa del contrato de servicio
    SELECT numero_contrato, id_tarifa INTO v_numero_contrato, v_tarifa_id
    FROM acometidas.contrato_servicio
    WHERE id_solicitud = NEW.id_solicitud
    ORDER BY created_at DESC LIMIT 1;

    -- Aplicar defaults en caso de que vengan nulos
    v_numero_contrato := COALESCE(v_numero_contrato, '0');
    v_tarifa_id := COALESCE(v_tarifa_id, 2);

    -- 1.2 Obtener observaciones del informe de instalación
    SELECT observaciones INTO v_observaciones
    FROM acometidas.informe_instalacion
    WHERE id_solicitud = NEW.id_solicitud
    ORDER BY created_at DESC LIMIT 1;

    v_observaciones := COALESCE(v_observaciones, '-');

    -- 2. Extraer sector y cuenta de la clave_catastral (ej: '29-60')
    BEGIN
        v_sector := split_part(NEW.clave_catastral, '-', 1)::INTEGER;
        v_cuenta := split_part(NEW.clave_catastral, '-', 2)::INTEGER;
    EXCEPTION WHEN OTHERS THEN
        v_sector := 0;
        v_cuenta := 0;
    END;

    -- 3. Determinar si tiene alcantarillado
    IF NEW.tipo_servicio IN ('ALCANTARILLADO', 'MIXTO') THEN
        v_alcantarillado := TRUE;
    ELSE
        v_alcantarillado := FALSE;
    END IF;

    -- 4. Lógica de inserción o actualización en public.acometida
    IF EXISTS (
        SELECT 1 FROM public.acometida
        WHERE acometida_id = SUBSTRING(NEW.clave_catastral, 1, 10)
           OR clave_catastral = SUBSTRING(NEW.clave_catastral, 1, 10)
    ) THEN
        -- Si la clave catastral ya existe, NO insertamos.
        -- Actualizamos el medidor (Cambio de Medidor), cliente (Cambio de Dueño), y Tarifa.
        UPDATE public.acometida
        SET numero_medidor = SUBSTRING(NEW.numero_medidor, 1, 20),
            cliente_id = v_cliente_id,
            tarifa_id = v_tarifa_id,
            alcantarillado = v_alcantarillado,
            updated_at = NOW()
        WHERE acometida_id = SUBSTRING(NEW.clave_catastral, 1, 10)
           OR clave_catastral = SUBSTRING(NEW.clave_catastral, 1, 10);
    ELSE
        -- Si la clave catastral NO existe, verificamos que el medidor no esté en uso por otra cuenta
        -- para evitar errores de clave duplicada. Si está libre, insertamos.
        IF NOT EXISTS (
            SELECT 1 FROM public.acometida WHERE numero_medidor = SUBSTRING(NEW.numero_medidor, 1, 20)
        ) THEN
            INSERT INTO public.acometida (
                acometida_id,
                cliente_id,
                tarifa_id,
                numero_medidor,
                sector,
                cuenta,
                clave_catastral,
                numero_contrato,
                alcantarillado,
                estado,
                observaciones,
                direccion,
                fecha_instalacion,
                numero_personas,
                zona,
                coordenadas,
                referencia,
                metadata,
                altitud,
                "precision",
                fecha_geolocalizacion,
                fecha_inicio_lecturas,
                zona_id,
                created_at,
                updated_at,
                estado_id
            ) VALUES (
                SUBSTRING(NEW.clave_catastral, 1, 10), -- acometida_id truncado a 10 chars max
                v_cliente_id,                          -- cliente_id de la solicitud
                v_tarifa_id,                           -- tarifa_id extraído del contrato (o 2 por defecto)
                SUBSTRING(NEW.numero_medidor, 1, 20),  -- numero_medidor truncado a 20 chars max
                v_sector,                              -- sector extraído
                v_cuenta,                              -- cuenta extraída
                SUBSTRING(NEW.clave_catastral, 1, 10), -- clave_catastral truncada a 10 chars max
                SUBSTRING(v_numero_contrato, 1, 20),   -- numero_contrato truncado a 20 chars max
                v_alcantarillado,                      -- alcantarillado (true/false)
                TRUE,                                  -- estado
                v_observaciones,                       -- observaciones extraídas del informe (o '-')
                COALESCE(NEW.direccion_exacta, v_direccion), -- direccion
                NEW.fecha_instalacion::timestamp,      -- fecha_instalacion
                5,                                     -- numero_personas
                3,                                     -- zona
                NEW.geom,                              -- coordenadas geométricas
                NULL,                                  -- referencia
                '{"source": "registro_catastral"}'::jsonb, -- metadata
                5,                                     -- altitud
                0.99,                                  -- precision
                NOW(),                                 -- fecha_geolocalizacion
                CURRENT_DATE,                          -- fecha_inicio_lecturas
                3,                                     -- zona_id
                NOW(),                                 -- created_at
                NOW(),                                 -- updated_at
                1                                      -- estado_id
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION acometidas.fn_trg_sincronizar_acometida_legacy() OWNER TO postgres;

--
-- Name: fn_validar_transicion(character varying, character varying); Type: FUNCTION; Schema: acometidas; Owner: postgres
--

CREATE FUNCTION acometidas.fn_validar_transicion(p_estado_actual character varying, p_nuevo_estado character varying) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN CASE
        WHEN p_estado_actual = 'DRAFT'                        AND p_nuevo_estado IN ('DOCS_SUBMITTED', 'ANULADA')                    THEN TRUE
        WHEN p_estado_actual = 'DOCS_SUBMITTED'               AND p_nuevo_estado IN ('DOCS_APPROVED', 'DOCS_REJECTED', 'ANULADA')    THEN TRUE
        WHEN p_estado_actual = 'DOCS_REJECTED'                AND p_nuevo_estado IN ('DOCS_SUBMITTED', 'DOCS_APPROVED', 'ANULADA')   THEN TRUE
        WHEN p_estado_actual = 'DOCS_APPROVED'                AND p_nuevo_estado IN ('FACTURA_INSPECCION_EMITIDA', 'ANULADA')        THEN TRUE
        WHEN p_estado_actual = 'FACTURA_INSPECCION_EMITIDA'   AND p_nuevo_estado IN ('PAGO_PENDIENTE', 'PAGO_CONFIRMADO', 'ANULADA') THEN TRUE
        WHEN p_estado_actual = 'PAGO_PENDIENTE'               AND p_nuevo_estado IN ('PAGO_CONFIRMADO', 'FACTURA_INSPECCION_EMITIDA', 'ANULADA') THEN TRUE
        WHEN p_estado_actual = 'PAGO_CONFIRMADO'              AND p_nuevo_estado IN ('ORDEN_INSPECCION_EMITIDA', 'ANULADA')          THEN TRUE
        WHEN p_estado_actual = 'ORDEN_INSPECCION_EMITIDA'     AND p_nuevo_estado IN ('INSPECCION_EN_PROCESO', 'ANULADA')             THEN TRUE
        WHEN p_estado_actual = 'INSPECCION_EN_PROCESO'        AND p_nuevo_estado IN ('INFORME_EN_REVISION')                          THEN TRUE
        WHEN p_estado_actual = 'INFORME_EN_REVISION'          AND p_nuevo_estado IN ('INFORME_APROBADO', 'RECHAZADA_TECNICA')        THEN TRUE
        WHEN p_estado_actual = 'INFORME_APROBADO'             AND p_nuevo_estado IN ('CONTRATO_GENERADO')                            THEN TRUE
        WHEN p_estado_actual = 'CONTRATO_GENERADO'            AND p_nuevo_estado IN ('CONTRATO_FIRMADO', 'ANULADA')                  THEN TRUE
        WHEN p_estado_actual = 'CONTRATO_FIRMADO'             AND p_nuevo_estado IN ('OT_INSTALACION_EMITIDA')                       THEN TRUE
        WHEN p_estado_actual = 'OT_INSTALACION_EMITIDA'       AND p_nuevo_estado IN ('INSTALACION_EN_PROCESO')                       THEN TRUE
        WHEN p_estado_actual = 'INSTALACION_EN_PROCESO'       AND p_nuevo_estado IN ('INSTALACION_COMPLETADA', 'INSTALACION_FALLIDA') THEN TRUE
        WHEN p_estado_actual = 'INSTALACION_FALLIDA'          AND p_nuevo_estado IN ('OT_INSTALACION_EMITIDA', 'ANULADA')            THEN TRUE

        -- Aquí está el cambio clave: Se permite ir directo a SUMINISTRO_ACTIVO
        WHEN p_estado_actual = 'INSTALACION_COMPLETADA'       AND p_nuevo_estado IN ('REGISTRO_CATASTRAL_PENDIENTE', 'SUMINISTRO_ACTIVO') THEN TRUE
        WHEN p_estado_actual = 'REGISTRO_CATASTRAL_PENDIENTE' AND p_nuevo_estado IN ('SUMINISTRO_ACTIVO')                            THEN TRUE
        ELSE FALSE
    END;
END;
$$;


ALTER FUNCTION acometidas.fn_validar_transicion(p_estado_actual character varying, p_nuevo_estado character varying) OWNER TO postgres;

--
-- Name: fn_validar_usuario_accion(); Type: FUNCTION; Schema: acometidas; Owner: postgres
--

CREATE FUNCTION acometidas.fn_validar_usuario_accion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM public.usuarios WHERE usuario_id = NEW.id_usuario_accion) OR
       EXISTS (SELECT 1 FROM public.cliente_usuario WHERE cliente_usuario_id = NEW.id_usuario_accion) THEN
        RETURN NEW;
    END IF;

    RAISE EXCEPTION 'El id_usuario_accion (%) no existe en public.usuarios ni en public.cliente_usuario', NEW.id_usuario_accion;
END;
$$;


ALTER FUNCTION acometidas.fn_validar_usuario_accion() OWNER TO postgres;

--
-- Name: fn_aplicar_triggers(); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit.fn_aplicar_triggers() RETURNS TABLE(esquema text, tabla text, accion text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'audit', 'public'
    AS $$
DECLARE
    r        RECORD;
    v_existe BOOLEAN;
BEGIN
    FOR r IN
        SELECT tc.schema_nombre, tc.tabla_nombre
        FROM audit.tabla_config tc
        WHERE tc.activo = TRUE
        ORDER BY tc.schema_nombre, tc.tabla_nombre
    LOOP
        -- Verificar existencia en el esquema correspondiente
        SELECT EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = r.schema_nombre
              AND table_name   = r.tabla_nombre
        ) INTO v_existe;

        IF NOT v_existe THEN
            esquema := r.schema_nombre;
            tabla   := r.tabla_nombre;
            accion  := 'OMITIDA — tabla no encontrada en schema ' || r.schema_nombre;
            RETURN NEXT;
            CONTINUE;
        END IF;

        -- Eliminar trigger previo de forma limpia
        EXECUTE FORMAT(
            'DROP TRIGGER IF EXISTS trg_audit_%I ON %I.%I',
            r.tabla_nombre, r.schema_nombre, r.tabla_nombre
        );

        -- Crear trigger dinámicamente apuntando a su esquema correspondiente
        EXECUTE FORMAT(
            'CREATE TRIGGER trg_audit_%I '
            'AFTER INSERT OR UPDATE OR DELETE ON %I.%I '
            'FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar()',
            r.tabla_nombre, r.schema_nombre, r.tabla_nombre
        );

        esquema := r.schema_nombre;
        tabla   := r.tabla_nombre;
        accion  := 'TRIGGER CREADO: trg_audit_' || r.tabla_nombre;
        RETURN NEXT;
    END LOOP;
END;
$$;


ALTER FUNCTION audit.fn_aplicar_triggers() OWNER TO postgres;

--
-- Name: FUNCTION fn_aplicar_triggers(); Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON FUNCTION audit.fn_aplicar_triggers() IS 'Crea o recrea los triggers de auditoría en todas las tablas activas de audit.tabla_config para cualquier esquema. Es idempotente.';


--
-- Name: fn_auditar_esquema(text, audit.audit_nivel); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit.fn_auditar_esquema(p_esquema text, p_nivel audit.audit_nivel DEFAULT 'STANDARD'::audit.audit_nivel) RETURNS TABLE(tablas_auditadas integer)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_count INT := 0;
BEGIN
    -- 1. Registrar todas las tablas del esquema indicado
    INSERT INTO audit.tabla_config (schema_nombre, tabla_nombre, nivel, activo, descripcion)
    SELECT
        p_esquema,
        table_name,
        p_nivel,
        TRUE,
        'Registrada automáticamente para auditoría de esquema completo: ' || p_esquema
    FROM information_schema.tables
    WHERE table_schema = p_esquema
      AND table_type = 'BASE TABLE'
      AND table_name NOT IN ('registro', 'tabla_config')
    ON CONFLICT (schema_nombre, tabla_nombre) DO NOTHING;

    -- 2. Aplicar los triggers dinámicos
    PERFORM audit.fn_aplicar_triggers();

    -- Contar tablas con auditoría activa en dicho esquema
    SELECT COUNT(*)::INT INTO v_count
    FROM audit.tabla_config
    WHERE schema_nombre = p_esquema AND activo = TRUE;

    RETURN QUERY SELECT v_count;
END;
$$;


ALTER FUNCTION audit.fn_auditar_esquema(p_esquema text, p_nivel audit.audit_nivel) OWNER TO postgres;

--
-- Name: FUNCTION fn_auditar_esquema(p_esquema text, p_nivel audit.audit_nivel); Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON FUNCTION audit.fn_auditar_esquema(p_esquema text, p_nivel audit.audit_nivel) IS 'Registra todas las tablas de un esquema y aplica sus triggers de auditoría.';


--
-- Name: fn_config_updated_at(); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit.fn_config_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;


ALTER FUNCTION audit.fn_config_updated_at() OWNER TO postgres;

--
-- Name: fn_contexto_sesion(); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit.fn_contexto_sesion() RETURNS TABLE(usuario_id uuid, usuario_nom text, ip_address inet, sesion_id text, app_nombre text)
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY SELECT
        NULLIF(current_setting('app.usuario_id',  TRUE), '')::UUID,
        NULLIF(current_setting('app.usuario_nom',  TRUE), ''),
        NULLIF(current_setting('app.ip_address',  TRUE), '')::INET,
        NULLIF(current_setting('app.sesion_id',   TRUE), ''),
        COALESCE(NULLIF(current_setting('app.nombre', TRUE), ''), 'SIGEPAA');
EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT NULL::UUID, NULL::TEXT, NULL::INET, NULL::TEXT, 'SIGEPAA'::TEXT;
END;
$$;


ALTER FUNCTION audit.fn_contexto_sesion() OWNER TO postgres;

--
-- Name: FUNCTION fn_contexto_sesion(); Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON FUNCTION audit.fn_contexto_sesion() IS 'Lee las variables de sesión inyectadas por la aplicación (SET LOCAL app.*). Retorna el contexto del usuario actual para inclusión en registros de auditoría.';


--
-- Name: fn_crear_particion_mes(date); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit.fn_crear_particion_mes(p_fecha date DEFAULT CURRENT_DATE) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'audit', 'public'
    AS $$
DECLARE
    v_inicio  DATE;
    v_fin     DATE;
    v_nombre  TEXT;
    v_sql     TEXT;
BEGIN
    v_inicio := DATE_TRUNC('month', p_fecha)::DATE;
    v_fin    := (v_inicio + INTERVAL '1 month')::DATE;
    v_nombre := 'audit.registro_' || TO_CHAR(v_inicio, 'YYYY_MM');

    -- Verificar si ya existe
    IF EXISTS (
        SELECT 1 FROM pg_tables
        WHERE schemaname = 'audit'
          AND tablename  = 'registro_' || TO_CHAR(v_inicio, 'YYYY_MM')
    ) THEN
        RETURN 'YA EXISTE: ' || v_nombre;
    END IF;

    v_sql := FORMAT(
        'CREATE TABLE %s PARTITION OF audit.registro '
        'FOR VALUES FROM (%L) TO (%L)',
        v_nombre, v_inicio, v_fin
    );
    EXECUTE v_sql;

    RETURN 'CREADA: ' || v_nombre || ' (' || v_inicio || ' → ' || v_fin || ')';
EXCEPTION WHEN OTHERS THEN
    RETURN 'ERROR: ' || SQLERRM;
END;
$$;


ALTER FUNCTION audit.fn_crear_particion_mes(p_fecha date) OWNER TO postgres;

--
-- Name: FUNCTION fn_crear_particion_mes(p_fecha date); Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON FUNCTION audit.fn_crear_particion_mes(p_fecha date) IS 'Crea la partición mensual de audit.registro para la fecha dada. Llamar mensualmente (ej: primer día del mes anterior al siguiente). Ejemplo: SELECT audit.fn_crear_particion_mes(''2028-01-01'');';


--
-- Name: fn_crear_particion_sesion(date); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit.fn_crear_particion_sesion(p_fecha date DEFAULT CURRENT_DATE) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'audit', 'public'
    AS $$
DECLARE
    v_inicio  DATE;
    v_fin     DATE;
    v_nombre  TEXT;
    v_sql     TEXT;
BEGIN
    v_inicio := DATE_TRUNC('month', p_fecha)::DATE;
    v_fin    := (v_inicio + INTERVAL '1 month')::DATE;
    v_nombre := 'audit.sesion_' || TO_CHAR(v_inicio, 'YYYY_MM');

    -- Verificar si ya existe
    IF EXISTS (
        SELECT 1 FROM pg_tables
        WHERE schemaname = 'audit'
          AND tablename  = 'sesion_' || TO_CHAR(v_inicio, 'YYYY_MM')
    ) THEN
        RETURN 'YA EXISTE: ' || v_nombre;
    END IF;

    v_sql := FORMAT(
        'CREATE TABLE %s PARTITION OF audit.sesion '
        'FOR VALUES FROM (%L) TO (%L)',
        v_nombre, v_inicio, v_fin
    );
    EXECUTE v_sql;

    RETURN 'CREADA: ' || v_nombre || ' (' || v_inicio || ' → ' || v_fin || ')';
EXCEPTION WHEN OTHERS THEN
    RETURN 'ERROR: ' || SQLERRM;
END;
$$;


ALTER FUNCTION audit.fn_crear_particion_sesion(p_fecha date) OWNER TO postgres;

--
-- Name: fn_crear_proximas_particiones(integer); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit.fn_crear_proximas_particiones(p_meses integer DEFAULT 3) RETURNS SETOF text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'audit', 'public'
    AS $$
DECLARE
    i INTEGER;
BEGIN
    FOR i IN 0..p_meses LOOP
        RETURN NEXT audit.fn_crear_particion_mes(
            (DATE_TRUNC('month', CURRENT_DATE) + (i || ' months')::INTERVAL)::DATE
        );
    END LOOP;
END;
$$;


ALTER FUNCTION audit.fn_crear_proximas_particiones(p_meses integer) OWNER TO postgres;

--
-- Name: FUNCTION fn_crear_proximas_particiones(p_meses integer); Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON FUNCTION audit.fn_crear_proximas_particiones(p_meses integer) IS 'Crea las próximas N particiones mensuales desde el mes actual. Recomendado: ejecutar mensualmente con pg_cron o cron del SO. Ejemplo: SELECT audit.fn_crear_proximas_particiones(3);';


--
-- Name: fn_enmascarar_jsonb(jsonb, text[], text[]); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit.fn_enmascarar_jsonb(p_datos jsonb, p_enmascarar text[], p_excluir text[]) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER
    AS $$
DECLARE
    v_resultado JSONB := '{}';
    v_clave     TEXT;
    v_valor     JSONB;
BEGIN
    IF p_datos IS NULL THEN RETURN NULL; END IF;

    FOR v_clave, v_valor IN SELECT key, value FROM jsonb_each(p_datos) LOOP

        -- Omitir completamente si está en la lista de excluidos
        IF p_excluir IS NOT NULL AND v_clave = ANY(p_excluir) THEN
            CONTINUE;
        END IF;

        -- Enmascarar con SHA-256 si está en la lista de sensibles
        IF p_enmascarar IS NOT NULL AND v_clave = ANY(p_enmascarar) THEN
            IF v_valor IS NULL OR v_valor = 'null'::JSONB THEN
                v_resultado := v_resultado || jsonb_build_object(v_clave, NULL);
            ELSE
                v_resultado := v_resultado || jsonb_build_object(
                    v_clave,
                    '[SHA256:' || encode(
                        digest(v_valor #>> '{}', 'sha256'),
                        'hex'
                    ) || ']'
                );
            END IF;
            CONTINUE;
        END IF;

        -- Columna normal: incluir tal cual
        v_resultado := v_resultado || jsonb_build_object(v_clave, v_valor);
    END LOOP;

    RETURN v_resultado;
END;
$$;


ALTER FUNCTION audit.fn_enmascarar_jsonb(p_datos jsonb, p_enmascarar text[], p_excluir text[]) OWNER TO postgres;

--
-- Name: FUNCTION fn_enmascarar_jsonb(p_datos jsonb, p_enmascarar text[], p_excluir text[]); Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON FUNCTION audit.fn_enmascarar_jsonb(p_datos jsonb, p_enmascarar text[], p_excluir text[]) IS 'Procesa JSONB de una fila para auditoría: excluye columnas no deseadas y enmascara valores sensibles con SHA-256 (no reversible). Requiere extensión pgcrypto.';


--
-- Name: fn_estadisticas_particiones(); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit.fn_estadisticas_particiones() RETURNS TABLE(particion text, fecha_desde date, fecha_hasta date, total_filas bigint, tamanio_bytes bigint, tamanio_pretty text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'audit', 'public'
    AS $_$
BEGIN
    RETURN QUERY
    SELECT
        (schemaname || '.' || tablename)::TEXT,
        TO_DATE(
            REPLACE(REPLACE(tablename, 'registro_', ''), '_', '-') || '-01',
            'YYYY-MM-DD'
        ) AS fecha_desde,
        (TO_DATE(
            REPLACE(REPLACE(tablename, 'registro_', ''), '_', '-') || '-01',
            'YYYY-MM-DD'
        ) + INTERVAL '1 month - 1 day')::DATE AS fecha_hasta,
        (SELECT reltuples::BIGINT FROM pg_class WHERE relname = tablename)::BIGINT AS total_filas,
        pg_relation_size(schemaname || '.' || tablename)::BIGINT,
        pg_size_pretty(pg_relation_size(schemaname || '.' || tablename))
    FROM pg_tables
    WHERE schemaname = 'audit'
      AND tablename ~ '^registro_\d{4}_\d{2}$'
    ORDER BY tablename;
END;
$_$;


ALTER FUNCTION audit.fn_estadisticas_particiones() OWNER TO postgres;

--
-- Name: FUNCTION fn_estadisticas_particiones(); Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON FUNCTION audit.fn_estadisticas_particiones() IS 'Muestra el tamaño y número de filas de cada partición de audit.registro. Uso: SELECT * FROM audit.fn_estadisticas_particiones();';


--
-- Name: fn_evaluar_alertas(); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit.fn_evaluar_alertas() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'audit', 'public'
    AS $_$
DECLARE
    v_regla         audit.regla_alerta%ROWTYPE;
    v_alertas_new   INTEGER := 0;
    v_desde         TIMESTAMPTZ;
    v_ya_existe     BOOLEAN;
    v_registros     RECORD;
BEGIN
    -- Iterar sobre reglas activas
    FOR v_regla IN
        SELECT * FROM audit.regla_alerta WHERE activa = TRUE ORDER BY severidad DESC
    LOOP
        v_desde := NOW() - (v_regla.ventana_minutos || ' minutes')::INTERVAL;

        -- Evitar duplicar alertas: verificar si ya existe una alerta del mismo
        -- tipo y usuario en la última ventana
        FOR v_registros IN
            EXECUTE FORMAT(
                $q$
                SELECT
                    usuario_id,
                    usuario_nombre,
                    %L AS tabla_nombre,
                    COUNT(*) AS total,
                    ARRAY_AGG(audit_id ORDER BY audit_id) AS audit_ids
                FROM audit.registro
                WHERE audit_timestamp > %L
                  %s
                  %s
                GROUP BY usuario_id, usuario_nombre
                HAVING COUNT(*) >= %s
                $q$,
                COALESCE(v_regla.tabla_objetivo, 'MULTIPLES'),
                v_desde,
                CASE WHEN v_regla.tabla_objetivo IS NOT NULL
                     THEN 'AND tabla_nombre = ' || quote_literal(v_regla.tabla_objetivo)
                     ELSE '' END,
                CASE WHEN v_regla.operacion IS NOT NULL
                     THEN 'AND operacion::TEXT = ' || quote_literal(v_regla.operacion)
                     ELSE '' END,
                COALESCE(v_regla.umbral_count, 1)
            )
        LOOP
            -- Verificar si ya existe alerta reciente para este usuario+tipo
            SELECT EXISTS (
                SELECT 1 FROM audit.alerta
                WHERE tipo_alerta = v_regla.codigo
                  AND usuario_id  = v_registros.usuario_id
                  AND created_at  > v_desde
                  AND resuelta    = FALSE
            ) INTO v_ya_existe;

            IF NOT v_ya_existe THEN
                INSERT INTO audit.alerta (
                    tipo_alerta, severidad, descripcion,
                    tabla_nombre, usuario_id, usuario_nombre,
                    audit_ids, metadata
                ) VALUES (
                    v_regla.codigo,
                    v_regla.severidad,
                    FORMAT(
                        '[%s] %s — Usuario: %s | Eventos: %s | Ventana: %s min',
                        v_regla.codigo,
                        v_regla.descripcion,
                        COALESCE(v_registros.usuario_nombre, v_registros.usuario_id::TEXT, 'DESCONOCIDO'),
                        v_registros.total,
                        v_regla.ventana_minutos
                    ),
                    v_registros.tabla_nombre,
                    v_registros.usuario_id,
                    v_registros.usuario_nombre,
                    v_registros.audit_ids,
                    jsonb_build_object(
                        'regla_id',        v_regla.regla_id,
                        'umbral_count',    v_regla.umbral_count,
                        'ventana_minutos', v_regla.ventana_minutos,
                        'total_eventos',   v_registros.total
                    )
                );
                v_alertas_new := v_alertas_new + 1;
            END IF;
        END LOOP;
    END LOOP;

    RETURN v_alertas_new;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING '[AUDIT] Error en fn_evaluar_alertas: %', SQLERRM;
    RETURN -1;
END;
$_$;


ALTER FUNCTION audit.fn_evaluar_alertas() OWNER TO postgres;

--
-- Name: FUNCTION fn_evaluar_alertas(); Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON FUNCTION audit.fn_evaluar_alertas() IS 'Evalúa todas las reglas de alertas activas y genera registros en audit.alerta. Retorna el número de nuevas alertas generadas. Ejecutar periódicamente: SELECT audit.fn_evaluar_alertas(); Recomendado: cada 5 minutos via pg_cron.';


--
-- Name: fn_generar_reporte_retencion(); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit.fn_generar_reporte_retencion() RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_report JSONB;
BEGIN
    SELECT jsonb_build_object(
        'generado_en', NOW(),
        'politica_default_dias', 2190,
        'politica_default_descripcion', '6 años (cumplimiento tributario Ecuador)',
        'tablas_configuradas', (SELECT COUNT(*) FROM audit.tabla_config WHERE activo = TRUE),
        'total_eventos', (SELECT COUNT(*) FROM audit.registro),
        'primera_fecha', (SELECT MIN(audit_timestamp) FROM audit.registro),
        'ultima_fecha',  (SELECT MAX(audit_timestamp) FROM audit.registro),
        'particiones', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'nombre', schemaname || '.' || tablename,
                    'tamanio', pg_size_pretty(pg_relation_size(schemaname || '.' || tablename))
                )
                ORDER BY tablename
            )
            FROM pg_tables
            WHERE schemaname = 'audit' AND tablename LIKE 'registro_%'
        ),
        'tam_total_schema', pg_size_pretty(
            (SELECT SUM(pg_total_relation_size(schemaname || '.' || tablename))
             FROM pg_tables WHERE schemaname = 'audit')::BIGINT
        )
    ) INTO v_report;

    RETURN v_report;
END;
$$;


ALTER FUNCTION audit.fn_generar_reporte_retencion() OWNER TO postgres;

--
-- Name: FUNCTION fn_generar_reporte_retencion(); Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON FUNCTION audit.fn_generar_reporte_retencion() IS 'Genera reporte JSONB de retención de datos para compliance. Uso: SELECT audit.fn_generar_reporte_retencion();';


--
-- Name: fn_limpiar_particiones_antiguas(boolean); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit.fn_limpiar_particiones_antiguas(p_dry_run boolean DEFAULT true) RETURNS TABLE(particion text, fecha_desde date, fecha_hasta date, accion text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'audit', 'public'
    AS $_$
DECLARE
    v_retener_min_dias  INTEGER;
    v_corte_fecha       DATE;
    v_particion_schema  TEXT;
    v_particion_nombre  TEXT;
    v_fecha_particion   DATE;
    v_pg_particion      RECORD;
BEGIN
    -- Obtener la menor política de retención configurada (el más restrictivo)
    SELECT COALESCE(MIN(retener_dias), 2190)  -- default: 6 años
    INTO v_retener_min_dias
    FROM audit.tabla_config
    WHERE activo = TRUE;

    v_corte_fecha := CURRENT_DATE - v_retener_min_dias;

    RAISE NOTICE '[AUDIT RETENCIÓN] Política: % días | Corte: % | Dry-run: %',
                 v_retener_min_dias, v_corte_fecha, p_dry_run;

    -- Identificar particiones candidatas para eliminación
    FOR v_pg_particion IN
        SELECT
            schemaname,
            tablename,
            -- Extraer fecha de nombre: registro_YYYY_MM → YYYY-MM-01
            TO_DATE(
                REPLACE(
                    REPLACE(tablename, 'registro_', ''),
                    '_', '-'
                ) || '-01',
                'YYYY-MM-DD'
            ) AS fecha_particion
        FROM pg_tables
        WHERE schemaname = 'audit'
          AND tablename  ~ '^registro_\d{4}_\d{2}$'
        ORDER BY tablename
    LOOP
        -- La partición cubre [fecha_particion, fecha_particion + 1 mes)
        -- Si su fecha FIN es anterior al corte, es candidata
        IF (v_pg_particion.fecha_particion + INTERVAL '1 month')::DATE <= v_corte_fecha THEN

            particion   := v_pg_particion.schemaname || '.' || v_pg_particion.tablename;
            fecha_desde := v_pg_particion.fecha_particion;
            fecha_hasta := (v_pg_particion.fecha_particion + INTERVAL '1 month - 1 day')::DATE;

            IF p_dry_run THEN
                accion := 'DRY-RUN: se eliminaría ' || particion;
            ELSE
                EXECUTE 'DROP TABLE IF EXISTS ' || particion;
                accion := 'ELIMINADA: ' || particion;
                RAISE NOTICE '[AUDIT RETENCIÓN] %', accion;
            END IF;

            RETURN NEXT;
        END IF;
    END LOOP;

    IF p_dry_run THEN
        RAISE NOTICE '[AUDIT RETENCIÓN] Dry-run completado. Ejecutar con FALSE para eliminar.';
    ELSE
        RAISE NOTICE '[AUDIT RETENCIÓN] Limpieza completada.';
    END IF;
END;
$_$;


ALTER FUNCTION audit.fn_limpiar_particiones_antiguas(p_dry_run boolean) OWNER TO postgres;

--
-- Name: FUNCTION fn_limpiar_particiones_antiguas(p_dry_run boolean); Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON FUNCTION audit.fn_limpiar_particiones_antiguas(p_dry_run boolean) IS 'Elimina particiones mensuales de audit.registro que superaron el período de retención. Por defecto ejecuta en dry-run (no elimina). Uso: SELECT * FROM audit.fn_limpiar_particiones_antiguas(FALSE); -- para eliminar Recomendado: ejecutar mensualmente via pg_cron o cron del SO.';


--
-- Name: fn_limpiar_tokens_invalidos(); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit.fn_limpiar_tokens_invalidos() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM audit.usuario_refresh_tokens
    WHERE expires_at < NOW() 
       OR (revoked = TRUE AND revoked_at < NOW() - INTERVAL '7 days');
END;
$$;


ALTER FUNCTION audit.fn_limpiar_tokens_invalidos() OWNER TO postgres;

--
-- Name: fn_obtener_pk(text, text, jsonb); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit.fn_obtener_pk(p_schema text, p_tabla text, p_fila jsonb) RETURNS jsonb
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'audit', 'public', 'information_schema'
    AS $$
DECLARE
    v_pk_cols   TEXT[];
    v_pk_jsonb  JSONB := '{}';
    v_col       TEXT;
BEGIN
    -- Obtener columnas PK desde constraint del sistema
    SELECT ARRAY_AGG(kcu.column_name ORDER BY kcu.ordinal_position)
    INTO v_pk_cols
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema   = kcu.table_schema
        AND tc.table_name     = kcu.table_name
    WHERE tc.constraint_type = 'PRIMARY KEY'
      AND tc.table_schema    = p_schema
      AND tc.table_name      = p_tabla;

    -- Fallback si no se encontró PK (tablas sin PK explícita)
    IF v_pk_cols IS NULL OR array_length(v_pk_cols, 1) = 0 THEN
        RETURN jsonb_build_object('_no_pk', 'true');
    END IF;

    -- Extraer valores del JSONB de la fila
    FOREACH v_col IN ARRAY v_pk_cols LOOP
        v_pk_jsonb := v_pk_jsonb || jsonb_build_object(v_col, p_fila -> v_col);
    END LOOP;

    RETURN v_pk_jsonb;
END;
$$;


ALTER FUNCTION audit.fn_obtener_pk(p_schema text, p_tabla text, p_fila jsonb) OWNER TO postgres;

--
-- Name: FUNCTION fn_obtener_pk(p_schema text, p_tabla text, p_fila jsonb); Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON FUNCTION audit.fn_obtener_pk(p_schema text, p_tabla text, p_fila jsonb) IS 'Extrae los valores de la clave primaria de una fila serializada como JSONB. Consulta information_schema para descubrir las columnas PK dinámicamente. Soporta PKs compuestas.';


--
-- Name: fn_pausar_tabla(text); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit.fn_pausar_tabla(p_tabla text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'audit', 'public'
    AS $$
BEGIN
    -- Verificar que existe la config
    IF NOT EXISTS (SELECT 1 FROM audit.tabla_config WHERE tabla_nombre = p_tabla) THEN
        RAISE EXCEPTION 'Tabla % no está en audit.tabla_config', p_tabla;
    END IF;

    UPDATE audit.tabla_config SET activo = FALSE, updated_at = NOW()
    WHERE tabla_nombre = p_tabla;

    EXECUTE FORMAT(
        'DROP TRIGGER IF EXISTS trg_audit_%I ON public.%I',
        p_tabla, p_tabla
    );

    RAISE NOTICE '[AUDIT] Auditoría PAUSADA para tabla: %', p_tabla;
END;
$$;


ALTER FUNCTION audit.fn_pausar_tabla(p_tabla text) OWNER TO postgres;

--
-- Name: fn_reactivar_tabla(text); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit.fn_reactivar_tabla(p_tabla text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'audit', 'public'
    AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM audit.tabla_config WHERE tabla_nombre = p_tabla) THEN
        RAISE EXCEPTION 'Tabla % no está en audit.tabla_config', p_tabla;
    END IF;

    UPDATE audit.tabla_config SET activo = TRUE, updated_at = NOW()
    WHERE tabla_nombre = p_tabla;

    EXECUTE FORMAT(
        'DROP TRIGGER IF EXISTS trg_audit_%I ON public.%I; '
        'CREATE TRIGGER trg_audit_%I '
        'AFTER INSERT OR UPDATE OR DELETE ON public.%I '
        'FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar()',
        p_tabla, p_tabla, p_tabla, p_tabla
    );

    RAISE NOTICE '[AUDIT] Auditoría REACTIVADA para tabla: %', p_tabla;
END;
$$;


ALTER FUNCTION audit.fn_reactivar_tabla(p_tabla text) OWNER TO postgres;

--
-- Name: fn_registrar(); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit.fn_registrar() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'audit', 'public'
    AS $$
DECLARE
    -- Configuración de la tabla
    v_config            audit.tabla_config%ROWTYPE;

    -- Contexto de sesión
    v_usuario_id        UUID;
    v_usuario_nom       TEXT;
    v_ip                INET;
    v_sesion            TEXT;
    v_app               TEXT;

    -- Serialización de filas
    v_fila_old          JSONB;
    v_fila_new          JSONB;
    v_datos_antes       JSONB;
    v_datos_despues     JSONB;

    -- Diff columna a columna
    v_diff              JSONB    := '{}'::JSONB;
    v_campos            TEXT[]   := ARRAY[]::TEXT[];
    v_col               TEXT;
    v_val_antes         JSONB;
    v_val_despues       JSONB;

    -- PK
    v_pk                JSONB;

    -- Columnas sensibles de la config
    v_enmascarar        TEXT[];
    v_excluir           TEXT[];

    -- Marcas de tiempo para duracion
    v_inicio            TIMESTAMPTZ := CLOCK_TIMESTAMP();
BEGIN
    -- =========================================================================
    -- 1. Leer configuración de la tabla (si no está configurada, no auditar)
    -- =========================================================================
    SELECT * INTO v_config
    FROM audit.tabla_config
    WHERE tabla_nombre = TG_TABLE_NAME;

    -- Si no hay configuración o está desactivada → pasar sin auditar
    IF NOT FOUND OR NOT v_config.activo THEN
        RETURN COALESCE(NEW, OLD);
    END IF;

    -- Filtrar por operación habilitada
    IF TG_OP = 'INSERT' AND NOT v_config.auditar_insert THEN RETURN NEW; END IF;
    IF TG_OP = 'UPDATE' AND NOT v_config.auditar_update THEN RETURN NEW; END IF;
    IF TG_OP = 'DELETE' AND NOT v_config.auditar_delete THEN RETURN OLD; END IF;

    -- =========================================================================
    -- 2. Leer contexto de sesión inyectado por la aplicación
    -- =========================================================================
    BEGIN
        v_usuario_id  := NULLIF(current_setting('app.usuario_id',  TRUE), '')::UUID;
        v_usuario_nom := NULLIF(current_setting('app.usuario_nom',  TRUE), '');
        v_ip          := NULLIF(current_setting('app.ip_address',  TRUE), '')::INET;
        v_sesion      := NULLIF(current_setting('app.sesion_id',   TRUE), '');
        v_app         := COALESCE(NULLIF(current_setting('app.nombre', TRUE), ''), 'SIGEPAA');
    EXCEPTION WHEN OTHERS THEN
        -- No bloquear la transacción si falla la lectura del contexto
        v_usuario_id  := NULL;
        v_usuario_nom := NULL;
        v_ip          := NULL;
        v_sesion      := NULL;
        v_app         := 'SIGEPAA';
    END;

    -- =========================================================================
    -- 3. Preparar columnas sensibles
    -- =========================================================================
    v_enmascarar := COALESCE(v_config.columnas_enmascarar, ARRAY[]::TEXT[]);
    v_excluir    := COALESCE(v_config.columnas_excluidas,  ARRAY[]::TEXT[]);

    -- =========================================================================
    -- 4. Serializar filas OLD y NEW aplicando enmascaramiento
    -- =========================================================================
    IF TG_OP IN ('UPDATE', 'DELETE') THEN
        v_fila_old    := row_to_json(OLD)::JSONB;
        v_datos_antes := audit.fn_enmascarar_jsonb(v_fila_old, v_enmascarar, v_excluir);
    END IF;

    IF TG_OP IN ('INSERT', 'UPDATE') THEN
        v_fila_new    := row_to_json(NEW)::JSONB;
        v_datos_despues := audit.fn_enmascarar_jsonb(v_fila_new, v_enmascarar, v_excluir);
    END IF;

    -- =========================================================================
    -- 5. Calcular diff solo en UPDATE y solo en nivel STANDARD o FULL
    -- =========================================================================
    IF TG_OP = 'UPDATE' AND v_config.nivel != 'MINIMAL' THEN
        FOR v_col IN SELECT key FROM jsonb_each(v_datos_despues) LOOP
            v_val_antes   := v_datos_antes  -> v_col;
            v_val_despues := v_datos_despues -> v_col;

            IF v_val_antes IS DISTINCT FROM v_val_despues THEN
                v_campos := v_campos || v_col;
                v_diff   := v_diff || jsonb_build_object(
                    v_col,
                    jsonb_build_object('antes', v_val_antes, 'despues', v_val_despues)
                );
            END IF;
        END LOOP;

        -- Optimización: si nada cambió realmente (ej: UPDATE sin cambios reales),
        -- no registrar el evento para evitar ruido en la auditoría.
        IF array_length(v_campos, 1) IS NULL THEN
            RETURN NEW;
        END IF;
    END IF;

    -- =========================================================================
    -- 6. En nivel MINIMAL → no guardar filas completas, solo metadatos
    -- =========================================================================
    IF v_config.nivel = 'MINIMAL' THEN
        v_datos_antes   := NULL;
        v_datos_despues := NULL;
        v_diff          := '{}'::JSONB;
    END IF;

    -- =========================================================================
    -- 7. Obtener valor de la PK de la fila afectada
    -- =========================================================================
    v_pk := audit.fn_obtener_pk(
        TG_TABLE_SCHEMA,
        TG_TABLE_NAME,
        COALESCE(v_fila_new, v_fila_old)
    );

    -- =========================================================================
    -- 8. Insertar en audit.registro
    -- =========================================================================
    INSERT INTO audit.registro (
        audit_timestamp,
        -- Contexto de quién
        usuario_id, usuario_nombre, ip_address, sesion_id, app_nombre,
        -- Contexto de qué
        schema_nombre, tabla_nombre, operacion, pk_valor,
        -- Datos
        datos_antes, datos_despues, campos_cambiados, diff_jsonb,
        -- Métricas
        duracion_ms,
        query_hash
    ) VALUES (
        CLOCK_TIMESTAMP(),
        v_usuario_id, v_usuario_nom, v_ip, v_sesion, v_app,
        TG_TABLE_SCHEMA, TG_TABLE_NAME, TG_OP::audit.audit_operacion, v_pk,
        v_datos_antes, v_datos_despues, v_campos, v_diff,
        EXTRACT(EPOCH FROM (CLOCK_TIMESTAMP() - v_inicio)) * 1000,
        md5(current_query())
    );

    RETURN COALESCE(NEW, OLD);

EXCEPTION WHEN OTHERS THEN
    -- =========================================================================
    -- 9. Manejo de errores: NO bloquear la transacción de negocio
    --    por un fallo de auditoría. Solo registrar advertencia.
    -- =========================================================================
    RAISE WARNING '[AUDIT] Error en fn_registrar para tabla=% operacion=%: %',
                  TG_TABLE_NAME, TG_OP, SQLERRM;
    RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION audit.fn_registrar() OWNER TO postgres;

--
-- Name: FUNCTION fn_registrar(); Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON FUNCTION audit.fn_registrar() IS 'Función trigger genérica AFTER INSERT/UPDATE/DELETE. Se aplica a todas las tablas configuradas en audit.tabla_config. SECURITY DEFINER: ejecuta con privilegios del propietario del schema. Nunca bloquea la transacción de negocio (errores son solo WARNING). Requiere: audit.fn_enmascarar_jsonb(), audit.fn_obtener_pk().';


--
-- Name: fn_registrar_acceso(uuid, text, text, inet, text, text, jsonb); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit.fn_registrar_acceso(p_usuario_id uuid, p_usuario_name text, p_evento text, p_ip inet, p_user_agent text, p_motivo text DEFAULT NULL::text, p_metadata jsonb DEFAULT '{}'::jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO audit.sesion (
        usuario_id,
        usuario_nombre,
        evento,
        ip_address,
        user_agent,
        motivo_fallo,
        metadata
    ) VALUES (
        p_usuario_id,
        p_usuario_name,
        p_evento,
        p_ip,
        p_user_agent,
        p_motivo,
        p_metadata
    );
END;
$$;


ALTER FUNCTION audit.fn_registrar_acceso(p_usuario_id uuid, p_usuario_name text, p_evento text, p_ip inet, p_user_agent text, p_motivo text, p_metadata jsonb) OWNER TO postgres;

--
-- Name: fn_resolver_alerta(bigint, uuid, text); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit.fn_resolver_alerta(p_alerta_id bigint, p_usuario_id uuid, p_nota text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    UPDATE audit.alerta
    SET resuelta       = TRUE,
        resuelta_por   = p_usuario_id,
        resuelta_at    = NOW(),
        resolucion_nota = p_nota
    WHERE alerta_id = p_alerta_id
      AND resuelta  = FALSE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Alerta % no encontrada o ya estaba resuelta', p_alerta_id;
    END IF;
END;
$$;


ALTER FUNCTION audit.fn_resolver_alerta(p_alerta_id bigint, p_usuario_id uuid, p_nota text) OWNER TO postgres;

--
-- Name: fn_set_contexto(text, text, text, text, text); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit.fn_set_contexto(p_usuario_id text, p_usuario_nom text DEFAULT NULL::text, p_ip_address text DEFAULT NULL::text, p_sesion_id text DEFAULT NULL::text, p_app_nombre text DEFAULT 'SIGEPAA'::text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    PERFORM set_config('app.usuario_id',  COALESCE(p_usuario_id,  ''), TRUE);
    PERFORM set_config('app.usuario_nom', COALESCE(p_usuario_nom, ''), TRUE);
    PERFORM set_config('app.ip_address',  COALESCE(p_ip_address,  ''), TRUE);
    PERFORM set_config('app.sesion_id',   COALESCE(p_sesion_id,   ''), TRUE);
    PERFORM set_config('app.nombre',      COALESCE(p_app_nombre,  'SIGEPAA'), TRUE);
END;
$$;


ALTER FUNCTION audit.fn_set_contexto(p_usuario_id text, p_usuario_nom text, p_ip_address text, p_sesion_id text, p_app_nombre text) OWNER TO postgres;

--
-- Name: FUNCTION fn_set_contexto(p_usuario_id text, p_usuario_nom text, p_ip_address text, p_sesion_id text, p_app_nombre text); Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON FUNCTION audit.fn_set_contexto(p_usuario_id text, p_usuario_nom text, p_ip_address text, p_sesion_id text, p_app_nombre text) IS 'Inicializa el contexto de auditoría para la transacción actual. Llamar al inicio de cada request HTTP desde el backend. Ejemplo: SELECT audit.fn_set_contexto(''user-uuid'', ''Admin'', ''10.0.0.1'', ''jti-123'');';


--
-- Name: fn_update_timestamp(); Type: FUNCTION; Schema: documents; Owner: postgres
--

CREATE FUNCTION documents.fn_update_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION documents.fn_update_timestamp() OWNER TO postgres;

--
-- Name: broadcast_realtime_notification(); Type: FUNCTION; Schema: notifications; Owner: postgres
--

CREATE FUNCTION notifications.broadcast_realtime_notification() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    payload json;
    v_codigo_canal varchar;
    v_codigo_estado varchar;
BEGIN
    SELECT codigo INTO v_codigo_canal FROM notifications.canal WHERE id_canal = NEW.id_canal;
    SELECT codigo INTO v_codigo_estado FROM notifications.estado_envio WHERE id_estado_envio = NEW.id_estado_envio;

    -- Solo emitimos en tiempo real si el canal es IN_APP o PUSH y está pendiente de entrega
    IF v_codigo_canal IN ('IN_APP', 'PUSH') AND v_codigo_estado = 'PENDING' THEN
        payload = json_build_object(
            'notification_id', NEW.notification_id,
            'id_usuario', NEW.id_usuario,
            'titulo', NEW.titulo,
            'cuerpo', NEW.cuerpo,
            'canal', v_codigo_canal,
            'metadata', NEW.metadata,
            'entidad_tipo', NEW.entidad_tipo,
            'entidad_id', NEW.entidad_id,
            'created_at', NEW.created_at
        );
        
        -- pg_notify para WebSockets del client-gateway
        PERFORM pg_notify('user_channel_' || NEW.id_usuario::text, payload::text);
        PERFORM pg_notify('global_notifications_channel', payload::text);
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION notifications.broadcast_realtime_notification() OWNER TO postgres;

--
-- Name: enviar_notificacion(uuid, character varying, text, character varying, character varying, character varying, uuid, jsonb); Type: FUNCTION; Schema: notifications; Owner: postgres
--

CREATE FUNCTION notifications.enviar_notificacion(p_id_usuario uuid, p_titulo character varying, p_cuerpo text, p_codigo_canal character varying DEFAULT 'IN_APP'::character varying, p_codigo_prioridad character varying DEFAULT 'NORMAL'::character varying, p_entidad_tipo character varying DEFAULT NULL::character varying, p_entidad_id uuid DEFAULT NULL::uuid, p_metadata jsonb DEFAULT '{}'::jsonb) RETURNS uuid
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_notif_id uuid;
    v_id_canal integer;
    v_id_prioridad integer;
    v_id_estado_pendiente integer;
BEGIN
    -- Resolver IDs a partir de códigos legibles (DIP - Dependency Inversion Principle)
    SELECT id_canal INTO v_id_canal FROM notifications.canal WHERE codigo = p_codigo_canal AND activo = true;
    IF NOT FOUND THEN 
        RAISE EXCEPTION 'Canal de notificación no válido o inactivo: %', p_codigo_canal; 
    END IF;

    SELECT id_prioridad INTO v_id_prioridad FROM notifications.prioridad WHERE codigo = p_codigo_prioridad;
    IF NOT FOUND THEN 
        RAISE EXCEPTION 'Prioridad de notificación no válida: %', p_codigo_prioridad; 
    END IF;

    SELECT id_estado_envio INTO v_id_estado_pendiente FROM notifications.estado_envio WHERE codigo = 'PENDING';

    -- Insertar Registro Principal
    INSERT INTO notifications.user_notification (
        id_usuario, titulo, cuerpo, id_canal, id_prioridad, id_estado_envio, entidad_tipo, entidad_id, metadata
    ) VALUES (
        p_id_usuario, p_titulo, p_cuerpo, v_id_canal, v_id_prioridad, v_id_estado_pendiente, p_entidad_tipo, p_entidad_id, p_metadata
    ) RETURNING notification_id INTO v_notif_id;
    
    -- Crear el primer registro en el log de despacho
    INSERT INTO notifications.user_notification_dispatch_log (
        notification_id, id_estado_envio, provider_response
    ) VALUES (
        v_notif_id, v_id_estado_pendiente, '{}'::jsonb
    );
    
    RETURN v_notif_id;
END;
$$;


ALTER FUNCTION notifications.enviar_notificacion(p_id_usuario uuid, p_titulo character varying, p_cuerpo text, p_codigo_canal character varying, p_codigo_prioridad character varying, p_entidad_tipo character varying, p_entidad_id uuid, p_metadata jsonb) OWNER TO postgres;

--
-- Name: fn_validar_usuario_notificacion(); Type: FUNCTION; Schema: notifications; Owner: postgres
--

CREATE FUNCTION notifications.fn_validar_usuario_notificacion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Validamos que el ID exista en la tabla de empleados O en la tabla de clientes
    IF EXISTS (SELECT 1 FROM public.usuarios WHERE usuario_id = NEW.id_usuario) OR
       EXISTS (SELECT 1 FROM public.cliente_usuario WHERE cliente_usuario_id = NEW.id_usuario) THEN
        RETURN NEW;
    END IF;

    RAISE EXCEPTION 'El id_usuario (%) no existe en public.usuarios ni en public.cliente_usuario', NEW.id_usuario;
END;
$$;


ALTER FUNCTION notifications.fn_validar_usuario_notificacion() OWNER TO postgres;

--
-- Name: set_updated_at(); Type: FUNCTION; Schema: notifications; Owner: postgres
--

CREATE FUNCTION notifications.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION notifications.set_updated_at() OWNER TO postgres;

--
-- Name: actualizar_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.actualizar_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Actualiza updated_at SOLO si hay cambios reales (opcional, pero evita actualizaciones innecesarias)
    IF row(NEW.*) IS DISTINCT FROM row(OLD.*) THEN
        NEW.updated_at = NOW();
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.actualizar_updated_at() OWNER TO postgres;

--
-- Name: fn_actualizar_estado_activo(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_actualizar_estado_activo() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- 1. Desactiva el estado anterior en el historial
    UPDATE historial_estados_acometida
    SET activo = FALSE
    WHERE acometida_id = NEW.acometida_id AND activo = TRUE;

    -- 2. Sincroniza el estado en la tabla principal (OPCIONAL)
    UPDATE acometida
    SET estado_id = NEW.estado_id
    WHERE acometida_id = NEW.acometida_id;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_actualizar_estado_activo() OWNER TO postgres;

--
-- Name: fn_auditar_cambio_estado(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_auditar_cambio_estado() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_usuario_id UUID := 'e3400d18-86e1-4eee-9a8b-3e7eaf812a95'::UUID;
BEGIN
    BEGIN
        v_usuario_id := current_setting('app.usuario_id', TRUE)::UUID;
    EXCEPTION WHEN OTHERS THEN
        v_usuario_id := 'e3400d18-86e1-4eee-9a8b-3e7eaf812a95'::UUID;
    END;

    INSERT INTO seguimiento_lectura (
        acometida_id,
        lectura_id,
        usuario_id,
        lectura_estado_id,
        lectura_estado_anterior_id,
        accion,
        descripcion
    ) VALUES (
        NEW.acometida_id,
        NEW.lectura_id,
        v_usuario_id,
        NEW.lectura_estado_id,
        OLD.lectura_estado_id,
        CASE WHEN TG_OP = 'INSERT' THEN 'CREACION' ELSE 'CAMBIO ESTADO' END,
        CASE WHEN TG_OP = 'UPDATE' THEN
            'De ' || COALESCE((SELECT nombre FROM lectura_estado WHERE lectura_estado_id = OLD.lectura_estado_id), 'DESCONOCIDO') ||
            ' a ' || COALESCE((SELECT nombre FROM lectura_estado WHERE lectura_estado_id = NEW.lectura_estado_id), 'DESCONOCIDO')
        ELSE 'Nueva lectura creada (automatica)'
        END
    );

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_auditar_cambio_estado() OWNER TO postgres;

--
-- Name: fn_auto_cierre_auditoria(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_auto_cierre_auditoria() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- A. YA ESTABA COMPLETO → se queda cerrado (bloqueo de seguridad)
    IF OLD.completo = TRUE AND NEW.completo = TRUE THEN
        NULL;

    -- B. SE MARCA MANUALMENTE COMO COMPLETO
    ELSIF NEW.completo = TRUE AND OLD.completo = FALSE THEN
        NEW.fecha_cierre := NOW();

    -- C. LLEGA AL 100% AUTOMÁTICAMENTE
    ELSIF NEW.total_completadas >= NEW.total_esperado AND NEW.total_esperado > 0 THEN
        IF NOT NEW.completo THEN
            NEW.completo     := TRUE;
            NEW.fecha_cierre := NOW();
        END IF;

    -- D. BAJA DEL 100% (por borrado) y no fue cerrado manualmente
    ELSIF NEW.total_completadas < NEW.total_esperado AND NEW.usuario_supervisor_id IS NULL THEN
        NEW.completo     := FALSE;
        NEW.fecha_cierre := NULL;
    END IF;

    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_auto_cierre_auditoria() OWNER TO postgres;

--
-- Name: fn_block_duplicate_lectura(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_block_duplicate_lectura() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    cnt_normal INTEGER := 0;
    cnt_especial INTEGER := 0;
    mes CHAR(7);
    inicio_periodo DATE;
    fin_periodo DATE;
    existe_periodo BOOLEAN := FALSE;
BEGIN
    -- Permitir siempre lecturas con valor 0 (lecturas iniciales / cambios de medidor)
    IF COALESCE(NEW.lectura_actual, 0) = 0 THEN
        RETURN NEW;
    END IF;

    mes := fn_mes_lectura(NEW.fecha_lectura);

    SELECT EXISTS (SELECT 1 FROM siguiente_lectura WHERE siguiente_lectura.acometida_id = NEW.acometida_id),
           fecha_inicio_periodo,
           fecha_fin_periodo
    INTO existe_periodo, inicio_periodo, fin_periodo
    FROM siguiente_lectura
    WHERE siguiente_lectura.acometida_id = NEW.acometida_id;

    IF NOT existe_periodo THEN
        IF NEW.novedad LIKE '%INICIAL%' OR NEW.novedad LIKE '%CAMBIO DE MEDIDOR%' THEN
            RETURN NEW;
        ELSE
            RAISE EXCEPTION 'Primera lectura DEBE ser INICIAL o CAMBIO DE MEDIDOR para acometida %', NEW.acometida_id;
        END IF;
    END IF;

    -- Validaciones de fecha comentadas para permitir flexibilidad
    -- IF NEW.fecha_lectura::DATE < inicio_periodo THEN ... END IF;
    -- IF NEW.fecha_lectura::DATE > fin_periodo THEN ... END IF;

    SELECT COUNT(*) INTO cnt_normal
    FROM lectura
    WHERE lectura.acometida_id = NEW.acometida_id
      AND fn_mes_lectura(lectura.fecha_lectura) = mes
      AND lectura.novedad NOT LIKE '%INICIAL%'
      AND lectura.novedad NOT LIKE '%CAMBIO DE MEDIDOR%';

    SELECT COUNT(*) INTO cnt_especial
    FROM lectura
    WHERE lectura.acometida_id = NEW.acometida_id
      AND fn_mes_lectura(lectura.fecha_lectura) = mes
      AND (lectura.novedad LIKE '%INICIAL%' OR lectura.novedad LIKE '%CAMBIO DE MEDIDOR%');

    IF (NEW.novedad NOT LIKE '%INICIAL%' AND NEW.novedad NOT LIKE '%CAMBIO DE MEDIDOR%' AND cnt_normal >= 1)
       OR ((NEW.novedad LIKE '%INICIAL%' OR NEW.novedad LIKE '%CAMBIO DE MEDIDOR%') AND cnt_especial >= 2) THEN
        RAISE EXCEPTION 'Duplicado: Maximo % % por mes (%)',
              CASE WHEN NEW.novedad LIKE '%INICIAL%' OR NEW.novedad LIKE '%CAMBIO DE MEDIDOR%' THEN 2 ELSE 1 END,
              CASE WHEN NEW.novedad LIKE '%INICIAL%' OR NEW.novedad LIKE '%CAMBIO DE MEDIDOR%' THEN 'especiales' ELSE 'normales' END,
              mes;
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_block_duplicate_lectura() OWNER TO postgres;

--
-- Name: fn_cliente_usuario_lifecycle(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_cliente_usuario_lifecycle() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN

    -- A) INSERT → siempre PENDING_VERIFICATION (deben verificar email)
    IF TG_OP = 'INSERT' THEN
        NEW.estado_cliente_usuario_id := 2;
        NEW.email_verified            := COALESCE(NEW.email_verified, false);
        NEW.telefono_verified         := COALESCE(NEW.telefono_verified, false);
        NEW.failed_attempts           := COALESCE(NEW.failed_attempts, 0);
        NEW.is_locked_out             := false;
        RETURN NEW;
    END IF;

    -- B/C) Verificación de email
    IF NEW.email_verified IS DISTINCT FROM OLD.email_verified THEN
        IF NEW.email_verified = TRUE AND OLD.estado_cliente_usuario_id = 2 THEN
            NEW.estado_cliente_usuario_id := 1; -- ACTIVE
            NEW.verification_token        := NULL;
            NEW.verification_expiry       := NULL;

        ELSIF NEW.email_verified = FALSE AND OLD.estado_cliente_usuario_id = 1 THEN
            NEW.estado_cliente_usuario_id := 2; -- PENDING_VERIFICATION
        END IF;
    END IF;

    -- D/E) Intentos fallidos
    IF NEW.failed_attempts IS DISTINCT FROM OLD.failed_attempts THEN
        IF NEW.failed_attempts >= 5 AND OLD.estado_cliente_usuario_id NOT IN (3, 5) THEN
            NEW.estado_cliente_usuario_id := 4; -- LOCKED
            NEW.lockout_until             := NOW() + INTERVAL '30 minutes';
            NEW.is_locked_out             := TRUE;

        ELSIF NEW.failed_attempts = 0 AND OLD.estado_cliente_usuario_id = 4 THEN
            NEW.estado_cliente_usuario_id := 1; -- ACTIVE
            NEW.lockout_until             := NULL;
            NEW.is_locked_out             := FALSE;
        END IF;
    END IF;

    -- F) Borrado lógico
    IF NEW.deleted_at IS DISTINCT FROM OLD.deleted_at AND NEW.deleted_at IS NOT NULL THEN
        NEW.estado_cliente_usuario_id := 5; -- INACTIVE
    END IF;

    -- G) Limpieza al suspender o desactivar
    IF NEW.estado_cliente_usuario_id IN (3, 5) AND OLD.estado_cliente_usuario_id NOT IN (3, 5) THEN
        NEW.verification_token  := NULL;
        NEW.verification_expiry := NULL;
        NEW.reset_token         := NULL;
        NEW.reset_token_expiry  := NULL;
        NEW.lockout_until       := NULL;
        NEW.is_locked_out       := FALSE;
    END IF;

    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_cliente_usuario_lifecycle() OWNER TO postgres;

--
-- Name: FUNCTION fn_cliente_usuario_lifecycle(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.fn_cliente_usuario_lifecycle() IS 'Ciclo de vida de public.cliente_usuario (clientes EXTERNOS):
 INSERT             → estado 2 (PENDING_VERIFICATION) siempre.
 email_verified=T   → ACTIVE (1) si venía de PENDING_VERIFICATION.
 failed_attempts>=5 → LOCKED (4) + lockout 30 min.
 failed_attempts=0 desde LOCKED → ACTIVE (1).
 deleted_at IS NOT NULL → INACTIVE (5).
 Estado 3/5 → limpia todos los tokens de seguridad.';


--
-- Name: fn_control_siguiente_lectura_mensual(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_control_siguiente_lectura_mensual() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    fecha_base DATE;
    ultima_fecha_ideal DATE;
    proxima_fecha_ideal DATE;
    v_acometida_id VARCHAR(10) := NEW.acometida_id;

    -- Variables para auditoria
    diff_months INTEGER;
    tipo_anomalia VARCHAR(50);
    mensaje TEXT;
    consumo_calc NUMERIC(10,2);
BEGIN
    PERFORM 1 FROM acometida WHERE acometida.acometida_id = v_acometida_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Acometida % no encontrada', v_acometida_id;
    END IF;

    SELECT COALESCE(fecha_inicio_lecturas, NEW.fecha_lectura::DATE) INTO fecha_base
    FROM acometida WHERE acometida.acometida_id = v_acometida_id;

    IF fecha_base IS NULL THEN
        fecha_base := NEW.fecha_lectura::DATE;
        UPDATE acometida SET fecha_inicio_lecturas = fecha_base WHERE acometida.acometida_id = v_acometida_id;
    END IF;

    SELECT fecha_siguiente_lectura INTO ultima_fecha_ideal
    FROM siguiente_lectura WHERE siguiente_lectura.acometida_id = v_acometida_id;

    IF ultima_fecha_ideal IS NULL THEN
        ultima_fecha_ideal := fecha_base;
    END IF;

    -- ==========================================
    -- LOGICA DE AUDITORIA Y CONTROL DE SALTOS
    -- ==========================================
    diff_months := (EXTRACT(year FROM NEW.fecha_lectura::DATE) - EXTRACT(year FROM ultima_fecha_ideal)) * 12 +
                   (EXTRACT(month FROM NEW.fecha_lectura::DATE) - EXTRACT(month FROM ultima_fecha_ideal));

    consumo_calc := COALESCE(NEW.lectura_actual, 0) - COALESCE(NEW.lectura_anterior, 0);

    IF diff_months > 0 THEN
        -- Hubo un salto de meses hacia el futuro
        tipo_anomalia := 'SALTO_MESES_FUTURO';
        mensaje := 'Se insertó una lectura adelantada por ' || diff_months || ' meses. Riesgo de facturación acumulada (Consumo calculado en lectura: ' || consumo_calc || ' m3).';

        IF diff_months >= 12 THEN
            tipo_anomalia := 'SALTO_FUTURO_EXTREMO';
            mensaje := 'ALERTA CRÍTICA: Lectura insertada muy en el futuro (' || diff_months || ' meses). Alta probabilidad de error de digitación de año.';
        END IF;

        -- Registrar anomalía en la nueva tabla
        INSERT INTO public.alerta_lectura_anomala (
            acometida_id, lectura_id, tipo_anomalia, fecha_esperada, fecha_registrada, meses_diferencia, lectura_actual, consumo_calculado, mensaje_sistema
        ) VALUES (
            v_acometida_id, NEW.lectura_id, tipo_anomalia, ultima_fecha_ideal, NEW.fecha_lectura::DATE, diff_months, NEW.lectura_actual, consumo_calc, mensaje
        );

        -- Ajustamos la fecha ideal al nuevo mes para que el sistema "alcance" al usuario
        ultima_fecha_ideal := NEW.fecha_lectura::DATE;

    ELSIF diff_months < 0 THEN
        -- Lectura retroactiva (meses en el pasado respecto a lo que la base de datos esperaba)
        tipo_anomalia := 'LECTURA_RETROACTIVA';
        mensaje := 'Se insertó una lectura antigua (' || ABS(diff_months) || ' meses en el pasado). Revisar si es una regularización o error humano.';

        INSERT INTO public.alerta_lectura_anomala (
            acometida_id, lectura_id, tipo_anomalia, fecha_esperada, fecha_registrada, meses_diferencia, lectura_actual, consumo_calculado, mensaje_sistema
        ) VALUES (
            v_acometida_id, NEW.lectura_id, tipo_anomalia, ultima_fecha_ideal, NEW.fecha_lectura::DATE, diff_months, NEW.lectura_actual, consumo_calc, mensaje
        );

        -- Al ser retroactiva, NO avanzamos el siguiente_lectura porque ya estamos en un mes más adelantado en el presente
        RETURN NEW;
    END IF;
    -- ==========================================

    proxima_fecha_ideal := ultima_fecha_ideal + INTERVAL '1 month';

    IF EXTRACT(DAY FROM proxima_fecha_ideal) <> EXTRACT(DAY FROM fecha_base) THEN
        proxima_fecha_ideal := date_trunc('month', proxima_fecha_ideal) + INTERVAL '1 month - 1 day';
    END IF;

    INSERT INTO siguiente_lectura (
        acometida_id, ultima_lectura_id, fecha_siguiente_lectura,
        fecha_inicio_periodo, fecha_fin_periodo, created_at, updated_at
    ) VALUES (
        v_acometida_id, NEW.lectura_id, proxima_fecha_ideal,
        date_trunc('month', proxima_fecha_ideal),
        (date_trunc('month', proxima_fecha_ideal) + INTERVAL '1 month' - INTERVAL '1 day'),
        NOW(), NOW()
    )
    ON CONFLICT (acometida_id) DO UPDATE SET
        ultima_lectura_id = EXCLUDED.ultima_lectura_id,
        fecha_siguiente_lectura = EXCLUDED.fecha_siguiente_lectura,
        fecha_inicio_periodo = date_trunc('month', EXCLUDED.fecha_siguiente_lectura),
        fecha_fin_periodo = (date_trunc('month', EXCLUDED.fecha_siguiente_lectura) + INTERVAL '1 month' - INTERVAL '1 day'),
        updated_at = NOW();

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_control_siguiente_lectura_mensual() OWNER TO postgres;

--
-- Name: fn_inicializar_siguiente_lectura(character varying, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_inicializar_siguiente_lectura(p_acometida_id character varying, p_fecha_base date) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    IF p_acometida_id IS NULL THEN
        RAISE EXCEPTION 'Parametro p_acometida_id requerido';
    END IF;
    IF p_fecha_base IS NULL THEN
        RAISE EXCEPTION 'Parametro p_fecha_base requerido';
    END IF;

    DECLARE
        proxima_fecha_ideal DATE := p_fecha_base + INTERVAL '1 month';
        dia_base INTEGER := EXTRACT(DAY FROM p_fecha_base);
    BEGIN
        IF EXTRACT(DAY FROM proxima_fecha_ideal) <> dia_base THEN
            proxima_fecha_ideal := date_trunc('month', proxima_fecha_ideal) + INTERVAL '1 month - 1 day';
        END IF;

        INSERT INTO siguiente_lectura (
            acometida_id,
            ultima_lectura_id,
            fecha_siguiente_lectura,
            fecha_inicio_periodo,
            fecha_fin_periodo,
            created_at,
            updated_at
        ) VALUES (
            p_acometida_id,
            NULL,
            proxima_fecha_ideal,
            date_trunc('month', proxima_fecha_ideal),
            (date_trunc('month', proxima_fecha_ideal) + INTERVAL '1 month' - INTERVAL '1 day'),
            NOW(),
            NOW()
        )
        ON CONFLICT (acometida_id) DO NOTHING;

        RAISE NOTICE 'SiguienteLectura inicializada para % en fecha %', p_acometida_id, proxima_fecha_ideal;
    END;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error al inicializar SiguienteLectura para %: %', p_acometida_id, SQLERRM;
        RAISE;
END;
$$;


ALTER FUNCTION public.fn_inicializar_siguiente_lectura(p_acometida_id character varying, p_fecha_base date) OWNER TO postgres;

--
-- Name: fn_insert_cambio_medidor_reading(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_insert_cambio_medidor_reading() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    pend_id INTEGER;
    fecha_base DATE := CURRENT_DATE;
BEGIN
    IF NEW.numero_medidor = OLD.numero_medidor THEN
        RETURN NEW;
    END IF;

    SELECT lectura_estado_id INTO pend_id
    FROM lectura_estado WHERE codigo = 'PEND' LIMIT 1;

    IF pend_id IS NULL THEN
        RAISE EXCEPTION 'Estado PEND no encontrado';
    END IF;

    INSERT INTO lectura (
        acometida_id, fecha_lectura, hora_lectura, sector, cuenta, clave_catastral,
        valor_lectura, tasa_alcantarillado, lectura_anterior, lectura_actual,
        codigo_ingreso_renta, novedad, codigo_ingreso, tipo_novedad_lectura_id, lectura_estado_id
    ) VALUES (
        NEW.acometida_id, fecha_base, CURRENT_TIME, NEW.sector, NEW.cuenta, NEW.clave_catastral,
        0, 0, 0, 0, NULL, 'CAMBIO DE MEDIDOR AUTOMATICO', NULL, 8, pend_id
    );

    UPDATE acometida
    SET fecha_inicio_lecturas = COALESCE(fecha_inicio_lecturas, fecha_base)
    WHERE acometida_id = NEW.acometida_id;

    RAISE NOTICE 'Lectura cambio medidor para %', NEW.acometida_id;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error en cambio medidor: %', SQLERRM;
        RAISE;
END;
$$;


ALTER FUNCTION public.fn_insert_cambio_medidor_reading() OWNER TO postgres;

--
-- Name: fn_insert_initial_reading_full(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_insert_initial_reading_full() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    pend_id INTEGER;
    fecha_base DATE := CURRENT_DATE;
BEGIN
    IF NEW.acometida_id IS NULL THEN RAISE EXCEPTION 'acometida_id requerido'; END IF;
    IF NEW.sector IS NULL THEN RAISE EXCEPTION 'sector requerido'; END IF;
    IF NEW.cuenta IS NULL THEN RAISE EXCEPTION 'cuenta requerida'; END IF;
    IF NEW.clave_catastral IS NULL THEN RAISE EXCEPTION 'clave_catastral requerida'; END IF;

    SELECT lectura_estado_id INTO pend_id
    FROM lectura_estado
    WHERE codigo = 'PEND' LIMIT 1;

    IF pend_id IS NULL THEN
        RAISE EXCEPTION 'Estado PEND no encontrado';
    END IF;

    INSERT INTO lectura (
        acometida_id, fecha_lectura, hora_lectura, sector, cuenta, clave_catastral,
        valor_lectura, tasa_alcantarillado, lectura_anterior, lectura_actual,
        codigo_ingreso_renta, novedad, codigo_ingreso, tipo_novedad_lectura_id, lectura_estado_id
    ) VALUES (
        NEW.acometida_id, fecha_base, CURRENT_TIME, NEW.sector, NEW.cuenta, NEW.clave_catastral,
        0, 0, 0, 0, NULL, 'LECTURA INICIAL AUTOMATICA', NULL, 8, pend_id
    );

    UPDATE acometida
    SET fecha_inicio_lecturas = fecha_base
    WHERE acometida_id = NEW.acometida_id;

    RAISE NOTICE 'Lectura inicial creada para %', NEW.acometida_id;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error en lectura inicial: %', SQLERRM;
        RAISE;
END;
$$;


ALTER FUNCTION public.fn_insert_initial_reading_full() OWNER TO postgres;

--
-- Name: fn_mes_lectura(date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_mes_lectura(p_fecha date) RETURNS character
    LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER
    AS $$
BEGIN
    IF p_fecha IS NULL THEN
        RAISE EXCEPTION 'Fecha requerida para fn_mes_lectura';
    END IF;
    RETURN TO_CHAR(p_fecha, 'YYYY-MM');
END;
$$;


ALTER FUNCTION public.fn_mes_lectura(p_fecha date) OWNER TO postgres;

--
-- Name: fn_mes_lectura(timestamp without time zone); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_mes_lectura(ts timestamp without time zone) RETURNS character
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT TO_CHAR(ts::date, 'YYYY-MM');
$$;


ALTER FUNCTION public.fn_mes_lectura(ts timestamp without time zone) OWNER TO postgres;

--
-- Name: fn_registrar_historial_incidente(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_registrar_historial_incidente() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Registro inicial al insertar (INSERT)
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.historial_incidente (
            incidente_id,
            estado_anterior,
            estado_nuevo,
            usuario_id,
            observacion
        ) VALUES (
            NEW.incidente_id,
            NULL,
            NEW.estado,
            NEW.usuario_reporta_id,
            'Registro inicial del reporte de incidente.'
        );
    -- Registro al cambiar el estado (UPDATE)
    ELSIF (TG_OP = 'UPDATE') THEN
        IF (OLD.estado IS DISTINCT FROM NEW.estado) THEN
            INSERT INTO public.historial_incidente (
                incidente_id,
                estado_anterior,
                estado_nuevo,
                usuario_id,
                observacion
            ) VALUES (
                NEW.incidente_id,
                OLD.estado,
                NEW.estado,
                COALESCE(NEW.usuario_resuelve_id, NEW.usuario_reporta_id),
                COALESCE(NEW.descripcion_resolucion, 'Cambio de estado del incidente.')
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_registrar_historial_incidente() OWNER TO postgres;

--
-- Name: fn_registrar_historial_medidor(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_registrar_historial_medidor() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_fecha_cambio TIMESTAMP WITHOUT TIME ZONE := CURRENT_TIMESTAMP;
    v_medidor_anterior VARCHAR(100);
    v_medidor_nuevo VARCHAR(100);
BEGIN
    -- 1. Determinar los valores según la operación (INSERT / UPDATE)
    IF (TG_OP = 'UPDATE') THEN
        -- Si los medidores no han cambiado, no se hace nada (doble seguridad)
        IF OLD.numero_medidor IS NOT DISTINCT FROM NEW.numero_medidor THEN
            RETURN NEW;
        END IF;

        v_medidor_anterior := COALESCE(OLD.numero_medidor, 'SIN MEDIDOR');
        v_medidor_nuevo := COALESCE(NEW.numero_medidor, 'RETIRADO');
    ELSIF (TG_OP = 'INSERT') THEN
        -- En creación, solo registramos si ya posee un medidor asignado
        IF NEW.numero_medidor IS NULL THEN
            RETURN NEW;
        END IF;

        v_medidor_anterior := 'NUEVA ACOMETIDA (SIN MEDIDOR)';
        v_medidor_nuevo := NEW.numero_medidor;
    ELSE
        RETURN NEW;
    END IF;

    -- 2. Desactivar el medidor activo anterior (marcar estado 'INACTIVO' y registrar fecha_desinstalacion)
    UPDATE public.historial_medidores
    SET estado = 'INACTIVO',
        fecha_desinstalacion = v_fecha_cambio,
        updated_at = v_fecha_cambio
    WHERE id_acometida = NEW.acometida_id
      AND estado = 'ACTIVO';

    -- 3. Insertar el nuevo registro de cambio de medidor en el historial
    INSERT INTO public.historial_medidores (
        id_cliente,
        id_acometida,
        numero_medidor_anterior,
        numero_medidor_nuevo,
        fecha_instalacion,
        fecha_desinstalacion,
        estado,
        observacion,
        created_at,
        updated_at
    ) VALUES (
        NEW.cliente_id,
        NEW.acometida_id,
        v_medidor_anterior,
        v_medidor_nuevo,
        v_fecha_cambio,
        NULL,
        'ACTIVO',
        CASE
            WHEN TG_OP = 'INSERT' THEN 'Asignación de medidor inicial en nueva acometida.'
            WHEN OLD.numero_medidor IS NULL THEN 'Asignación de primer medidor.'
            WHEN NEW.numero_medidor IS NULL THEN 'Desinstalación y retiro de medidor.'
            ELSE 'Reemplazo de medidor: ' || OLD.numero_medidor || ' por ' || NEW.numero_medidor || '.'
        END,
        v_fecha_cambio,
        v_fecha_cambio
    );

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Control de errores y logging en consola del servidor
        RAISE WARNING 'Error en fn_registrar_historial_medidor (Operación: %): %', TG_OP, SQLERRM;
        RAISE;
END;
$$;


ALTER FUNCTION public.fn_registrar_historial_medidor() OWNER TO postgres;

--
-- Name: fn_set_updated_at_verificar_cuenta(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_set_updated_at_verificar_cuenta() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_set_updated_at_verificar_cuenta() OWNER TO postgres;

--
-- Name: fn_sync_lectura_auditoria(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_sync_lectura_auditoria() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_sector_id   INTEGER;
    v_mes_lectura CHAR(7);   -- ← Ahora CHAR(7) en vez de DATE
BEGIN
    -- 1. Identificar periodo y sector
    v_mes_lectura := TO_CHAR(COALESCE(NEW.fecha_lectura, OLD.fecha_lectura), 'YYYY-MM');
    v_sector_id   := COALESCE(NEW.sector, OLD.sector);

    -- GUARDIA: Sin fecha o sector no se puede auditar
    IF v_mes_lectura IS NULL OR v_sector_id IS NULL THEN
        RETURN NULL;
    END IF;

    -- 2. INSERT: Lazy initialization si no existe la auditoría del mes
    IF (TG_OP = 'INSERT') THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.auditoria_lectura_sector
            WHERE mes_lectura = v_mes_lectura
              AND sector_id   = v_sector_id
        ) THEN
            CALL pr_generar_auditoria_mensual(v_mes_lectura);
        END IF;

        UPDATE public.auditoria_lectura_sector
           SET total_completadas = total_completadas + 1
         WHERE mes_lectura = v_mes_lectura
           AND sector_id   = v_sector_id;

    -- 3. DELETE: Restar 1
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.auditoria_lectura_sector
           SET total_completadas = total_completadas - 1
         WHERE mes_lectura = v_mes_lectura
           AND sector_id   = v_sector_id;
    END IF;

    RETURN NULL;
END;
$$;


ALTER FUNCTION public.fn_sync_lectura_auditoria() OWNER TO postgres;

--
-- Name: fn_update_meter_reading_initial(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_update_meter_reading_initial() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    pend_id INTEGER;
    v_lectura_id INTEGER;
    fecha_base DATE;
    count_completadas INTEGER := 0;
    proxima_ideal DATE;
BEGIN
    IF (OLD.numero_medidor IS DISTINCT FROM NEW.numero_medidor)
       AND NEW.numero_medidor IS NOT NULL THEN

        IF NEW.acometida_id IS NULL THEN
            RAISE EXCEPTION 'acometida_id requerido';
        END IF;
        IF NEW.sector IS NULL THEN
            RAISE EXCEPTION 'sector requerido en acometida %', NEW.acometida_id;
        END IF;
        IF NEW.cuenta IS NULL THEN
            RAISE EXCEPTION 'cuenta requerida en acometida %', NEW.acometida_id;
        END IF;
        IF NEW.clave_catastral IS NULL THEN
            RAISE EXCEPTION 'clave_catastral requerida en acometida %', NEW.acometida_id;
        END IF;

        SELECT lectura_estado_id INTO pend_id
        FROM lectura_estado
        WHERE codigo = 'PEND' LIMIT 1;

        IF pend_id IS NULL THEN
            RAISE EXCEPTION 'Estado PEND no encontrado';
        END IF;

        -- Buscar si ya existe una lectura en 0 para esta acometida para actualizarla en lugar de duplicarla
        SELECT l.lectura_id INTO v_lectura_id
        FROM lectura l
        WHERE l.acometida_id = NEW.acometida_id
          AND l.lectura_actual = 0
        ORDER BY l.fecha_lectura DESC, l.lectura_id DESC
        LIMIT 1;

        IF v_lectura_id IS NOT NULL THEN
            UPDATE lectura
            SET novedad = 'LECTURA INICIAL POR CAMBIO DE MEDIDOR: ' || NEW.numero_medidor,
                fecha_lectura = CURRENT_DATE,
                hora_lectura = CURRENT_TIME,
                valor_lectura = 0,
                lectura_anterior = 0,
                lectura_actual = 0,
                updated_at = NOW()
            WHERE lectura.lectura_id = v_lectura_id;

            RAISE NOTICE 'Lectura en 0 existente actualizada para acometida % con nuevo medidor %', NEW.acometida_id, NEW.numero_medidor;
        ELSE
            INSERT INTO lectura (
                acometida_id,
                fecha_lectura,
                hora_lectura,
                sector,
                cuenta,
                clave_catastral,
                valor_lectura,
                tasa_alcantarillado,
                lectura_anterior,
                lectura_actual,
                codigo_ingreso_renta,
                novedad,
                codigo_ingreso,
                tipo_novedad_lectura_id,
                lectura_estado_id
            ) VALUES (
                NEW.acometida_id,
                CURRENT_DATE,
                CURRENT_TIME,
                NEW.sector,
                NEW.cuenta,
                NEW.clave_catastral,
                0,
                0,
                0,
                0,
                NULL,
                'LECTURA INICIAL POR CAMBIO DE MEDIDOR: ' || NEW.numero_medidor,
                NULL,
                8,
                pend_id
            ) RETURNING lectura.lectura_id INTO v_lectura_id;

            RAISE NOTICE 'Nueva lectura en 0 creada para acometida % con medidor %', NEW.acometida_id, NEW.numero_medidor;
        END IF;

        SELECT fecha_inicio_lecturas INTO fecha_base
        FROM acometida
        WHERE acometida_id = NEW.acometida_id;

        IF fecha_base IS NULL THEN
            RAISE EXCEPTION 'fecha_inicio_lecturas no seteada. Crea acometida primero.';
        END IF;

        SELECT COUNT(*) INTO count_completadas
        FROM lectura l
        JOIN lectura_estado le ON le.lectura_estado_id = l.lectura_estado_id
        WHERE l.acometida_id = NEW.acometida_id
          AND le.codigo IN ('REAL', 'FACT');

        proxima_ideal := fecha_base + INTERVAL '1 month' * (count_completadas + 1);

        INSERT INTO siguiente_lectura (
            acometida_id,
            ultima_lectura_id,
            fecha_siguiente_lectura,
            fecha_inicio_periodo,
            fecha_fin_periodo
        ) VALUES (
            NEW.acometida_id,
            v_lectura_id,
            proxima_ideal,
            date_trunc('month', proxima_ideal),
            (date_trunc('month', proxima_ideal) + INTERVAL '1 month' - INTERVAL '1 day')
        )
        ON CONFLICT (acometida_id) DO UPDATE SET
            ultima_lectura_id = EXCLUDED.ultima_lectura_id,
            fecha_siguiente_lectura = EXCLUDED.fecha_siguiente_lectura,
            fecha_inicio_periodo = EXCLUDED.fecha_inicio_periodo,
            fecha_fin_periodo = EXCLUDED.fecha_fin_periodo;

        RAISE NOTICE 'Cambio medidor para % | Fecha base INMUTABLE: % | Proxima recalculada: % (rango: % a %)',
                     NEW.acometida_id, fecha_base, proxima_ideal,
                     date_trunc('month', proxima_ideal), (date_trunc('month', proxima_ideal) + INTERVAL '1 month' - INTERVAL '1 day');
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_update_meter_reading_initial() OWNER TO postgres;

--
-- Name: fn_usuarios_lifecycle(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_usuarios_lifecycle() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN

    -- A) INSERT → activos por defecto (usuarios internos creados por admin)
    IF TG_OP = 'INSERT' THEN
        NEW.estado_usuario_id := COALESCE(NEW.estado_usuario_id, 1);
        NEW.email_verified    := COALESCE(NEW.email_verified, false);
        NEW.telefono_verified := COALESCE(NEW.telefono_verified, false);
        NEW.failed_attempts   := COALESCE(NEW.failed_attempts, 0);
        NEW.is_locked_out     := false;
        RETURN NEW;
    END IF;

    -- B/C) Verificación de email ↔ cambio de estado
    IF NEW.email_verified IS DISTINCT FROM OLD.email_verified THEN
        IF NEW.email_verified = TRUE AND OLD.estado_usuario_id = 2 THEN
            NEW.estado_usuario_id   := 1; -- ACTIVE
            NEW.verification_token  := NULL;
            NEW.verification_expiry := NULL;

        ELSIF NEW.email_verified = FALSE AND OLD.estado_usuario_id = 1 THEN
            NEW.estado_usuario_id := 2; -- PENDING_VERIFICATION
        END IF;
    END IF;

    -- D/E) Control de intentos fallidos
    IF NEW.failed_attempts IS DISTINCT FROM OLD.failed_attempts THEN
        IF NEW.failed_attempts >= 5 AND OLD.estado_usuario_id NOT IN (3, 5) THEN
            NEW.estado_usuario_id := 4; -- LOCKED
            NEW.lockout_until     := NOW() + INTERVAL '30 minutes';
            NEW.is_locked_out     := TRUE;

        ELSIF NEW.failed_attempts = 0 AND OLD.estado_usuario_id = 4 THEN
            NEW.estado_usuario_id := 1; -- ACTIVE
            NEW.lockout_until     := NULL;
            NEW.is_locked_out     := FALSE;
        END IF;
    END IF;

    -- F) Borrado lógico → INACTIVE
    IF NEW.deleted_at IS DISTINCT FROM OLD.deleted_at AND NEW.deleted_at IS NOT NULL THEN
        NEW.estado_usuario_id := 5;
    END IF;

    -- G) Limpieza de tokens al suspender o desactivar
    IF NEW.estado_usuario_id IN (3, 5) AND OLD.estado_usuario_id NOT IN (3, 5) THEN
        NEW.verification_token  := NULL;
        NEW.verification_expiry := NULL;
        NEW.reset_token         := NULL;
        NEW.reset_token_expiry  := NULL;
        NEW.lockout_until       := NULL;
        NEW.is_locked_out       := FALSE;
    END IF;

    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_usuarios_lifecycle() OWNER TO postgres;

--
-- Name: FUNCTION fn_usuarios_lifecycle(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.fn_usuarios_lifecycle() IS 'Ciclo de vida de public.usuarios (usuarios INTERNOS del sistema):
 INSERT           → estado_usuario_id = 1 (ACTIVE) por defecto.
 email_verified=T → ACTIVE si venía de PENDING_VERIFICATION.
 failed_attempts>=5 → LOCKED (4) + lockout_until = NOW()+30min.
 failed_attempts=0 desde LOCKED → ACTIVE (1).
 deleted_at IS NOT NULL → INACTIVE (5).
 Estado 3/5 → limpia todos los tokens de seguridad.
 NOTA: La columna activo original NO se modifica aquí (compatibilidad backend).';


--
-- Name: generar_codigo_incidente(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generar_codigo_incidente() RETURNS character varying
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_seq bigint;
BEGIN
  v_seq := nextval('public.seq_codigo_incidente');
  IF v_seq < 1000000 THEN
    RETURN 'RPT-EPAA-' || LPAD(v_seq::text, 6, '0');
  ELSE
    RETURN 'RPT-EPAA-' || v_seq::text;
  END IF;
END;
$$;


ALTER FUNCTION public.generar_codigo_incidente() OWNER TO postgres;

--
-- Name: insert_rol_for_client_user_default(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.insert_rol_for_client_user_default() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO cliente_usuario_roles (cliente_usuario_id, rol_id, fecha_asignacion)
    VALUES (NEW.cliente_usuario_id, 9, NOW());

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.insert_rol_for_client_user_default() OWNER TO postgres;

--
-- Name: pr_generar_auditoria_mensual(character); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.pr_generar_auditoria_mensual(IN p_mes character)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- p_mes tiene formato 'YYYY-MM'
    INSERT INTO public.auditoria_lectura_sector (mes_lectura, sector_id, total_esperado)
    SELECT
        p_mes,
        a.sector,
        COUNT(*) AS total
    FROM public.acometida a
    JOIN public.cat_estados_acometida e ON a.estado_id = e.id_estado
    WHERE e.permite_lectura = TRUE
    GROUP BY a.sector
    ON CONFLICT (mes_lectura, sector_id) DO UPDATE
        SET total_esperado = EXCLUDED.total_esperado;

    RAISE NOTICE 'Auditoría generada para el periodo %', p_mes;
END;
$$;


ALTER PROCEDURE public.pr_generar_auditoria_mensual(IN p_mes character) OWNER TO postgres;

--
-- Name: pr_generar_auditoria_mensual(date); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.pr_generar_auditoria_mensual(IN p_fecha date)
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO public.auditoria_lectura_sector (mes_lectura, sector_id, total_esperado)
    SELECT
        date_trunc('month', p_fecha)::DATE,
        a.sector,
        COUNT(*) as total
    FROM public.acometida a
    JOIN public.cat_estados_acometida e ON a.estado_id = e.id_estado
    WHERE e.permite_lectura = TRUE
    GROUP BY a.sector
    ON CONFLICT (mes_lectura, sector_id) DO UPDATE
    SET total_esperado = EXCLUDED.total_esperado;

    RAISE NOTICE 'Auditoría generada para el periodo %', p_fecha;
END;
$$;


ALTER PROCEDURE public.pr_generar_auditoria_mensual(IN p_fecha date) OWNER TO postgres;

--
-- Name: trg_update_is_locked_out(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.trg_update_is_locked_out() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.is_locked_out := (NEW.lockout_until IS NOT NULL AND NEW.lockout_until > CURRENT_TIMESTAMP);
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.trg_update_is_locked_out() OWNER TO postgres;

--
-- Name: update_cliente_usuario_timestamp(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_cliente_usuario_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_cliente_usuario_timestamp() OWNER TO postgres;

--
-- Name: update_consumo_promedio(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_consumo_promedio() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO consumo_promedio (acometida_id, average_consumption, updated_at)
    VALUES (
        NEW.acometida_id,
        ROUND(
          GREATEST(
            COALESCE((
              SELECT AVG(CASE
                            WHEN (sub.lectura_actual - sub.lectura_anterior) >= 0
                            THEN (sub.lectura_actual - sub.lectura_anterior)
                        END)
              FROM (
                SELECT lectura_actual, lectura_anterior
                FROM lectura
                WHERE acometida_id = NEW.acometida_id
                  AND fecha_lectura IS NOT NULL
                ORDER BY fecha_lectura DESC
                LIMIT 10
              ) sub
            ), 0),
          0),
        2),
        NOW()
    )
    ON CONFLICT (acometida_id)
    DO UPDATE SET
        average_consumption = EXCLUDED.average_consumption,
        updated_at = NOW();

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_consumo_promedio() OWNER TO postgres;

--
-- Name: update_empleados_timestamp(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_empleados_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_empleados_timestamp() OWNER TO postgres;

--
-- Name: update_timestamp(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_timestamp() OWNER TO postgres;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

--
-- Name: fn_buscar_ordenes_cercanas(double precision, double precision, numeric); Type: FUNCTION; Schema: work_orders; Owner: postgres
--

CREATE FUNCTION work_orders.fn_buscar_ordenes_cercanas(p_latitud double precision, p_longitud double precision, p_radio_metros numeric DEFAULT 1000) RETURNS TABLE(id_orden_trabajo uuid, codigo_orden character varying, distancia_metros double precision)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        ot.id_orden_trabajo,
        ot.codigo_orden,
        public.ST_Distance(
            ot.geom_punto::public.geography,
            public.ST_SetSRID(public.ST_Point(p_longitud, p_latitud), 4326)::public.geography
        ) AS distancia_metros
    FROM work_orders.orden_trabajo ot
    WHERE ot.estado IN ('NOTIFICADA', 'PENDIENTE')
      AND ot.is_deleted = FALSE
      AND public.ST_DWithin(
          ot.geom_punto::public.geography,
          public.ST_SetSRID(public.ST_Point(p_longitud, p_latitud), 4326)::public.geography,
          p_radio_metros
      )
    ORDER BY distancia_metros ASC;
END;
$$;


ALTER FUNCTION work_orders.fn_buscar_ordenes_cercanas(p_latitud double precision, p_longitud double precision, p_radio_metros numeric) OWNER TO postgres;

--
-- Name: FUNCTION fn_buscar_ordenes_cercanas(p_latitud double precision, p_longitud double precision, p_radio_metros numeric); Type: COMMENT; Schema: work_orders; Owner: postgres
--

COMMENT ON FUNCTION work_orders.fn_buscar_ordenes_cercanas(p_latitud double precision, p_longitud double precision, p_radio_metros numeric) IS 'Retorna órdenes activas pendientes en un radio geográfico, ordenadas de la más cercana a la más lejana.';


--
-- Name: fn_cambiar_estado_orden(uuid, character varying, uuid, text); Type: FUNCTION; Schema: work_orders; Owner: postgres
--

CREATE FUNCTION work_orders.fn_cambiar_estado_orden(p_id_orden_trabajo uuid, p_nuevo_estado character varying, p_id_usuario uuid, p_comentario text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_estado_anterior VARCHAR(50);
BEGIN
    SELECT estado INTO v_estado_anterior
    FROM work_orders.orden_trabajo
    WHERE id_orden_trabajo = p_id_orden_trabajo
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Orden de trabajo % no encontrada', p_id_orden_trabajo;
    END IF;

    -- Resolución automática del estado de completado
    IF p_nuevo_estado = 'COMPLETADA' THEN
        IF v_estado_anterior = 'INSPECCION_EJECUTADA' THEN
            p_nuevo_estado := 'INSPECCION_COMPLETADA';
        ELSIF v_estado_anterior = 'INSTALACION_EJECUTADA' THEN
            p_nuevo_estado := 'INSTALACION_COMPLETADA';
        END IF;
    END IF;

    UPDATE work_orders.orden_trabajo
    SET estado     = p_nuevo_estado,
        updated_at = NOW()
    WHERE id_orden_trabajo = p_id_orden_trabajo;

    INSERT INTO work_orders.historial_estado_orden_trabajo (
        id_orden_trabajo, estado_anterior, estado_nuevo, id_usuario, descripcion_cambio
    ) VALUES (
        p_id_orden_trabajo, v_estado_anterior, p_nuevo_estado, p_id_usuario, p_comentario
    );
END;
$$;


ALTER FUNCTION work_orders.fn_cambiar_estado_orden(p_id_orden_trabajo uuid, p_nuevo_estado character varying, p_id_usuario uuid, p_comentario text) OWNER TO postgres;

--
-- Name: fn_enforce_state_machine(); Type: FUNCTION; Schema: work_orders; Owner: postgres
--

CREATE FUNCTION work_orders.fn_enforce_state_machine() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF OLD.estado <> NEW.estado THEN
        IF NOT work_orders.fn_validar_transicion_estado(OLD.estado, NEW.estado) THEN
            RAISE EXCEPTION 'Transición inválida: % → %', OLD.estado, NEW.estado;
        END IF;
    END IF;
    NEW.version := OLD.version + 1;
    RETURN NEW;
END;
$$;


ALTER FUNCTION work_orders.fn_enforce_state_machine() OWNER TO postgres;

--
-- Name: fn_generar_codigo_orden(); Type: FUNCTION; Schema: work_orders; Owner: postgres
--

CREATE FUNCTION work_orders.fn_generar_codigo_orden() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.codigo_orden IS NULL THEN
        NEW.codigo_orden := 'OT-'
                            || TO_CHAR(NOW(), 'YYYY')
                            || '-'
                            || LPAD(NEW.numero_secuencial::TEXT, 7, '0');
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION work_orders.fn_generar_codigo_orden() OWNER TO postgres;

--
-- Name: fn_registrar_historial_creacion_ot(); Type: FUNCTION; Schema: work_orders; Owner: postgres
--

CREATE FUNCTION work_orders.fn_registrar_historial_creacion_ot() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO work_orders.historial_estado_orden_trabajo (
        id_orden_trabajo, estado_anterior, estado_nuevo, id_usuario, descripcion_cambio
    ) VALUES (
        NEW.id_orden_trabajo, NULL, NEW.estado, NEW.created_by,
        'Orden de trabajo creada - Estado inicial: ' || NEW.estado
    );
    RETURN NEW;
END;
$$;


ALTER FUNCTION work_orders.fn_registrar_historial_creacion_ot() OWNER TO postgres;

--
-- Name: fn_update_timestamp(); Type: FUNCTION; Schema: work_orders; Owner: postgres
--

CREATE FUNCTION work_orders.fn_update_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION work_orders.fn_update_timestamp() OWNER TO postgres;

--
-- Name: fn_validar_transicion_estado(character varying, character varying); Type: FUNCTION; Schema: work_orders; Owner: postgres
--

CREATE FUNCTION work_orders.fn_validar_transicion_estado(p_estado_actual character varying, p_nuevo_estado character varying) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $$
  SELECT CASE
    -- ── Inicialización genérica ──────────────────────────────────────────────
    WHEN p_estado_actual IS NULL                  AND p_nuevo_estado = 'NOTIFICADA'              THEN TRUE

    -- ── Flujo genérico (OTs que NO vienen de acometidas) ───────────────────
    WHEN p_estado_actual = 'NOTIFICADA'            AND p_nuevo_estado IN ('PENDIENTE',            'CANCELADA')                             THEN TRUE
    WHEN p_estado_actual = 'PENDIENTE'             AND p_nuevo_estado IN ('ASIGNADA',             'CANCELADA')                             THEN TRUE
    WHEN p_estado_actual = 'ASIGNADA'              AND p_nuevo_estado IN ('PREPARACION',          'CANCELADA')                             THEN TRUE
    WHEN p_estado_actual = 'PREPARACION'           AND p_nuevo_estado IN ('EN_PROCESO',           'REVISION_RECHAZADA', 'CANCELADA')        THEN TRUE
    WHEN p_estado_actual = 'REVISION_RECHAZADA'    AND p_nuevo_estado IN ('PREPARACION',          'CANCELADA')                             THEN TRUE
    WHEN p_estado_actual = 'EN_PROCESO'            AND p_nuevo_estado IN ('EJECUTADA',            'CANCELADA')                             THEN TRUE
    WHEN p_estado_actual = 'EJECUTADA'             AND p_nuevo_estado IN ('COMPLETADA',           'RECHAZADA_TECNICA', 'CANCELADA')         THEN TRUE
    WHEN p_estado_actual = 'RECHAZADA_TECNICA'     AND p_nuevo_estado IN ('EN_PROCESO',           'EN_PROCESO_INSPECCION',
                                                                          'EN_PROCESO_INSTALACION','CANCELADA')                             THEN TRUE

    -- ── Flujo INSPECCION (exclusivo acometidas — SRP) ────────────────────────
    WHEN p_estado_actual IS NULL                  AND p_nuevo_estado = 'NOTIFICADA_INSPECCION'   THEN TRUE
    WHEN p_estado_actual = 'NOTIFICADA_INSPECCION' AND p_nuevo_estado IN ('PENDIENTE_INSPECCION',  'CANCELADA')                            THEN TRUE
    WHEN p_estado_actual = 'PENDIENTE_INSPECCION'  AND p_nuevo_estado IN ('EN_PROCESO_INSPECCION', 'CANCELADA')                            THEN TRUE
    WHEN p_estado_actual = 'EN_PROCESO_INSPECCION' AND p_nuevo_estado IN ('INSPECCION_EJECUTADA',  'CANCELADA')                            THEN TRUE
    WHEN p_estado_actual = 'INSPECCION_EJECUTADA'  AND p_nuevo_estado IN ('INSPECCION_COMPLETADA', 'RECHAZADA_TECNICA', 'CANCELADA')        THEN TRUE

    -- ── Flujo INSTALACION (exclusivo acometidas — SRP) ───────────────────────
    WHEN p_estado_actual IS NULL                   AND p_nuevo_estado = 'NOTIFICADA_INSTALACION'  THEN TRUE
    WHEN p_estado_actual = 'NOTIFICADA_INSTALACION' AND p_nuevo_estado IN ('PENDIENTE_INSTALACION',  'CANCELADA')                          THEN TRUE
    WHEN p_estado_actual = 'PENDIENTE_INSTALACION'  AND p_nuevo_estado IN ('EN_PROCESO_INSTALACION', 'CANCELADA')                          THEN TRUE
    WHEN p_estado_actual = 'EN_PROCESO_INSTALACION' AND p_nuevo_estado IN ('INSTALACION_EJECUTADA',  'CANCELADA')                          THEN TRUE
    WHEN p_estado_actual = 'INSTALACION_EJECUTADA'  AND p_nuevo_estado IN ('INSTALACION_COMPLETADA', 'RECHAZADA_TECNICA', 'CANCELADA')      THEN TRUE

    ELSE FALSE
  END;
$$;


ALTER FUNCTION work_orders.fn_validar_transicion_estado(p_estado_actual character varying, p_nuevo_estado character varying) OWNER TO postgres;

--
-- Name: fn_verificar_escalamiento_sla(); Type: FUNCTION; Schema: work_orders; Owner: postgres
--

CREATE FUNCTION work_orders.fn_verificar_escalamiento_sla() RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_conteo_escaladas INTEGER := 0;
    v_reg RECORD;
BEGIN
    FOR v_reg IN
        SELECT
            ot.id_orden_trabajo,
            ot.codigo_orden,
            ot.fecha_creacion,
            pot.sla_horas,
            pot.nivel AS prioridad
        FROM work_orders.orden_trabajo ot
        JOIN work_orders.prioridad_orden_trabajo pot ON ot.id_prioridad = pot.id_prioridad
        WHERE ot.estado IN ('NOTIFICADA', 'PENDIENTE')
          AND ot.escala_supervisor = FALSE
          AND ot.is_deleted = FALSE
    LOOP
        IF EXTRACT(EPOCH FROM (NOW() - v_reg.fecha_creacion)) / 3600 >= v_reg.sla_horas THEN
            UPDATE work_orders.orden_trabajo
            SET escala_supervisor   = TRUE,
                motivo_escalamiento = 'ALERTA SLA VENCIDO: La orden de prioridad "' || v_reg.prioridad ||
                                      '" superó las ' || v_reg.sla_horas || ' horas en espera sin ser atendida.',
                updated_at          = NOW()
            WHERE id_orden_trabajo = v_reg.id_orden_trabajo;

            INSERT INTO work_orders.historial_estado_orden_trabajo (
                id_orden_trabajo, estado_anterior, estado_nuevo, id_usuario, descripcion_cambio
            ) VALUES (
                v_reg.id_orden_trabajo, 'PENDIENTE', 'PENDIENTE',
                'e3400d18-86e1-4eee-9a8b-3e7eaf812a95'::uuid,
                'Orden escalada automáticamente. Razón: SLA vencido (' || v_reg.sla_horas || ' horas).'
            );

            PERFORM pg_notify(
                'supervisor_sla_alerts',
                json_build_object(
                    'event',            'SLA_ESCALATED',
                    'id_orden_trabajo', v_reg.id_orden_trabajo,
                    'codigo_orden',     v_reg.codigo_orden,
                    'prioridad',        v_reg.prioridad,
                    'horas_limite',     v_reg.sla_horas
                )::TEXT
            );

            v_conteo_escaladas := v_conteo_escaladas + 1;
        END IF;
    END LOOP;
    RETURN v_conteo_escaladas;
END;
$$;


ALTER FUNCTION work_orders.fn_verificar_escalamiento_sla() OWNER TO postgres;

--
-- Name: FUNCTION fn_verificar_escalamiento_sla(); Type: COMMENT; Schema: work_orders; Owner: postgres
--

COMMENT ON FUNCTION work_orders.fn_verificar_escalamiento_sla() IS 'Escala automáticamente órdenes pendientes que superan su SLA de prioridad.';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cat_estado_firma; Type: TABLE; Schema: acometidas; Owner: postgres
--

CREATE TABLE acometidas.cat_estado_firma (
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    activo boolean DEFAULT true
);


ALTER TABLE acometidas.cat_estado_firma OWNER TO postgres;

--
-- Name: cat_estado_orden; Type: TABLE; Schema: acometidas; Owner: postgres
--

CREATE TABLE acometidas.cat_estado_orden (
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    activo boolean DEFAULT true
);


ALTER TABLE acometidas.cat_estado_orden OWNER TO postgres;

--
-- Name: cat_estado_pago; Type: TABLE; Schema: acometidas; Owner: postgres
--

CREATE TABLE acometidas.cat_estado_pago (
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    activo boolean DEFAULT true
);


ALTER TABLE acometidas.cat_estado_pago OWNER TO postgres;

--
-- Name: cat_estado_solicitud; Type: TABLE; Schema: acometidas; Owner: postgres
--

CREATE TABLE acometidas.cat_estado_solicitud (
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    activo boolean DEFAULT true
);


ALTER TABLE acometidas.cat_estado_solicitud OWNER TO postgres;

--
-- Name: cat_estado_validacion_doc; Type: TABLE; Schema: acometidas; Owner: postgres
--

CREATE TABLE acometidas.cat_estado_validacion_doc (
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    activo boolean DEFAULT true
);


ALTER TABLE acometidas.cat_estado_validacion_doc OWNER TO postgres;

--
-- Name: cat_resultado_inspeccion; Type: TABLE; Schema: acometidas; Owner: postgres
--

CREATE TABLE acometidas.cat_resultado_inspeccion (
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    activo boolean DEFAULT true
);


ALTER TABLE acometidas.cat_resultado_inspeccion OWNER TO postgres;

--
-- Name: cat_tipo_acometida; Type: TABLE; Schema: acometidas; Owner: postgres
--

CREATE TABLE acometidas.cat_tipo_acometida (
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    activo boolean DEFAULT true
);


ALTER TABLE acometidas.cat_tipo_acometida OWNER TO postgres;

--
-- Name: cat_tipo_orden; Type: TABLE; Schema: acometidas; Owner: postgres
--

CREATE TABLE acometidas.cat_tipo_orden (
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    activo boolean DEFAULT true
);


ALTER TABLE acometidas.cat_tipo_orden OWNER TO postgres;

--
-- Name: cat_tipo_persona; Type: TABLE; Schema: acometidas; Owner: postgres
--

CREATE TABLE acometidas.cat_tipo_persona (
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    activo boolean DEFAULT true
);


ALTER TABLE acometidas.cat_tipo_persona OWNER TO postgres;

--
-- Name: cat_uso_predio; Type: TABLE; Schema: acometidas; Owner: postgres
--

CREATE TABLE acometidas.cat_uso_predio (
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    activo boolean DEFAULT true
);


ALTER TABLE acometidas.cat_uso_predio OWNER TO postgres;

--
-- Name: catalogo_concepto_factura; Type: TABLE; Schema: acometidas; Owner: postgres
--

CREATE TABLE acometidas.catalogo_concepto_factura (
    id integer NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(200) NOT NULL,
    monto_base numeric(10,2) DEFAULT 0 NOT NULL,
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE acometidas.catalogo_concepto_factura OWNER TO postgres;

--
-- Name: catalogo_concepto_factura_id_seq; Type: SEQUENCE; Schema: acometidas; Owner: postgres
--

CREATE SEQUENCE acometidas.catalogo_concepto_factura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE acometidas.catalogo_concepto_factura_id_seq OWNER TO postgres;

--
-- Name: catalogo_concepto_factura_id_seq; Type: SEQUENCE OWNED BY; Schema: acometidas; Owner: postgres
--

ALTER SEQUENCE acometidas.catalogo_concepto_factura_id_seq OWNED BY acometidas.catalogo_concepto_factura.id;


--
-- Name: catalogo_tipo_documento; Type: TABLE; Schema: acometidas; Owner: postgres
--

CREATE TABLE acometidas.catalogo_tipo_documento (
    id integer NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(200) NOT NULL,
    descripcion text,
    obligatorio boolean DEFAULT true,
    aplica_natural boolean DEFAULT true,
    aplica_juridica boolean DEFAULT true,
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE acometidas.catalogo_tipo_documento OWNER TO postgres;

--
-- Name: catalogo_tipo_documento_id_seq; Type: SEQUENCE; Schema: acometidas; Owner: postgres
--

CREATE SEQUENCE acometidas.catalogo_tipo_documento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE acometidas.catalogo_tipo_documento_id_seq OWNER TO postgres;

--
-- Name: catalogo_tipo_documento_id_seq; Type: SEQUENCE OWNED BY; Schema: acometidas; Owner: postgres
--

ALTER SEQUENCE acometidas.catalogo_tipo_documento_id_seq OWNED BY acometidas.catalogo_tipo_documento.id;


--
-- Name: contrato_servicio; Type: TABLE; Schema: acometidas; Owner: postgres
--

CREATE TABLE acometidas.contrato_servicio (
    id_contrato uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_solicitud uuid NOT NULL,
    numero_contrato character varying(50) NOT NULL,
    id_medidor uuid,
    id_tarifa integer,
    costo_materiales numeric(10,2) DEFAULT 0 NOT NULL,
    costo_mano_obra numeric(10,2) DEFAULT 0 NOT NULL,
    tasa_conexion numeric(10,2) DEFAULT 0 NOT NULL,
    valor_total numeric(10,2) GENERATED ALWAYS AS (((costo_materiales + costo_mano_obra) + tasa_conexion)) STORED,
    estado_firma character varying(50) DEFAULT 'PENDIENTE'::character varying,
    url_contrato_pdf character varying(1000),
    url_contrato_firmado character varying(1000),
    fecha_firma_usuario timestamp with time zone,
    fecha_firma_epaa timestamp with time zone,
    id_generador uuid,
    is_deleted boolean DEFAULT false,
    deleted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE acometidas.contrato_servicio OWNER TO postgres;

--
-- Name: documento_adjunto; Type: TABLE; Schema: acometidas; Owner: postgres
--

CREATE TABLE acometidas.documento_adjunto (
    id_documento uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_solicitud uuid NOT NULL,
    id_tipo_documento integer NOT NULL,
    url_archivo character varying(1000) NOT NULL,
    nombre_original character varying(500),
    mime_type character varying(100),
    tamano_bytes bigint,
    hash_sha256 character varying(64),
    estado_validacion character varying(50) DEFAULT 'PENDIENTE'::character varying,
    observacion text,
    id_validador uuid,
    fecha_validacion timestamp with time zone,
    is_deleted boolean DEFAULT false,
    deleted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE acometidas.documento_adjunto OWNER TO postgres;

--
-- Name: factura_inspeccion; Type: TABLE; Schema: acometidas; Owner: postgres
--

CREATE TABLE acometidas.factura_inspeccion (
    id_factura uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_solicitud uuid NOT NULL,
    numero_factura character varying(50) NOT NULL,
    id_concepto integer,
    monto numeric(10,2) NOT NULL,
    estado character varying(50) DEFAULT 'PENDIENTE'::character varying,
    fecha_vencimiento date,
    fecha_pago timestamp with time zone,
    metodo_pago character varying(100),
    referencia_pago character varying(200),
    url_comprobante character varying(1000),
    id_cajero uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE acometidas.factura_inspeccion OWNER TO postgres;

--
-- Name: historial_estado; Type: TABLE; Schema: acometidas; Owner: postgres
--

CREATE TABLE acometidas.historial_estado (
    id_historial uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_solicitud uuid NOT NULL,
    estado_anterior character varying(50),
    estado_nuevo character varying(50) NOT NULL,
    id_usuario_accion uuid NOT NULL,
    comentario text,
    datos_extra jsonb DEFAULT '{}'::jsonb,
    fecha_cambio timestamp with time zone DEFAULT now()
);


ALTER TABLE acometidas.historial_estado OWNER TO postgres;

--
-- Name: informe_inspeccion; Type: TABLE; Schema: acometidas; Owner: postgres
--

CREATE TABLE acometidas.informe_inspeccion (
    id_informe uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_orden_trabajo uuid NOT NULL,
    id_solicitud uuid NOT NULL,
    resultado character varying(50) NOT NULL,
    distancia_red_m numeric(8,2),
    diametro_conexion character varying(20),
    condiciones_terreno text,
    observaciones text,
    geom_acometida public.geometry(Point,4326),
    costo_materiales numeric(10,2),
    costo_mano_obra numeric(10,2),
    costo_total numeric(10,2) GENERATED ALWAYS AS ((costo_materiales + costo_mano_obra)) STORED,
    aprobado boolean,
    motivo_rechazo text,
    id_aprobador uuid,
    fecha_aprobacion timestamp with time zone,
    is_deleted boolean DEFAULT false,
    deleted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE acometidas.informe_inspeccion OWNER TO postgres;

--
-- Name: informe_instalacion; Type: TABLE; Schema: acometidas; Owner: postgres
--

CREATE TABLE acometidas.informe_instalacion (
    id_informe uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_orden_trabajo uuid NOT NULL,
    id_solicitud uuid NOT NULL,
    resultado character varying(50) NOT NULL,
    fecha_instalacion timestamp with time zone DEFAULT now() NOT NULL,
    numero_medidor character varying(100),
    lectura_inicial numeric(10,2) DEFAULT 0,
    sello_seguridad character varying(100),
    diametro_conexion character varying(20),
    geom_medidor public.geometry(Point,4326),
    condiciones_finales text,
    observaciones text,
    firma_cliente character varying(500),
    aprobado boolean,
    id_aprobador uuid,
    fecha_aprobacion timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE acometidas.informe_instalacion OWNER TO postgres;

--
-- Name: inventario_medidor; Type: TABLE; Schema: acometidas; Owner: postgres
--

CREATE TABLE acometidas.inventario_medidor (
    id_medidor uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    numero_serie character varying(100) NOT NULL,
    marca character varying(100),
    modelo character varying(100),
    diametro_mm numeric(6,2),
    fecha_adquisicion date,
    disponible boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE acometidas.inventario_medidor OWNER TO postgres;

--
-- Name: registro_catastral; Type: TABLE; Schema: acometidas; Owner: postgres
--

CREATE TABLE acometidas.registro_catastral (
    id_registro uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_solicitud uuid NOT NULL,
    id_contrato uuid,
    clave_catastral character varying(100) NOT NULL,
    numero_medidor character varying(100) NOT NULL,
    direccion_exacta character varying(500) NOT NULL,
    geom public.geometry(Point,4326) NOT NULL,
    diametro_conexion character varying(20),
    tipo_servicio character varying(100),
    fecha_instalacion date NOT NULL,
    numero_cuenta character varying(100),
    activo boolean DEFAULT false,
    fecha_activacion timestamp with time zone,
    id_registrador uuid,
    is_deleted boolean DEFAULT false,
    deleted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE acometidas.registro_catastral OWNER TO postgres;

--
-- Name: seq_solicitud; Type: SEQUENCE; Schema: acometidas; Owner: postgres
--

CREATE SEQUENCE acometidas.seq_solicitud
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE acometidas.seq_solicitud OWNER TO postgres;

--
-- Name: solicitud; Type: TABLE; Schema: acometidas; Owner: postgres
--

CREATE TABLE acometidas.solicitud (
    id_solicitud uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_cliente character varying(13) NOT NULL,
    tipo_persona character varying(50) NOT NULL,
    tipo_acometida character varying(50) NOT NULL,
    uso_predio character varying(50) NOT NULL,
    direccion character varying(500) NOT NULL,
    clave_catastral character varying(100),
    geom public.geometry(Point,4326),
    estado character varying(50) DEFAULT 'DRAFT'::character varying NOT NULL,
    datos_adicionales jsonb DEFAULT '{}'::jsonb,
    id_analista uuid,
    is_deleted boolean DEFAULT false,
    deleted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    numero_solicitud character varying(30) NOT NULL,
    id_tipo_solicitud integer
);


ALTER TABLE acometidas.solicitud OWNER TO postgres;

--
-- Name: solicitud_orden_trabajo; Type: TABLE; Schema: acometidas; Owner: postgres
--

CREATE TABLE acometidas.solicitud_orden_trabajo (
    id_solicitud uuid NOT NULL,
    id_orden_trabajo uuid NOT NULL,
    tipo_orden character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    numero_orden character varying(30)
);


ALTER TABLE acometidas.solicitud_orden_trabajo OWNER TO postgres;

--
-- Name: tipo_acometida; Type: TABLE; Schema: acometidas; Owner: postgres
--

CREATE TABLE acometidas.tipo_acometida (
    id_tipo_acometida integer NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(255) NOT NULL,
    descripcion text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE acometidas.tipo_acometida OWNER TO postgres;

--
-- Name: tipo_acometida_id_tipo_acometida_seq; Type: SEQUENCE; Schema: acometidas; Owner: postgres
--

CREATE SEQUENCE acometidas.tipo_acometida_id_tipo_acometida_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE acometidas.tipo_acometida_id_tipo_acometida_seq OWNER TO postgres;

--
-- Name: tipo_acometida_id_tipo_acometida_seq; Type: SEQUENCE OWNED BY; Schema: acometidas; Owner: postgres
--

ALTER SEQUENCE acometidas.tipo_acometida_id_tipo_acometida_seq OWNED BY acometidas.tipo_acometida.id_tipo_acometida;


--
-- Name: tipo_solicitud; Type: TABLE; Schema: acometidas; Owner: postgres
--

CREATE TABLE acometidas.tipo_solicitud (
    id_tipo_solicitud integer NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE acometidas.tipo_solicitud OWNER TO postgres;

--
-- Name: tipo_solicitud_id_tipo_solicitud_seq; Type: SEQUENCE; Schema: acometidas; Owner: postgres
--

CREATE SEQUENCE acometidas.tipo_solicitud_id_tipo_solicitud_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE acometidas.tipo_solicitud_id_tipo_solicitud_seq OWNER TO postgres;

--
-- Name: tipo_solicitud_id_tipo_solicitud_seq; Type: SEQUENCE OWNED BY; Schema: acometidas; Owner: postgres
--

ALTER SEQUENCE acometidas.tipo_solicitud_id_tipo_solicitud_seq OWNED BY acometidas.tipo_solicitud.id_tipo_solicitud;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    usuario_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255),
    email character varying(150) NOT NULL,
    fecha_registro timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_ultimo_acceso timestamp with time zone,
    failed_attempts integer DEFAULT 0 NOT NULL,
    two_factor_enabled boolean DEFAULT false NOT NULL,
    observaciones character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    cliente_id character varying(13),
    auth_method character varying(50) DEFAULT 'PASSWORD'::character varying NOT NULL,
    auth_provider character varying(50),
    estado_usuario_id integer DEFAULT 2 NOT NULL,
    lockout_until timestamp with time zone,
    is_locked_out boolean DEFAULT false NOT NULL,
    two_factor_secret character varying(255),
    two_factor_backup_codes text[],
    email_verified boolean DEFAULT false,
    telefono_verified boolean DEFAULT false,
    verification_token character varying(255),
    verification_expiry timestamp with time zone,
    reset_token character varying(255),
    reset_token_expiry timestamp with time zone,
    preferencias jsonb DEFAULT '{}'::jsonb,
    created_by uuid,
    updated_by uuid,
    deleted_at timestamp with time zone,
    last_login timestamp with time zone,
    activo boolean DEFAULT true NOT NULL,
    is_active boolean GENERATED ALWAYS AS ((estado_usuario_id = 1)) STORED NOT NULL,
    CONSTRAINT chk_usuarios_reset_expiry CHECK (((reset_token_expiry IS NULL) OR (reset_token_expiry > CURRENT_TIMESTAMP))),
    CONSTRAINT usuarios_failed_attempts_check CHECK ((failed_attempts >= 0))
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: v_panel_solicitudes; Type: VIEW; Schema: acometidas; Owner: postgres
--

CREATE VIEW acometidas.v_panel_solicitudes AS
 SELECT s.id_solicitud,
    s.estado,
    s.tipo_acometida,
    s.uso_predio,
    s.direccion,
    s.clave_catastral,
    s.created_at AS fecha_solicitud,
    s.id_cliente AS identificacion_cliente,
    a.username AS nombre_analista,
    f.numero_factura,
    f.estado AS estado_pago,
    c.numero_contrato,
    c.estado_firma,
    c.valor_total,
    r.numero_cuenta,
    r.activo AS servicio_activo,
    (EXTRACT(day FROM (now() - s.created_at)))::integer AS dias_en_proceso
   FROM ((((acometidas.solicitud s
     LEFT JOIN public.usuarios a ON ((a.usuario_id = s.id_analista)))
     LEFT JOIN acometidas.factura_inspeccion f ON ((f.id_solicitud = s.id_solicitud)))
     LEFT JOIN acometidas.contrato_servicio c ON ((c.id_solicitud = s.id_solicitud)))
     LEFT JOIN acometidas.registro_catastral r ON ((r.id_solicitud = s.id_solicitud)))
  WHERE (s.is_deleted = false);


ALTER VIEW acometidas.v_panel_solicitudes OWNER TO postgres;

--
-- Name: alerta; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.alerta (
    alerta_id bigint NOT NULL,
    tipo_alerta text NOT NULL,
    severidad audit.audit_severidad DEFAULT 'MEDIUM'::audit.audit_severidad NOT NULL,
    descripcion text NOT NULL,
    tabla_nombre text,
    usuario_id uuid,
    usuario_nombre text,
    audit_ids bigint[] DEFAULT ARRAY[]::bigint[],
    resuelta boolean DEFAULT false NOT NULL,
    resuelta_por uuid,
    resuelta_at timestamp with time zone,
    resolucion_nota text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE audit.alerta OWNER TO postgres;

--
-- Name: TABLE alerta; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON TABLE audit.alerta IS 'Alertas automáticas generadas por anomalías detectadas en audit.registro. Revisable por administradores. No modificable por usuarios normales.';


--
-- Name: alerta_alerta_id_seq; Type: SEQUENCE; Schema: audit; Owner: postgres
--

ALTER TABLE audit.alerta ALTER COLUMN alerta_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME audit.alerta_alerta_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: registro; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro (
    audit_id bigint NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text NOT NULL,
    tabla_nombre text NOT NULL,
    operacion audit.audit_operacion NOT NULL,
    pk_valor jsonb NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
)
PARTITION BY RANGE (audit_timestamp);

ALTER TABLE ONLY audit.registro FORCE ROW LEVEL SECURITY;


ALTER TABLE audit.registro OWNER TO postgres;

--
-- Name: TABLE registro; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON TABLE audit.registro IS 'Registro central de auditoría enterprise. Particionada mensualmente. Append-only: UPDATE y DELETE están protegidos por RLS y permisos de rol.';


--
-- Name: COLUMN registro.pk_valor; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON COLUMN audit.registro.pk_valor IS 'Valor de la clave primaria de la fila afectada, siempre en formato JSONB para soportar PKs compuestas. Ej: {"factura_id": 42}';


--
-- Name: COLUMN registro.campos_cambiados; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON COLUMN audit.registro.campos_cambiados IS 'Array de nombres de columnas que realmente cambiaron en un UPDATE. Permite búsqueda rápida sin parsear diff_jsonb.';


--
-- Name: COLUMN registro.diff_jsonb; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON COLUMN audit.registro.diff_jsonb IS 'Diferencial columna a columna en UPDATE. Formato: {"columna": {"antes": valor_old, "despues": valor_new}}. Vacío en INSERT y DELETE.';


--
-- Name: registro_2024_01; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2024_01 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2024_01 OWNER TO postgres;

--
-- Name: registro_2024_02; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2024_02 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2024_02 OWNER TO postgres;

--
-- Name: registro_2024_03; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2024_03 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2024_03 OWNER TO postgres;

--
-- Name: registro_2024_04; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2024_04 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2024_04 OWNER TO postgres;

--
-- Name: registro_2024_05; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2024_05 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2024_05 OWNER TO postgres;

--
-- Name: registro_2024_06; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2024_06 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2024_06 OWNER TO postgres;

--
-- Name: registro_2024_07; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2024_07 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2024_07 OWNER TO postgres;

--
-- Name: registro_2024_08; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2024_08 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2024_08 OWNER TO postgres;

--
-- Name: registro_2024_09; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2024_09 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2024_09 OWNER TO postgres;

--
-- Name: registro_2024_10; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2024_10 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2024_10 OWNER TO postgres;

--
-- Name: registro_2024_11; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2024_11 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2024_11 OWNER TO postgres;

--
-- Name: registro_2024_12; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2024_12 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2024_12 OWNER TO postgres;

--
-- Name: registro_2025_01; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2025_01 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2025_01 OWNER TO postgres;

--
-- Name: registro_2025_02; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2025_02 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2025_02 OWNER TO postgres;

--
-- Name: registro_2025_03; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2025_03 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2025_03 OWNER TO postgres;

--
-- Name: registro_2025_04; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2025_04 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2025_04 OWNER TO postgres;

--
-- Name: registro_2025_05; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2025_05 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2025_05 OWNER TO postgres;

--
-- Name: registro_2025_06; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2025_06 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2025_06 OWNER TO postgres;

--
-- Name: registro_2025_07; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2025_07 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2025_07 OWNER TO postgres;

--
-- Name: registro_2025_08; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2025_08 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2025_08 OWNER TO postgres;

--
-- Name: registro_2025_09; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2025_09 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2025_09 OWNER TO postgres;

--
-- Name: registro_2025_10; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2025_10 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2025_10 OWNER TO postgres;

--
-- Name: registro_2025_11; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2025_11 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2025_11 OWNER TO postgres;

--
-- Name: registro_2025_12; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2025_12 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2025_12 OWNER TO postgres;

--
-- Name: registro_2026_01; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2026_01 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2026_01 OWNER TO postgres;

--
-- Name: registro_2026_02; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2026_02 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2026_02 OWNER TO postgres;

--
-- Name: registro_2026_03; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2026_03 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2026_03 OWNER TO postgres;

--
-- Name: registro_2026_04; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2026_04 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2026_04 OWNER TO postgres;

--
-- Name: registro_2026_05; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2026_05 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2026_05 OWNER TO postgres;

--
-- Name: registro_2026_06; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2026_06 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2026_06 OWNER TO postgres;

--
-- Name: registro_2026_07; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2026_07 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2026_07 OWNER TO postgres;

--
-- Name: registro_2026_08; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2026_08 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2026_08 OWNER TO postgres;

--
-- Name: registro_2026_09; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2026_09 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2026_09 OWNER TO postgres;

--
-- Name: registro_2026_10; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2026_10 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2026_10 OWNER TO postgres;

--
-- Name: registro_2026_11; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2026_11 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2026_11 OWNER TO postgres;

--
-- Name: registro_2026_12; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2026_12 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2026_12 OWNER TO postgres;

--
-- Name: registro_2027_01; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2027_01 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2027_01 OWNER TO postgres;

--
-- Name: registro_2027_02; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2027_02 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2027_02 OWNER TO postgres;

--
-- Name: registro_2027_03; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2027_03 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2027_03 OWNER TO postgres;

--
-- Name: registro_2027_04; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2027_04 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2027_04 OWNER TO postgres;

--
-- Name: registro_2027_05; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2027_05 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2027_05 OWNER TO postgres;

--
-- Name: registro_2027_06; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2027_06 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2027_06 OWNER TO postgres;

--
-- Name: registro_2027_07; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2027_07 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2027_07 OWNER TO postgres;

--
-- Name: registro_2027_08; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2027_08 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2027_08 OWNER TO postgres;

--
-- Name: registro_2027_09; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2027_09 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2027_09 OWNER TO postgres;

--
-- Name: registro_2027_10; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2027_10 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2027_10 OWNER TO postgres;

--
-- Name: registro_2027_11; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2027_11 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2027_11 OWNER TO postgres;

--
-- Name: registro_2027_12; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_2027_12 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_2027_12 OWNER TO postgres;

--
-- Name: registro_audit_id_seq; Type: SEQUENCE; Schema: audit; Owner: postgres
--

ALTER TABLE audit.registro ALTER COLUMN audit_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME audit.registro_audit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: registro_default; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.registro_default (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.registro_default OWNER TO postgres;

--
-- Name: TABLE registro_default; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON TABLE audit.registro_default IS 'Partición de seguridad. Si hay datos aquí, significa que falta crear la partición mensual correspondiente. Ejecutar audit.fn_crear_particion_mes().';


--
-- Name: regla_alerta; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.regla_alerta (
    regla_id integer NOT NULL,
    codigo text NOT NULL,
    descripcion text NOT NULL,
    severidad audit.audit_severidad DEFAULT 'HIGH'::audit.audit_severidad NOT NULL,
    activa boolean DEFAULT true NOT NULL,
    tabla_objetivo text,
    operacion text,
    umbral_count integer,
    ventana_minutos integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE audit.regla_alerta OWNER TO postgres;

--
-- Name: regla_alerta_regla_id_seq; Type: SEQUENCE; Schema: audit; Owner: postgres
--

CREATE SEQUENCE audit.regla_alerta_regla_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE audit.regla_alerta_regla_id_seq OWNER TO postgres;

--
-- Name: regla_alerta_regla_id_seq; Type: SEQUENCE OWNED BY; Schema: audit; Owner: postgres
--

ALTER SEQUENCE audit.regla_alerta_regla_id_seq OWNED BY audit.regla_alerta.regla_id;


--
-- Name: sesion; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.sesion (
    sesion_log_id bigint NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    evento text NOT NULL,
    ip_address inet,
    user_agent text,
    motivo_fallo text,
    metadata jsonb DEFAULT '{}'::jsonb
)
PARTITION BY RANGE (audit_timestamp);


ALTER TABLE audit.sesion OWNER TO postgres;

--
-- Name: sesion_2026_04; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.sesion_2026_04 (
    sesion_log_id bigint CONSTRAINT sesion_sesion_log_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT sesion_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    evento text CONSTRAINT sesion_evento_not_null NOT NULL,
    ip_address inet,
    user_agent text,
    motivo_fallo text,
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.sesion_2026_04 OWNER TO postgres;

--
-- Name: sesion_2026_05; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.sesion_2026_05 (
    sesion_log_id bigint CONSTRAINT sesion_sesion_log_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT sesion_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    evento text CONSTRAINT sesion_evento_not_null NOT NULL,
    ip_address inet,
    user_agent text,
    motivo_fallo text,
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.sesion_2026_05 OWNER TO postgres;

--
-- Name: sesion_2026_06; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.sesion_2026_06 (
    sesion_log_id bigint CONSTRAINT sesion_sesion_log_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT sesion_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    evento text CONSTRAINT sesion_evento_not_null NOT NULL,
    ip_address inet,
    user_agent text,
    motivo_fallo text,
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.sesion_2026_06 OWNER TO postgres;

--
-- Name: sesion_2026_07; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.sesion_2026_07 (
    sesion_log_id bigint CONSTRAINT sesion_sesion_log_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT sesion_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    evento text CONSTRAINT sesion_evento_not_null NOT NULL,
    ip_address inet,
    user_agent text,
    motivo_fallo text,
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.sesion_2026_07 OWNER TO postgres;

--
-- Name: sesion_default; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.sesion_default (
    sesion_log_id bigint CONSTRAINT sesion_sesion_log_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT sesion_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    evento text CONSTRAINT sesion_evento_not_null NOT NULL,
    ip_address inet,
    user_agent text,
    motivo_fallo text,
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE audit.sesion_default OWNER TO postgres;

--
-- Name: sesion_sesion_log_id_seq; Type: SEQUENCE; Schema: audit; Owner: postgres
--

ALTER TABLE audit.sesion ALTER COLUMN sesion_log_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME audit.sesion_sesion_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tabla_config; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.tabla_config (
    tabla_nombre text NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    nivel audit.audit_nivel DEFAULT 'STANDARD'::audit.audit_nivel NOT NULL,
    columnas_excluidas text[] DEFAULT ARRAY[]::text[] NOT NULL,
    columnas_enmascarar text[] DEFAULT ARRAY[]::text[] NOT NULL,
    auditar_insert boolean DEFAULT true NOT NULL,
    auditar_update boolean DEFAULT true NOT NULL,
    auditar_delete boolean DEFAULT true NOT NULL,
    retener_dias integer,
    descripcion text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    schema_nombre text DEFAULT 'public'::text NOT NULL,
    CONSTRAINT tabla_config_retener_dias_check CHECK ((retener_dias > 0))
);


ALTER TABLE audit.tabla_config OWNER TO postgres;

--
-- Name: TABLE tabla_config; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON TABLE audit.tabla_config IS 'Configuración por tabla del sistema de auditoría. Controla nivel de detalle, columnas sensibles, operaciones y retención.';


--
-- Name: usuario_refresh_tokens; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.usuario_refresh_tokens (
    token_id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid NOT NULL,
    token_hash text NOT NULL,
    jti uuid NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    revoked boolean DEFAULT false NOT NULL,
    revoked_at timestamp with time zone,
    ip_address inet,
    device_info text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE audit.usuario_refresh_tokens OWNER TO postgres;

--
-- Name: vw_accesos_recientes; Type: VIEW; Schema: audit; Owner: postgres
--

CREATE VIEW audit.vw_accesos_recientes AS
 SELECT sesion_log_id,
    audit_timestamp,
    usuario_id,
    usuario_nombre,
    evento,
    ip_address,
    user_agent,
    motivo_fallo,
    metadata
   FROM audit.sesion s
  ORDER BY audit_timestamp DESC;


ALTER VIEW audit.vw_accesos_recientes OWNER TO postgres;

--
-- Name: VIEW vw_accesos_recientes; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON VIEW audit.vw_accesos_recientes IS 'Feed cronológico de todos los inicios y cierres de sesión, además de fallos. Esencial para auditoría de acceso e identificación de ataques de fuerza bruta.';


--
-- Name: vw_actividad_usuario; Type: VIEW; Schema: audit; Owner: postgres
--

CREATE VIEW audit.vw_actividad_usuario AS
 SELECT usuario_id,
    usuario_nombre,
    count(*) AS total_eventos,
    count(*) FILTER (WHERE (operacion = 'INSERT'::audit.audit_operacion)) AS inserts,
    count(*) FILTER (WHERE (operacion = 'UPDATE'::audit.audit_operacion)) AS updates,
    count(*) FILTER (WHERE (operacion = 'DELETE'::audit.audit_operacion)) AS deletes,
    count(DISTINCT tabla_nombre) AS tablas_afectadas,
    array_agg(DISTINCT tabla_nombre ORDER BY tabla_nombre) AS tablas,
    count(DISTINCT (ip_address)::text) AS ips_distintas,
    min(audit_timestamp) AS primera_accion,
    max(audit_timestamp) AS ultima_accion,
    (max(audit_timestamp) - min(audit_timestamp)) AS duracion_sesion
   FROM audit.registro
  WHERE (audit_timestamp > (now() - '24:00:00'::interval))
  GROUP BY usuario_id, usuario_nombre
  ORDER BY (count(*)) DESC;


ALTER VIEW audit.vw_actividad_usuario OWNER TO postgres;

--
-- Name: VIEW vw_actividad_usuario; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON VIEW audit.vw_actividad_usuario IS 'Resumen de actividad por usuario en las últimas 24 horas. Útil para detectar patrones de uso anómalos.';


--
-- Name: vw_alertas_activas; Type: VIEW; Schema: audit; Owner: postgres
--

CREATE VIEW audit.vw_alertas_activas AS
 SELECT alerta_id,
    tipo_alerta,
    severidad,
    descripcion,
    tabla_nombre,
    usuario_id,
    usuario_nombre,
    array_length(audit_ids, 1) AS num_eventos,
    created_at,
    (EXTRACT(epoch FROM (now() - created_at)) / (60)::numeric) AS minutos_transcurridos,
    metadata
   FROM audit.alerta a
  WHERE (resuelta = false)
  ORDER BY
        CASE severidad
            WHEN 'CRITICAL'::audit.audit_severidad THEN 1
            WHEN 'HIGH'::audit.audit_severidad THEN 2
            WHEN 'MEDIUM'::audit.audit_severidad THEN 3
            WHEN 'LOW'::audit.audit_severidad THEN 4
            ELSE NULL::integer
        END, created_at DESC;


ALTER VIEW audit.vw_alertas_activas OWNER TO postgres;

--
-- Name: VIEW vw_alertas_activas; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON VIEW audit.vw_alertas_activas IS 'Alertas de seguridad pendientes de resolución, ordenadas por severidad. Para resolver: SELECT audit.fn_resolver_alerta(alerta_id, usuario_id, nota);';


--
-- Name: vw_cambios_recientes; Type: VIEW; Schema: audit; Owner: postgres
--

CREATE VIEW audit.vw_cambios_recientes AS
 SELECT audit_id,
    audit_timestamp,
    tabla_nombre,
    operacion,
    usuario_id,
    usuario_nombre,
    ip_address,
    sesion_id,
    pk_valor,
    campos_cambiados,
    diff_jsonb,
    COALESCE(array_length(campos_cambiados, 1), 0) AS num_campos_cambiados,
    duracion_ms,
    metadata
   FROM audit.registro r
  ORDER BY audit_timestamp DESC;


ALTER VIEW audit.vw_cambios_recientes OWNER TO postgres;

--
-- Name: VIEW vw_cambios_recientes; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON VIEW audit.vw_cambios_recientes IS 'Feed cronológico descendente de todos los cambios auditados. Limitar con LIMIT/WHERE para evitar scans completos.';


--
-- Name: vw_cambios_sensibles; Type: VIEW; Schema: audit; Owner: postgres
--

CREATE VIEW audit.vw_cambios_sensibles AS
 SELECT audit_id,
    audit_timestamp,
    tabla_nombre,
    operacion,
    usuario_id,
    usuario_nombre,
    ip_address,
    pk_valor,
    campos_cambiados,
    diff_jsonb
   FROM audit.registro r
  WHERE (tabla_nombre = ANY (ARRAY['usuarios'::text, 'cliente_usuario'::text, 'usuario_roles'::text, 'usuario_permisos'::text, 'roles'::text, 'rol_permisos'::text, 'permisos'::text, 'tarifa'::text, 'rangos_variables'::text, 'componentes_fijos'::text, 'empleados'::text]))
  ORDER BY audit_timestamp DESC;


ALTER VIEW audit.vw_cambios_sensibles OWNER TO postgres;

--
-- Name: VIEW vw_cambios_sensibles; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON VIEW audit.vw_cambios_sensibles IS 'Filtro solo de tablas de alta criticidad: seguridad, tarifas, RRHH. Para compliance y revisión de auditoría focalizada.';


--
-- Name: vw_config_resumen; Type: VIEW; Schema: audit; Owner: postgres
--

CREATE VIEW audit.vw_config_resumen AS
 SELECT schema_nombre,
    tabla_nombre,
    activo,
    nivel,
    COALESCE(array_length(columnas_enmascarar, 1), 0) AS cols_enmascaradas,
    COALESCE(array_length(columnas_excluidas, 1), 0) AS cols_excluidas,
    auditar_insert,
    auditar_update,
    auditar_delete,
    retener_dias,
        CASE
            WHEN (retener_dias IS NULL) THEN 'política global'::text
            ELSE ((((retener_dias)::numeric / 365.0))::numeric(5,1) || ' años'::text)
        END AS retencion_descripcion
   FROM audit.tabla_config
  ORDER BY schema_nombre, nivel DESC, tabla_nombre;


ALTER VIEW audit.vw_config_resumen OWNER TO postgres;

--
-- Name: vw_estadisticas_generales; Type: VIEW; Schema: audit; Owner: postgres
--

CREATE VIEW audit.vw_estadisticas_generales AS
 SELECT ( SELECT count(*) AS count
           FROM audit.registro) AS total_eventos_historico,
    ( SELECT count(*) AS count
           FROM audit.registro
          WHERE (registro.audit_timestamp > (now() - '24:00:00'::interval))) AS eventos_24h,
    ( SELECT count(*) AS count
           FROM audit.registro
          WHERE (registro.audit_timestamp > (now() - '7 days'::interval))) AS eventos_7d,
    ( SELECT count(*) AS count
           FROM audit.registro
          WHERE (registro.audit_timestamp > (now() - '30 days'::interval))) AS eventos_30d,
    ( SELECT count(*) AS count
           FROM audit.alerta
          WHERE (alerta.resuelta = false)) AS alertas_pendientes,
    ( SELECT count(*) AS count
           FROM audit.alerta
          WHERE ((alerta.resuelta = false) AND (alerta.severidad = 'CRITICAL'::audit.audit_severidad))) AS alertas_criticas,
    ( SELECT count(*) AS count
           FROM audit.tabla_config
          WHERE (tabla_config.activo = true)) AS tablas_auditadas,
    ( SELECT count(*) AS count
           FROM audit.tabla_config
          WHERE (tabla_config.activo = false)) AS tablas_pausadas,
    ( SELECT max(registro.audit_timestamp) AS max
           FROM audit.registro) AS ultimo_evento,
    ( SELECT max(alerta.created_at) AS max
           FROM audit.alerta) AS ultima_alerta,
    (( SELECT count(*) AS count
           FROM pg_tables
          WHERE ((pg_tables.schemaname = 'audit'::name) AND (pg_tables.tablename ~~ 'registro_%'::text))))::integer AS particiones_totales,
    now() AS generado_en;


ALTER VIEW audit.vw_estadisticas_generales OWNER TO postgres;

--
-- Name: VIEW vw_estadisticas_generales; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON VIEW audit.vw_estadisticas_generales IS 'KPIs globales del sistema de auditoría. Usar para el dashboard de monitoreo de seguridad.';


--
-- Name: vw_estado_triggers; Type: VIEW; Schema: audit; Owner: postgres
--

CREATE VIEW audit.vw_estado_triggers AS
 SELECT tc.schema_nombre,
    tc.tabla_nombre,
    tc.activo AS config_activa,
    tc.nivel,
        CASE
            WHEN (t.trigger_name IS NOT NULL) THEN true
            ELSE false
        END AS trigger_existe,
    t.trigger_name,
    t.event_manipulation,
    t.action_timing
   FROM (audit.tabla_config tc
     LEFT JOIN information_schema.triggers t ON ((((t.trigger_schema)::name = tc.schema_nombre) AND ((t.event_object_table)::name = tc.tabla_nombre) AND ((t.trigger_name)::name = ('trg_audit_'::text || tc.tabla_nombre)))))
  WHERE (((t.event_manipulation)::text = 'INSERT'::text) OR (t.event_manipulation IS NULL))
  ORDER BY tc.schema_nombre, tc.tabla_nombre;


ALTER VIEW audit.vw_estado_triggers OWNER TO postgres;

--
-- Name: vw_historial_fila; Type: VIEW; Schema: audit; Owner: postgres
--

CREATE VIEW audit.vw_historial_fila AS
 SELECT audit_id,
    audit_timestamp,
    tabla_nombre AS tabla,
    pk_valor AS pk,
    operacion,
    usuario_id,
    usuario_nombre,
    ip_address,
    campos_cambiados,
    diff_jsonb,
    datos_antes,
    datos_despues,
    duracion_ms
   FROM audit.registro r
  ORDER BY tabla_nombre, pk_valor, audit_timestamp;


ALTER VIEW audit.vw_historial_fila OWNER TO postgres;

--
-- Name: VIEW vw_historial_fila; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON VIEW audit.vw_historial_fila IS 'Historial completo de cambios agrupado por tabla y PK. Filtrar por tabla_nombre y pk_valor para ver el historial de un registro. Ejemplo: SELECT * FROM audit.vw_historial_fila WHERE tabla = ''acometida'' AND pk = ''{"acometida_id": "0001-001"}'';';


--
-- Name: vw_permisos; Type: VIEW; Schema: audit; Owner: postgres
--

CREATE VIEW audit.vw_permisos AS
 SELECT grantee,
    table_schema,
    table_name,
    privilege_type,
    is_grantable
   FROM information_schema.role_table_grants
  WHERE ((table_schema)::name = 'audit'::name)
  ORDER BY grantee, table_name, privilege_type;


ALTER VIEW audit.vw_permisos OWNER TO postgres;

--
-- Name: VIEW vw_permisos; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON VIEW audit.vw_permisos IS 'Permisos actuales sobre objetos del schema audit. Usar para verificar la correcta configuración de seguridad.';


--
-- Name: vw_resumen_accesos; Type: VIEW; Schema: audit; Owner: postgres
--

CREATE VIEW audit.vw_resumen_accesos AS
 SELECT (date_trunc('day'::text, audit_timestamp))::date AS fecha,
    evento,
    count(*) AS total,
    count(DISTINCT usuario_nombre) AS usuarios_unicos,
    count(DISTINCT ip_address) AS ips_distintas
   FROM audit.sesion
  WHERE (audit_timestamp > (now() - '7 days'::interval))
  GROUP BY ((date_trunc('day'::text, audit_timestamp))::date), evento
  ORDER BY ((date_trunc('day'::text, audit_timestamp))::date) DESC, evento;


ALTER VIEW audit.vw_resumen_accesos OWNER TO postgres;

--
-- Name: VIEW vw_resumen_accesos; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON VIEW audit.vw_resumen_accesos IS 'Resumen diario de eventos de sesión de los últimos 7 días. Permite visualizar picos de uso o de fallos de autenticación.';


--
-- Name: vw_resumen_diario; Type: VIEW; Schema: audit; Owner: postgres
--

CREATE VIEW audit.vw_resumen_diario AS
 SELECT (date_trunc('day'::text, audit_timestamp))::date AS fecha,
    tabla_nombre,
    operacion,
    count(*) AS total,
    count(DISTINCT usuario_id) AS usuarios_unicos,
    round(avg(duracion_ms), 3) AS duracion_prom_ms,
    round(max(duracion_ms), 3) AS duracion_max_ms
   FROM audit.registro
  WHERE (audit_timestamp > (now() - '30 days'::interval))
  GROUP BY ((date_trunc('day'::text, audit_timestamp))::date), tabla_nombre, operacion
  ORDER BY ((date_trunc('day'::text, audit_timestamp))::date) DESC, (count(*)) DESC;


ALTER VIEW audit.vw_resumen_diario OWNER TO postgres;

--
-- Name: VIEW vw_resumen_diario; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON VIEW audit.vw_resumen_diario IS 'Estadísticas diarias de auditoría por tabla y operación (últimos 30 días). Útil para dashboards y reportes de compliance.';


--
-- Name: documento; Type: TABLE; Schema: documents; Owner: postgres
--

CREATE TABLE documents.documento (
    documento_id uuid DEFAULT gen_random_uuid() NOT NULL,
    tipo_documento_id integer NOT NULL,
    nombre_original text NOT NULL,
    nombre_almacenamiento text NOT NULL,
    storage_provider text DEFAULT 'MINIO'::text NOT NULL,
    storage_bucket text NOT NULL,
    storage_path text NOT NULL,
    mime_type text NOT NULL,
    file_size_bytes bigint NOT NULL,
    file_hash_sha256 character varying(64) NOT NULL,
    estado character varying(50) DEFAULT 'CARGADO'::character varying NOT NULL,
    nivel_acceso character varying(50) DEFAULT 'PRIVADO'::character varying NOT NULL,
    roles_permitidos text[] DEFAULT ARRAY[]::text[] NOT NULL,
    motivo_rechazo text,
    metadatos_extras jsonb DEFAULT '{}'::jsonb NOT NULL,
    uploaded_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT documento_file_size_bytes_check CHECK ((file_size_bytes > 0))
);


ALTER TABLE documents.documento OWNER TO postgres;

--
-- Name: TABLE documento; Type: COMMENT; Schema: documents; Owner: postgres
--

COMMENT ON TABLE documents.documento IS 'Tabla central que almacena los metadatos y referencias físicas de almacenamiento de los documentos.';


--
-- Name: estado_documento; Type: TABLE; Schema: documents; Owner: postgres
--

CREATE TABLE documents.estado_documento (
    estado_id character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE documents.estado_documento OWNER TO postgres;

--
-- Name: TABLE estado_documento; Type: COMMENT; Schema: documents; Owner: postgres
--

COMMENT ON TABLE documents.estado_documento IS 'Catálogo extensible de estados de validación por los que pasa un documento.';


--
-- Name: historial_documento; Type: TABLE; Schema: documents; Owner: postgres
--

CREATE TABLE documents.historial_documento (
    historial_id integer NOT NULL,
    documento_id uuid NOT NULL,
    estado_anterior character varying(50),
    estado_nuevo character varying(50) NOT NULL,
    motivo text,
    realizado_por uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE documents.historial_documento OWNER TO postgres;

--
-- Name: TABLE historial_documento; Type: COMMENT; Schema: documents; Owner: postgres
--

COMMENT ON TABLE documents.historial_documento IS 'Trazabilidad y log histórico de estados por los que ha pasado cada documento.';


--
-- Name: historial_documento_historial_id_seq; Type: SEQUENCE; Schema: documents; Owner: postgres
--

CREATE SEQUENCE documents.historial_documento_historial_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE documents.historial_documento_historial_id_seq OWNER TO postgres;

--
-- Name: historial_documento_historial_id_seq; Type: SEQUENCE OWNED BY; Schema: documents; Owner: postgres
--

ALTER SEQUENCE documents.historial_documento_historial_id_seq OWNED BY documents.historial_documento.historial_id;


--
-- Name: nivel_acceso; Type: TABLE; Schema: documents; Owner: postgres
--

CREATE TABLE documents.nivel_acceso (
    nivel_id character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE documents.nivel_acceso OWNER TO postgres;

--
-- Name: TABLE nivel_acceso; Type: COMMENT; Schema: documents; Owner: postgres
--

COMMENT ON TABLE documents.nivel_acceso IS 'Catálogo extensible de niveles de visibilidad y acceso asignados a un documento.';


--
-- Name: relacion_acometida; Type: TABLE; Schema: documents; Owner: postgres
--

CREATE TABLE documents.relacion_acometida (
    documento_id uuid NOT NULL,
    acometida_id character varying(10) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE documents.relacion_acometida OWNER TO postgres;

--
-- Name: relacion_factura; Type: TABLE; Schema: documents; Owner: postgres
--

CREATE TABLE documents.relacion_factura (
    documento_id uuid NOT NULL,
    factura_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE documents.relacion_factura OWNER TO postgres;

--
-- Name: relacion_lectura; Type: TABLE; Schema: documents; Owner: postgres
--

CREATE TABLE documents.relacion_lectura (
    documento_id uuid NOT NULL,
    lectura_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE documents.relacion_lectura OWNER TO postgres;

--
-- Name: relacion_orden_trabajo; Type: TABLE; Schema: documents; Owner: postgres
--

CREATE TABLE documents.relacion_orden_trabajo (
    documento_id uuid NOT NULL,
    orden_trabajo_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE documents.relacion_orden_trabajo OWNER TO postgres;

--
-- Name: relacion_predio; Type: TABLE; Schema: documents; Owner: postgres
--

CREATE TABLE documents.relacion_predio (
    documento_id uuid NOT NULL,
    predio_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE documents.relacion_predio OWNER TO postgres;

--
-- Name: relacion_solicitud; Type: TABLE; Schema: documents; Owner: postgres
--

CREATE TABLE documents.relacion_solicitud (
    documento_id uuid NOT NULL,
    solicitud_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE documents.relacion_solicitud OWNER TO postgres;

--
-- Name: relacion_usuarios; Type: TABLE; Schema: documents; Owner: postgres
--

CREATE TABLE documents.relacion_usuarios (
    documento_id uuid NOT NULL,
    usuario_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE documents.relacion_usuarios OWNER TO postgres;

--
-- Name: tipo_documento; Type: TABLE; Schema: documents; Owner: postgres
--

CREATE TABLE documents.tipo_documento (
    tipo_documento_id integer NOT NULL,
    codigo text NOT NULL,
    nombre text NOT NULL,
    extensiones_permitidas text[] DEFAULT ARRAY['pdf'::text, 'jpg'::text, 'jpeg'::text, 'png'::text] NOT NULL,
    tamano_maximo_mb numeric(5,2) DEFAULT 5.00 NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    requiere_firma boolean DEFAULT false NOT NULL,
    descripcion text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE documents.tipo_documento OWNER TO postgres;

--
-- Name: TABLE tipo_documento; Type: COMMENT; Schema: documents; Owner: postgres
--

COMMENT ON TABLE documents.tipo_documento IS 'Catálogo de tipos de documentos permitidos con validaciones asociadas.';


--
-- Name: tipo_documento_tipo_documento_id_seq; Type: SEQUENCE; Schema: documents; Owner: postgres
--

CREATE SEQUENCE documents.tipo_documento_tipo_documento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE documents.tipo_documento_tipo_documento_id_seq OWNER TO postgres;

--
-- Name: tipo_documento_tipo_documento_id_seq; Type: SEQUENCE OWNED BY; Schema: documents; Owner: postgres
--

ALTER SEQUENCE documents.tipo_documento_tipo_documento_id_seq OWNED BY documents.tipo_documento.tipo_documento_id;


--
-- Name: canal; Type: TABLE; Schema: notifications; Owner: postgres
--

CREATE TABLE notifications.canal (
    id_canal integer NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    activo boolean DEFAULT true NOT NULL
);


ALTER TABLE notifications.canal OWNER TO postgres;

--
-- Name: TABLE canal; Type: COMMENT; Schema: notifications; Owner: postgres
--

COMMENT ON TABLE notifications.canal IS 'Canales de comunicación soportados por el sistema (ej. IN_APP, EMAIL, SMS).';


--
-- Name: canal_id_canal_seq; Type: SEQUENCE; Schema: notifications; Owner: postgres
--

ALTER TABLE notifications.canal ALTER COLUMN id_canal ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME notifications.canal_id_canal_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: estado_envio; Type: TABLE; Schema: notifications; Owner: postgres
--

CREATE TABLE notifications.estado_envio (
    id_estado_envio integer NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255)
);


ALTER TABLE notifications.estado_envio OWNER TO postgres;

--
-- Name: TABLE estado_envio; Type: COMMENT; Schema: notifications; Owner: postgres
--

COMMENT ON TABLE notifications.estado_envio IS 'Estados posibles en el ciclo de vida del envío de una notificación (ej. PENDING, SENT, FAILED).';


--
-- Name: estado_envio_id_estado_envio_seq; Type: SEQUENCE; Schema: notifications; Owner: postgres
--

ALTER TABLE notifications.estado_envio ALTER COLUMN id_estado_envio ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME notifications.estado_envio_id_estado_envio_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: prioridad; Type: TABLE; Schema: notifications; Owner: postgres
--

CREATE TABLE notifications.prioridad (
    id_prioridad integer NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    nivel integer NOT NULL
);


ALTER TABLE notifications.prioridad OWNER TO postgres;

--
-- Name: TABLE prioridad; Type: COMMENT; Schema: notifications; Owner: postgres
--

COMMENT ON TABLE notifications.prioridad IS 'Nivel de urgencia de la notificación para procesamiento prioritario del worker.';


--
-- Name: prioridad_id_prioridad_seq; Type: SEQUENCE; Schema: notifications; Owner: postgres
--

ALTER TABLE notifications.prioridad ALTER COLUMN id_prioridad ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME notifications.prioridad_id_prioridad_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: template; Type: TABLE; Schema: notifications; Owner: postgres
--

CREATE TABLE notifications.template (
    template_id integer NOT NULL,
    codigo character varying(100) NOT NULL,
    titulo_template character varying(255) NOT NULL,
    cuerpo_template text NOT NULL,
    id_canal_predeterminado integer NOT NULL,
    id_prioridad_predeterminada integer NOT NULL,
    requiere_accion boolean DEFAULT false NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE notifications.template OWNER TO postgres;

--
-- Name: TABLE template; Type: COMMENT; Schema: notifications; Owner: postgres
--

COMMENT ON TABLE notifications.template IS 'Plantillas parametrizadas con variables {{ejemplo}} para normalizar los mensajes del sistema.';


--
-- Name: template_template_id_seq; Type: SEQUENCE; Schema: notifications; Owner: postgres
--

ALTER TABLE notifications.template ALTER COLUMN template_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME notifications.template_template_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: user_notification; Type: TABLE; Schema: notifications; Owner: postgres
--

CREATE TABLE notifications.user_notification (
    notification_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_usuario uuid NOT NULL,
    id_canal integer NOT NULL,
    id_prioridad integer NOT NULL,
    titulo character varying(255) NOT NULL,
    cuerpo text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    entidad_tipo character varying(100),
    entidad_id uuid,
    id_estado_envio integer NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    read_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE notifications.user_notification OWNER TO postgres;

--
-- Name: TABLE user_notification; Type: COMMENT; Schema: notifications; Owner: postgres
--

COMMENT ON TABLE notifications.user_notification IS 'Historial central de notificaciones asignadas a usuarios específicos del sistema.';


--
-- Name: user_notification_dispatch_log; Type: TABLE; Schema: notifications; Owner: postgres
--

CREATE TABLE notifications.user_notification_dispatch_log (
    dispatch_log_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    notification_id uuid NOT NULL,
    id_estado_envio integer NOT NULL,
    provider_response jsonb DEFAULT '{}'::jsonb NOT NULL,
    error_message text,
    dispatched_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE notifications.user_notification_dispatch_log OWNER TO postgres;

--
-- Name: TABLE user_notification_dispatch_log; Type: COMMENT; Schema: notifications; Owner: postgres
--

COMMENT ON TABLE notifications.user_notification_dispatch_log IS 'Log histórico detallado de los intentos de envío y respuestas de proveedores externos (SMTP, Twilio, Firebase).';


--
-- Name: acometida; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.acometida (
    acometida_id character varying(10) NOT NULL,
    cliente_id character varying(13) NOT NULL,
    tarifa_id integer NOT NULL,
    numero_medidor character varying(20),
    sector integer NOT NULL,
    cuenta integer NOT NULL,
    clave_catastral character varying(10) NOT NULL,
    numero_contrato character varying(20),
    alcantarillado boolean NOT NULL,
    estado boolean,
    observaciones character varying(255),
    direccion character varying(255),
    fecha_instalacion timestamp without time zone,
    numero_personas integer,
    zona integer,
    coordenadas public.geometry(Point,4326),
    referencia character varying(255),
    metadata jsonb,
    altitud double precision,
    "precision" double precision,
    fecha_geolocalizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    zona_geometrica public.geometry(Polygon,4326),
    predio_clave_catastral character varying(25),
    fecha_inicio_lecturas date,
    zona_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    estado_id integer,
    zona_code character varying(20),
    zona_name character varying(155),
    tipo_acometida character varying(50)
);


ALTER TABLE public.acometida OWNER TO postgres;

--
-- Name: alerta_lectura_anomala; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alerta_lectura_anomala (
    alerta_id integer NOT NULL,
    acometida_id character varying(10) NOT NULL,
    lectura_id integer,
    tipo_anomalia character varying(50) NOT NULL,
    fecha_esperada date,
    fecha_registrada date,
    meses_diferencia integer,
    lectura_actual numeric(10,2),
    consumo_calculado numeric(10,2),
    mensaje_sistema text,
    estado_revision character varying(20) DEFAULT 'PENDIENTE'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.alerta_lectura_anomala OWNER TO postgres;

--
-- Name: TABLE alerta_lectura_anomala; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.alerta_lectura_anomala IS 'Tabla de auditoría para registrar lecturas que saltan meses, tienen fechas futuras extremas o retroactivas, permitiendo control preventivo por parte de facturación y soporte.';


--
-- Name: COLUMN alerta_lectura_anomala.tipo_anomalia; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.alerta_lectura_anomala.tipo_anomalia IS 'Ejemplos: SALTO_MESES_FUTURO, SALTO_FUTURO_EXTREMO, LECTURA_RETROACTIVA';


--
-- Name: alerta_lectura_anomala_alerta_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alerta_lectura_anomala_alerta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alerta_lectura_anomala_alerta_id_seq OWNER TO postgres;

--
-- Name: alerta_lectura_anomala_alerta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alerta_lectura_anomala_alerta_id_seq OWNED BY public.alerta_lectura_anomala.alerta_id;


--
-- Name: auditoria_lectura_sector; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auditoria_lectura_sector (
    audit_id integer NOT NULL,
    sector_id integer NOT NULL,
    total_esperado integer DEFAULT 0,
    total_completadas integer DEFAULT 0,
    total_pendientes integer GENERATED ALWAYS AS (
CASE
    WHEN ((total_esperado - total_completadas) < 0) THEN 0
    ELSE (total_esperado - total_completadas)
END) STORED,
    avance_porcentaje numeric(5,2) GENERATED ALWAYS AS (
CASE
    WHEN (total_esperado > 0) THEN LEAST((((total_completadas)::numeric / (total_esperado)::numeric) * (100)::numeric), (100)::numeric)
    ELSE (0)::numeric
END) STORED,
    completo boolean DEFAULT false,
    fecha_cierre timestamp with time zone,
    usuario_supervisor_id uuid,
    observaciones text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    mes_lectura character(7) NOT NULL
);


ALTER TABLE public.auditoria_lectura_sector OWNER TO postgres;

--
-- Name: auditoria_lectura_sector_audit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auditoria_lectura_sector_audit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.auditoria_lectura_sector_audit_id_seq OWNER TO postgres;

--
-- Name: auditoria_lectura_sector_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auditoria_lectura_sector_audit_id_seq OWNED BY public.auditoria_lectura_sector.audit_id;


--
-- Name: canton; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.canton (
    canton_id character varying(8) NOT NULL,
    nombre character varying(100) NOT NULL,
    provincia_id character varying(8) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.canton OWNER TO postgres;

--
-- Name: cargo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cargo (
    cargo_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    nivel_jerarquico smallint DEFAULT 0,
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.cargo OWNER TO postgres;

--
-- Name: cargo_cargo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cargo_cargo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cargo_cargo_id_seq OWNER TO postgres;

--
-- Name: cargo_cargo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cargo_cargo_id_seq OWNED BY public.cargo.cargo_id;


--
-- Name: cat_action_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cat_action_types (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cat_action_types OWNER TO postgres;

--
-- Name: TABLE cat_action_types; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.cat_action_types IS 'Catalog for system audit and user action types.';


--
-- Name: COLUMN cat_action_types.code; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.cat_action_types.code IS 'Short uppercase unique identifier for the action.';


--
-- Name: cat_action_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cat_action_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cat_action_types_id_seq OWNER TO postgres;

--
-- Name: cat_action_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cat_action_types_id_seq OWNED BY public.cat_action_types.id;


--
-- Name: cat_estados_acometida; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cat_estados_acometida (
    id_estado integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion text,
    permite_facturar boolean DEFAULT true,
    requiere_inspeccion boolean DEFAULT false,
    permite_lectura boolean DEFAULT true
);


ALTER TABLE public.cat_estados_acometida OWNER TO postgres;

--
-- Name: categoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categoria (
    categoria_id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.categoria OWNER TO postgres;

--
-- Name: categoria_categoria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categoria_categoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categoria_categoria_id_seq OWNER TO postgres;

--
-- Name: categoria_categoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categoria_categoria_id_seq OWNED BY public.categoria.categoria_id;


--
-- Name: categoria_incidente_medidor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categoria_incidente_medidor (
    categoria_incidente_id integer NOT NULL,
    codigo character varying(30) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.categoria_incidente_medidor OWNER TO postgres;

--
-- Name: categoria_incidente_medidor_categoria_incidente_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categoria_incidente_medidor_categoria_incidente_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categoria_incidente_medidor_categoria_incidente_id_seq OWNER TO postgres;

--
-- Name: categoria_incidente_medidor_categoria_incidente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categoria_incidente_medidor_categoria_incidente_id_seq OWNED BY public.categoria_incidente_medidor.categoria_incidente_id;


--
-- Name: ciudadano; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ciudadano (
    ciudadano_id character varying(10) NOT NULL,
    nombres character varying(100) DEFAULT 'SIN NOMBRE'::character varying,
    apellidos character varying(100) DEFAULT 'SIN APELLIDO'::character varying,
    fecha_nacimiento date,
    fallecido boolean DEFAULT false NOT NULL,
    sexo_id integer NOT NULL,
    estado_civil_id integer NOT NULL,
    profesion_id integer NOT NULL,
    parroquia_id character varying(10) NOT NULL,
    direccion character varying(255) DEFAULT 'SIN DIRECCION'::character varying,
    pais_origen character varying(100),
    updated_at timestamp without time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.ciudadano OWNER TO postgres;

--
-- Name: claves_sql2000; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.claves_sql2000 (
    id integer NOT NULL,
    clave_catastral character varying(15) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.claves_sql2000 OWNER TO postgres;

--
-- Name: claves_sql2000_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.claves_sql2000_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.claves_sql2000_id_seq OWNER TO postgres;

--
-- Name: claves_sql2000_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.claves_sql2000_id_seq OWNED BY public.claves_sql2000.id;


--
-- Name: cliente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cliente (
    cliente_id character varying(13) NOT NULL,
    tipo_identificacion_id character varying(5) NOT NULL,
    cliente_id_valido character varying(20) NOT NULL,
    create_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.cliente OWNER TO postgres;

--
-- Name: correo_electronico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.correo_electronico (
    correo_electronico_id integer NOT NULL,
    email character varying(150) CONSTRAINT correo_electronico_correo_not_null NOT NULL,
    cliente_id character varying(13) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.correo_electronico OWNER TO postgres;

--
-- Name: telefono; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.telefono (
    telefono_id integer NOT NULL,
    cliente_id character varying(13) NOT NULL,
    numero character varying(20) NOT NULL,
    tipo_telefono_id integer NOT NULL,
    es_valido boolean DEFAULT false CONSTRAINT telefono_es_validado_not_null NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.telefono OWNER TO postgres;

--
-- Name: cliente_contacto; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.cliente_contacto AS
 SELECT c.cliente_id,
    COALESCE(json_agg(DISTINCT jsonb_build_object('telefono_id', t.telefono_id, 'numero', t.numero)) FILTER (WHERE (t.telefono_id IS NOT NULL)), '[]'::json) AS phones,
    COALESCE(json_agg(DISTINCT jsonb_build_object('correo_electronico_id', ce.correo_electronico_id, 'correo', ce.email)) FILTER (WHERE (ce.correo_electronico_id IS NOT NULL)), '[]'::json) AS correos
   FROM ((public.cliente c
     LEFT JOIN public.telefono t ON (((t.cliente_id)::text = (c.cliente_id)::text)))
     LEFT JOIN public.correo_electronico ce ON (((ce.cliente_id)::text = (c.cliente_id)::text)))
  GROUP BY c.cliente_id;


ALTER VIEW public.cliente_contacto OWNER TO postgres;

--
-- Name: cliente_persona_natural; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cliente_persona_natural (
    cliente_persona_natural_id integer NOT NULL,
    ciudadano_id character varying(10) NOT NULL,
    cliente_id character varying(13) NOT NULL,
    direccion_acometida character varying(255) DEFAULT 'SIN DIRECCION'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.cliente_persona_natural OWNER TO postgres;

--
-- Name: cliente_persona_natural_cliente_persona_natural_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cliente_persona_natural_cliente_persona_natural_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cliente_persona_natural_cliente_persona_natural_id_seq OWNER TO postgres;

--
-- Name: cliente_persona_natural_cliente_persona_natural_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cliente_persona_natural_cliente_persona_natural_id_seq OWNED BY public.cliente_persona_natural.cliente_persona_natural_id;


--
-- Name: cliente_usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cliente_usuario (
    cliente_usuario_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    cliente_id character varying(13) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash character varying(255),
    auth_method character varying(50) DEFAULT 'PASSWORD'::character varying NOT NULL,
    auth_provider character varying(50),
    estado_cliente_usuario_id integer DEFAULT 2 NOT NULL,
    is_active boolean GENERATED ALWAYS AS ((estado_cliente_usuario_id = 1)) STORED NOT NULL,
    fecha_registro timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_ultimo_acceso timestamp with time zone,
    failed_attempts integer DEFAULT 0,
    lockout_until timestamp with time zone,
    is_locked_out boolean DEFAULT false NOT NULL,
    two_factor_enabled boolean DEFAULT false,
    two_factor_secret character varying(255),
    two_factor_backup_codes text[],
    email_verified boolean DEFAULT false,
    telefono_verified boolean DEFAULT false,
    verification_token character varying(255),
    verification_expiry timestamp with time zone,
    reset_token character varying(255),
    reset_token_expiry timestamp with time zone,
    preferencias jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    deleted_at timestamp with time zone,
    CONSTRAINT chk_reset_expiry CHECK (((reset_token_expiry IS NULL) OR (reset_token_expiry > CURRENT_TIMESTAMP))),
    CONSTRAINT cliente_usuario_failed_attempts_check CHECK ((failed_attempts >= 0))
);


ALTER TABLE public.cliente_usuario OWNER TO postgres;

--
-- Name: cliente_usuario_permisos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cliente_usuario_permisos (
    cliente_usuario_permiso_id integer NOT NULL,
    cliente_usuario_id uuid NOT NULL,
    permiso_id integer NOT NULL,
    fecha_asignacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.cliente_usuario_permisos OWNER TO postgres;

--
-- Name: cliente_usuario_permisos_cliente_usuario_permiso_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.cliente_usuario_permisos ALTER COLUMN cliente_usuario_permiso_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.cliente_usuario_permisos_cliente_usuario_permiso_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: cliente_usuario_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cliente_usuario_roles (
    cliente_usuario_rol_id integer NOT NULL,
    cliente_usuario_id uuid NOT NULL,
    rol_id integer NOT NULL,
    fecha_asignacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.cliente_usuario_roles OWNER TO postgres;

--
-- Name: cliente_usuario_roles_cliente_usuario_rol_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.cliente_usuario_roles ALTER COLUMN cliente_usuario_rol_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.cliente_usuario_roles_cliente_usuario_rol_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: componentes_fijos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.componentes_fijos (
    id integer NOT NULL,
    tarifa_id integer NOT NULL,
    servicio_id integer,
    componente_nombre character varying(100) NOT NULL,
    valor numeric(10,4) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.componentes_fijos OWNER TO postgres;

--
-- Name: componentes_fijos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.componentes_fijos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.componentes_fijos_id_seq OWNER TO postgres;

--
-- Name: componentes_fijos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.componentes_fijos_id_seq OWNED BY public.componentes_fijos.id;


--
-- Name: consumo_promedio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.consumo_promedio (
    acometida_id character varying(50) NOT NULL,
    average_consumption numeric(18,2) NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    lecturas_usadas integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.consumo_promedio OWNER TO postgres;

--
-- Name: correo_electronico_correo_electronico_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.correo_electronico_correo_electronico_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.correo_electronico_correo_electronico_id_seq OWNER TO postgres;

--
-- Name: correo_electronico_correo_electronico_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.correo_electronico_correo_electronico_id_seq OWNED BY public.correo_electronico.correo_electronico_id;


--
-- Name: correo_empresa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.correo_empresa (
    correo_empresa_id integer NOT NULL,
    correo_electronico_id integer NOT NULL,
    empresa_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.correo_empresa OWNER TO postgres;

--
-- Name: correo_empresa_correo_empresa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.correo_empresa_correo_empresa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.correo_empresa_correo_empresa_id_seq OWNER TO postgres;

--
-- Name: correo_empresa_correo_empresa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.correo_empresa_correo_empresa_id_seq OWNED BY public.correo_empresa.correo_empresa_id;


--
-- Name: correo_persona_natural; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.correo_persona_natural (
    correo_persona_natural_id integer NOT NULL,
    correo_electronico_id integer NOT NULL,
    cliente_persona_natural_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.correo_persona_natural OWNER TO postgres;

--
-- Name: correo_persona_natural_correo_persona_natural_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.correo_persona_natural_correo_persona_natural_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.correo_persona_natural_correo_persona_natural_id_seq OWNER TO postgres;

--
-- Name: correo_persona_natural_correo_persona_natural_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.correo_persona_natural_correo_persona_natural_id_seq OWNED BY public.correo_persona_natural.correo_persona_natural_id;


--
-- Name: direccion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.direccion (
    direccion_id integer NOT NULL,
    calle_principal character varying(100) NOT NULL,
    calle_secundaria character varying(100),
    numero character varying(20),
    parroquia_id character varying(10) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.direccion OWNER TO postgres;

--
-- Name: direccion_direccion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.direccion_direccion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.direccion_direccion_id_seq OWNER TO postgres;

--
-- Name: direccion_direccion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.direccion_direccion_id_seq OWNED BY public.direccion.direccion_id;


--
-- Name: empleado_zona; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empleado_zona (
    empleado_id uuid NOT NULL,
    zona_id integer NOT NULL,
    fecha_asignacion date DEFAULT CURRENT_DATE,
    fecha_fin date,
    es_principal boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.empleado_zona OWNER TO postgres;

--
-- Name: empleados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empleados (
    empleado_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    usuario_id uuid NOT NULL,
    ciudadano_id character varying(10),
    cedula character varying(10),
    nombres character varying(100) DEFAULT 'SIN NOMBRE'::character varying NOT NULL,
    apellidos character varying(100) DEFAULT 'SIN APELLIDO'::character varying NOT NULL,
    fecha_nacimiento date,
    sexo_id integer,
    cargo_id integer NOT NULL,
    tipo_contrato_id integer NOT NULL,
    estado_empleado_id integer DEFAULT 1 NOT NULL,
    fecha_ingreso date,
    fecha_salida date,
    salario_base numeric(12,2),
    supervisor_id uuid,
    zonas_asignadas integer[],
    licencia_conducir character varying(20),
    tiene_vehiculo_empresa boolean DEFAULT false,
    telefono_interno character varying(20),
    email_interno character varying(150),
    foto_url character varying(255),
    metadata jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    deleted_at timestamp with time zone,
    CONSTRAINT chk_fecha_salida CHECK (((fecha_salida IS NULL) OR (fecha_salida > fecha_ingreso)))
);


ALTER TABLE public.empleados OWNER TO postgres;

--
-- Name: empresa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empresa (
    empresa_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nombre_comercial character varying(255),
    razon_social character varying(255),
    ruc character varying(13),
    direccion character varying(255) DEFAULT 'SIN DIRECCION'::character varying,
    parroquia_id character varying(10) NOT NULL,
    cliente_id character varying(13) NOT NULL,
    create_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    pais character varying(100),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.empresa OWNER TO postgres;

--
-- Name: estado_civil; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estado_civil (
    estado_civil_id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.estado_civil OWNER TO postgres;

--
-- Name: estado_civil_estado_civil_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estado_civil_estado_civil_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estado_civil_estado_civil_id_seq OWNER TO postgres;

--
-- Name: estado_civil_estado_civil_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estado_civil_estado_civil_id_seq OWNED BY public.estado_civil.estado_civil_id;


--
-- Name: estado_cliente_usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estado_cliente_usuario (
    estado_cliente_usuario_id integer NOT NULL,
    codigo character varying(30) NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion text,
    permite_login boolean DEFAULT true NOT NULL,
    requiere_verificacion boolean DEFAULT false,
    color_ui character varying(20) DEFAULT '#000000'::character varying,
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.estado_cliente_usuario OWNER TO postgres;

--
-- Name: estado_cliente_usuario_estado_cliente_usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estado_cliente_usuario_estado_cliente_usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estado_cliente_usuario_estado_cliente_usuario_id_seq OWNER TO postgres;

--
-- Name: estado_cliente_usuario_estado_cliente_usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estado_cliente_usuario_estado_cliente_usuario_id_seq OWNED BY public.estado_cliente_usuario.estado_cliente_usuario_id;


--
-- Name: estado_empleado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estado_empleado (
    estado_empleado_id integer NOT NULL,
    codigo character varying(20) NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion text,
    permite_acceso_sistema boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.estado_empleado OWNER TO postgres;

--
-- Name: estado_empleado_estado_empleado_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estado_empleado_estado_empleado_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estado_empleado_estado_empleado_id_seq OWNER TO postgres;

--
-- Name: estado_empleado_estado_empleado_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estado_empleado_estado_empleado_id_seq OWNED BY public.estado_empleado.estado_empleado_id;


--
-- Name: estado_pago; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estado_pago (
    estado_pago_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.estado_pago OWNER TO postgres;

--
-- Name: estado_pago_estado_pago_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estado_pago_estado_pago_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estado_pago_estado_pago_id_seq OWNER TO postgres;

--
-- Name: estado_pago_estado_pago_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estado_pago_estado_pago_id_seq OWNED BY public.estado_pago.estado_pago_id;


--
-- Name: factura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.factura (
    factura_id integer NOT NULL,
    cliente_id character varying(13) NOT NULL,
    forma_pago_id integer NOT NULL,
    estado_pago_id integer NOT NULL,
    numero_factura character varying(20) NOT NULL,
    fecha_pago timestamp without time zone,
    fecha_vencimiento timestamp without time zone NOT NULL,
    numero_serie character varying(20) NOT NULL,
    generado_xml boolean DEFAULT false NOT NULL,
    numero_xml character varying(20),
    valor_factura numeric(18,2) NOT NULL,
    iva numeric(18,2) NOT NULL,
    sub_total numeric(18,2) NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.factura OWNER TO postgres;

--
-- Name: factura_factura_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.factura_factura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.factura_factura_id_seq OWNER TO postgres;

--
-- Name: factura_factura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.factura_factura_id_seq OWNED BY public.factura.factura_id;


--
-- Name: forma_pago; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forma_pago (
    forma_pago_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.forma_pago OWNER TO postgres;

--
-- Name: forma_pago_forma_pago_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.forma_pago_forma_pago_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.forma_pago_forma_pago_id_seq OWNER TO postgres;

--
-- Name: forma_pago_forma_pago_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.forma_pago_forma_pago_id_seq OWNED BY public.forma_pago.forma_pago_id;


--
-- Name: foto_acometida; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.foto_acometida (
    foto_acometida_id integer NOT NULL,
    acometida_id character varying(10) NOT NULL,
    imagen_url character varying(255) NOT NULL,
    descripcion character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.foto_acometida OWNER TO postgres;

--
-- Name: foto_acometida_foto_acometida_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.foto_acometida_foto_acometida_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.foto_acometida_foto_acometida_id_seq OWNER TO postgres;

--
-- Name: foto_acometida_foto_acometida_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.foto_acometida_foto_acometida_id_seq OWNED BY public.foto_acometida.foto_acometida_id;


--
-- Name: foto_incidente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.foto_incidente (
    foto_incidente_id integer NOT NULL,
    ruta_archivo character varying(255) NOT NULL,
    tipo_foto character varying(20) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    incidente_id uuid NOT NULL,
    CONSTRAINT chk_foto_incidente_tipo CHECK (((tipo_foto)::text = ANY (ARRAY[('REPORTE'::character varying)::text, ('RESOLUCION'::character varying)::text])))
);


ALTER TABLE public.foto_incidente OWNER TO postgres;

--
-- Name: foto_incidente_foto_incidente_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.foto_incidente_foto_incidente_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.foto_incidente_foto_incidente_id_seq OWNER TO postgres;

--
-- Name: foto_incidente_foto_incidente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.foto_incidente_foto_incidente_id_seq OWNED BY public.foto_incidente.foto_incidente_id;


--
-- Name: foto_lectura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.foto_lectura (
    foto_lectura_id integer NOT NULL,
    lectura_id integer NOT NULL,
    imagen_url character varying(255) NOT NULL,
    clave_catastral character varying(10) NOT NULL,
    descripcion character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.foto_lectura OWNER TO postgres;

--
-- Name: foto_lectura_copia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.foto_lectura_copia (
    foto_lectura_id integer,
    lectura_id integer,
    imagen_url character varying(255),
    clave_catastral character varying(10),
    descripcion character varying(255),
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.foto_lectura_copia OWNER TO postgres;

--
-- Name: foto_lectura_foto_lectura_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.foto_lectura_foto_lectura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.foto_lectura_foto_lectura_id_seq OWNER TO postgres;

--
-- Name: foto_lectura_foto_lectura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.foto_lectura_foto_lectura_id_seq OWNED BY public.foto_lectura.foto_lectura_id;


--
-- Name: historial_estados_acometida; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_estados_acometida (
    id integer NOT NULL,
    acometida_id character varying(15),
    estado_id integer,
    fecha_cambio timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    usuario_id uuid,
    motivo text,
    activo boolean DEFAULT true,
    detalles_tecnicos jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE public.historial_estados_acometida OWNER TO postgres;

--
-- Name: historial_estados_acometida_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historial_estados_acometida_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historial_estados_acometida_id_seq OWNER TO postgres;

--
-- Name: historial_estados_acometida_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historial_estados_acometida_id_seq OWNED BY public.historial_estados_acometida.id;


--
-- Name: historial_incidente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_incidente (
    historial_id integer NOT NULL,
    estado_anterior character varying(20),
    estado_nuevo character varying(20) NOT NULL,
    usuario_id uuid,
    observacion text,
    fecha_cambio timestamp with time zone DEFAULT now() NOT NULL,
    incidente_id uuid NOT NULL,
    CONSTRAINT chk_historial_estado_anterior CHECK (((estado_anterior)::text = ANY (ARRAY[('REPORTADO'::character varying)::text, ('EN_INSPECCION'::character varying)::text, ('RESUELTO'::character varying)::text, ('FALSO_REPORTE'::character varying)::text]))),
    CONSTRAINT chk_historial_estado_nuevo CHECK (((estado_nuevo)::text = ANY (ARRAY[('REPORTADO'::character varying)::text, ('EN_INSPECCION'::character varying)::text, ('RESUELTO'::character varying)::text, ('FALSO_REPORTE'::character varying)::text])))
);


ALTER TABLE public.historial_incidente OWNER TO postgres;

--
-- Name: historial_incidente_historial_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historial_incidente_historial_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historial_incidente_historial_id_seq OWNER TO postgres;

--
-- Name: historial_incidente_historial_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historial_incidente_historial_id_seq OWNED BY public.historial_incidente.historial_id;


--
-- Name: historial_medidores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_medidores (
    id_historial_medidor uuid DEFAULT gen_random_uuid() NOT NULL,
    id_cliente character varying(13) NOT NULL,
    id_acometida character varying(10) NOT NULL,
    numero_medidor_anterior character varying(100) NOT NULL,
    numero_medidor_nuevo character varying(100) NOT NULL,
    fecha_instalacion timestamp without time zone NOT NULL,
    fecha_desinstalacion timestamp without time zone,
    estado character varying(20) DEFAULT 'ACTIVO'::character varying NOT NULL,
    observacion character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_estado_historial CHECK (((estado)::text = ANY (ARRAY[('ACTIVO'::character varying)::text, ('INACTIVO'::character varying)::text])))
);


ALTER TABLE public.historial_medidores OWNER TO postgres;

--
-- Name: TABLE historial_medidores; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.historial_medidores IS 'Registro histórico de la asignación e instalación de medidores en las acometidas de los clientes.';


--
-- Name: incidente_medidor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.incidente_medidor (
    acometida_id character varying(10),
    lectura_id integer,
    tipo_incidente_id integer NOT NULL,
    descripcion_reporte text NOT NULL,
    direccion_referencia character varying(255),
    estado character varying(20) DEFAULT 'REPORTADO'::character varying NOT NULL,
    origen_reporte character varying(30) DEFAULT 'LECTURISTA'::character varying NOT NULL,
    prioridad character varying(10) DEFAULT 'MEDIA'::character varying NOT NULL,
    fecha_reporte timestamp with time zone DEFAULT now() NOT NULL,
    usuario_reporta_id uuid,
    cliente_usuario_reporta_id uuid,
    coordenadas public.geometry(Point,4326),
    fecha_resolucion timestamp with time zone,
    usuario_resuelve_id uuid,
    descripcion_resolucion text,
    cobrar_a_usuario boolean DEFAULT false NOT NULL,
    costo_reparacion numeric(10,2) DEFAULT 0.00 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    incidente_id uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo_incidente character varying(30) DEFAULT public.generar_codigo_incidente(),
    datos_reportante jsonb,
    CONSTRAINT chk_incidente_estado CHECK (((estado)::text = ANY (ARRAY[('REPORTADO'::character varying)::text, ('EN_INSPECCION'::character varying)::text, ('RESUELTO'::character varying)::text, ('FALSO_REPORTE'::character varying)::text]))),
    CONSTRAINT chk_incidente_localizacion CHECK (((acometida_id IS NOT NULL) OR (coordenadas IS NOT NULL) OR (direccion_referencia IS NOT NULL))),
    CONSTRAINT chk_incidente_origen CHECK (((origen_reporte)::text = ANY (ARRAY[('LECTURISTA'::character varying)::text, ('ATENCION_AL_CLIENTE'::character varying)::text, ('INSPECTOR'::character varying)::text, ('WEB_USUARIO'::character varying)::text]))),
    CONSTRAINT chk_incidente_prioridad CHECK (((prioridad)::text = ANY (ARRAY[('BAJA'::character varying)::text, ('MEDIA'::character varying)::text, ('ALTA'::character varying)::text, ('CRITICA'::character varying)::text]))),
    CONSTRAINT chk_incidente_reporta CHECK (((((origen_reporte)::text = 'WEB_USUARIO'::text) AND ((cliente_usuario_reporta_id IS NOT NULL) OR (usuario_reporta_id IS NOT NULL) OR ((datos_reportante IS NOT NULL) AND (NULLIF(TRIM(BOTH FROM (datos_reportante ->> 'nombre'::text)), ''::text) IS NOT NULL) AND (NULLIF(TRIM(BOTH FROM (datos_reportante ->> 'apellido'::text)), ''::text) IS NOT NULL) AND ((NULLIF(TRIM(BOTH FROM (datos_reportante ->> 'telefono'::text)), ''::text) IS NOT NULL) OR (NULLIF(TRIM(BOTH FROM (datos_reportante ->> 'correo'::text)), ''::text) IS NOT NULL))))) OR (((origen_reporte)::text = ANY ((ARRAY['LECTURISTA'::character varying, 'ATENCION_AL_CLIENTE'::character varying, 'INSPECTOR'::character varying])::text[])) AND (usuario_reporta_id IS NOT NULL) AND (cliente_usuario_reporta_id IS NULL) AND (datos_reportante IS NULL))))
);


ALTER TABLE public.incidente_medidor OWNER TO postgres;

--
-- Name: lectura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lectura (
    lectura_id integer NOT NULL,
    acometida_id character varying(10) NOT NULL,
    fecha_lectura timestamp without time zone DEFAULT now(),
    hora_lectura time without time zone DEFAULT (now())::time without time zone,
    sector integer NOT NULL,
    cuenta integer NOT NULL,
    clave_catastral character varying(10) NOT NULL,
    valor_lectura numeric(18,2),
    tasa_alcantarillado numeric(18,2),
    lectura_anterior numeric(10,2),
    lectura_actual numeric(10,2),
    codigo_ingreso_renta integer,
    novedad character varying(255),
    codigo_ingreso integer,
    tipo_novedad_lectura_id integer,
    lectura_estado_id integer,
    observacion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    mes_lectura character(7),
    ubicacion_captura public.geometry(Point,4326)
);


ALTER TABLE public.lectura OWNER TO postgres;

--
-- Name: lectura_estado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lectura_estado (
    lectura_estado_id integer NOT NULL,
    codigo character varying(20) NOT NULL,
    tipo_estado_lectura_id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(255),
    activo boolean DEFAULT true NOT NULL,
    orden smallint DEFAULT 0 NOT NULL,
    es_inicial boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.lectura_estado OWNER TO postgres;

--
-- Name: lectura_estado_lectura_estado_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lectura_estado_lectura_estado_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lectura_estado_lectura_estado_id_seq OWNER TO postgres;

--
-- Name: lectura_estado_lectura_estado_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lectura_estado_lectura_estado_id_seq OWNED BY public.lectura_estado.lectura_estado_id;


--
-- Name: lectura_lectura_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lectura_lectura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lectura_lectura_id_seq OWNER TO postgres;

--
-- Name: lectura_lectura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lectura_lectura_id_seq OWNED BY public.lectura.lectura_id;


--
-- Name: observacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.observacion (
    observacion_id integer NOT NULL,
    titulo_observacion character varying(100) NOT NULL,
    detalle_observacion character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.observacion OWNER TO postgres;

--
-- Name: observacion_acometida; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.observacion_acometida (
    observacion_acometida_id integer NOT NULL,
    observacion_id integer NOT NULL,
    acometida_id character varying(10) NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.observacion_acometida OWNER TO postgres;

--
-- Name: observacion_acometida_observacion_acometida_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.observacion_acometida_observacion_acometida_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.observacion_acometida_observacion_acometida_id_seq OWNER TO postgres;

--
-- Name: observacion_acometida_observacion_acometida_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.observacion_acometida_observacion_acometida_id_seq OWNED BY public.observacion_acometida.observacion_acometida_id;


--
-- Name: observacion_factura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.observacion_factura (
    observacion_factura_id integer NOT NULL,
    observacion_id integer NOT NULL,
    factura_id integer NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.observacion_factura OWNER TO postgres;

--
-- Name: observacion_factura_observacion_factura_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.observacion_factura_observacion_factura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.observacion_factura_observacion_factura_id_seq OWNER TO postgres;

--
-- Name: observacion_factura_observacion_factura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.observacion_factura_observacion_factura_id_seq OWNED BY public.observacion_factura.observacion_factura_id;


--
-- Name: observacion_lectura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.observacion_lectura (
    observacion_lectura_id integer NOT NULL,
    observacion_id integer NOT NULL,
    lectura_id integer NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.observacion_lectura OWNER TO postgres;

--
-- Name: observacion_lectura_observacion_lectura_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.observacion_lectura_observacion_lectura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.observacion_lectura_observacion_lectura_id_seq OWNER TO postgres;

--
-- Name: observacion_lectura_observacion_lectura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.observacion_lectura_observacion_lectura_id_seq OWNED BY public.observacion_lectura.observacion_lectura_id;


--
-- Name: observacion_observacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.observacion_observacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.observacion_observacion_id_seq OWNER TO postgres;

--
-- Name: observacion_observacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.observacion_observacion_id_seq OWNED BY public.observacion.observacion_id;


--
-- Name: pais; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pais (
    pais_id character varying(3) NOT NULL,
    nombre character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.pais OWNER TO postgres;

--
-- Name: parroquia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parroquia (
    parroquia_id character varying(10) NOT NULL,
    nombre character varying(100) NOT NULL,
    canton_id character varying(8) NOT NULL,
    tipo_parroquia_id character varying(5) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.parroquia OWNER TO postgres;

--
-- Name: permiso_categoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permiso_categoria (
    categoria_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.permiso_categoria OWNER TO postgres;

--
-- Name: permiso_categoria_categoria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permiso_categoria_categoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permiso_categoria_categoria_id_seq OWNER TO postgres;

--
-- Name: permiso_categoria_categoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permiso_categoria_categoria_id_seq OWNED BY public.permiso_categoria.categoria_id;


--
-- Name: permisos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permisos (
    permiso_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    scopes text,
    activo boolean DEFAULT true NOT NULL,
    categoria_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.permisos OWNER TO postgres;

--
-- Name: permisos_permiso_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permisos_permiso_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permisos_permiso_id_seq OWNER TO postgres;

--
-- Name: permisos_permiso_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permisos_permiso_id_seq OWNED BY public.permisos.permiso_id;


--
-- Name: predio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.predio (
    predio_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    clave_catastral character varying(25),
    cliente_id character varying(13) NOT NULL,
    callejon character varying(150) NOT NULL,
    sector character varying(100) NOT NULL,
    tipo_predio_id integer NOT NULL,
    direccion character varying(255) NOT NULL,
    area_terreno numeric(10,2),
    area_construccion numeric(10,2),
    valor_terreno numeric(18,2),
    valor_construccion numeric(18,2),
    valor_comercial numeric(18,2),
    referencia character varying(255),
    altitud double precision,
    "precision" double precision,
    fecha_geolocalizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    zona_geometrica public.geometry(Polygon,4326),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    coordenadas public.geometry(Point,4326)
);


ALTER TABLE public.predio OWNER TO postgres;

--
-- Name: profesion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profesion (
    profesion_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.profesion OWNER TO postgres;

--
-- Name: profesion_profesion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.profesion_profesion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profesion_profesion_id_seq OWNER TO postgres;

--
-- Name: profesion_profesion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.profesion_profesion_id_seq OWNED BY public.profesion.profesion_id;


--
-- Name: provincia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.provincia (
    provincia_id character varying(8) NOT NULL,
    nombre character varying(100) NOT NULL,
    pais_id character varying(3) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.provincia OWNER TO postgres;

--
-- Name: qrcode; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.qrcode (
    qrcode_id integer NOT NULL,
    acometida_id character varying(10) NOT NULL,
    imagen_bytea bytea,
    qrcode_url text,
    updated_at timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.qrcode OWNER TO postgres;

--
-- Name: qrcode_qrcode_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.qrcode_qrcode_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.qrcode_qrcode_id_seq OWNER TO postgres;

--
-- Name: qrcode_qrcode_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.qrcode_qrcode_id_seq OWNED BY public.qrcode.qrcode_id;


--
-- Name: rangos_variables; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rangos_variables (
    id integer NOT NULL,
    tarifa_id integer NOT NULL,
    servicio_id integer NOT NULL,
    min_consumo numeric(10,2) NOT NULL,
    max_consumo numeric(10,2),
    tasa_por_m3 numeric(10,4) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_rangos CHECK (((max_consumo IS NULL) OR (max_consumo > min_consumo)))
);


ALTER TABLE public.rangos_variables OWNER TO postgres;

--
-- Name: rangos_variables_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rangos_variables_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rangos_variables_id_seq OWNER TO postgres;

--
-- Name: rangos_variables_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rangos_variables_id_seq OWNED BY public.rangos_variables.id;


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    id bigint NOT NULL,
    usuario_id uuid NOT NULL,
    token_hash text NOT NULL,
    jti uuid DEFAULT gen_random_uuid(),
    expires_at timestamp with time zone NOT NULL,
    revoked boolean DEFAULT false,
    revoked_at timestamp with time zone,
    device_info text,
    ip_address inet,
    created_at timestamp with time zone DEFAULT now(),
    last_used_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refresh_tokens_id_seq OWNER TO postgres;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- Name: respaldo_acometidas_2026; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.respaldo_acometidas_2026 (
    id integer NOT NULL,
    cedula text,
    apellidos text,
    nombres text,
    sector text,
    num_medidor text,
    direccion text,
    tarifa text,
    novedad text,
    tiene_alcantarillado text,
    tercera_edad integer,
    discapacidad integer,
    cod_factura text,
    lect_act numeric,
    lec_ante numeric,
    consumo_m3 numeric,
    v_agua numeric,
    v_alcantarillado numeric,
    v_comerc numeric,
    v_reconexion numeric,
    total numeric,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.respaldo_acometidas_2026 OWNER TO postgres;

--
-- Name: respaldo_acometidas_2026_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.respaldo_acometidas_2026_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.respaldo_acometidas_2026_id_seq OWNER TO postgres;

--
-- Name: respaldo_acometidas_2026_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.respaldo_acometidas_2026_id_seq OWNED BY public.respaldo_acometidas_2026.id;


--
-- Name: rol_permisos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rol_permisos (
    rol_permiso_id integer NOT NULL,
    rol_id integer NOT NULL,
    permiso_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.rol_permisos OWNER TO postgres;

--
-- Name: rol_permisos_rol_permiso_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rol_permisos_rol_permiso_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rol_permisos_rol_permiso_id_seq OWNER TO postgres;

--
-- Name: rol_permisos_rol_permiso_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rol_permisos_rol_permiso_id_seq OWNED BY public.rol_permisos.rol_permiso_id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    rol_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    parent_rol_id integer,
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_rol_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_rol_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_rol_id_seq OWNER TO postgres;

--
-- Name: roles_rol_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_rol_id_seq OWNED BY public.roles.rol_id;


--
-- Name: seguimiento_lectura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seguimiento_lectura (
    seguimiento_lectura_id integer NOT NULL,
    acometida_id character varying(10) NOT NULL,
    lectura_id integer NOT NULL,
    usuario_id uuid DEFAULT 'e3400d18-86e1-4eee-9a8b-3e7eaf812a95'::uuid,
    lectura_estado_id integer NOT NULL,
    lectura_estado_anterior_id integer,
    accion character varying(100) NOT NULL,
    descripcion character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.seguimiento_lectura OWNER TO postgres;

--
-- Name: seguimiento_lectura_seguimiento_lectura_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seguimiento_lectura_seguimiento_lectura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seguimiento_lectura_seguimiento_lectura_id_seq OWNER TO postgres;

--
-- Name: seguimiento_lectura_seguimiento_lectura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seguimiento_lectura_seguimiento_lectura_id_seq OWNED BY public.seguimiento_lectura.seguimiento_lectura_id;


--
-- Name: seq_codigo_incidente; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_codigo_incidente
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_codigo_incidente OWNER TO postgres;

--
-- Name: servicio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.servicio (
    servicio_id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.servicio OWNER TO postgres;

--
-- Name: servicio_servicio_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.servicio_servicio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.servicio_servicio_id_seq OWNER TO postgres;

--
-- Name: servicio_servicio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.servicio_servicio_id_seq OWNED BY public.servicio.servicio_id;


--
-- Name: sexo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sexo (
    sexo_id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sexo OWNER TO postgres;

--
-- Name: sexo_sexo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sexo_sexo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sexo_sexo_id_seq OWNER TO postgres;

--
-- Name: sexo_sexo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sexo_sexo_id_seq OWNED BY public.sexo.sexo_id;


--
-- Name: siguiente_lectura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.siguiente_lectura (
    siguiente_lectura_id integer NOT NULL,
    acometida_id character varying(10) NOT NULL,
    ultima_lectura_id integer,
    fecha_siguiente_lectura timestamp without time zone NOT NULL,
    fecha_inicio_periodo timestamp without time zone NOT NULL,
    fecha_fin_periodo timestamp without time zone NOT NULL,
    dias_tolerancia smallint DEFAULT 5 NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_siguiente_lectura_fechas CHECK ((fecha_fin_periodo >= fecha_inicio_periodo)),
    CONSTRAINT siguiente_lectura_dias_tolerancia_check CHECK ((dias_tolerancia >= 0))
);


ALTER TABLE public.siguiente_lectura OWNER TO postgres;

--
-- Name: siguiente_lectura_siguiente_lectura_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.siguiente_lectura_siguiente_lectura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.siguiente_lectura_siguiente_lectura_id_seq OWNER TO postgres;

--
-- Name: siguiente_lectura_siguiente_lectura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.siguiente_lectura_siguiente_lectura_id_seq OWNED BY public.siguiente_lectura.siguiente_lectura_id;


--
-- Name: tarifa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tarifa (
    tarifa_id integer NOT NULL,
    categoria_id integer NOT NULL,
    effective_date date NOT NULL,
    end_date date,
    descripcion text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_dates CHECK (((end_date IS NULL) OR (end_date > effective_date)))
);


ALTER TABLE public.tarifa OWNER TO postgres;

--
-- Name: tarifa_tarifa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tarifa_tarifa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tarifa_tarifa_id_seq OWNER TO postgres;

--
-- Name: tarifa_tarifa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tarifa_tarifa_id_seq OWNED BY public.tarifa.tarifa_id;


--
-- Name: telefono_empresa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.telefono_empresa (
    telefono_empresa_id integer NOT NULL,
    telefono_id integer NOT NULL,
    empresa_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.telefono_empresa OWNER TO postgres;

--
-- Name: telefono_empresa_telefono_empresa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.telefono_empresa_telefono_empresa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.telefono_empresa_telefono_empresa_id_seq OWNER TO postgres;

--
-- Name: telefono_empresa_telefono_empresa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.telefono_empresa_telefono_empresa_id_seq OWNED BY public.telefono_empresa.telefono_empresa_id;


--
-- Name: telefono_persona_natural; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.telefono_persona_natural (
    telefono_persona_natural_id integer NOT NULL,
    telefono_id integer NOT NULL,
    cliente_persona_natural_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.telefono_persona_natural OWNER TO postgres;

--
-- Name: telefono_persona_natural_telefono_persona_natural_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.telefono_persona_natural_telefono_persona_natural_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.telefono_persona_natural_telefono_persona_natural_id_seq OWNER TO postgres;

--
-- Name: telefono_persona_natural_telefono_persona_natural_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.telefono_persona_natural_telefono_persona_natural_id_seq OWNED BY public.telefono_persona_natural.telefono_persona_natural_id;


--
-- Name: telefono_telefono_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.telefono_telefono_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.telefono_telefono_id_seq OWNER TO postgres;

--
-- Name: telefono_telefono_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.telefono_telefono_id_seq OWNED BY public.telefono.telefono_id;


--
-- Name: temp_acometida_update; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.temp_acometida_update (
    acometidaid text,
    clavecatastral text,
    clienteid text,
    tarifaid integer,
    numeromedidor text,
    direccion text,
    numeropersonas integer,
    zona text,
    coordenadas text,
    referencia text,
    altitud numeric,
    precision_val numeric,
    fechageolocalizacion timestamp without time zone,
    predioclavecatastral text
);


ALTER TABLE public.temp_acometida_update OWNER TO postgres;

--
-- Name: temp_correo_electronico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.temp_correo_electronico (
    correoid integer,
    email character varying(100),
    clienteid character varying(20)
);


ALTER TABLE public.temp_correo_electronico OWNER TO postgres;

--
-- Name: tipo_contrato; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_contrato (
    tipo_contrato_id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion text,
    duracion_max_meses smallint,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tipo_contrato OWNER TO postgres;

--
-- Name: tipo_contrato_tipo_contrato_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipo_contrato_tipo_contrato_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipo_contrato_tipo_contrato_id_seq OWNER TO postgres;

--
-- Name: tipo_contrato_tipo_contrato_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipo_contrato_tipo_contrato_id_seq OWNED BY public.tipo_contrato.tipo_contrato_id;


--
-- Name: tipo_estado_lectura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_estado_lectura (
    tipo_estado_lectura_id integer NOT NULL,
    codigo character varying(10) NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(255),
    permite_facturar boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tipo_estado_lectura OWNER TO postgres;

--
-- Name: tipo_estado_lectura_tipo_estado_lectura_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipo_estado_lectura_tipo_estado_lectura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipo_estado_lectura_tipo_estado_lectura_id_seq OWNER TO postgres;

--
-- Name: tipo_estado_lectura_tipo_estado_lectura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipo_estado_lectura_tipo_estado_lectura_id_seq OWNED BY public.tipo_estado_lectura.tipo_estado_lectura_id;


--
-- Name: tipo_identificacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_identificacion (
    tipo_identificacion_id character varying(5) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tipo_identificacion OWNER TO postgres;

--
-- Name: tipo_incidente_medidor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_incidente_medidor (
    tipo_incidente_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    categoria_incidente_id integer NOT NULL,
    descripcion character varying(255),
    prioridad_sugerida character varying(10) DEFAULT 'MEDIA'::character varying NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_tipo_incidente_prioridad CHECK (((prioridad_sugerida)::text = ANY (ARRAY[('BAJA'::character varying)::text, ('MEDIA'::character varying)::text, ('ALTA'::character varying)::text, ('CRITICA'::character varying)::text])))
);


ALTER TABLE public.tipo_incidente_medidor OWNER TO postgres;

--
-- Name: tipo_incidente_medidor_tipo_incidente_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipo_incidente_medidor_tipo_incidente_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipo_incidente_medidor_tipo_incidente_id_seq OWNER TO postgres;

--
-- Name: tipo_incidente_medidor_tipo_incidente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipo_incidente_medidor_tipo_incidente_id_seq OWNED BY public.tipo_incidente_medidor.tipo_incidente_id;


--
-- Name: tipo_novedad_lectura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_novedad_lectura (
    tipo_novedad_lectura_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    min_porcentaje numeric(5,2),
    max_porcentaje numeric(5,2),
    accion_recomendada text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tipo_novedad_lectura OWNER TO postgres;

--
-- Name: tipo_novedad_lectura_tipo_novedad_lectura_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipo_novedad_lectura_tipo_novedad_lectura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipo_novedad_lectura_tipo_novedad_lectura_id_seq OWNER TO postgres;

--
-- Name: tipo_novedad_lectura_tipo_novedad_lectura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipo_novedad_lectura_tipo_novedad_lectura_id_seq OWNED BY public.tipo_novedad_lectura.tipo_novedad_lectura_id;


--
-- Name: tipo_parroquia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_parroquia (
    tipo_parroquia_id character varying(5) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tipo_parroquia OWNER TO postgres;

--
-- Name: tipo_predio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_predio (
    tipo_predio_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tipo_predio OWNER TO postgres;

--
-- Name: tipo_predio_tipo_predio_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipo_predio_tipo_predio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipo_predio_tipo_predio_id_seq OWNER TO postgres;

--
-- Name: tipo_predio_tipo_predio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipo_predio_tipo_predio_id_seq OWNED BY public.tipo_predio.tipo_predio_id;


--
-- Name: tipo_relacion_familiar; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_relacion_familiar (
    tipo_relacion_familiar_id integer NOT NULL,
    parentesco character varying(50) NOT NULL,
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tipo_relacion_familiar OWNER TO postgres;

--
-- Name: tipo_relacion_familiar_tipo_relacion_familiar_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipo_relacion_familiar_tipo_relacion_familiar_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipo_relacion_familiar_tipo_relacion_familiar_id_seq OWNER TO postgres;

--
-- Name: tipo_relacion_familiar_tipo_relacion_familiar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipo_relacion_familiar_tipo_relacion_familiar_id_seq OWNED BY public.tipo_relacion_familiar.tipo_relacion_familiar_id;


--
-- Name: tipo_telefono; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_telefono (
    tipo_telefono_id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tipo_telefono OWNER TO postgres;

--
-- Name: tipo_telefono_tipo_telefono_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipo_telefono_tipo_telefono_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipo_telefono_tipo_telefono_id_seq OWNER TO postgres;

--
-- Name: tipo_telefono_tipo_telefono_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipo_telefono_tipo_telefono_id_seq OWNED BY public.tipo_telefono.tipo_telefono_id;


--
-- Name: tipo_titulo_dato; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_titulo_dato (
    tipo_titulo_dato_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tipo_titulo_dato OWNER TO postgres;

--
-- Name: tipo_titulo_dato_tipo_titulo_dato_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipo_titulo_dato_tipo_titulo_dato_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipo_titulo_dato_tipo_titulo_dato_id_seq OWNER TO postgres;

--
-- Name: tipo_titulo_dato_tipo_titulo_dato_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipo_titulo_dato_tipo_titulo_dato_id_seq OWNED BY public.tipo_titulo_dato.tipo_titulo_dato_id;


--
-- Name: tipo_verificacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_verificacion (
    tipo_verificacion_id integer NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255) NOT NULL,
    usa_codigo boolean DEFAULT true NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tipo_verificacion OWNER TO postgres;

--
-- Name: TABLE tipo_verificacion; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.tipo_verificacion IS 'Catálogo de métodos de verificación de cuenta. OCP: extensible por INSERT sin cambios de esquema.';


--
-- Name: COLUMN tipo_verificacion.usa_codigo; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tipo_verificacion.usa_codigo IS 'true = verifica con código numérico (6 dígitos). false = verifica con token en URL (link mágico).';


--
-- Name: tipo_verificacion_tipo_verificacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.tipo_verificacion ALTER COLUMN tipo_verificacion_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tipo_verificacion_tipo_verificacion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: titulo_dato; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.titulo_dato (
    titulo_dato_id integer NOT NULL,
    tipo_titulo_dato_id integer NOT NULL,
    cliente_id character varying(13) NOT NULL,
    descripcion character varying(255),
    fecha_emision date,
    fecha_vencimiento date,
    monto numeric(15,4) NOT NULL,
    estado character varying(50) DEFAULT 'PENDIENTE'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.titulo_dato OWNER TO postgres;

--
-- Name: titulo_dato_titulo_dato_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.titulo_dato_titulo_dato_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.titulo_dato_titulo_dato_id_seq OWNER TO postgres;

--
-- Name: titulo_dato_titulo_dato_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.titulo_dato_titulo_dato_id_seq OWNED BY public.titulo_dato.titulo_dato_id;


--
-- Name: usuario_factura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario_factura (
    usuario_factura_id integer NOT NULL,
    usuario_id uuid NOT NULL,
    factura_id integer NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.usuario_factura OWNER TO postgres;

--
-- Name: usuario_factura_usuario_factura_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_factura_usuario_factura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_factura_usuario_factura_id_seq OWNER TO postgres;

--
-- Name: usuario_factura_usuario_factura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_factura_usuario_factura_id_seq OWNED BY public.usuario_factura.usuario_factura_id;


--
-- Name: usuario_lectura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario_lectura (
    usuario_lectura_id integer NOT NULL,
    usuario_id uuid NOT NULL,
    lectura_id integer NOT NULL,
    create_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    action_type_id integer
);


ALTER TABLE public.usuario_lectura OWNER TO postgres;

--
-- Name: usuario_lectura_usuario_lectura_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_lectura_usuario_lectura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_lectura_usuario_lectura_id_seq OWNER TO postgres;

--
-- Name: usuario_lectura_usuario_lectura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_lectura_usuario_lectura_id_seq OWNED BY public.usuario_lectura.usuario_lectura_id;


--
-- Name: usuario_permisos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario_permisos (
    usuario_permiso_id integer NOT NULL,
    usuario_id uuid NOT NULL,
    permiso_id integer NOT NULL,
    fecha_asignacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_expiracion timestamp without time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.usuario_permisos OWNER TO postgres;

--
-- Name: usuario_permisos_usuario_permiso_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_permisos_usuario_permiso_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_permisos_usuario_permiso_id_seq OWNER TO postgres;

--
-- Name: usuario_permisos_usuario_permiso_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_permisos_usuario_permiso_id_seq OWNED BY public.usuario_permisos.usuario_permiso_id;


--
-- Name: usuario_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario_roles (
    usuario_rol_id integer NOT NULL,
    usuario_id uuid NOT NULL,
    rol_id integer NOT NULL,
    fecha_asignacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.usuario_roles OWNER TO postgres;

--
-- Name: usuario_roles_usuario_rol_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_roles_usuario_rol_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_roles_usuario_rol_id_seq OWNER TO postgres;

--
-- Name: usuario_roles_usuario_rol_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_roles_usuario_rol_id_seq OWNED BY public.usuario_roles.usuario_rol_id;


--
-- Name: verificar_cuenta_cliente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.verificar_cuenta_cliente (
    verificacion_id uuid DEFAULT gen_random_uuid() NOT NULL,
    cliente_usuario_id uuid NOT NULL,
    tipo_verificacion_id integer NOT NULL,
    codigo character varying(10),
    token character varying(512),
    activo boolean DEFAULT true NOT NULL,
    intentos smallint DEFAULT 0 NOT NULL,
    max_intentos smallint DEFAULT 5 NOT NULL,
    fecha_expiracion timestamp with time zone NOT NULL,
    fecha_verificado timestamp with time zone,
    ip_solicitud character varying(45),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_codigo_o_token CHECK (((codigo IS NOT NULL) OR (token IS NOT NULL))),
    CONSTRAINT chk_fecha_verificado_valida CHECK (((fecha_verificado IS NULL) OR (fecha_verificado >= created_at))),
    CONSTRAINT chk_intentos_positivos CHECK (((intentos >= 0) AND (max_intentos > 0)))
);


ALTER TABLE public.verificar_cuenta_cliente OWNER TO postgres;

--
-- Name: TABLE verificar_cuenta_cliente; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.verificar_cuenta_cliente IS 'Registro de intentos de verificación de cuenta. Soporta código numérico y link con token.Para migrar a nuevo método: INSERT en tipo_verificacion + generar el campo correspondiente.';


--
-- Name: COLUMN verificar_cuenta_cliente.codigo; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.verificar_cuenta_cliente.codigo IS 'Código numérico corto (6 dígitos). Se usa con EMAIL_CODE y PHONE_CODE. NULL si el método usa token.';


--
-- Name: COLUMN verificar_cuenta_cliente.token; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.verificar_cuenta_cliente.token IS 'Token criptográfico largo para verificación por link. Se usa con EMAIL_LINK. NULL si el método usa código.';


--
-- Name: COLUMN verificar_cuenta_cliente.activo; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.verificar_cuenta_cliente.activo IS 'false = verificación invalidada (ya usada, expirada manualmente, o reemplazada por una nueva).';


--
-- Name: COLUMN verificar_cuenta_cliente.intentos; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.verificar_cuenta_cliente.intentos IS 'Contador de intentos fallidos. Al alcanzar max_intentos, el registro se desactiva automáticamente.';


--
-- Name: COLUMN verificar_cuenta_cliente.fecha_verificado; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.verificar_cuenta_cliente.fecha_verificado IS 'Timestamp del momento exacto en que el cliente completó la verificación. NULL si aún no verifica.';


--
-- Name: zona; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.zona (
    zona_id integer NOT NULL,
    codigo character varying(25) NOT NULL,
    nombre character varying(100),
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.zona OWNER TO postgres;

--
-- Name: view_acometida_detalle; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.view_acometida_detalle AS
 SELECT a.acometida_id AS connection_id,
    a.cliente_id AS client_id,
    a.tarifa_id AS connection_rate_id,
    ct.nombre AS connection_rate_name,
    a.numero_medidor AS connection_meter_number,
    a.sector AS connection_sector,
    a.cuenta AS connection_account,
    a.clave_catastral AS connection_cadastral_key,
    a.numero_contrato AS connection_contract_number,
    a.alcantarillado AS connection_sewerage,
    a.estado_id AS connection_state_id,
    est.nombre AS connection_status,
    est.permite_lectura AS connection_is_readable,
    a.direccion AS connection_address,
    a.fecha_instalacion AS connection_installation_date,
    a.numero_personas AS connection_people_number,
    a.zona AS connection_zone,
    a.coordenadas AS connection_coordinates,
    a.referencia AS connection_reference,
    a.metadata AS connection_metadata,
    a.altitud AS connection_altitude,
    a."precision" AS connection_precision,
    a.fecha_geolocalizacion AS connection_geolocation_date,
    a.zona_geometrica AS connection_geometric_zone,
    a.predio_clave_catastral AS property_cadastral_key,
    a.zona_id AS zone_id,
    z.codigo AS zone_code,
    z.nombre AS zone_name,
        CASE
            WHEN (e.ruc IS NOT NULL) THEN jsonb_build_object('company_id', e.empresa_id, 'commercial_name', e.nombre_comercial, 'business_name', e.razon_social, 'ruc', e.ruc, 'address', e.direccion, 'parish_id', e.parroquia_id, 'country', e.pais, 'client_id', e.cliente_id, 'phones', cc.phones, 'emails', cc.correos)
            ELSE NULL::jsonb
        END AS company,
        CASE
            WHEN (ci.ciudadano_id IS NOT NULL) THEN jsonb_build_object('person_id', ci.ciudadano_id, 'first_name', ci.nombres, 'last_name', ci.apellidos, 'birth_date', ci.fecha_nacimiento, 'is_deceased', ci.fallecido, 'gender_id', ci.sexo_id, 'civil_status_id', ci.estado_civil_id, 'profession_id', ci.profesion_id, 'parish_id', ci.parroquia_id, 'address', ci.direccion, 'country', ci.pais_origen, 'phones', cc.phones, 'emails', cc.correos)
            ELSE NULL::jsonb
        END AS person,
    ( SELECT jsonb_agg(jsonb_build_object('cadastral_key', sub_lr.clave_catastral, 'reading_date', sub_lr.fecha_lectura, 'reading_time', sub_lr.hora_lectura, 'reading_month', sub_lr.mes_lectura, 'reading_value_current', sub_lr.lectura_actual, 'reading_value_preview', sub_lr.lectura_anterior, 'novelty', sub_lr.novedad) ORDER BY sub_lr.fecha_lectura DESC, sub_lr.hora_lectura DESC NULLS LAST, sub_lr.lectura_id DESC) AS jsonb_agg
           FROM ( SELECT lr.clave_catastral,
                    lr.fecha_lectura,
                    lr.hora_lectura,
                    lr.mes_lectura,
                    lr.lectura_actual,
                    lr.lectura_anterior,
                    lr.novedad,
                    lr.lectura_id
                   FROM public.lectura lr
                  WHERE (((lr.acometida_id)::text = (a.acometida_id)::text) AND (lr.fecha_lectura IS NOT NULL))
                  ORDER BY lr.fecha_lectura DESC, lr.hora_lectura DESC NULLS LAST, lr.lectura_id DESC
                 LIMIT 10) sub_lr) AS last_readings
   FROM ((((((((public.acometida a
     JOIN public.cliente c ON (((c.cliente_id)::text = (a.cliente_id)::text)))
     LEFT JOIN public.ciudadano ci ON (((ci.ciudadano_id)::text = (c.cliente_id)::text)))
     LEFT JOIN public.empresa e ON (((e.ruc)::text = (c.cliente_id)::text)))
     LEFT JOIN public.cliente_contacto cc ON (((cc.cliente_id)::text = (c.cliente_id)::text)))
     JOIN public.tarifa t ON ((t.tarifa_id = a.tarifa_id)))
     JOIN public.categoria ct ON ((t.categoria_id = ct.categoria_id)))
     JOIN public.zona z ON ((z.zona_id = a.zona_id)))
     LEFT JOIN public.cat_estados_acometida est ON ((a.estado_id = est.id_estado)));


ALTER VIEW public.view_acometida_detalle OWNER TO postgres;

--
-- Name: view_incidentes_detalle; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.view_incidentes_detalle AS
 SELECT i.incidente_id AS incident_id,
    i.acometida_id AS connection_id,
    i.codigo_incidente AS incident_code,
    i.lectura_id AS reading_id,
    c.codigo AS category_code,
    c.nombre AS category_name,
    i.tipo_incidente_id AS incident_type_id,
    t.nombre AS incident_type_name,
    t.prioridad_sugerida AS suggested_priority,
    i.descripcion_reporte AS report_description,
    i.direccion_referencia AS reference_address,
    i.estado AS status,
    i.origen_reporte AS report_origin,
    i.prioridad AS current_priority,
    i.fecha_reporte AS report_date,
    public.st_y(i.coordenadas) AS latitude,
    public.st_x(i.coordenadas) AS longitude,
        CASE
            WHEN (u_reporta.usuario_id IS NOT NULL) THEN jsonb_build_object('user_type', 'Usuario Interno', 'name', COALESCE(NULLIF(TRIM(BOTH FROM concat(emp.nombres, ' ', emp.apellidos)), ''::text), (u_reporta.username)::text), 'email', u_reporta.email, 'phone', emp.telefono_interno, 'card_id', emp.cedula)
            WHEN ((cu_reporta.cliente_usuario_id IS NOT NULL) AND (e.empresa_id IS NOT NULL)) THEN jsonb_build_object('user_type', 'Usuario Externo', 'name', COALESCE(e.razon_social, e.nombre_comercial), 'email', cc.correos, 'phone', cc.phones, 'card_id', e.cliente_id)
            WHEN ((cu_reporta.cliente_usuario_id IS NOT NULL) AND (ci.ciudadano_id IS NOT NULL)) THEN jsonb_build_object('user_type', 'Usuario Externo', 'name', concat(ci.nombres, ' ', ci.apellidos), 'email', cc.correos, 'phone', cc.phones, 'card_id', ci.ciudadano_id)
            WHEN (i.datos_reportante IS NOT NULL) THEN jsonb_build_object('user_type', 'Usuario Anónimo', 'name', concat((i.datos_reportante ->> 'nombre'::text), ' ', (i.datos_reportante ->> 'apellido'::text)), 'email', (i.datos_reportante ->> 'correo'::text), 'phone', (i.datos_reportante ->> 'celular'::text), 'card_id', (i.datos_reportante ->> 'cedula'::text))
            ELSE jsonb_build_object('user_type', NULL::unknown, 'name', NULL::unknown, 'email', NULL::unknown, 'phone', NULL::unknown, 'card_id', NULL::unknown)
        END AS reported_by,
        CASE
            WHEN (e.ruc IS NOT NULL) THEN jsonb_build_object('company_id', e.empresa_id, 'commercial_name', e.nombre_comercial, 'business_name', e.razon_social, 'ruc', e.ruc, 'address', e.direccion, 'parish_id', e.parroquia_id, 'country', e.pais, 'client_id', e.cliente_id, 'phones', cc.phones, 'emails', cc.correos)
            ELSE NULL::jsonb
        END AS company,
        CASE
            WHEN ((e.ruc IS NULL) AND (ci.ciudadano_id IS NOT NULL)) THEN jsonb_build_object('person_id', ci.ciudadano_id, 'first_name', ci.nombres, 'last_name', ci.apellidos, 'birth_date', ci.fecha_nacimiento, 'is_deceased', ci.fallecido, 'gender_id', ci.sexo_id, 'civil_status_id', ci.estado_civil_id, 'profession_id', ci.profesion_id, 'parish_id', ci.parroquia_id, 'address', ci.direccion, 'country', ci.pais_origen, 'phones', cc.phones, 'emails', cc.correos)
            ELSE NULL::jsonb
        END AS person,
    i.fecha_resolucion AS resolution_date,
        CASE
            WHEN (u_resuelve.usuario_id IS NOT NULL) THEN jsonb_build_object('user_type', 'Usuario Interno', 'name', COALESCE(NULLIF(TRIM(BOTH FROM concat(emp_resuelve.nombres, ' ', emp_resuelve.apellidos)), ''::text), (u_resuelve.username)::text), 'card_id', emp_resuelve.cedula)
            ELSE NULL::jsonb
        END AS resolved_by,
    i.descripcion_resolucion AS resolution_description,
    i.cobrar_a_usuario AS charge_to_user,
    i.costo_reparacion AS repair_cost,
    COALESCE(fotos.photos_report, '[]'::jsonb) AS photos_report,
    COALESCE(fotos.photos_report_count, (0)::bigint) AS photos_report_count,
    COALESCE(fotos.photos_resolution, '[]'::jsonb) AS photos_resolution,
    COALESCE(fotos.photos_resolution_count, (0)::bigint) AS photos_resolution_count,
    COALESCE(hist.history_recent, '[]'::jsonb) AS history_recent,
    EXTRACT(day FROM (COALESCE(i.fecha_resolucion, now()) - i.fecha_reporte)) AS open_days,
        CASE
            WHEN (i.fecha_resolucion IS NULL) THEN EXTRACT(day FROM (now() - i.fecha_reporte))
            ELSE NULL::numeric
        END AS pending_days,
    i.created_at,
    i.updated_at
   FROM (((((((((((((public.incidente_medidor i
     LEFT JOIN public.tipo_incidente_medidor t ON ((t.tipo_incidente_id = i.tipo_incidente_id)))
     LEFT JOIN public.categoria_incidente_medidor c ON ((c.categoria_incidente_id = t.categoria_incidente_id)))
     LEFT JOIN public.usuarios u_reporta ON ((u_reporta.usuario_id = i.usuario_reporta_id)))
     LEFT JOIN public.empleados emp ON ((emp.usuario_id = u_reporta.usuario_id)))
     LEFT JOIN public.cliente_usuario cu_reporta ON ((cu_reporta.cliente_usuario_id = i.cliente_usuario_reporta_id)))
     LEFT JOIN public.cliente cl ON (((cl.cliente_id)::text = (cu_reporta.cliente_id)::text)))
     LEFT JOIN public.ciudadano ci ON (((ci.ciudadano_id)::text = (cl.cliente_id)::text)))
     LEFT JOIN public.empresa e ON (((e.cliente_id)::text = (cl.cliente_id)::text)))
     LEFT JOIN public.cliente_contacto cc ON (((cc.cliente_id)::text = (cl.cliente_id)::text)))
     LEFT JOIN public.usuarios u_resuelve ON ((u_resuelve.usuario_id = i.usuario_resuelve_id)))
     LEFT JOIN public.empleados emp_resuelve ON ((emp_resuelve.usuario_id = i.usuario_resuelve_id)))
     LEFT JOIN ( SELECT f.incidente_id,
            jsonb_agg(jsonb_build_object('id', f.foto_incidente_id, 'file_path', f.ruta_archivo, 'type', f.tipo_foto, 'created_at', f.created_at)) FILTER (WHERE ((f.tipo_foto)::text = 'REPORTE'::text)) AS photos_report,
            count(f.foto_incidente_id) FILTER (WHERE ((f.tipo_foto)::text = 'REPORTE'::text)) AS photos_report_count,
            jsonb_agg(jsonb_build_object('id', f.foto_incidente_id, 'file_path', f.ruta_archivo, 'type', f.tipo_foto, 'created_at', f.created_at)) FILTER (WHERE ((f.tipo_foto)::text = 'RESOLUCION'::text)) AS photos_resolution,
            count(f.foto_incidente_id) FILTER (WHERE ((f.tipo_foto)::text = 'RESOLUCION'::text)) AS photos_resolution_count
           FROM public.foto_incidente f
          GROUP BY f.incidente_id) fotos ON ((fotos.incidente_id = i.incidente_id)))
     LEFT JOIN LATERAL ( SELECT jsonb_agg(jsonb_build_object('date_change', h.fecha_cambio, 'previous_status', h.estado_anterior, 'new_status', h.estado_nuevo, 'managed_by',
                CASE
                    WHEN (emp_hist.empleado_id IS NOT NULL) THEN jsonb_build_object('nombre', emp_hist.nombres, 'apellido', emp_hist.apellidos, 'correo', u_hist.email, 'celular', emp_hist.telefono_interno)
                    WHEN (u_hist.usuario_id IS NOT NULL) THEN jsonb_build_object('nombre', u_hist.username, 'apellido', '', 'correo', u_hist.email, 'celular', '')
                    WHEN ((cu_reporta.cliente_usuario_id IS NOT NULL) AND (e.empresa_id IS NOT NULL)) THEN jsonb_build_object('nombre', COALESCE(e.razon_social, e.nombre_comercial), 'apellido', '', 'correo', NULL::unknown, 'celular', NULL::unknown)
                    WHEN ((cu_reporta.cliente_usuario_id IS NOT NULL) AND (ci.ciudadano_id IS NOT NULL)) THEN jsonb_build_object('nombre', ci.nombres, 'apellido', ci.apellidos, 'correo', NULL::unknown, 'celular', NULL::unknown)
                    WHEN (i.datos_reportante IS NOT NULL) THEN i.datos_reportante
                    ELSE NULL::jsonb
                END, 'observation', h.observacion) ORDER BY h.fecha_cambio DESC) AS history_recent
           FROM ((( SELECT hi.historial_id,
                    hi.estado_anterior,
                    hi.estado_nuevo,
                    hi.usuario_id,
                    hi.observacion,
                    hi.fecha_cambio,
                    hi.incidente_id
                   FROM public.historial_incidente hi
                  WHERE (hi.incidente_id = i.incidente_id)
                  ORDER BY hi.fecha_cambio DESC
                 LIMIT 5) h
             LEFT JOIN public.usuarios u_hist ON ((u_hist.usuario_id = h.usuario_id)))
             LEFT JOIN public.empleados emp_hist ON ((emp_hist.usuario_id = h.usuario_id)))) hist ON (true));


ALTER VIEW public.view_incidentes_detalle OWNER TO postgres;

--
-- Name: vw_avance_actualizacion_acometidas; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_avance_actualizacion_acometidas AS
 WITH cte_cliente_contacto AS (
         SELECT c.cliente_id,
            (EXISTS ( SELECT 1
                   FROM public.correo_electronico ce
                  WHERE ((ce.cliente_id)::text = (c.cliente_id)::text))) AS tiene_email,
            (EXISTS ( SELECT 1
                   FROM public.telefono t
                  WHERE (((t.cliente_id)::text = (c.cliente_id)::text) AND (t.es_valido = true)))) AS tiene_telf_valido
           FROM public.cliente c
        ), cte_metricas AS (
         SELECT a.acometida_id,
            a.zona_id,
            a.cliente_id,
            (a.coordenadas IS NOT NULL) AS acometida_actualizada,
            ((p.clave_catastral IS NOT NULL) AND (p.area_terreno > (0)::numeric) AND (p.coordenadas IS NOT NULL)) AS predio_actualizado,
            (cc.tiene_email AND cc.tiene_telf_valido) AS cliente_actualizado,
            GREATEST(a.updated_at, (p.updated_at)::timestamp with time zone, c.updated_at) AS ultima_modificacion_global
           FROM (((public.acometida a
             LEFT JOIN public.predio p ON (((a.predio_clave_catastral)::text = (p.clave_catastral)::text)))
             JOIN public.cliente c ON (((a.cliente_id)::text = (c.cliente_id)::text)))
             JOIN cte_cliente_contacto cc ON (((c.cliente_id)::text = (cc.cliente_id)::text)))
        )
 SELECT acometida_id,
    zona_id,
    cliente_id,
    acometida_actualizada,
    predio_actualizado,
    cliente_actualizado,
    ultima_modificacion_global,
    (acometida_actualizada AND cliente_actualizado) AS actualizacion_completa
   FROM cte_metricas;


ALTER VIEW public.vw_avance_actualizacion_acometidas OWNER TO postgres;

--
-- Name: VIEW vw_avance_actualizacion_acometidas; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public.vw_avance_actualizacion_acometidas IS 'Vista maestra para el dashboard de actualización. Consolida el estado de Predio, Cliente y Acometida en un único registro por conexión.';


--
-- Name: vw_calendario_completo; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_calendario_completo AS
 WITH lecturas_historicas AS (
         SELECT l.acometida_id,
            a.direccion,
            to_char(l.fecha_lectura, 'YYYY-MM'::text) AS mes,
            l.fecha_lectura,
            le.nombre AS estado,
            l.valor_lectura,
            'HISTORICA'::text AS tipo
           FROM ((public.lectura l
             JOIN public.lectura_estado le ON ((le.lectura_estado_id = l.lectura_estado_id)))
             JOIN public.acometida a ON (((a.acometida_id)::text = (l.acometida_id)::text)))
        ), proxima AS (
         SELECT sl.acometida_id,
            a.direccion,
            to_char(sl.fecha_siguiente_lectura, 'YYYY-MM'::text) AS mes,
            sl.fecha_siguiente_lectura AS fecha_lectura,
            'PROXIMA'::text AS estado,
            NULL::numeric AS valor_lectura,
            'PROGRAMADA'::text AS tipo
           FROM (public.siguiente_lectura sl
             JOIN public.acometida a ON (((a.acometida_id)::text = (sl.acometida_id)::text)))
        )
 SELECT lecturas_historicas.acometida_id,
    lecturas_historicas.direccion,
    lecturas_historicas.mes,
    lecturas_historicas.fecha_lectura,
    lecturas_historicas.estado,
    lecturas_historicas.valor_lectura,
    lecturas_historicas.tipo
   FROM lecturas_historicas
UNION ALL
 SELECT proxima.acometida_id,
    proxima.direccion,
    proxima.mes,
    proxima.fecha_lectura,
    proxima.estado,
    proxima.valor_lectura,
    proxima.tipo
   FROM proxima;


ALTER VIEW public.vw_calendario_completo OWNER TO postgres;

--
-- Name: vw_calendario_lecturas; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_calendario_lecturas AS
 WITH historial AS (
         SELECT l.acometida_id,
            a.direccion,
            to_char(l.fecha_lectura, 'YYYY-MM'::text) AS mes,
            l.fecha_lectura,
            le.nombre AS estado,
            'REALIZADA'::text AS tipo
           FROM ((public.lectura l
             JOIN public.lectura_estado le ON ((le.lectura_estado_id = l.lectura_estado_id)))
             JOIN public.acometida a ON (((a.acometida_id)::text = (l.acometida_id)::text)))
          WHERE ((le.codigo)::text = ANY (ARRAY[('REAL'::character varying)::text, ('FACT'::character varying)::text]))
        ), proxima AS (
         SELECT sl.acometida_id,
            a.direccion,
            to_char(sl.fecha_siguiente_lectura, 'YYYY-MM'::text) AS mes,
            sl.fecha_siguiente_lectura,
            'PROGRAMADA'::text AS estado,
            'PROXIMA'::text AS tipo
           FROM (public.siguiente_lectura sl
             JOIN public.acometida a ON (((a.acometida_id)::text = (sl.acometida_id)::text)))
        )
 SELECT historial.acometida_id,
    historial.direccion,
    historial.mes,
    historial.fecha_lectura,
    historial.estado,
    historial.tipo
   FROM historial
UNION ALL
 SELECT proxima.acometida_id,
    proxima.direccion,
    proxima.mes,
    proxima.fecha_siguiente_lectura AS fecha_lectura,
    proxima.estado,
    proxima.tipo
   FROM proxima;


ALTER VIEW public.vw_calendario_lecturas OWNER TO postgres;

--
-- Name: vw_historial_lectura; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_historial_lectura AS
 SELECT s.seguimiento_lectura_id,
    s.acometida_id,
    s.lectura_id,
    le.nombre AS estado_actual,
    lea.nombre AS estado_anterior,
    u.username AS usuario,
    s.accion,
    s.descripcion,
    s.created_at
   FROM (((public.seguimiento_lectura s
     JOIN public.lectura_estado le ON ((le.lectura_estado_id = s.lectura_estado_id)))
     LEFT JOIN public.lectura_estado lea ON ((lea.lectura_estado_id = s.lectura_estado_anterior_id)))
     JOIN public.usuarios u ON ((u.usuario_id = s.usuario_id)))
  ORDER BY s.created_at DESC;


ALTER VIEW public.vw_historial_lectura OWNER TO postgres;

--
-- Name: zona_zona_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.zona_zona_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.zona_zona_id_seq OWNER TO postgres;

--
-- Name: zona_zona_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.zona_zona_id_seq OWNED BY public.zona.zona_id;


--
-- Name: adjuntos_orden_trabajo; Type: TABLE; Schema: work_orders; Owner: postgres
--

CREATE TABLE work_orders.adjuntos_orden_trabajo (
    id_adjunto uuid DEFAULT gen_random_uuid() NOT NULL,
    id_orden_trabajo uuid NOT NULL,
    nombre_archivo character varying(255) NOT NULL,
    url_archivo character varying(1000) NOT NULL,
    tipo_adjunto character varying(50) NOT NULL,
    mime_type character varying(100),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE work_orders.adjuntos_orden_trabajo OWNER TO postgres;

--
-- Name: asignacion_trabajador_orden; Type: TABLE; Schema: work_orders; Owner: postgres
--

CREATE TABLE work_orders.asignacion_trabajador_orden (
    id_asignacion uuid DEFAULT gen_random_uuid() NOT NULL,
    id_orden_trabajo uuid NOT NULL,
    id_trabajador uuid NOT NULL,
    id_rol integer,
    es_responsable boolean DEFAULT false NOT NULL,
    fecha_asignacion timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE work_orders.asignacion_trabajador_orden OWNER TO postgres;

--
-- Name: TABLE asignacion_trabajador_orden; Type: COMMENT; Schema: work_orders; Owner: postgres
--

COMMENT ON TABLE work_orders.asignacion_trabajador_orden IS 'Personal asignado directamente a una OT. Permite agregar uno a uno: un técnico responsable (es_responsable=TRUE) y N trabajadores de campo. Compatible con inspecciones individuales (1 usuario sin compañeros).';


--
-- Name: COLUMN asignacion_trabajador_orden.es_responsable; Type: COMMENT; Schema: work_orders; Owner: postgres
--

COMMENT ON COLUMN work_orders.asignacion_trabajador_orden.es_responsable IS 'TRUE = técnico responsable/líder de la OT. Solo debe existir uno por orden. FALSE = trabajador de campo adicional.';


--
-- Name: cat_checklist_item; Type: TABLE; Schema: work_orders; Owner: postgres
--

CREATE TABLE work_orders.cat_checklist_item (
    codigo character varying(50) NOT NULL,
    nombre character varying(150) NOT NULL,
    descripcion text,
    obligatorio boolean DEFAULT true
);


ALTER TABLE work_orders.cat_checklist_item OWNER TO postgres;

--
-- Name: TABLE cat_checklist_item; Type: COMMENT; Schema: work_orders; Owner: postgres
--

COMMENT ON TABLE work_orders.cat_checklist_item IS 'Ítems de verificación de seguridad, herramientas y EPP requeridos antes de la ejecución del trabajo en campo.';


--
-- Name: cat_estado_orden; Type: TABLE; Schema: work_orders; Owner: postgres
--

CREATE TABLE work_orders.cat_estado_orden (
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    activo boolean DEFAULT true
);


ALTER TABLE work_orders.cat_estado_orden OWNER TO postgres;

--
-- Name: TABLE cat_estado_orden; Type: COMMENT; Schema: work_orders; Owner: postgres
--

COMMENT ON TABLE work_orders.cat_estado_orden IS 'Catálogo del ciclo de vida de la orden. Mapeado a los carriles del BPMN.';


--
-- Name: cat_item_calidad; Type: TABLE; Schema: work_orders; Owner: postgres
--

CREATE TABLE work_orders.cat_item_calidad (
    codigo character varying(50) NOT NULL,
    nombre character varying(150) NOT NULL,
    descripcion text,
    obligatorio boolean DEFAULT true
);


ALTER TABLE work_orders.cat_item_calidad OWNER TO postgres;

--
-- Name: TABLE cat_item_calidad; Type: COMMENT; Schema: work_orders; Owner: postgres
--

COMMENT ON TABLE work_orders.cat_item_calidad IS 'Parámetros técnicos y estéticos requeridos para dar una orden de trabajo por finalizada con éxito.';


--
-- Name: cat_origen_orden; Type: TABLE; Schema: work_orders; Owner: postgres
--

CREATE TABLE work_orders.cat_origen_orden (
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text
);


ALTER TABLE work_orders.cat_origen_orden OWNER TO postgres;

--
-- Name: TABLE cat_origen_orden; Type: COMMENT; Schema: work_orders; Owner: postgres
--

COMMENT ON TABLE work_orders.cat_origen_orden IS 'Orígenes admisibles de una orden de trabajo (Solicitudes de clientes, Reclamos, Preventivos, Emergencias).';


--
-- Name: control_calidad; Type: TABLE; Schema: work_orders; Owner: postgres
--

CREATE TABLE work_orders.control_calidad (
    id_control uuid DEFAULT gen_random_uuid() NOT NULL,
    id_orden_trabajo uuid NOT NULL,
    trabajo_aprobado boolean NOT NULL,
    comentarios text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE work_orders.control_calidad OWNER TO postgres;

--
-- Name: control_calidad_detalle; Type: TABLE; Schema: work_orders; Owner: postgres
--

CREATE TABLE work_orders.control_calidad_detalle (
    id_detalle uuid DEFAULT gen_random_uuid() NOT NULL,
    id_control uuid NOT NULL,
    codigo_item character varying(50) NOT NULL,
    cumple boolean NOT NULL,
    observacion text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE work_orders.control_calidad_detalle OWNER TO postgres;

--
-- Name: corte_servicio; Type: TABLE; Schema: work_orders; Owner: postgres
--

CREATE TABLE work_orders.corte_servicio (
    id_corte uuid DEFAULT gen_random_uuid() NOT NULL,
    id_orden_trabajo uuid NOT NULL,
    tipo_corte character varying(50) NOT NULL,
    sector_afectado text NOT NULL,
    fecha_inicio timestamp with time zone NOT NULL,
    fecha_fin_estimada timestamp with time zone NOT NULL,
    fecha_restablecido timestamp with time zone,
    notificacion_enviada boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE work_orders.corte_servicio OWNER TO postgres;

--
-- Name: costo_adicional_orden; Type: TABLE; Schema: work_orders; Owner: postgres
--

CREATE TABLE work_orders.costo_adicional_orden (
    id_costo_adicional uuid DEFAULT gen_random_uuid() NOT NULL,
    id_orden_trabajo uuid NOT NULL,
    concepto character varying(255) NOT NULL,
    cantidad numeric(10,2) DEFAULT 1 NOT NULL,
    costo_unitario numeric(10,2) NOT NULL,
    total numeric(10,2) GENERATED ALWAYS AS ((cantidad * costo_unitario)) STORED,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE work_orders.costo_adicional_orden OWNER TO postgres;

--
-- Name: departamento_trabajo; Type: TABLE; Schema: work_orders; Owner: postgres
--

CREATE TABLE work_orders.departamento_trabajo (
    id_departamento integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text
);


ALTER TABLE work_orders.departamento_trabajo OWNER TO postgres;

--
-- Name: TABLE departamento_trabajo; Type: COMMENT; Schema: work_orders; Owner: postgres
--

COMMENT ON TABLE work_orders.departamento_trabajo IS 'Departamentos que ejecutan o administran tipos específicos de órdenes de trabajo.';


--
-- Name: departamento_trabajo_id_departamento_seq; Type: SEQUENCE; Schema: work_orders; Owner: postgres
--

CREATE SEQUENCE work_orders.departamento_trabajo_id_departamento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE work_orders.departamento_trabajo_id_departamento_seq OWNER TO postgres;

--
-- Name: departamento_trabajo_id_departamento_seq; Type: SEQUENCE OWNED BY; Schema: work_orders; Owner: postgres
--

ALTER SEQUENCE work_orders.departamento_trabajo_id_departamento_seq OWNED BY work_orders.departamento_trabajo.id_departamento;


--
-- Name: detalle_orden_trabajo_material; Type: TABLE; Schema: work_orders; Owner: postgres
--

CREATE TABLE work_orders.detalle_orden_trabajo_material (
    id_detalle_material uuid DEFAULT gen_random_uuid() NOT NULL,
    id_orden_trabajo uuid NOT NULL,
    id_material integer NOT NULL,
    cantidad numeric(10,2) NOT NULL,
    costo_unitario numeric(10,2) DEFAULT 0 NOT NULL,
    subtotal numeric(10,2) GENERATED ALWAYS AS ((cantidad * costo_unitario)) STORED,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    codigo character varying(25),
    nombre character varying(255),
    CONSTRAINT chk_cantidad_positiva CHECK ((cantidad > (0)::numeric)),
    CONSTRAINT chk_costo_positivo CHECK ((costo_unitario >= (0)::numeric))
);


ALTER TABLE work_orders.detalle_orden_trabajo_material OWNER TO postgres;

--
-- Name: encuesta_satisfaccion; Type: TABLE; Schema: work_orders; Owner: postgres
--

CREATE TABLE work_orders.encuesta_satisfaccion (
    id_encuesta uuid DEFAULT gen_random_uuid() NOT NULL,
    id_orden_trabajo uuid NOT NULL,
    calificacion integer NOT NULL,
    comentarios text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT chk_calificacion CHECK (((calificacion >= 1) AND (calificacion <= 5)))
);


ALTER TABLE work_orders.encuesta_satisfaccion OWNER TO postgres;

--
-- Name: historial_estado_orden_trabajo; Type: TABLE; Schema: work_orders; Owner: postgres
--

CREATE TABLE work_orders.historial_estado_orden_trabajo (
    id_historial integer NOT NULL,
    id_orden_trabajo uuid NOT NULL,
    estado_anterior character varying(50),
    estado_nuevo character varying(50) NOT NULL,
    id_usuario uuid NOT NULL,
    descripcion_cambio text,
    fecha_cambio timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE work_orders.historial_estado_orden_trabajo OWNER TO postgres;

--
-- Name: historial_estado_orden_trabajo_id_historial_seq; Type: SEQUENCE; Schema: work_orders; Owner: postgres
--

CREATE SEQUENCE work_orders.historial_estado_orden_trabajo_id_historial_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE work_orders.historial_estado_orden_trabajo_id_historial_seq OWNER TO postgres;

--
-- Name: historial_estado_orden_trabajo_id_historial_seq; Type: SEQUENCE OWNED BY; Schema: work_orders; Owner: postgres
--

ALTER SEQUENCE work_orders.historial_estado_orden_trabajo_id_historial_seq OWNED BY work_orders.historial_estado_orden_trabajo.id_historial;


--
-- Name: inspeccion_preparacion; Type: TABLE; Schema: work_orders; Owner: postgres
--

CREATE TABLE work_orders.inspeccion_preparacion (
    id_inspeccion uuid DEFAULT gen_random_uuid() NOT NULL,
    id_orden_trabajo uuid NOT NULL,
    pasa_revision boolean NOT NULL,
    observaciones text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE work_orders.inspeccion_preparacion OWNER TO postgres;

--
-- Name: inspeccion_cuadrilla; Type: VIEW; Schema: work_orders; Owner: postgres
--

CREATE VIEW work_orders.inspeccion_cuadrilla AS
 SELECT id_inspeccion,
    id_orden_trabajo,
    pasa_revision,
    observaciones,
    created_at,
    updated_at,
    created_by,
    is_deleted,
    deleted_at
   FROM work_orders.inspeccion_preparacion;


ALTER VIEW work_orders.inspeccion_cuadrilla OWNER TO postgres;

--
-- Name: inspeccion_preparacion_detalle; Type: TABLE; Schema: work_orders; Owner: postgres
--

CREATE TABLE work_orders.inspeccion_preparacion_detalle (
    id_detalle uuid DEFAULT gen_random_uuid() NOT NULL,
    id_inspeccion uuid NOT NULL,
    codigo_item character varying(50) NOT NULL,
    cumple boolean NOT NULL,
    observacion text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE work_orders.inspeccion_preparacion_detalle OWNER TO postgres;

--
-- Name: inspeccion_cuadrilla_detalle; Type: VIEW; Schema: work_orders; Owner: postgres
--

CREATE VIEW work_orders.inspeccion_cuadrilla_detalle AS
 SELECT id_detalle,
    id_inspeccion,
    codigo_item,
    cumple,
    observacion,
    created_at,
    updated_at,
    created_by,
    is_deleted,
    deleted_at
   FROM work_orders.inspeccion_preparacion_detalle;


ALTER VIEW work_orders.inspeccion_cuadrilla_detalle OWNER TO postgres;

--
-- Name: observaciones_orden_trabajo; Type: TABLE; Schema: work_orders; Owner: postgres
--

CREATE TABLE work_orders.observaciones_orden_trabajo (
    id_observacion uuid DEFAULT gen_random_uuid() NOT NULL,
    id_orden_trabajo uuid NOT NULL,
    texto text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE work_orders.observaciones_orden_trabajo OWNER TO postgres;

--
-- Name: seq_orden_trabajo; Type: SEQUENCE; Schema: work_orders; Owner: postgres
--

CREATE SEQUENCE work_orders.seq_orden_trabajo
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE work_orders.seq_orden_trabajo OWNER TO postgres;

--
-- Name: orden_trabajo; Type: TABLE; Schema: work_orders; Owner: postgres
--

CREATE TABLE work_orders.orden_trabajo (
    id_orden_trabajo uuid DEFAULT gen_random_uuid() NOT NULL,
    numero_secuencial integer DEFAULT nextval('work_orders.seq_orden_trabajo'::regclass) NOT NULL,
    codigo_orden character varying(30),
    version integer DEFAULT 1 NOT NULL,
    id_orden_padre uuid,
    origen character varying(50) NOT NULL,
    id_entidad_origen uuid,
    id_tipo_trabajo integer NOT NULL,
    id_prioridad integer NOT NULL,
    id_cliente character varying(13),
    clave_catastral character varying(50),
    estado character varying(50) DEFAULT 'NOTIFICADA'::character varying NOT NULL,
    direccion text NOT NULL,
    ubicacion_detalles character varying(255),
    geom_punto public.geometry(Point,4326),
    geom_trazado public.geometry(LineString,4326),
    geom_area public.geometry(Polygon,4326),
    usuario_asignado uuid,
    escala_supervisor boolean DEFAULT false NOT NULL,
    motivo_escalamiento text,
    fecha_creacion timestamp with time zone DEFAULT now() NOT NULL,
    fecha_asignacion timestamp with time zone,
    fecha_inicio_campo timestamp with time zone,
    fecha_completada timestamp with time zone,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL,
    usuario_asignacion uuid,
    usuario_completacion uuid,
    descripcion text,
    is_deleted boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE work_orders.orden_trabajo OWNER TO postgres;

--
-- Name: TABLE orden_trabajo; Type: COMMENT; Schema: work_orders; Owner: postgres
--

COMMENT ON TABLE work_orders.orden_trabajo IS 'Órdenes de trabajo de la EPAA con soporte para PostGIS, jerarquías, bloqueos optimistas y asignación directa de personal.';


--
-- Name: COLUMN orden_trabajo.usuario_asignado; Type: COMMENT; Schema: work_orders; Owner: postgres
--

COMMENT ON COLUMN work_orders.orden_trabajo.usuario_asignado IS 'Espejo desnormalizado del técnico responsable (es_responsable=TRUE en asignacion_trabajador_orden). Para búsquedas rápidas.';


--
-- Name: prioridad_orden_trabajo; Type: TABLE; Schema: work_orders; Owner: postgres
--

CREATE TABLE work_orders.prioridad_orden_trabajo (
    id_prioridad integer NOT NULL,
    nivel character varying(50) NOT NULL,
    descripcion text,
    sla_horas integer DEFAULT 48 NOT NULL
);


ALTER TABLE work_orders.prioridad_orden_trabajo OWNER TO postgres;

--
-- Name: TABLE prioridad_orden_trabajo; Type: COMMENT; Schema: work_orders; Owner: postgres
--

COMMENT ON TABLE work_orders.prioridad_orden_trabajo IS 'Nivel de criticidad de la orden de trabajo con el Acuerdo de Nivel de Servicio (SLA) en horas.';


--
-- Name: prioridad_orden_trabajo_id_prioridad_seq; Type: SEQUENCE; Schema: work_orders; Owner: postgres
--

CREATE SEQUENCE work_orders.prioridad_orden_trabajo_id_prioridad_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE work_orders.prioridad_orden_trabajo_id_prioridad_seq OWNER TO postgres;

--
-- Name: prioridad_orden_trabajo_id_prioridad_seq; Type: SEQUENCE OWNED BY; Schema: work_orders; Owner: postgres
--

ALTER SEQUENCE work_orders.prioridad_orden_trabajo_id_prioridad_seq OWNED BY work_orders.prioridad_orden_trabajo.id_prioridad;


--
-- Name: rol_trabajador; Type: TABLE; Schema: work_orders; Owner: postgres
--

CREATE TABLE work_orders.rol_trabajador (
    id_rol integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text
);


ALTER TABLE work_orders.rol_trabajador OWNER TO postgres;

--
-- Name: TABLE rol_trabajador; Type: COMMENT; Schema: work_orders; Owner: postgres
--

COMMENT ON TABLE work_orders.rol_trabajador IS 'Roles del personal técnico en campo (Líder, Técnico Operativo, Supervisor GIS, etc.).';


--
-- Name: rol_trabajador_id_rol_seq; Type: SEQUENCE; Schema: work_orders; Owner: postgres
--

CREATE SEQUENCE work_orders.rol_trabajador_id_rol_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE work_orders.rol_trabajador_id_rol_seq OWNER TO postgres;

--
-- Name: rol_trabajador_id_rol_seq; Type: SEQUENCE OWNED BY; Schema: work_orders; Owner: postgres
--

ALTER SEQUENCE work_orders.rol_trabajador_id_rol_seq OWNED BY work_orders.rol_trabajador.id_rol;


--
-- Name: tipo_trabajo; Type: TABLE; Schema: work_orders; Owner: postgres
--

CREATE TABLE work_orders.tipo_trabajo (
    id_tipo_trabajo integer NOT NULL,
    nombre character varying(150) NOT NULL,
    descripcion text NOT NULL,
    id_departamento integer NOT NULL
);


ALTER TABLE work_orders.tipo_trabajo OWNER TO postgres;

--
-- Name: TABLE tipo_trabajo; Type: COMMENT; Schema: work_orders; Owner: postgres
--

COMMENT ON TABLE work_orders.tipo_trabajo IS 'Servicios específicos provistos por la EPAA (Ej: Reparación de fugas, Reparación de pozos, Cortes, etc.).';


--
-- Name: tipo_trabajo_id_tipo_trabajo_seq; Type: SEQUENCE; Schema: work_orders; Owner: postgres
--

CREATE SEQUENCE work_orders.tipo_trabajo_id_tipo_trabajo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE work_orders.tipo_trabajo_id_tipo_trabajo_seq OWNER TO postgres;

--
-- Name: tipo_trabajo_id_tipo_trabajo_seq; Type: SEQUENCE OWNED BY; Schema: work_orders; Owner: postgres
--

ALTER SEQUENCE work_orders.tipo_trabajo_id_tipo_trabajo_seq OWNED BY work_orders.tipo_trabajo.id_tipo_trabajo;


--
-- Name: view_work_order_assignments; Type: VIEW; Schema: work_orders; Owner: postgres
--

CREATE VIEW work_orders.view_work_order_assignments AS
 SELECT ato.id_orden_trabajo AS work_order_id,
    ot.codigo_orden AS work_order_code,
    ato.id_trabajador AS worker_id,
    COALESCE(rt.nombre, 'Sin Rol'::character varying) AS worker_role,
    ato.es_responsable,
    ato.fecha_asignacion AS assignment_date,
    COALESCE((((emp.nombres)::text || ' '::text) || (emp.apellidos)::text), (u.username)::text) AS worker_name
   FROM ((((work_orders.asignacion_trabajador_orden ato
     JOIN work_orders.orden_trabajo ot ON ((ot.id_orden_trabajo = ato.id_orden_trabajo)))
     LEFT JOIN work_orders.rol_trabajador rt ON ((ato.id_rol = rt.id_rol)))
     LEFT JOIN public.usuarios u ON ((ato.id_trabajador = u.usuario_id)))
     LEFT JOIN public.empleados emp ON ((u.usuario_id = emp.usuario_id)))
  WHERE ((ato.is_deleted = false) AND (ot.is_deleted = false));


ALTER VIEW work_orders.view_work_order_assignments OWNER TO postgres;

--
-- Name: VIEW view_work_order_assignments; Type: COMMENT; Schema: work_orders; Owner: postgres
--

COMMENT ON VIEW work_orders.view_work_order_assignments IS 'Lista el personal asignado a cada OT: técnico responsable (es_responsable=TRUE) y trabajadores de campo adicionales.';


--
-- Name: view_all_work_orders_full_details; Type: VIEW; Schema: work_orders; Owner: postgres
--

CREATE VIEW work_orders.view_all_work_orders_full_details AS
 SELECT ot.id_orden_trabajo AS work_order_id,
    ot.codigo_orden AS work_order_code,
    ot.clave_catastral AS cadastral_key,
    ot.descripcion AS work_order_description,
    ot.direccion AS work_order_location,
    public.st_astext(ot.geom_punto) AS coordinates_wkt,
    public.st_x(ot.geom_punto) AS longitude,
    public.st_y(ot.geom_punto) AS latitude,
    tt.nombre AS work_type,
    dep.nombre AS department,
    prio.nivel AS priority,
    est_actual.nombre AS current_state,
    ot.id_cliente AS client_id,
    ot.created_by AS created_by_user_id,
    ot.usuario_asignado AS assigned_to_user_id,
    ot.usuario_completacion AS completed_by_user_id,
    ot.fecha_creacion AS creation_date,
    ot.fecha_asignacion AS assignment_date,
    ot.fecha_completada AS completion_date,
    COALESCE(jsonb_agg(DISTINCT jsonb_build_object('file_name', aot.nombre_archivo, 'file_type', aot.tipo_adjunto, 'file_url', aot.url_archivo, 'upload_date', aot.created_at)) FILTER (WHERE (aot.id_adjunto IS NOT NULL)), '[]'::jsonb) AS management_attachments,
    COALESCE(jsonb_agg(DISTINCT jsonb_build_object('material_id', dotm.id_material, 'quantity', dotm.cantidad, 'unit_cost', dotm.costo_unitario, 'subtotal_cost', dotm.subtotal)) FILTER (WHERE (dotm.id_detalle_material IS NOT NULL)), '[]'::jsonb) AS materials_used,
    COALESCE(jsonb_agg(DISTINCT jsonb_build_object('observation_text', oot.texto, 'observation_date', oot.created_at, 'observer_user_id', oot.created_by)) FILTER (WHERE (oot.id_observacion IS NOT NULL)), '[]'::jsonb) AS observations_made,
    COALESCE(jsonb_agg(DISTINCT jsonb_build_object('worker_id', vwoa.worker_id, 'worker_name', vwoa.worker_name, 'worker_role', vwoa.worker_role, 'is_responsible', vwoa.es_responsable, 'assignment_date', vwoa.assignment_date)) FILTER (WHERE (vwoa.worker_id IS NOT NULL)), '[]'::jsonb) AS assigned_workers
   FROM ((((((((work_orders.orden_trabajo ot
     LEFT JOIN work_orders.tipo_trabajo tt ON ((ot.id_tipo_trabajo = tt.id_tipo_trabajo)))
     LEFT JOIN work_orders.departamento_trabajo dep ON ((tt.id_departamento = dep.id_departamento)))
     LEFT JOIN work_orders.prioridad_orden_trabajo prio ON ((ot.id_prioridad = prio.id_prioridad)))
     LEFT JOIN work_orders.cat_estado_orden est_actual ON (((ot.estado)::text = (est_actual.codigo)::text)))
     LEFT JOIN work_orders.adjuntos_orden_trabajo aot ON (((ot.id_orden_trabajo = aot.id_orden_trabajo) AND (aot.is_deleted = false))))
     LEFT JOIN work_orders.detalle_orden_trabajo_material dotm ON (((ot.id_orden_trabajo = dotm.id_orden_trabajo) AND (dotm.is_deleted = false))))
     LEFT JOIN work_orders.observaciones_orden_trabajo oot ON (((ot.id_orden_trabajo = oot.id_orden_trabajo) AND (oot.is_deleted = false))))
     LEFT JOIN work_orders.view_work_order_assignments vwoa ON ((ot.id_orden_trabajo = vwoa.work_order_id)))
  WHERE (ot.is_deleted = false)
  GROUP BY ot.id_orden_trabajo, ot.codigo_orden, ot.clave_catastral, ot.descripcion, ot.direccion, ot.geom_punto, tt.nombre, dep.nombre, prio.nivel, est_actual.nombre, ot.id_cliente, ot.created_by, ot.usuario_asignado, ot.usuario_completacion, ot.fecha_creacion, ot.fecha_asignacion, ot.fecha_completada
  ORDER BY ot.codigo_orden;


ALTER VIEW work_orders.view_all_work_orders_full_details OWNER TO postgres;

--
-- Name: view_dashboard_ordenes; Type: VIEW; Schema: work_orders; Owner: postgres
--

CREATE VIEW work_orders.view_dashboard_ordenes AS
 SELECT ot.id_orden_trabajo,
    ot.codigo_orden,
    ot.clave_catastral,
    ot.direccion,
    ot.estado,
    ceo.nombre AS nombre_estado,
    coo.nombre AS origen_requerimiento,
    tt.nombre AS tipo_trabajo,
    dep.nombre AS departamento,
    pot.nivel AS prioridad,
    pot.sla_horas,
    u_resp.username AS tecnico_responsable_username,
    COALESCE((((emp_resp.nombres)::text || ' '::text) || (emp_resp.apellidos)::text), (u_resp.username)::text) AS tecnico_responsable_nombre,
    ot.usuario_asignado,
    ( SELECT count(*) AS count
           FROM work_orders.asignacion_trabajador_orden ato
          WHERE ((ato.id_orden_trabajo = ot.id_orden_trabajo) AND (ato.is_deleted = false))) AS total_personal,
    ot.escala_supervisor,
    ot.motivo_escalamiento,
    ot.fecha_creacion,
    ot.fecha_asignacion,
    ot.fecha_inicio_campo,
    ot.fecha_completada,
    ot.created_by,
    ot.is_deleted,
    ((EXTRACT(epoch FROM (ot.fecha_asignacion - ot.fecha_creacion)) / (3600)::numeric))::numeric(10,2) AS horas_hasta_asignacion,
    ((EXTRACT(epoch FROM (ot.fecha_completada - ot.fecha_inicio_campo)) / (3600)::numeric))::numeric(10,2) AS horas_ejecucion_campo,
    ((EXTRACT(epoch FROM (COALESCE(ot.fecha_completada, now()) - ot.fecha_creacion)) / (3600)::numeric))::numeric(10,2) AS horas_totales_proceso,
        CASE
            WHEN (ot.fecha_completada IS NOT NULL) THEN (ot.fecha_completada <= (ot.fecha_creacion + ((pot.sla_horas || ' hours'::text))::interval))
            ELSE (now() <= (ot.fecha_creacion + ((pot.sla_horas || ' hours'::text))::interval))
        END AS cumple_sla,
    ( SELECT count(*) AS count
           FROM work_orders.inspeccion_preparacion ip
          WHERE ((ip.id_orden_trabajo = ot.id_orden_trabajo) AND (ip.pasa_revision = false) AND (ip.is_deleted = false))) AS revisiones_checklist_fallidas,
    ( SELECT count(*) AS count
           FROM work_orders.control_calidad cc
          WHERE ((cc.id_orden_trabajo = ot.id_orden_trabajo) AND (cc.trabajo_aprobado = false) AND (cc.is_deleted = false))) AS revisiones_calidad_fallidas,
    public.st_y(ot.geom_punto) AS latitud,
    public.st_x(ot.geom_punto) AS longitud
   FROM (((((((work_orders.orden_trabajo ot
     JOIN work_orders.cat_estado_orden ceo ON (((ot.estado)::text = (ceo.codigo)::text)))
     JOIN work_orders.cat_origen_orden coo ON (((ot.origen)::text = (coo.codigo)::text)))
     JOIN work_orders.tipo_trabajo tt ON ((ot.id_tipo_trabajo = tt.id_tipo_trabajo)))
     JOIN work_orders.departamento_trabajo dep ON ((tt.id_departamento = dep.id_departamento)))
     JOIN work_orders.prioridad_orden_trabajo pot ON ((ot.id_prioridad = pot.id_prioridad)))
     LEFT JOIN public.usuarios u_resp ON ((ot.usuario_asignado = u_resp.usuario_id)))
     LEFT JOIN public.empleados emp_resp ON ((u_resp.usuario_id = emp_resp.usuario_id)))
  WHERE (ot.is_deleted = false);


ALTER VIEW work_orders.view_dashboard_ordenes OWNER TO postgres;

--
-- Name: VIEW view_dashboard_ordenes; Type: COMMENT; Schema: work_orders; Owner: postgres
--

COMMENT ON VIEW work_orders.view_dashboard_ordenes IS 'Vista principal de monitoreo de OTs. Única fuente de verdad para dashboards y KPIs.';


--
-- Name: view_historical_work_orders; Type: VIEW; Schema: work_orders; Owner: postgres
--

CREATE VIEW work_orders.view_historical_work_orders AS
 SELECT ot.id_orden_trabajo AS work_order_id,
    ot.codigo_orden AS work_order_code,
    ot.clave_catastral AS cadastral_key,
    ot.descripcion AS work_order_description,
    ot.direccion AS work_order_location,
    public.st_astext(ot.geom_punto) AS coordinates_wkt,
    public.st_x(ot.geom_punto) AS longitude,
    public.st_y(ot.geom_punto) AS latitude,
    tt.nombre AS work_type,
    dep.nombre AS department,
    prio.nivel AS priority,
    est_actual.nombre AS current_state,
    ot.id_cliente AS client_id,
    ot.created_by AS created_by_user_id,
    ot.usuario_asignado AS assigned_to_user_id,
    ot.usuario_completacion AS completed_by_user_id,
    ot.fecha_creacion AS creation_date,
    ot.fecha_asignacion AS assignment_date,
    ot.fecha_completada AS completion_date,
    he.id_historial AS historical_id,
    he.estado_nuevo AS historical_state_id,
    est_hist.nombre AS historical_state_name,
    he.fecha_cambio AS state_change_date,
    he.id_usuario AS state_change_user_id,
    he.descripcion_cambio AS change_description,
    row_number() OVER (PARTITION BY ot.id_orden_trabajo ORDER BY he.fecha_cambio) AS change_number
   FROM ((((((work_orders.orden_trabajo ot
     LEFT JOIN work_orders.tipo_trabajo tt ON ((ot.id_tipo_trabajo = tt.id_tipo_trabajo)))
     LEFT JOIN work_orders.departamento_trabajo dep ON ((tt.id_departamento = dep.id_departamento)))
     LEFT JOIN work_orders.prioridad_orden_trabajo prio ON ((ot.id_prioridad = prio.id_prioridad)))
     LEFT JOIN work_orders.cat_estado_orden est_actual ON (((ot.estado)::text = (est_actual.codigo)::text)))
     LEFT JOIN work_orders.historial_estado_orden_trabajo he ON ((ot.id_orden_trabajo = he.id_orden_trabajo)))
     LEFT JOIN work_orders.cat_estado_orden est_hist ON (((he.estado_nuevo)::text = (est_hist.codigo)::text)))
  WHERE (ot.is_deleted = false)
  ORDER BY ot.codigo_orden, he.fecha_cambio;


ALTER VIEW work_orders.view_historical_work_orders OWNER TO postgres;

--
-- Name: view_informe_inspeccion; Type: VIEW; Schema: work_orders; Owner: postgres
--

CREATE VIEW work_orders.view_informe_inspeccion AS
 WITH trabajadores_ot AS (
         SELECT ato.id_orden_trabajo,
            json_agg(json_build_object('assignment_id', ato.id_asignacion, 'worker_id', ato.id_trabajador, 'is_responsible', ato.es_responsable, 'assignment_date', ato.fecha_asignacion, 'first_name', emp.nombres, 'last_name', emp.apellidos, 'email', COALESCE(emp.email_interno, u.email), 'phone', emp.telefono_interno, 'role_id', emp.cargo_id)) AS trabajadores
           FROM ((work_orders.asignacion_trabajador_orden ato
             LEFT JOIN public.usuarios u ON ((u.usuario_id = ato.id_trabajador)))
             LEFT JOIN public.empleados emp ON ((emp.usuario_id = u.usuario_id)))
          WHERE (ato.is_deleted = false)
          GROUP BY ato.id_orden_trabajo
        ), materiales_ot AS (
         SELECT detalle_orden_trabajo_material.id_orden_trabajo,
            json_agg(json_build_object('material_id', detalle_orden_trabajo_material.id_material, 'code', detalle_orden_trabajo_material.codigo, 'name', detalle_orden_trabajo_material.nombre, 'quantity', detalle_orden_trabajo_material.cantidad, 'unit_cost', detalle_orden_trabajo_material.costo_unitario, 'subtotal', detalle_orden_trabajo_material.subtotal)) AS materiales
           FROM work_orders.detalle_orden_trabajo_material
          WHERE (detalle_orden_trabajo_material.is_deleted = false)
          GROUP BY detalle_orden_trabajo_material.id_orden_trabajo
        ), documentos_sol AS (
         SELECT documento_adjunto.id_solicitud,
            json_agg(json_build_object('document_id', documento_adjunto.id_documento, 'file_url', documento_adjunto.url_archivo, 'original_name', documento_adjunto.nombre_original, 'validation_status', documento_adjunto.estado_validacion)) AS documentos
           FROM acometidas.documento_adjunto
          GROUP BY documento_adjunto.id_solicitud
        ), adjuntos_ot AS (
         SELECT adjuntos_orden_trabajo.id_orden_trabajo,
            json_agg(json_build_object('attachment_id', adjuntos_orden_trabajo.id_adjunto, 'type', adjuntos_orden_trabajo.tipo_adjunto, 'file_url', adjuntos_orden_trabajo.url_archivo, 'created_at', adjuntos_orden_trabajo.created_at)) AS adjuntos
           FROM work_orders.adjuntos_orden_trabajo
          WHERE (adjuntos_orden_trabajo.is_deleted = false)
          GROUP BY adjuntos_orden_trabajo.id_orden_trabajo
        ), observaciones_ot AS (
         SELECT observaciones_orden_trabajo.id_orden_trabajo,
            json_agg(json_build_object('observation_id', observaciones_orden_trabajo.id_observacion, 'text', observaciones_orden_trabajo.texto, 'created_at', observaciones_orden_trabajo.created_at)) AS observaciones
           FROM work_orders.observaciones_orden_trabajo
          WHERE (observaciones_orden_trabajo.is_deleted = false)
          GROUP BY observaciones_orden_trabajo.id_orden_trabajo
        )
 SELECT insp.id_informe AS report_id,
    sol.numero_solicitud AS request_number,
    ot.codigo_orden AS order_code,
    insp.resultado AS result,
    insp.distancia_red_m AS network_distance_meters,
    insp.diametro_conexion AS connection_diameter,
    insp.condiciones_terreno AS terrain_conditions,
    insp.observaciones AS observations,
    (public.st_asgeojson(insp.geom_acometida))::jsonb AS location,
    insp.costo_materiales AS materials_cost,
    insp.costo_mano_obra AS labor_cost,
    insp.costo_total AS total_cost,
    insp.aprobado AS is_approved,
    insp.motivo_rechazo AS rejection_reason,
    insp.fecha_aprobacion AS approval_date,
    insp.created_at,
        CASE
            WHEN (insp.id_aprobador IS NOT NULL) THEN jsonb_build_object('approver_id', insp.id_aprobador, 'first_name', emp_apr.nombres, 'last_name', emp_apr.apellidos, 'email', COALESCE(emp_apr.email_interno, u_apr.email), 'role_id', emp_apr.cargo_id)
            ELSE NULL::jsonb
        END AS approver_detail,
    jsonb_build_object('request_id', sol.id_solicitud, 'request_number', sol.numero_solicitud, 'connection_type', sol.tipo_acometida, 'property_use', sol.uso_predio, 'address', sol.direccion, 'status', sol.estado, 'cadastral_code', sol.clave_catastral, 'client',
        CASE
            WHEN (ci.ciudadano_id IS NOT NULL) THEN jsonb_build_object('type', 'NATURAL', 'identification', ci.ciudadano_id, 'full_name', concat(ci.nombres, ' ', ci.apellidos))
            WHEN (em.empresa_id IS NOT NULL) THEN jsonb_build_object('type', 'EMPRESA', 'identification', em.ruc, 'full_name', COALESCE(em.razon_social, em.nombre_comercial))
            ELSE NULL::jsonb
        END, 'analyst',
        CASE
            WHEN (sol.id_analista IS NOT NULL) THEN jsonb_build_object('analyst_id', sol.id_analista, 'first_name', emp_analista.nombres, 'last_name', emp_analista.apellidos)
            ELSE NULL::jsonb
        END, 'documents', COALESCE(ds.documentos, '[]'::json)) AS request_detail,
    jsonb_build_object('work_order_id', ot.id_orden_trabajo, 'order_code', ot.codigo_orden, 'status', ot.estado, 'origin', ot.origen, 'priority_id', ot.id_prioridad, 'assignment_date', ot.fecha_asignacion, 'completed_date', ot.fecha_completada, 'workers', COALESCE(t.trabajadores, '[]'::json), 'materials', COALESCE(m.materiales, '[]'::json), 'attachments', COALESCE(ao.adjuntos, '[]'::json), 'observations', COALESCE(oo.observaciones, '[]'::json)) AS work_order_detail
   FROM ((((((((((((((acometidas.informe_inspeccion insp
     JOIN acometidas.solicitud sol ON ((sol.id_solicitud = insp.id_solicitud)))
     JOIN work_orders.orden_trabajo ot ON ((ot.id_orden_trabajo = insp.id_orden_trabajo)))
     LEFT JOIN trabajadores_ot t ON ((t.id_orden_trabajo = ot.id_orden_trabajo)))
     LEFT JOIN materiales_ot m ON ((m.id_orden_trabajo = ot.id_orden_trabajo)))
     LEFT JOIN adjuntos_ot ao ON ((ao.id_orden_trabajo = ot.id_orden_trabajo)))
     LEFT JOIN observaciones_ot oo ON ((oo.id_orden_trabajo = ot.id_orden_trabajo)))
     LEFT JOIN documentos_sol ds ON ((ds.id_solicitud = sol.id_solicitud)))
     LEFT JOIN public.usuarios u_apr ON ((u_apr.usuario_id = insp.id_aprobador)))
     LEFT JOIN public.empleados emp_apr ON ((emp_apr.usuario_id = u_apr.usuario_id)))
     LEFT JOIN public.usuarios u_analista ON ((u_analista.usuario_id = sol.id_analista)))
     LEFT JOIN public.empleados emp_analista ON ((emp_analista.usuario_id = u_analista.usuario_id)))
     LEFT JOIN public.cliente cl ON (((cl.cliente_id)::text = (sol.id_cliente)::text)))
     LEFT JOIN public.ciudadano ci ON (((ci.ciudadano_id)::text = (sol.id_cliente)::text)))
     LEFT JOIN public.empresa em ON (((em.cliente_id)::text = (sol.id_cliente)::text)))
  WHERE (insp.is_deleted = false)
  ORDER BY insp.created_at DESC;


ALTER VIEW work_orders.view_informe_inspeccion OWNER TO postgres;

--
-- Name: view_informe_instalacion; Type: VIEW; Schema: work_orders; Owner: postgres
--

CREATE VIEW work_orders.view_informe_instalacion AS
 WITH trabajadores_ot AS (
         SELECT ato.id_orden_trabajo,
            json_agg(json_build_object('assignment_id', ato.id_asignacion, 'worker_id', ato.id_trabajador, 'is_responsible', ato.es_responsable, 'assignment_date', ato.fecha_asignacion, 'first_name', emp.nombres, 'last_name', emp.apellidos, 'email', COALESCE(emp.email_interno, u.email), 'phone', emp.telefono_interno, 'role_id', emp.cargo_id)) AS trabajadores
           FROM ((work_orders.asignacion_trabajador_orden ato
             LEFT JOIN public.usuarios u ON ((u.usuario_id = ato.id_trabajador)))
             LEFT JOIN public.empleados emp ON ((emp.usuario_id = u.usuario_id)))
          WHERE (ato.is_deleted = false)
          GROUP BY ato.id_orden_trabajo
        ), materiales_ot AS (
         SELECT detalle_orden_trabajo_material.id_orden_trabajo,
            json_agg(json_build_object('material_id', detalle_orden_trabajo_material.id_material, 'code', detalle_orden_trabajo_material.codigo, 'name', detalle_orden_trabajo_material.nombre, 'quantity', detalle_orden_trabajo_material.cantidad, 'unit_cost', detalle_orden_trabajo_material.costo_unitario, 'subtotal', detalle_orden_trabajo_material.subtotal)) AS materiales
           FROM work_orders.detalle_orden_trabajo_material
          WHERE (detalle_orden_trabajo_material.is_deleted = false)
          GROUP BY detalle_orden_trabajo_material.id_orden_trabajo
        ), documentos_sol AS (
         SELECT documento_adjunto.id_solicitud,
            json_agg(json_build_object('document_id', documento_adjunto.id_documento, 'file_url', documento_adjunto.url_archivo, 'original_name', documento_adjunto.nombre_original, 'validation_status', documento_adjunto.estado_validacion)) AS documentos
           FROM acometidas.documento_adjunto
          GROUP BY documento_adjunto.id_solicitud
        ), adjuntos_ot AS (
         SELECT adjuntos_orden_trabajo.id_orden_trabajo,
            json_agg(json_build_object('attachment_id', adjuntos_orden_trabajo.id_adjunto, 'type', adjuntos_orden_trabajo.tipo_adjunto, 'file_url', adjuntos_orden_trabajo.url_archivo, 'created_at', adjuntos_orden_trabajo.created_at)) AS adjuntos
           FROM work_orders.adjuntos_orden_trabajo
          WHERE (adjuntos_orden_trabajo.is_deleted = false)
          GROUP BY adjuntos_orden_trabajo.id_orden_trabajo
        ), observaciones_ot AS (
         SELECT observaciones_orden_trabajo.id_orden_trabajo,
            json_agg(json_build_object('observation_id', observaciones_orden_trabajo.id_observacion, 'text', observaciones_orden_trabajo.texto, 'created_at', observaciones_orden_trabajo.created_at)) AS observaciones
           FROM work_orders.observaciones_orden_trabajo
          WHERE (observaciones_orden_trabajo.is_deleted = false)
          GROUP BY observaciones_orden_trabajo.id_orden_trabajo
        )
 SELECT inst.id_informe AS report_id,
    sol.numero_solicitud AS request_number,
    ot.codigo_orden AS order_code,
    inst.resultado AS result,
    inst.fecha_instalacion AS installation_date,
    inst.numero_medidor AS meter_number,
    inst.lectura_inicial AS initial_reading,
    inst.sello_seguridad AS security_seal,
    inst.diametro_conexion AS connection_diameter,
    (public.st_asgeojson(inst.geom_medidor))::jsonb AS location,
    inst.condiciones_finales AS final_conditions,
    inst.observaciones AS observations,
    inst.firma_cliente AS client_signature_url,
    inst.aprobado AS is_approved,
    inst.fecha_aprobacion AS approval_date,
    inst.created_at,
        CASE
            WHEN (inst.id_aprobador IS NOT NULL) THEN jsonb_build_object('approver_id', inst.id_aprobador, 'first_name', emp_apr.nombres, 'last_name', emp_apr.apellidos, 'email', COALESCE(emp_apr.email_interno, u_apr.email), 'role_id', emp_apr.cargo_id)
            ELSE NULL::jsonb
        END AS approver_detail,
    jsonb_build_object('request_id', sol.id_solicitud, 'request_number', sol.numero_solicitud, 'connection_type', sol.tipo_acometida, 'property_use', sol.uso_predio, 'address', sol.direccion, 'status', sol.estado, 'cadastral_code', sol.clave_catastral, 'client',
        CASE
            WHEN (ci.ciudadano_id IS NOT NULL) THEN jsonb_build_object('type', 'NATURAL', 'identification', ci.ciudadano_id, 'full_name', concat(ci.nombres, ' ', ci.apellidos))
            WHEN (em.empresa_id IS NOT NULL) THEN jsonb_build_object('type', 'EMPRESA', 'identification', em.ruc, 'full_name', COALESCE(em.razon_social, em.nombre_comercial))
            ELSE NULL::jsonb
        END, 'analyst',
        CASE
            WHEN (sol.id_analista IS NOT NULL) THEN jsonb_build_object('analyst_id', sol.id_analista, 'first_name', emp_analista.nombres, 'last_name', emp_analista.apellidos)
            ELSE NULL::jsonb
        END, 'documents', COALESCE(ds.documentos, '[]'::json)) AS request_detail,
    jsonb_build_object('work_order_id', ot.id_orden_trabajo, 'order_code', ot.codigo_orden, 'status', ot.estado, 'origin', ot.origen, 'priority_id', ot.id_prioridad, 'assignment_date', ot.fecha_asignacion, 'completed_date', ot.fecha_completada, 'workers', COALESCE(t.trabajadores, '[]'::json), 'materials', COALESCE(m.materiales, '[]'::json), 'attachments', COALESCE(ao.adjuntos, '[]'::json), 'observations', COALESCE(oo.observaciones, '[]'::json)) AS work_order_detail
   FROM ((((((((((((((acometidas.informe_instalacion inst
     JOIN acometidas.solicitud sol ON ((sol.id_solicitud = inst.id_solicitud)))
     JOIN work_orders.orden_trabajo ot ON ((ot.id_orden_trabajo = inst.id_orden_trabajo)))
     LEFT JOIN trabajadores_ot t ON ((t.id_orden_trabajo = ot.id_orden_trabajo)))
     LEFT JOIN materiales_ot m ON ((m.id_orden_trabajo = ot.id_orden_trabajo)))
     LEFT JOIN adjuntos_ot ao ON ((ao.id_orden_trabajo = ot.id_orden_trabajo)))
     LEFT JOIN observaciones_ot oo ON ((oo.id_orden_trabajo = ot.id_orden_trabajo)))
     LEFT JOIN documentos_sol ds ON ((ds.id_solicitud = sol.id_solicitud)))
     LEFT JOIN public.usuarios u_apr ON ((u_apr.usuario_id = inst.id_aprobador)))
     LEFT JOIN public.empleados emp_apr ON ((emp_apr.usuario_id = u_apr.usuario_id)))
     LEFT JOIN public.usuarios u_analista ON ((u_analista.usuario_id = sol.id_analista)))
     LEFT JOIN public.empleados emp_analista ON ((emp_analista.usuario_id = u_analista.usuario_id)))
     LEFT JOIN public.cliente cl ON (((cl.cliente_id)::text = (sol.id_cliente)::text)))
     LEFT JOIN public.ciudadano ci ON (((ci.ciudadano_id)::text = (sol.id_cliente)::text)))
     LEFT JOIN public.empresa em ON (((em.cliente_id)::text = (sol.id_cliente)::text)))
  ORDER BY inst.created_at DESC;


ALTER VIEW work_orders.view_informe_instalacion OWNER TO postgres;

--
-- Name: view_ordenes_trabajo_pendientes; Type: VIEW; Schema: work_orders; Owner: postgres
--

CREATE VIEW work_orders.view_ordenes_trabajo_pendientes AS
 SELECT ot.id_orden_trabajo AS work_order_id,
    ot.codigo_orden AS work_order_code,
    ot.origen AS origin,
    ot.id_entidad_origen AS origin_entity_id,
    ot.id_cliente AS client_id,
    COALESCE((((ciud.nombres)::text || ' '::text) || (ciud.apellidos)::text), 'Sin Cliente / Uso Interno'::text) AS client_name,
    tt.nombre AS work_type,
    prio.nivel AS priority,
    prio.sla_horas AS sla_hours,
    est.nombre AS current_state,
    ot.direccion AS location,
    ot.geom_punto AS coordinates,
    ot.fecha_creacion AS creation_date,
    ot.fecha_asignacion AS assignment_date,
    ot.fecha_inicio_campo AS execution_start_date,
    ot.escala_supervisor AS is_escalated,
    ot.motivo_escalamiento AS escalation_reason,
    ((EXTRACT(epoch FROM (now() - ot.fecha_creacion)) / (3600)::numeric))::numeric(10,2) AS hours_elapsed,
    (((prio.sla_horas)::numeric - (EXTRACT(epoch FROM (now() - ot.fecha_creacion)) / (3600)::numeric)))::numeric(10,2) AS hours_remaining_sla,
        CASE
            WHEN ((EXTRACT(epoch FROM (now() - ot.fecha_creacion)) / (3600)::numeric) > (prio.sla_horas)::numeric) THEN true
            ELSE false
        END AS is_sla_breached,
        CASE
            WHEN (ot.usuario_asignado IS NOT NULL) THEN 'ASIGNADA'::text
            ELSE 'SIN_ASIGNAR'::text
        END AS assignment_type,
    COALESCE((((emp_asig.nombres)::text || ' '::text) || (emp_asig.apellidos)::text), (u_asig.username)::text, 'Sin Asignar'::text) AS assigned_to,
    ( SELECT count(*) AS count
           FROM work_orders.asignacion_trabajador_orden ato
          WHERE ((ato.id_orden_trabajo = ot.id_orden_trabajo) AND (ato.is_deleted = false))) AS assigned_workers_count,
    ( SELECT count(*) AS count
           FROM work_orders.detalle_orden_trabajo_material dotm
          WHERE ((dotm.id_orden_trabajo = ot.id_orden_trabajo) AND (dotm.is_deleted = false))) AS materials_count,
    ( SELECT COALESCE(sum(dotm.subtotal), (0)::numeric) AS "coalesce"
           FROM work_orders.detalle_orden_trabajo_material dotm
          WHERE ((dotm.id_orden_trabajo = ot.id_orden_trabajo) AND (dotm.is_deleted = false))) AS materials_cost,
    ( SELECT count(*) AS count
           FROM work_orders.observaciones_orden_trabajo oot
          WHERE ((oot.id_orden_trabajo = ot.id_orden_trabajo) AND (oot.is_deleted = false))) AS observations_count,
    ( SELECT count(*) AS count
           FROM work_orders.adjuntos_orden_trabajo aot
          WHERE ((aot.id_orden_trabajo = ot.id_orden_trabajo) AND (aot.is_deleted = false))) AS attachments_count
   FROM (((((((work_orders.orden_trabajo ot
     JOIN work_orders.tipo_trabajo tt ON ((ot.id_tipo_trabajo = tt.id_tipo_trabajo)))
     JOIN work_orders.prioridad_orden_trabajo prio ON ((ot.id_prioridad = prio.id_prioridad)))
     JOIN work_orders.cat_estado_orden est ON (((ot.estado)::text = (est.codigo)::text)))
     LEFT JOIN public.usuarios u_asig ON ((ot.usuario_asignado = u_asig.usuario_id)))
     LEFT JOIN public.empleados emp_asig ON ((u_asig.usuario_id = emp_asig.usuario_id)))
     LEFT JOIN public.cliente_persona_natural cpn ON (((ot.id_cliente)::text = (cpn.cliente_id)::text)))
     LEFT JOIN public.ciudadano ciud ON (((cpn.ciudadano_id)::text = (ciud.ciudadano_id)::text)))
  WHERE ((ot.is_deleted = false) AND ((ot.estado)::text <> ALL (ARRAY[('COMPLETADA'::character varying)::text, ('CANCELADA'::character varying)::text])))
  ORDER BY
        CASE
            WHEN ((EXTRACT(epoch FROM (now() - ot.fecha_creacion)) / (3600)::numeric) > (prio.sla_horas)::numeric) THEN true
            ELSE false
        END DESC, ((((prio.sla_horas)::numeric - (EXTRACT(epoch FROM (now() - ot.fecha_creacion)) / (3600)::numeric)))::numeric(10,2)), prio.sla_horas;


ALTER VIEW work_orders.view_ordenes_trabajo_pendientes OWNER TO postgres;

--
-- Name: view_work_order_attachments; Type: VIEW; Schema: work_orders; Owner: postgres
--

CREATE VIEW work_orders.view_work_order_attachments AS
 SELECT aot.id_adjunto AS attachment_id,
    aot.id_orden_trabajo AS work_order_id,
    ot.codigo_orden AS work_order_code,
    aot.nombre_archivo AS file_name,
    aot.url_archivo AS file_url,
    aot.tipo_adjunto AS file_type,
    aot.mime_type,
    aot.created_at AS upload_date,
    aot.created_by AS uploaded_by_user_id
   FROM (work_orders.adjuntos_orden_trabajo aot
     JOIN work_orders.orden_trabajo ot ON ((ot.id_orden_trabajo = aot.id_orden_trabajo)))
  WHERE ((aot.is_deleted = false) AND (ot.is_deleted = false));


ALTER VIEW work_orders.view_work_order_attachments OWNER TO postgres;

--
-- Name: view_work_order_history; Type: VIEW; Schema: work_orders; Owner: postgres
--

CREATE VIEW work_orders.view_work_order_history AS
 SELECT he.id_historial AS history_id,
    he.id_orden_trabajo AS work_order_id,
    ot.codigo_orden AS work_order_code,
    he.estado_anterior AS previous_status,
    prev_state.nombre AS previous_status_name,
    he.estado_nuevo AS new_status,
    new_state.nombre AS new_status_name,
    he.id_usuario AS changed_by_user_id,
    he.descripcion_cambio AS change_description,
    he.fecha_cambio AS changed_at
   FROM (((work_orders.historial_estado_orden_trabajo he
     JOIN work_orders.orden_trabajo ot ON ((ot.id_orden_trabajo = he.id_orden_trabajo)))
     LEFT JOIN work_orders.cat_estado_orden prev_state ON (((prev_state.codigo)::text = (he.estado_anterior)::text)))
     LEFT JOIN work_orders.cat_estado_orden new_state ON (((new_state.codigo)::text = (he.estado_nuevo)::text)))
  WHERE (ot.is_deleted = false)
  ORDER BY he.fecha_cambio DESC;


ALTER VIEW work_orders.view_work_order_history OWNER TO postgres;

--
-- Name: view_work_order_key_statistics; Type: VIEW; Schema: work_orders; Owner: postgres
--

CREATE VIEW work_orders.view_work_order_key_statistics AS
 SELECT count(*) AS total_orders,
    eot.codigo AS status_id,
    eot.nombre AS status_name,
    ot.id_tipo_trabajo AS work_type_id,
    tt.nombre AS work_type,
    dt.id_departamento AS department_id,
    dt.nombre AS department_name,
    count(*) FILTER (WHERE ((pot.nivel)::text = 'Emergencia'::text)) AS emergency,
    count(*) FILTER (WHERE ((pot.nivel)::text = 'Urgente'::text)) AS urgent,
    count(*) FILTER (WHERE ((pot.nivel)::text = 'Alta'::text)) AS high,
    count(*) FILTER (WHERE ((pot.nivel)::text = 'Media'::text)) AS medium,
    count(*) FILTER (WHERE ((pot.nivel)::text = 'Baja'::text)) AS low,
    count(*) FILTER (WHERE ((pot.nivel)::text = ANY (ARRAY[('Emergencia'::character varying)::text, ('Urgente'::character varying)::text]))) AS critical_orders,
    count(*) FILTER (WHERE (ot.fecha_creacion >= CURRENT_DATE)) AS created_today,
    count(*) FILTER (WHERE (ot.fecha_creacion >= (CURRENT_DATE - '7 days'::interval))) AS created_last_7_days,
    count(*) FILTER (WHERE (ot.fecha_creacion >= date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone))) AS created_this_month,
    count(*) FILTER (WHERE ((eot.codigo)::text = ANY (ARRAY[('COMPLETADA'::character varying)::text, ('CANCELADA'::character varying)::text]))) AS closed,
    count(*) FILTER (WHERE ((eot.codigo)::text = 'COMPLETADA'::text)) AS completed,
    avg((EXTRACT(epoch FROM (ot.fecha_completada - ot.fecha_creacion)) / (3600)::numeric)) FILTER (WHERE (ot.fecha_completada IS NOT NULL)) AS avg_hours_to_complete,
    avg((EXTRACT(epoch FROM (ot.fecha_asignacion - ot.fecha_creacion)) / (3600)::numeric)) FILTER (WHERE (ot.fecha_asignacion IS NOT NULL)) AS avg_hours_to_assignment,
    round(((100.0 * (count(*) FILTER (WHERE ((eot.codigo)::text = 'COMPLETADA'::text)))::numeric) / (NULLIF(count(*), 0))::numeric), 2) AS pct_completed_in_group,
    (COALESCE(sum(mat.costo_total), (0)::numeric))::numeric(12,2) AS total_material_cost,
    (avg(trab.cantidad_trabajadores))::numeric(5,1) AS avg_workers_per_order,
    sum(trab.cantidad_trabajadores) AS total_worker_assignments
   FROM ((((((work_orders.orden_trabajo ot
     JOIN work_orders.cat_estado_orden eot ON (((eot.codigo)::text = (ot.estado)::text)))
     JOIN work_orders.tipo_trabajo tt ON ((tt.id_tipo_trabajo = ot.id_tipo_trabajo)))
     JOIN work_orders.departamento_trabajo dt ON ((dt.id_departamento = tt.id_departamento)))
     JOIN work_orders.prioridad_orden_trabajo pot ON ((pot.id_prioridad = ot.id_prioridad)))
     LEFT JOIN ( SELECT detalle_orden_trabajo_material.id_orden_trabajo,
            sum(detalle_orden_trabajo_material.subtotal) AS costo_total
           FROM work_orders.detalle_orden_trabajo_material
          WHERE (detalle_orden_trabajo_material.is_deleted = false)
          GROUP BY detalle_orden_trabajo_material.id_orden_trabajo) mat ON ((ot.id_orden_trabajo = mat.id_orden_trabajo)))
     LEFT JOIN ( SELECT asignacion_trabajador_orden.id_orden_trabajo,
            count(*) AS cantidad_trabajadores
           FROM work_orders.asignacion_trabajador_orden
          WHERE (asignacion_trabajador_orden.is_deleted = false)
          GROUP BY asignacion_trabajador_orden.id_orden_trabajo) trab ON ((ot.id_orden_trabajo = trab.id_orden_trabajo)))
  WHERE (ot.is_deleted = false)
  GROUP BY eot.codigo, eot.nombre, ot.id_tipo_trabajo, tt.nombre, dt.id_departamento, dt.nombre
  ORDER BY dt.nombre, tt.nombre, (count(*)) DESC;


ALTER VIEW work_orders.view_work_order_key_statistics OWNER TO postgres;

--
-- Name: registro_2024_01; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2024_01 FOR VALUES FROM ('2024-01-01 00:00:00-05') TO ('2024-02-01 00:00:00-05');


--
-- Name: registro_2024_02; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2024_02 FOR VALUES FROM ('2024-02-01 00:00:00-05') TO ('2024-03-01 00:00:00-05');


--
-- Name: registro_2024_03; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2024_03 FOR VALUES FROM ('2024-03-01 00:00:00-05') TO ('2024-04-01 00:00:00-05');


--
-- Name: registro_2024_04; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2024_04 FOR VALUES FROM ('2024-04-01 00:00:00-05') TO ('2024-05-01 00:00:00-05');


--
-- Name: registro_2024_05; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2024_05 FOR VALUES FROM ('2024-05-01 00:00:00-05') TO ('2024-06-01 00:00:00-05');


--
-- Name: registro_2024_06; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2024_06 FOR VALUES FROM ('2024-06-01 00:00:00-05') TO ('2024-07-01 00:00:00-05');


--
-- Name: registro_2024_07; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2024_07 FOR VALUES FROM ('2024-07-01 00:00:00-05') TO ('2024-08-01 00:00:00-05');


--
-- Name: registro_2024_08; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2024_08 FOR VALUES FROM ('2024-08-01 00:00:00-05') TO ('2024-09-01 00:00:00-05');


--
-- Name: registro_2024_09; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2024_09 FOR VALUES FROM ('2024-09-01 00:00:00-05') TO ('2024-10-01 00:00:00-05');


--
-- Name: registro_2024_10; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2024_10 FOR VALUES FROM ('2024-10-01 00:00:00-05') TO ('2024-11-01 00:00:00-05');


--
-- Name: registro_2024_11; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2024_11 FOR VALUES FROM ('2024-11-01 00:00:00-05') TO ('2024-12-01 00:00:00-05');


--
-- Name: registro_2024_12; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2024_12 FOR VALUES FROM ('2024-12-01 00:00:00-05') TO ('2025-01-01 00:00:00-05');


--
-- Name: registro_2025_01; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2025_01 FOR VALUES FROM ('2025-01-01 00:00:00-05') TO ('2025-02-01 00:00:00-05');


--
-- Name: registro_2025_02; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2025_02 FOR VALUES FROM ('2025-02-01 00:00:00-05') TO ('2025-03-01 00:00:00-05');


--
-- Name: registro_2025_03; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2025_03 FOR VALUES FROM ('2025-03-01 00:00:00-05') TO ('2025-04-01 00:00:00-05');


--
-- Name: registro_2025_04; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2025_04 FOR VALUES FROM ('2025-04-01 00:00:00-05') TO ('2025-05-01 00:00:00-05');


--
-- Name: registro_2025_05; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2025_05 FOR VALUES FROM ('2025-05-01 00:00:00-05') TO ('2025-06-01 00:00:00-05');


--
-- Name: registro_2025_06; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2025_06 FOR VALUES FROM ('2025-06-01 00:00:00-05') TO ('2025-07-01 00:00:00-05');


--
-- Name: registro_2025_07; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2025_07 FOR VALUES FROM ('2025-07-01 00:00:00-05') TO ('2025-08-01 00:00:00-05');


--
-- Name: registro_2025_08; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2025_08 FOR VALUES FROM ('2025-08-01 00:00:00-05') TO ('2025-09-01 00:00:00-05');


--
-- Name: registro_2025_09; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2025_09 FOR VALUES FROM ('2025-09-01 00:00:00-05') TO ('2025-10-01 00:00:00-05');


--
-- Name: registro_2025_10; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2025_10 FOR VALUES FROM ('2025-10-01 00:00:00-05') TO ('2025-11-01 00:00:00-05');


--
-- Name: registro_2025_11; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2025_11 FOR VALUES FROM ('2025-11-01 00:00:00-05') TO ('2025-12-01 00:00:00-05');


--
-- Name: registro_2025_12; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2025_12 FOR VALUES FROM ('2025-12-01 00:00:00-05') TO ('2026-01-01 00:00:00-05');


--
-- Name: registro_2026_01; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2026_01 FOR VALUES FROM ('2026-01-01 00:00:00-05') TO ('2026-02-01 00:00:00-05');


--
-- Name: registro_2026_02; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2026_02 FOR VALUES FROM ('2026-02-01 00:00:00-05') TO ('2026-03-01 00:00:00-05');


--
-- Name: registro_2026_03; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2026_03 FOR VALUES FROM ('2026-03-01 00:00:00-05') TO ('2026-04-01 00:00:00-05');


--
-- Name: registro_2026_04; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2026_04 FOR VALUES FROM ('2026-04-01 00:00:00-05') TO ('2026-05-01 00:00:00-05');


--
-- Name: registro_2026_05; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2026_05 FOR VALUES FROM ('2026-05-01 00:00:00-05') TO ('2026-06-01 00:00:00-05');


--
-- Name: registro_2026_06; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2026_06 FOR VALUES FROM ('2026-06-01 00:00:00-05') TO ('2026-07-01 00:00:00-05');


--
-- Name: registro_2026_07; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2026_07 FOR VALUES FROM ('2026-07-01 00:00:00-05') TO ('2026-08-01 00:00:00-05');


--
-- Name: registro_2026_08; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2026_08 FOR VALUES FROM ('2026-08-01 00:00:00-05') TO ('2026-09-01 00:00:00-05');


--
-- Name: registro_2026_09; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2026_09 FOR VALUES FROM ('2026-09-01 00:00:00-05') TO ('2026-10-01 00:00:00-05');


--
-- Name: registro_2026_10; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2026_10 FOR VALUES FROM ('2026-10-01 00:00:00-05') TO ('2026-11-01 00:00:00-05');


--
-- Name: registro_2026_11; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2026_11 FOR VALUES FROM ('2026-11-01 00:00:00-05') TO ('2026-12-01 00:00:00-05');


--
-- Name: registro_2026_12; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2026_12 FOR VALUES FROM ('2026-12-01 00:00:00-05') TO ('2027-01-01 00:00:00-05');


--
-- Name: registro_2027_01; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2027_01 FOR VALUES FROM ('2027-01-01 00:00:00-05') TO ('2027-02-01 00:00:00-05');


--
-- Name: registro_2027_02; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2027_02 FOR VALUES FROM ('2027-02-01 00:00:00-05') TO ('2027-03-01 00:00:00-05');


--
-- Name: registro_2027_03; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2027_03 FOR VALUES FROM ('2027-03-01 00:00:00-05') TO ('2027-04-01 00:00:00-05');


--
-- Name: registro_2027_04; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2027_04 FOR VALUES FROM ('2027-04-01 00:00:00-05') TO ('2027-05-01 00:00:00-05');


--
-- Name: registro_2027_05; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2027_05 FOR VALUES FROM ('2027-05-01 00:00:00-05') TO ('2027-06-01 00:00:00-05');


--
-- Name: registro_2027_06; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2027_06 FOR VALUES FROM ('2027-06-01 00:00:00-05') TO ('2027-07-01 00:00:00-05');


--
-- Name: registro_2027_07; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2027_07 FOR VALUES FROM ('2027-07-01 00:00:00-05') TO ('2027-08-01 00:00:00-05');


--
-- Name: registro_2027_08; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2027_08 FOR VALUES FROM ('2027-08-01 00:00:00-05') TO ('2027-09-01 00:00:00-05');


--
-- Name: registro_2027_09; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2027_09 FOR VALUES FROM ('2027-09-01 00:00:00-05') TO ('2027-10-01 00:00:00-05');


--
-- Name: registro_2027_10; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2027_10 FOR VALUES FROM ('2027-10-01 00:00:00-05') TO ('2027-11-01 00:00:00-05');


--
-- Name: registro_2027_11; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2027_11 FOR VALUES FROM ('2027-11-01 00:00:00-05') TO ('2027-12-01 00:00:00-05');


--
-- Name: registro_2027_12; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2027_12 FOR VALUES FROM ('2027-12-01 00:00:00-05') TO ('2028-01-01 00:00:00-05');


--
-- Name: registro_default; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_default DEFAULT;


--
-- Name: sesion_2026_04; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.sesion ATTACH PARTITION audit.sesion_2026_04 FOR VALUES FROM ('2026-04-01 00:00:00-05') TO ('2026-05-01 00:00:00-05');


--
-- Name: sesion_2026_05; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.sesion ATTACH PARTITION audit.sesion_2026_05 FOR VALUES FROM ('2026-05-01 00:00:00-05') TO ('2026-06-01 00:00:00-05');


--
-- Name: sesion_2026_06; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.sesion ATTACH PARTITION audit.sesion_2026_06 FOR VALUES FROM ('2026-06-01 00:00:00-05') TO ('2026-07-01 00:00:00-05');


--
-- Name: sesion_2026_07; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.sesion ATTACH PARTITION audit.sesion_2026_07 FOR VALUES FROM ('2026-07-01 00:00:00-05') TO ('2026-08-01 00:00:00-05');


--
-- Name: sesion_default; Type: TABLE ATTACH; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.sesion ATTACH PARTITION audit.sesion_default DEFAULT;


--
-- Name: catalogo_concepto_factura id; Type: DEFAULT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.catalogo_concepto_factura ALTER COLUMN id SET DEFAULT nextval('acometidas.catalogo_concepto_factura_id_seq'::regclass);


--
-- Name: catalogo_tipo_documento id; Type: DEFAULT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.catalogo_tipo_documento ALTER COLUMN id SET DEFAULT nextval('acometidas.catalogo_tipo_documento_id_seq'::regclass);


--
-- Name: tipo_acometida id_tipo_acometida; Type: DEFAULT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.tipo_acometida ALTER COLUMN id_tipo_acometida SET DEFAULT nextval('acometidas.tipo_acometida_id_tipo_acometida_seq'::regclass);


--
-- Name: tipo_solicitud id_tipo_solicitud; Type: DEFAULT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.tipo_solicitud ALTER COLUMN id_tipo_solicitud SET DEFAULT nextval('acometidas.tipo_solicitud_id_tipo_solicitud_seq'::regclass);


--
-- Name: regla_alerta regla_id; Type: DEFAULT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.regla_alerta ALTER COLUMN regla_id SET DEFAULT nextval('audit.regla_alerta_regla_id_seq'::regclass);


--
-- Name: historial_documento historial_id; Type: DEFAULT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.historial_documento ALTER COLUMN historial_id SET DEFAULT nextval('documents.historial_documento_historial_id_seq'::regclass);


--
-- Name: tipo_documento tipo_documento_id; Type: DEFAULT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.tipo_documento ALTER COLUMN tipo_documento_id SET DEFAULT nextval('documents.tipo_documento_tipo_documento_id_seq'::regclass);


--
-- Name: alerta_lectura_anomala alerta_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerta_lectura_anomala ALTER COLUMN alerta_id SET DEFAULT nextval('public.alerta_lectura_anomala_alerta_id_seq'::regclass);


--
-- Name: auditoria_lectura_sector audit_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria_lectura_sector ALTER COLUMN audit_id SET DEFAULT nextval('public.auditoria_lectura_sector_audit_id_seq'::regclass);


--
-- Name: cargo cargo_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cargo ALTER COLUMN cargo_id SET DEFAULT nextval('public.cargo_cargo_id_seq'::regclass);


--
-- Name: cat_action_types id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cat_action_types ALTER COLUMN id SET DEFAULT nextval('public.cat_action_types_id_seq'::regclass);


--
-- Name: categoria categoria_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria ALTER COLUMN categoria_id SET DEFAULT nextval('public.categoria_categoria_id_seq'::regclass);


--
-- Name: categoria_incidente_medidor categoria_incidente_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_incidente_medidor ALTER COLUMN categoria_incidente_id SET DEFAULT nextval('public.categoria_incidente_medidor_categoria_incidente_id_seq'::regclass);


--
-- Name: claves_sql2000 id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.claves_sql2000 ALTER COLUMN id SET DEFAULT nextval('public.claves_sql2000_id_seq'::regclass);


--
-- Name: cliente_persona_natural cliente_persona_natural_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente_persona_natural ALTER COLUMN cliente_persona_natural_id SET DEFAULT nextval('public.cliente_persona_natural_cliente_persona_natural_id_seq'::regclass);


--
-- Name: componentes_fijos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.componentes_fijos ALTER COLUMN id SET DEFAULT nextval('public.componentes_fijos_id_seq'::regclass);


--
-- Name: correo_electronico correo_electronico_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.correo_electronico ALTER COLUMN correo_electronico_id SET DEFAULT nextval('public.correo_electronico_correo_electronico_id_seq'::regclass);


--
-- Name: correo_empresa correo_empresa_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.correo_empresa ALTER COLUMN correo_empresa_id SET DEFAULT nextval('public.correo_empresa_correo_empresa_id_seq'::regclass);


--
-- Name: correo_persona_natural correo_persona_natural_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.correo_persona_natural ALTER COLUMN correo_persona_natural_id SET DEFAULT nextval('public.correo_persona_natural_correo_persona_natural_id_seq'::regclass);


--
-- Name: direccion direccion_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.direccion ALTER COLUMN direccion_id SET DEFAULT nextval('public.direccion_direccion_id_seq'::regclass);


--
-- Name: estado_civil estado_civil_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_civil ALTER COLUMN estado_civil_id SET DEFAULT nextval('public.estado_civil_estado_civil_id_seq'::regclass);


--
-- Name: estado_cliente_usuario estado_cliente_usuario_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_cliente_usuario ALTER COLUMN estado_cliente_usuario_id SET DEFAULT nextval('public.estado_cliente_usuario_estado_cliente_usuario_id_seq'::regclass);


--
-- Name: estado_empleado estado_empleado_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_empleado ALTER COLUMN estado_empleado_id SET DEFAULT nextval('public.estado_empleado_estado_empleado_id_seq'::regclass);


--
-- Name: estado_pago estado_pago_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_pago ALTER COLUMN estado_pago_id SET DEFAULT nextval('public.estado_pago_estado_pago_id_seq'::regclass);


--
-- Name: factura factura_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura ALTER COLUMN factura_id SET DEFAULT nextval('public.factura_factura_id_seq'::regclass);


--
-- Name: forma_pago forma_pago_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forma_pago ALTER COLUMN forma_pago_id SET DEFAULT nextval('public.forma_pago_forma_pago_id_seq'::regclass);


--
-- Name: foto_acometida foto_acometida_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.foto_acometida ALTER COLUMN foto_acometida_id SET DEFAULT nextval('public.foto_acometida_foto_acometida_id_seq'::regclass);


--
-- Name: foto_incidente foto_incidente_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.foto_incidente ALTER COLUMN foto_incidente_id SET DEFAULT nextval('public.foto_incidente_foto_incidente_id_seq'::regclass);


--
-- Name: foto_lectura foto_lectura_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.foto_lectura ALTER COLUMN foto_lectura_id SET DEFAULT nextval('public.foto_lectura_foto_lectura_id_seq'::regclass);


--
-- Name: historial_estados_acometida id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estados_acometida ALTER COLUMN id SET DEFAULT nextval('public.historial_estados_acometida_id_seq'::regclass);


--
-- Name: historial_incidente historial_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_incidente ALTER COLUMN historial_id SET DEFAULT nextval('public.historial_incidente_historial_id_seq'::regclass);


--
-- Name: lectura lectura_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lectura ALTER COLUMN lectura_id SET DEFAULT nextval('public.lectura_lectura_id_seq'::regclass);


--
-- Name: lectura_estado lectura_estado_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lectura_estado ALTER COLUMN lectura_estado_id SET DEFAULT nextval('public.lectura_estado_lectura_estado_id_seq'::regclass);


--
-- Name: observacion observacion_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observacion ALTER COLUMN observacion_id SET DEFAULT nextval('public.observacion_observacion_id_seq'::regclass);


--
-- Name: observacion_acometida observacion_acometida_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observacion_acometida ALTER COLUMN observacion_acometida_id SET DEFAULT nextval('public.observacion_acometida_observacion_acometida_id_seq'::regclass);


--
-- Name: observacion_factura observacion_factura_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observacion_factura ALTER COLUMN observacion_factura_id SET DEFAULT nextval('public.observacion_factura_observacion_factura_id_seq'::regclass);


--
-- Name: observacion_lectura observacion_lectura_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observacion_lectura ALTER COLUMN observacion_lectura_id SET DEFAULT nextval('public.observacion_lectura_observacion_lectura_id_seq'::regclass);


--
-- Name: permiso_categoria categoria_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permiso_categoria ALTER COLUMN categoria_id SET DEFAULT nextval('public.permiso_categoria_categoria_id_seq'::regclass);


--
-- Name: permisos permiso_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos ALTER COLUMN permiso_id SET DEFAULT nextval('public.permisos_permiso_id_seq'::regclass);


--
-- Name: profesion profesion_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesion ALTER COLUMN profesion_id SET DEFAULT nextval('public.profesion_profesion_id_seq'::regclass);


--
-- Name: qrcode qrcode_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qrcode ALTER COLUMN qrcode_id SET DEFAULT nextval('public.qrcode_qrcode_id_seq'::regclass);


--
-- Name: rangos_variables id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rangos_variables ALTER COLUMN id SET DEFAULT nextval('public.rangos_variables_id_seq'::regclass);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- Name: respaldo_acometidas_2026 id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respaldo_acometidas_2026 ALTER COLUMN id SET DEFAULT nextval('public.respaldo_acometidas_2026_id_seq'::regclass);


--
-- Name: rol_permisos rol_permiso_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_permisos ALTER COLUMN rol_permiso_id SET DEFAULT nextval('public.rol_permisos_rol_permiso_id_seq'::regclass);


--
-- Name: roles rol_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN rol_id SET DEFAULT nextval('public.roles_rol_id_seq'::regclass);


--
-- Name: seguimiento_lectura seguimiento_lectura_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimiento_lectura ALTER COLUMN seguimiento_lectura_id SET DEFAULT nextval('public.seguimiento_lectura_seguimiento_lectura_id_seq'::regclass);


--
-- Name: servicio servicio_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicio ALTER COLUMN servicio_id SET DEFAULT nextval('public.servicio_servicio_id_seq'::regclass);


--
-- Name: sexo sexo_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sexo ALTER COLUMN sexo_id SET DEFAULT nextval('public.sexo_sexo_id_seq'::regclass);


--
-- Name: siguiente_lectura siguiente_lectura_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.siguiente_lectura ALTER COLUMN siguiente_lectura_id SET DEFAULT nextval('public.siguiente_lectura_siguiente_lectura_id_seq'::regclass);


--
-- Name: tarifa tarifa_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarifa ALTER COLUMN tarifa_id SET DEFAULT nextval('public.tarifa_tarifa_id_seq'::regclass);


--
-- Name: telefono telefono_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telefono ALTER COLUMN telefono_id SET DEFAULT nextval('public.telefono_telefono_id_seq'::regclass);


--
-- Name: telefono_empresa telefono_empresa_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telefono_empresa ALTER COLUMN telefono_empresa_id SET DEFAULT nextval('public.telefono_empresa_telefono_empresa_id_seq'::regclass);


--
-- Name: telefono_persona_natural telefono_persona_natural_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telefono_persona_natural ALTER COLUMN telefono_persona_natural_id SET DEFAULT nextval('public.telefono_persona_natural_telefono_persona_natural_id_seq'::regclass);


--
-- Name: tipo_contrato tipo_contrato_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_contrato ALTER COLUMN tipo_contrato_id SET DEFAULT nextval('public.tipo_contrato_tipo_contrato_id_seq'::regclass);


--
-- Name: tipo_estado_lectura tipo_estado_lectura_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_estado_lectura ALTER COLUMN tipo_estado_lectura_id SET DEFAULT nextval('public.tipo_estado_lectura_tipo_estado_lectura_id_seq'::regclass);


--
-- Name: tipo_incidente_medidor tipo_incidente_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_incidente_medidor ALTER COLUMN tipo_incidente_id SET DEFAULT nextval('public.tipo_incidente_medidor_tipo_incidente_id_seq'::regclass);


--
-- Name: tipo_novedad_lectura tipo_novedad_lectura_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_novedad_lectura ALTER COLUMN tipo_novedad_lectura_id SET DEFAULT nextval('public.tipo_novedad_lectura_tipo_novedad_lectura_id_seq'::regclass);


--
-- Name: tipo_predio tipo_predio_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_predio ALTER COLUMN tipo_predio_id SET DEFAULT nextval('public.tipo_predio_tipo_predio_id_seq'::regclass);


--
-- Name: tipo_relacion_familiar tipo_relacion_familiar_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_relacion_familiar ALTER COLUMN tipo_relacion_familiar_id SET DEFAULT nextval('public.tipo_relacion_familiar_tipo_relacion_familiar_id_seq'::regclass);


--
-- Name: tipo_telefono tipo_telefono_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_telefono ALTER COLUMN tipo_telefono_id SET DEFAULT nextval('public.tipo_telefono_tipo_telefono_id_seq'::regclass);


--
-- Name: tipo_titulo_dato tipo_titulo_dato_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_titulo_dato ALTER COLUMN tipo_titulo_dato_id SET DEFAULT nextval('public.tipo_titulo_dato_tipo_titulo_dato_id_seq'::regclass);


--
-- Name: titulo_dato titulo_dato_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titulo_dato ALTER COLUMN titulo_dato_id SET DEFAULT nextval('public.titulo_dato_titulo_dato_id_seq'::regclass);


--
-- Name: usuario_factura usuario_factura_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_factura ALTER COLUMN usuario_factura_id SET DEFAULT nextval('public.usuario_factura_usuario_factura_id_seq'::regclass);


--
-- Name: usuario_lectura usuario_lectura_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_lectura ALTER COLUMN usuario_lectura_id SET DEFAULT nextval('public.usuario_lectura_usuario_lectura_id_seq'::regclass);


--
-- Name: usuario_permisos usuario_permiso_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_permisos ALTER COLUMN usuario_permiso_id SET DEFAULT nextval('public.usuario_permisos_usuario_permiso_id_seq'::regclass);


--
-- Name: usuario_roles usuario_rol_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_roles ALTER COLUMN usuario_rol_id SET DEFAULT nextval('public.usuario_roles_usuario_rol_id_seq'::regclass);


--
-- Name: zona zona_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zona ALTER COLUMN zona_id SET DEFAULT nextval('public.zona_zona_id_seq'::regclass);


--
-- Name: departamento_trabajo id_departamento; Type: DEFAULT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.departamento_trabajo ALTER COLUMN id_departamento SET DEFAULT nextval('work_orders.departamento_trabajo_id_departamento_seq'::regclass);


--
-- Name: historial_estado_orden_trabajo id_historial; Type: DEFAULT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.historial_estado_orden_trabajo ALTER COLUMN id_historial SET DEFAULT nextval('work_orders.historial_estado_orden_trabajo_id_historial_seq'::regclass);


--
-- Name: prioridad_orden_trabajo id_prioridad; Type: DEFAULT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.prioridad_orden_trabajo ALTER COLUMN id_prioridad SET DEFAULT nextval('work_orders.prioridad_orden_trabajo_id_prioridad_seq'::regclass);


--
-- Name: rol_trabajador id_rol; Type: DEFAULT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.rol_trabajador ALTER COLUMN id_rol SET DEFAULT nextval('work_orders.rol_trabajador_id_rol_seq'::regclass);


--
-- Name: tipo_trabajo id_tipo_trabajo; Type: DEFAULT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.tipo_trabajo ALTER COLUMN id_tipo_trabajo SET DEFAULT nextval('work_orders.tipo_trabajo_id_tipo_trabajo_seq'::regclass);


--
-- Name: cat_estado_firma cat_estado_firma_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.cat_estado_firma
    ADD CONSTRAINT cat_estado_firma_pkey PRIMARY KEY (codigo);


--
-- Name: cat_estado_orden cat_estado_orden_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.cat_estado_orden
    ADD CONSTRAINT cat_estado_orden_pkey PRIMARY KEY (codigo);


--
-- Name: cat_estado_pago cat_estado_pago_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.cat_estado_pago
    ADD CONSTRAINT cat_estado_pago_pkey PRIMARY KEY (codigo);


--
-- Name: cat_estado_solicitud cat_estado_solicitud_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.cat_estado_solicitud
    ADD CONSTRAINT cat_estado_solicitud_pkey PRIMARY KEY (codigo);


--
-- Name: cat_estado_validacion_doc cat_estado_validacion_doc_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.cat_estado_validacion_doc
    ADD CONSTRAINT cat_estado_validacion_doc_pkey PRIMARY KEY (codigo);


--
-- Name: cat_resultado_inspeccion cat_resultado_inspeccion_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.cat_resultado_inspeccion
    ADD CONSTRAINT cat_resultado_inspeccion_pkey PRIMARY KEY (codigo);


--
-- Name: cat_tipo_acometida cat_tipo_acometida_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.cat_tipo_acometida
    ADD CONSTRAINT cat_tipo_acometida_pkey PRIMARY KEY (codigo);


--
-- Name: cat_tipo_orden cat_tipo_orden_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.cat_tipo_orden
    ADD CONSTRAINT cat_tipo_orden_pkey PRIMARY KEY (codigo);


--
-- Name: cat_tipo_persona cat_tipo_persona_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.cat_tipo_persona
    ADD CONSTRAINT cat_tipo_persona_pkey PRIMARY KEY (codigo);


--
-- Name: cat_uso_predio cat_uso_predio_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.cat_uso_predio
    ADD CONSTRAINT cat_uso_predio_pkey PRIMARY KEY (codigo);


--
-- Name: catalogo_concepto_factura catalogo_concepto_factura_codigo_key; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.catalogo_concepto_factura
    ADD CONSTRAINT catalogo_concepto_factura_codigo_key UNIQUE (codigo);


--
-- Name: catalogo_concepto_factura catalogo_concepto_factura_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.catalogo_concepto_factura
    ADD CONSTRAINT catalogo_concepto_factura_pkey PRIMARY KEY (id);


--
-- Name: catalogo_tipo_documento catalogo_tipo_documento_codigo_key; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.catalogo_tipo_documento
    ADD CONSTRAINT catalogo_tipo_documento_codigo_key UNIQUE (codigo);


--
-- Name: catalogo_tipo_documento catalogo_tipo_documento_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.catalogo_tipo_documento
    ADD CONSTRAINT catalogo_tipo_documento_pkey PRIMARY KEY (id);


--
-- Name: contrato_servicio contrato_servicio_id_solicitud_key; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.contrato_servicio
    ADD CONSTRAINT contrato_servicio_id_solicitud_key UNIQUE (id_solicitud);


--
-- Name: contrato_servicio contrato_servicio_numero_contrato_key; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.contrato_servicio
    ADD CONSTRAINT contrato_servicio_numero_contrato_key UNIQUE (numero_contrato);


--
-- Name: contrato_servicio contrato_servicio_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.contrato_servicio
    ADD CONSTRAINT contrato_servicio_pkey PRIMARY KEY (id_contrato);


--
-- Name: documento_adjunto documento_adjunto_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.documento_adjunto
    ADD CONSTRAINT documento_adjunto_pkey PRIMARY KEY (id_documento);


--
-- Name: factura_inspeccion factura_inspeccion_id_solicitud_key; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.factura_inspeccion
    ADD CONSTRAINT factura_inspeccion_id_solicitud_key UNIQUE (id_solicitud);


--
-- Name: factura_inspeccion factura_inspeccion_numero_factura_key; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.factura_inspeccion
    ADD CONSTRAINT factura_inspeccion_numero_factura_key UNIQUE (numero_factura);


--
-- Name: factura_inspeccion factura_inspeccion_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.factura_inspeccion
    ADD CONSTRAINT factura_inspeccion_pkey PRIMARY KEY (id_factura);


--
-- Name: historial_estado historial_estado_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.historial_estado
    ADD CONSTRAINT historial_estado_pkey PRIMARY KEY (id_historial);


--
-- Name: informe_inspeccion informe_inspeccion_id_orden_trabajo_key; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.informe_inspeccion
    ADD CONSTRAINT informe_inspeccion_id_orden_trabajo_key UNIQUE (id_orden_trabajo);


--
-- Name: informe_inspeccion informe_inspeccion_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.informe_inspeccion
    ADD CONSTRAINT informe_inspeccion_pkey PRIMARY KEY (id_informe);


--
-- Name: informe_instalacion informe_instalacion_id_orden_trabajo_key; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.informe_instalacion
    ADD CONSTRAINT informe_instalacion_id_orden_trabajo_key UNIQUE (id_orden_trabajo);


--
-- Name: informe_instalacion informe_instalacion_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.informe_instalacion
    ADD CONSTRAINT informe_instalacion_pkey PRIMARY KEY (id_informe);


--
-- Name: inventario_medidor inventario_medidor_numero_serie_key; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.inventario_medidor
    ADD CONSTRAINT inventario_medidor_numero_serie_key UNIQUE (numero_serie);


--
-- Name: inventario_medidor inventario_medidor_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.inventario_medidor
    ADD CONSTRAINT inventario_medidor_pkey PRIMARY KEY (id_medidor);


--
-- Name: tipo_acometida pk_tipo_acometida; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.tipo_acometida
    ADD CONSTRAINT pk_tipo_acometida PRIMARY KEY (id_tipo_acometida);


--
-- Name: registro_catastral registro_catastral_id_solicitud_key; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.registro_catastral
    ADD CONSTRAINT registro_catastral_id_solicitud_key UNIQUE (id_solicitud);


--
-- Name: registro_catastral registro_catastral_numero_cuenta_key; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.registro_catastral
    ADD CONSTRAINT registro_catastral_numero_cuenta_key UNIQUE (numero_cuenta);


--
-- Name: registro_catastral registro_catastral_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.registro_catastral
    ADD CONSTRAINT registro_catastral_pkey PRIMARY KEY (id_registro);


--
-- Name: solicitud_orden_trabajo solicitud_orden_trabajo_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.solicitud_orden_trabajo
    ADD CONSTRAINT solicitud_orden_trabajo_pkey PRIMARY KEY (id_solicitud, id_orden_trabajo);


--
-- Name: solicitud solicitud_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.solicitud
    ADD CONSTRAINT solicitud_pkey PRIMARY KEY (id_solicitud);


--
-- Name: tipo_acometida tipo_acometida_codigo_key; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.tipo_acometida
    ADD CONSTRAINT tipo_acometida_codigo_key UNIQUE (codigo);


--
-- Name: tipo_solicitud tipo_solicitud_codigo_key; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.tipo_solicitud
    ADD CONSTRAINT tipo_solicitud_codigo_key UNIQUE (codigo);


--
-- Name: tipo_solicitud tipo_solicitud_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.tipo_solicitud
    ADD CONSTRAINT tipo_solicitud_pkey PRIMARY KEY (id_tipo_solicitud);


--
-- Name: solicitud uq_solicitud_numero_solicitud; Type: CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.solicitud
    ADD CONSTRAINT uq_solicitud_numero_solicitud UNIQUE (numero_solicitud);


--
-- Name: alerta alerta_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.alerta
    ADD CONSTRAINT alerta_pkey PRIMARY KEY (alerta_id);


--
-- Name: registro registro_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro
    ADD CONSTRAINT registro_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2024_01 registro_2024_01_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2024_01
    ADD CONSTRAINT registro_2024_01_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2024_02 registro_2024_02_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2024_02
    ADD CONSTRAINT registro_2024_02_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2024_03 registro_2024_03_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2024_03
    ADD CONSTRAINT registro_2024_03_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2024_04 registro_2024_04_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2024_04
    ADD CONSTRAINT registro_2024_04_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2024_05 registro_2024_05_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2024_05
    ADD CONSTRAINT registro_2024_05_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2024_06 registro_2024_06_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2024_06
    ADD CONSTRAINT registro_2024_06_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2024_07 registro_2024_07_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2024_07
    ADD CONSTRAINT registro_2024_07_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2024_08 registro_2024_08_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2024_08
    ADD CONSTRAINT registro_2024_08_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2024_09 registro_2024_09_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2024_09
    ADD CONSTRAINT registro_2024_09_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2024_10 registro_2024_10_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2024_10
    ADD CONSTRAINT registro_2024_10_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2024_11 registro_2024_11_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2024_11
    ADD CONSTRAINT registro_2024_11_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2024_12 registro_2024_12_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2024_12
    ADD CONSTRAINT registro_2024_12_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2025_01 registro_2025_01_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2025_01
    ADD CONSTRAINT registro_2025_01_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2025_02 registro_2025_02_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2025_02
    ADD CONSTRAINT registro_2025_02_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2025_03 registro_2025_03_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2025_03
    ADD CONSTRAINT registro_2025_03_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2025_04 registro_2025_04_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2025_04
    ADD CONSTRAINT registro_2025_04_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2025_05 registro_2025_05_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2025_05
    ADD CONSTRAINT registro_2025_05_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2025_06 registro_2025_06_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2025_06
    ADD CONSTRAINT registro_2025_06_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2025_07 registro_2025_07_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2025_07
    ADD CONSTRAINT registro_2025_07_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2025_08 registro_2025_08_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2025_08
    ADD CONSTRAINT registro_2025_08_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2025_09 registro_2025_09_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2025_09
    ADD CONSTRAINT registro_2025_09_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2025_10 registro_2025_10_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2025_10
    ADD CONSTRAINT registro_2025_10_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2025_11 registro_2025_11_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2025_11
    ADD CONSTRAINT registro_2025_11_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2025_12 registro_2025_12_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2025_12
    ADD CONSTRAINT registro_2025_12_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2026_01 registro_2026_01_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2026_01
    ADD CONSTRAINT registro_2026_01_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2026_02 registro_2026_02_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2026_02
    ADD CONSTRAINT registro_2026_02_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2026_03 registro_2026_03_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2026_03
    ADD CONSTRAINT registro_2026_03_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2026_04 registro_2026_04_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2026_04
    ADD CONSTRAINT registro_2026_04_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2026_05 registro_2026_05_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2026_05
    ADD CONSTRAINT registro_2026_05_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2026_06 registro_2026_06_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2026_06
    ADD CONSTRAINT registro_2026_06_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2026_07 registro_2026_07_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2026_07
    ADD CONSTRAINT registro_2026_07_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2026_08 registro_2026_08_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2026_08
    ADD CONSTRAINT registro_2026_08_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2026_09 registro_2026_09_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2026_09
    ADD CONSTRAINT registro_2026_09_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2026_10 registro_2026_10_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2026_10
    ADD CONSTRAINT registro_2026_10_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2026_11 registro_2026_11_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2026_11
    ADD CONSTRAINT registro_2026_11_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2026_12 registro_2026_12_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2026_12
    ADD CONSTRAINT registro_2026_12_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2027_01 registro_2027_01_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2027_01
    ADD CONSTRAINT registro_2027_01_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2027_02 registro_2027_02_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2027_02
    ADD CONSTRAINT registro_2027_02_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2027_03 registro_2027_03_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2027_03
    ADD CONSTRAINT registro_2027_03_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2027_04 registro_2027_04_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2027_04
    ADD CONSTRAINT registro_2027_04_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2027_05 registro_2027_05_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2027_05
    ADD CONSTRAINT registro_2027_05_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2027_06 registro_2027_06_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2027_06
    ADD CONSTRAINT registro_2027_06_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2027_07 registro_2027_07_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2027_07
    ADD CONSTRAINT registro_2027_07_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2027_08 registro_2027_08_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2027_08
    ADD CONSTRAINT registro_2027_08_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2027_09 registro_2027_09_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2027_09
    ADD CONSTRAINT registro_2027_09_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2027_10 registro_2027_10_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2027_10
    ADD CONSTRAINT registro_2027_10_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2027_11 registro_2027_11_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2027_11
    ADD CONSTRAINT registro_2027_11_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_2027_12 registro_2027_12_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_2027_12
    ADD CONSTRAINT registro_2027_12_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: registro_default registro_default_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.registro_default
    ADD CONSTRAINT registro_default_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- Name: regla_alerta regla_alerta_codigo_key; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.regla_alerta
    ADD CONSTRAINT regla_alerta_codigo_key UNIQUE (codigo);


--
-- Name: regla_alerta regla_alerta_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.regla_alerta
    ADD CONSTRAINT regla_alerta_pkey PRIMARY KEY (regla_id);


--
-- Name: sesion sesion_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.sesion
    ADD CONSTRAINT sesion_pkey PRIMARY KEY (sesion_log_id, audit_timestamp);


--
-- Name: sesion_2026_04 sesion_2026_04_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.sesion_2026_04
    ADD CONSTRAINT sesion_2026_04_pkey PRIMARY KEY (sesion_log_id, audit_timestamp);


--
-- Name: sesion_2026_05 sesion_2026_05_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.sesion_2026_05
    ADD CONSTRAINT sesion_2026_05_pkey PRIMARY KEY (sesion_log_id, audit_timestamp);


--
-- Name: sesion_2026_06 sesion_2026_06_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.sesion_2026_06
    ADD CONSTRAINT sesion_2026_06_pkey PRIMARY KEY (sesion_log_id, audit_timestamp);


--
-- Name: sesion_2026_07 sesion_2026_07_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.sesion_2026_07
    ADD CONSTRAINT sesion_2026_07_pkey PRIMARY KEY (sesion_log_id, audit_timestamp);


--
-- Name: sesion_default sesion_default_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.sesion_default
    ADD CONSTRAINT sesion_default_pkey PRIMARY KEY (sesion_log_id, audit_timestamp);


--
-- Name: tabla_config tabla_config_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.tabla_config
    ADD CONSTRAINT tabla_config_pkey PRIMARY KEY (schema_nombre, tabla_nombre);


--
-- Name: usuario_refresh_tokens usuario_refresh_tokens_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.usuario_refresh_tokens
    ADD CONSTRAINT usuario_refresh_tokens_pkey PRIMARY KEY (token_id);


--
-- Name: documento documento_pkey; Type: CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.documento
    ADD CONSTRAINT documento_pkey PRIMARY KEY (documento_id);


--
-- Name: estado_documento estado_documento_pkey; Type: CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.estado_documento
    ADD CONSTRAINT estado_documento_pkey PRIMARY KEY (estado_id);


--
-- Name: historial_documento historial_documento_pkey; Type: CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.historial_documento
    ADD CONSTRAINT historial_documento_pkey PRIMARY KEY (historial_id);


--
-- Name: nivel_acceso nivel_acceso_pkey; Type: CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.nivel_acceso
    ADD CONSTRAINT nivel_acceso_pkey PRIMARY KEY (nivel_id);


--
-- Name: relacion_acometida relacion_acometida_pkey; Type: CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.relacion_acometida
    ADD CONSTRAINT relacion_acometida_pkey PRIMARY KEY (documento_id);


--
-- Name: relacion_factura relacion_factura_pkey; Type: CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.relacion_factura
    ADD CONSTRAINT relacion_factura_pkey PRIMARY KEY (documento_id);


--
-- Name: relacion_lectura relacion_lectura_pkey; Type: CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.relacion_lectura
    ADD CONSTRAINT relacion_lectura_pkey PRIMARY KEY (documento_id);


--
-- Name: relacion_orden_trabajo relacion_orden_trabajo_pkey; Type: CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.relacion_orden_trabajo
    ADD CONSTRAINT relacion_orden_trabajo_pkey PRIMARY KEY (documento_id);


--
-- Name: relacion_predio relacion_predio_pkey; Type: CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.relacion_predio
    ADD CONSTRAINT relacion_predio_pkey PRIMARY KEY (documento_id);


--
-- Name: relacion_solicitud relacion_solicitud_pkey; Type: CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.relacion_solicitud
    ADD CONSTRAINT relacion_solicitud_pkey PRIMARY KEY (documento_id);


--
-- Name: relacion_usuarios relacion_usuarios_pkey; Type: CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.relacion_usuarios
    ADD CONSTRAINT relacion_usuarios_pkey PRIMARY KEY (documento_id);


--
-- Name: tipo_documento tipo_documento_codigo_key; Type: CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.tipo_documento
    ADD CONSTRAINT tipo_documento_codigo_key UNIQUE (codigo);


--
-- Name: tipo_documento tipo_documento_pkey; Type: CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.tipo_documento
    ADD CONSTRAINT tipo_documento_pkey PRIMARY KEY (tipo_documento_id);


--
-- Name: canal canal_codigo_key; Type: CONSTRAINT; Schema: notifications; Owner: postgres
--

ALTER TABLE ONLY notifications.canal
    ADD CONSTRAINT canal_codigo_key UNIQUE (codigo);


--
-- Name: canal canal_pkey; Type: CONSTRAINT; Schema: notifications; Owner: postgres
--

ALTER TABLE ONLY notifications.canal
    ADD CONSTRAINT canal_pkey PRIMARY KEY (id_canal);


--
-- Name: estado_envio estado_envio_codigo_key; Type: CONSTRAINT; Schema: notifications; Owner: postgres
--

ALTER TABLE ONLY notifications.estado_envio
    ADD CONSTRAINT estado_envio_codigo_key UNIQUE (codigo);


--
-- Name: estado_envio estado_envio_pkey; Type: CONSTRAINT; Schema: notifications; Owner: postgres
--

ALTER TABLE ONLY notifications.estado_envio
    ADD CONSTRAINT estado_envio_pkey PRIMARY KEY (id_estado_envio);


--
-- Name: prioridad prioridad_codigo_key; Type: CONSTRAINT; Schema: notifications; Owner: postgres
--

ALTER TABLE ONLY notifications.prioridad
    ADD CONSTRAINT prioridad_codigo_key UNIQUE (codigo);


--
-- Name: prioridad prioridad_pkey; Type: CONSTRAINT; Schema: notifications; Owner: postgres
--

ALTER TABLE ONLY notifications.prioridad
    ADD CONSTRAINT prioridad_pkey PRIMARY KEY (id_prioridad);


--
-- Name: template template_codigo_key; Type: CONSTRAINT; Schema: notifications; Owner: postgres
--

ALTER TABLE ONLY notifications.template
    ADD CONSTRAINT template_codigo_key UNIQUE (codigo);


--
-- Name: template template_pkey; Type: CONSTRAINT; Schema: notifications; Owner: postgres
--

ALTER TABLE ONLY notifications.template
    ADD CONSTRAINT template_pkey PRIMARY KEY (template_id);


--
-- Name: user_notification_dispatch_log user_notification_dispatch_log_pkey; Type: CONSTRAINT; Schema: notifications; Owner: postgres
--

ALTER TABLE ONLY notifications.user_notification_dispatch_log
    ADD CONSTRAINT user_notification_dispatch_log_pkey PRIMARY KEY (dispatch_log_id);


--
-- Name: user_notification user_notification_pkey; Type: CONSTRAINT; Schema: notifications; Owner: postgres
--

ALTER TABLE ONLY notifications.user_notification
    ADD CONSTRAINT user_notification_pkey PRIMARY KEY (notification_id);


--
-- Name: acometida acometida_clave_catastral_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acometida
    ADD CONSTRAINT acometida_clave_catastral_key UNIQUE (clave_catastral);


--
-- Name: alerta_lectura_anomala alerta_lectura_anomala_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerta_lectura_anomala
    ADD CONSTRAINT alerta_lectura_anomala_pkey PRIMARY KEY (alerta_id);


--
-- Name: auditoria_lectura_sector auditoria_lectura_sector_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria_lectura_sector
    ADD CONSTRAINT auditoria_lectura_sector_pkey PRIMARY KEY (audit_id);


--
-- Name: cargo cargo_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cargo
    ADD CONSTRAINT cargo_nombre_key UNIQUE (nombre);


--
-- Name: cargo cargo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cargo
    ADD CONSTRAINT cargo_pkey PRIMARY KEY (cargo_id);


--
-- Name: cat_action_types cat_action_types_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cat_action_types
    ADD CONSTRAINT cat_action_types_code_key UNIQUE (code);


--
-- Name: cat_action_types cat_action_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cat_action_types
    ADD CONSTRAINT cat_action_types_pkey PRIMARY KEY (id);


--
-- Name: cat_estados_acometida cat_estados_acometida_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cat_estados_acometida
    ADD CONSTRAINT cat_estados_acometida_nombre_key UNIQUE (nombre);


--
-- Name: cat_estados_acometida cat_estados_acometida_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cat_estados_acometida
    ADD CONSTRAINT cat_estados_acometida_pkey PRIMARY KEY (id_estado);


--
-- Name: categoria categoria_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_nombre_key UNIQUE (nombre);


--
-- Name: claves_sql2000 claves_sql2000_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.claves_sql2000
    ADD CONSTRAINT claves_sql2000_pkey PRIMARY KEY (id);


--
-- Name: cliente_usuario cliente_usuario_cliente_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente_usuario
    ADD CONSTRAINT cliente_usuario_cliente_id_key UNIQUE (cliente_id);


--
-- Name: cliente_usuario cliente_usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente_usuario
    ADD CONSTRAINT cliente_usuario_email_key UNIQUE (email);


--
-- Name: cliente_usuario_permisos cliente_usuario_permisos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente_usuario_permisos
    ADD CONSTRAINT cliente_usuario_permisos_pkey PRIMARY KEY (cliente_usuario_permiso_id);


--
-- Name: cliente_usuario cliente_usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente_usuario
    ADD CONSTRAINT cliente_usuario_pkey PRIMARY KEY (cliente_usuario_id);


--
-- Name: cliente_usuario_roles cliente_usuario_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente_usuario_roles
    ADD CONSTRAINT cliente_usuario_roles_pkey PRIMARY KEY (cliente_usuario_rol_id);


--
-- Name: componentes_fijos componentes_fijos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.componentes_fijos
    ADD CONSTRAINT componentes_fijos_pkey PRIMARY KEY (id);


--
-- Name: consumo_promedio consumo_promedio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consumo_promedio
    ADD CONSTRAINT consumo_promedio_pkey PRIMARY KEY (acometida_id);


--
-- Name: empleado_zona empleado_zona_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleado_zona
    ADD CONSTRAINT empleado_zona_pkey PRIMARY KEY (empleado_id, zona_id);


--
-- Name: empleados empleados_cedula_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_cedula_key UNIQUE (cedula);


--
-- Name: empleados empleados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_pkey PRIMARY KEY (empleado_id);


--
-- Name: empleados empleados_usuario_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_usuario_id_key UNIQUE (usuario_id);


--
-- Name: estado_cliente_usuario estado_cliente_usuario_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_cliente_usuario
    ADD CONSTRAINT estado_cliente_usuario_codigo_key UNIQUE (codigo);


--
-- Name: estado_cliente_usuario estado_cliente_usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_cliente_usuario
    ADD CONSTRAINT estado_cliente_usuario_pkey PRIMARY KEY (estado_cliente_usuario_id);


--
-- Name: estado_empleado estado_empleado_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_empleado
    ADD CONSTRAINT estado_empleado_codigo_key UNIQUE (codigo);


--
-- Name: estado_empleado estado_empleado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_empleado
    ADD CONSTRAINT estado_empleado_pkey PRIMARY KEY (estado_empleado_id);


--
-- Name: historial_estados_acometida historial_estados_acometida_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estados_acometida
    ADD CONSTRAINT historial_estados_acometida_pkey PRIMARY KEY (id);


--
-- Name: historial_medidores historial_medidores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_medidores
    ADD CONSTRAINT historial_medidores_pkey PRIMARY KEY (id_historial_medidor);


--
-- Name: lectura_estado lectura_estado_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lectura_estado
    ADD CONSTRAINT lectura_estado_codigo_key UNIQUE (codigo);


--
-- Name: permiso_categoria permiso_categoria_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permiso_categoria
    ADD CONSTRAINT permiso_categoria_nombre_key UNIQUE (nombre);


--
-- Name: permiso_categoria permiso_categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permiso_categoria
    ADD CONSTRAINT permiso_categoria_pkey PRIMARY KEY (categoria_id);


--
-- Name: permisos permisos_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos
    ADD CONSTRAINT permisos_nombre_key UNIQUE (nombre);


--
-- Name: permisos permisos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos
    ADD CONSTRAINT permisos_pkey PRIMARY KEY (permiso_id);


--
-- Name: acometida pk_acometida; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acometida
    ADD CONSTRAINT pk_acometida PRIMARY KEY (acometida_id);


--
-- Name: canton pk_canton; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.canton
    ADD CONSTRAINT pk_canton PRIMARY KEY (canton_id);


--
-- Name: categoria pk_categoria; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT pk_categoria PRIMARY KEY (categoria_id);


--
-- Name: categoria_incidente_medidor pk_categoria_incidente_medidor; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_incidente_medidor
    ADD CONSTRAINT pk_categoria_incidente_medidor PRIMARY KEY (categoria_incidente_id);


--
-- Name: ciudadano pk_ciudadano; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudadano
    ADD CONSTRAINT pk_ciudadano PRIMARY KEY (ciudadano_id);


--
-- Name: cliente pk_cliente; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT pk_cliente PRIMARY KEY (cliente_id);


--
-- Name: cliente_persona_natural pk_cliente_persona_natural; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente_persona_natural
    ADD CONSTRAINT pk_cliente_persona_natural PRIMARY KEY (cliente_persona_natural_id);


--
-- Name: correo_electronico pk_correo_electronico; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.correo_electronico
    ADD CONSTRAINT pk_correo_electronico PRIMARY KEY (correo_electronico_id);


--
-- Name: correo_empresa pk_correo_empresa; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.correo_empresa
    ADD CONSTRAINT pk_correo_empresa PRIMARY KEY (correo_empresa_id);


--
-- Name: correo_persona_natural pk_correo_persona_natural; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.correo_persona_natural
    ADD CONSTRAINT pk_correo_persona_natural PRIMARY KEY (correo_persona_natural_id);


--
-- Name: direccion pk_direccion; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.direccion
    ADD CONSTRAINT pk_direccion PRIMARY KEY (direccion_id);


--
-- Name: empresa pk_empresa; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT pk_empresa PRIMARY KEY (empresa_id);


--
-- Name: estado_civil pk_estado_civil; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_civil
    ADD CONSTRAINT pk_estado_civil PRIMARY KEY (estado_civil_id);


--
-- Name: estado_pago pk_estado_pago; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_pago
    ADD CONSTRAINT pk_estado_pago PRIMARY KEY (estado_pago_id);


--
-- Name: factura pk_factura; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT pk_factura PRIMARY KEY (factura_id);


--
-- Name: forma_pago pk_forma_pago; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forma_pago
    ADD CONSTRAINT pk_forma_pago PRIMARY KEY (forma_pago_id);


--
-- Name: foto_acometida pk_foto_acometida; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.foto_acometida
    ADD CONSTRAINT pk_foto_acometida PRIMARY KEY (foto_acometida_id);


--
-- Name: foto_incidente pk_foto_incidente; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.foto_incidente
    ADD CONSTRAINT pk_foto_incidente PRIMARY KEY (foto_incidente_id);


--
-- Name: foto_lectura pk_foto_lectura; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.foto_lectura
    ADD CONSTRAINT pk_foto_lectura PRIMARY KEY (foto_lectura_id);


--
-- Name: historial_incidente pk_historial_incidente; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_incidente
    ADD CONSTRAINT pk_historial_incidente PRIMARY KEY (historial_id);


--
-- Name: incidente_medidor pk_incidente_medidor; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidente_medidor
    ADD CONSTRAINT pk_incidente_medidor PRIMARY KEY (incidente_id);


--
-- Name: lectura pk_lectura; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lectura
    ADD CONSTRAINT pk_lectura PRIMARY KEY (lectura_id);


--
-- Name: lectura_estado pk_lectura_estado; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lectura_estado
    ADD CONSTRAINT pk_lectura_estado PRIMARY KEY (lectura_estado_id);


--
-- Name: observacion pk_observacion; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observacion
    ADD CONSTRAINT pk_observacion PRIMARY KEY (observacion_id);


--
-- Name: observacion_acometida pk_observacion_acometida; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observacion_acometida
    ADD CONSTRAINT pk_observacion_acometida PRIMARY KEY (observacion_acometida_id);


--
-- Name: observacion_factura pk_observacion_factura; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observacion_factura
    ADD CONSTRAINT pk_observacion_factura PRIMARY KEY (observacion_factura_id);


--
-- Name: observacion_lectura pk_observacion_lectura; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observacion_lectura
    ADD CONSTRAINT pk_observacion_lectura PRIMARY KEY (observacion_lectura_id);


--
-- Name: pais pk_pais; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pais
    ADD CONSTRAINT pk_pais PRIMARY KEY (pais_id);


--
-- Name: parroquia pk_parroquia; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parroquia
    ADD CONSTRAINT pk_parroquia PRIMARY KEY (parroquia_id);


--
-- Name: predio pk_predio; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predio
    ADD CONSTRAINT pk_predio PRIMARY KEY (predio_id);


--
-- Name: profesion pk_profesion; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesion
    ADD CONSTRAINT pk_profesion PRIMARY KEY (profesion_id);


--
-- Name: provincia pk_provincia; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provincia
    ADD CONSTRAINT pk_provincia PRIMARY KEY (provincia_id);


--
-- Name: servicio pk_servicio; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicio
    ADD CONSTRAINT pk_servicio PRIMARY KEY (servicio_id);


--
-- Name: sexo pk_sexo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sexo
    ADD CONSTRAINT pk_sexo PRIMARY KEY (sexo_id);


--
-- Name: tarifa pk_tarifa; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarifa
    ADD CONSTRAINT pk_tarifa PRIMARY KEY (tarifa_id);


--
-- Name: telefono pk_telefono; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telefono
    ADD CONSTRAINT pk_telefono PRIMARY KEY (telefono_id);


--
-- Name: telefono_empresa pk_telefono_empresa; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telefono_empresa
    ADD CONSTRAINT pk_telefono_empresa PRIMARY KEY (telefono_empresa_id);


--
-- Name: telefono_persona_natural pk_telefono_persona_natural; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telefono_persona_natural
    ADD CONSTRAINT pk_telefono_persona_natural PRIMARY KEY (telefono_persona_natural_id);


--
-- Name: tipo_estado_lectura pk_tipo_estado_lectura; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_estado_lectura
    ADD CONSTRAINT pk_tipo_estado_lectura PRIMARY KEY (tipo_estado_lectura_id);


--
-- Name: tipo_identificacion pk_tipo_identificacion; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_identificacion
    ADD CONSTRAINT pk_tipo_identificacion PRIMARY KEY (tipo_identificacion_id);


--
-- Name: tipo_incidente_medidor pk_tipo_incidente_medidor; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_incidente_medidor
    ADD CONSTRAINT pk_tipo_incidente_medidor PRIMARY KEY (tipo_incidente_id);


--
-- Name: tipo_novedad_lectura pk_tipo_novedad_lectura; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_novedad_lectura
    ADD CONSTRAINT pk_tipo_novedad_lectura PRIMARY KEY (tipo_novedad_lectura_id);


--
-- Name: tipo_parroquia pk_tipo_parroquia; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_parroquia
    ADD CONSTRAINT pk_tipo_parroquia PRIMARY KEY (tipo_parroquia_id);


--
-- Name: tipo_relacion_familiar pk_tipo_relacion_familiar; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_relacion_familiar
    ADD CONSTRAINT pk_tipo_relacion_familiar PRIMARY KEY (tipo_relacion_familiar_id);


--
-- Name: tipo_telefono pk_tipo_telefono; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_telefono
    ADD CONSTRAINT pk_tipo_telefono PRIMARY KEY (tipo_telefono_id);


--
-- Name: tipo_titulo_dato pk_tipo_titulo_dato; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_titulo_dato
    ADD CONSTRAINT pk_tipo_titulo_dato PRIMARY KEY (tipo_titulo_dato_id);


--
-- Name: tipo_predio pk_tipopredio; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_predio
    ADD CONSTRAINT pk_tipopredio PRIMARY KEY (tipo_predio_id);


--
-- Name: titulo_dato pk_titulo_dato; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titulo_dato
    ADD CONSTRAINT pk_titulo_dato PRIMARY KEY (titulo_dato_id);


--
-- Name: usuario_factura pk_usuario_factura; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_factura
    ADD CONSTRAINT pk_usuario_factura PRIMARY KEY (usuario_factura_id);


--
-- Name: usuario_lectura pk_usuario_lectura; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_lectura
    ADD CONSTRAINT pk_usuario_lectura PRIMARY KEY (usuario_lectura_id);


--
-- Name: zona pk_zona; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zona
    ADD CONSTRAINT pk_zona PRIMARY KEY (zona_id);


--
-- Name: predio predio_clavecatastral_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predio
    ADD CONSTRAINT predio_clavecatastral_key UNIQUE (clave_catastral);


--
-- Name: qrcode qrcode_acometida_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qrcode
    ADD CONSTRAINT qrcode_acometida_id_key UNIQUE (acometida_id);


--
-- Name: qrcode qrcode_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qrcode
    ADD CONSTRAINT qrcode_pkey PRIMARY KEY (qrcode_id);


--
-- Name: rangos_variables rangos_variables_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rangos_variables
    ADD CONSTRAINT rangos_variables_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_jti_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_jti_key UNIQUE (jti);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_hash_key UNIQUE (token_hash);


--
-- Name: respaldo_acometidas_2026 respaldo_acometidas_2026_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respaldo_acometidas_2026
    ADD CONSTRAINT respaldo_acometidas_2026_pkey PRIMARY KEY (id);


--
-- Name: rol_permisos rol_permisos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_permisos
    ADD CONSTRAINT rol_permisos_pkey PRIMARY KEY (rol_permiso_id);


--
-- Name: rol_permisos rol_permisos_rol_id_permiso_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_permisos
    ADD CONSTRAINT rol_permisos_rol_id_permiso_id_key UNIQUE (rol_id, permiso_id);


--
-- Name: roles roles_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_key UNIQUE (nombre);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (rol_id);


--
-- Name: seguimiento_lectura seguimiento_lectura_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimiento_lectura
    ADD CONSTRAINT seguimiento_lectura_pkey PRIMARY KEY (seguimiento_lectura_id);


--
-- Name: servicio servicio_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicio
    ADD CONSTRAINT servicio_nombre_key UNIQUE (nombre);


--
-- Name: siguiente_lectura siguiente_lectura_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.siguiente_lectura
    ADD CONSTRAINT siguiente_lectura_pkey PRIMARY KEY (siguiente_lectura_id);


--
-- Name: tipo_contrato tipo_contrato_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_contrato
    ADD CONSTRAINT tipo_contrato_nombre_key UNIQUE (nombre);


--
-- Name: tipo_contrato tipo_contrato_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_contrato
    ADD CONSTRAINT tipo_contrato_pkey PRIMARY KEY (tipo_contrato_id);


--
-- Name: tipo_estado_lectura tipo_estado_lectura_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_estado_lectura
    ADD CONSTRAINT tipo_estado_lectura_codigo_key UNIQUE (codigo);


--
-- Name: tipo_estado_lectura tipo_estado_lectura_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_estado_lectura
    ADD CONSTRAINT tipo_estado_lectura_nombre_key UNIQUE (nombre);


--
-- Name: tipo_novedad_lectura tipo_novedad_lectura_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_novedad_lectura
    ADD CONSTRAINT tipo_novedad_lectura_nombre_key UNIQUE (nombre);


--
-- Name: tipo_verificacion tipo_verificacion_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_verificacion
    ADD CONSTRAINT tipo_verificacion_codigo_key UNIQUE (codigo);


--
-- Name: tipo_verificacion tipo_verificacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_verificacion
    ADD CONSTRAINT tipo_verificacion_pkey PRIMARY KEY (tipo_verificacion_id);


--
-- Name: tipo_predio tipopredio_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_predio
    ADD CONSTRAINT tipopredio_nombre_key UNIQUE (nombre);


--
-- Name: auditoria_lectura_sector uq_audit_mes_sector; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria_lectura_sector
    ADD CONSTRAINT uq_audit_mes_sector UNIQUE (mes_lectura, sector_id);


--
-- Name: categoria_incidente_medidor uq_categoria_incidente_codigo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_incidente_medidor
    ADD CONSTRAINT uq_categoria_incidente_codigo UNIQUE (codigo);


--
-- Name: categoria_incidente_medidor uq_categoria_incidente_nombre; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_incidente_medidor
    ADD CONSTRAINT uq_categoria_incidente_nombre UNIQUE (nombre);


--
-- Name: incidente_medidor uq_codigo_incidente; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidente_medidor
    ADD CONSTRAINT uq_codigo_incidente UNIQUE (codigo_incidente);


--
-- Name: empresa uq_empresa_ruc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT uq_empresa_ruc UNIQUE (ruc);


--
-- Name: lectura_estado uq_lectura_estado_nombre; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lectura_estado
    ADD CONSTRAINT uq_lectura_estado_nombre UNIQUE (nombre);


--
-- Name: siguiente_lectura uq_siguiente_lectura_acometida; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.siguiente_lectura
    ADD CONSTRAINT uq_siguiente_lectura_acometida UNIQUE (acometida_id);


--
-- Name: tipo_incidente_medidor uq_tipo_incidente_nombre; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_incidente_medidor
    ADD CONSTRAINT uq_tipo_incidente_nombre UNIQUE (nombre);


--
-- Name: usuario_permisos usuario_permisos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_permisos
    ADD CONSTRAINT usuario_permisos_pkey PRIMARY KEY (usuario_permiso_id);


--
-- Name: usuario_permisos usuario_permisos_usuario_id_permiso_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_permisos
    ADD CONSTRAINT usuario_permisos_usuario_id_permiso_id_key UNIQUE (usuario_id, permiso_id);


--
-- Name: usuario_roles usuario_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT usuario_roles_pkey PRIMARY KEY (usuario_rol_id);


--
-- Name: usuario_roles usuario_roles_usuario_id_rol_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT usuario_roles_usuario_id_rol_id_key UNIQUE (usuario_id, rol_id);


--
-- Name: usuarios usuarios_cliente_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_cliente_id_key UNIQUE (cliente_id);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (usuario_id);


--
-- Name: usuarios usuarios_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key UNIQUE (username);


--
-- Name: verificar_cuenta_cliente verificar_cuenta_cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verificar_cuenta_cliente
    ADD CONSTRAINT verificar_cuenta_cliente_pkey PRIMARY KEY (verificacion_id);


--
-- Name: zona zona_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zona
    ADD CONSTRAINT zona_codigo_key UNIQUE (codigo);


--
-- Name: adjuntos_orden_trabajo adjuntos_orden_trabajo_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.adjuntos_orden_trabajo
    ADD CONSTRAINT adjuntos_orden_trabajo_pkey PRIMARY KEY (id_adjunto);


--
-- Name: asignacion_trabajador_orden asignacion_trabajador_orden_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.asignacion_trabajador_orden
    ADD CONSTRAINT asignacion_trabajador_orden_pkey PRIMARY KEY (id_asignacion);


--
-- Name: cat_checklist_item cat_checklist_item_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.cat_checklist_item
    ADD CONSTRAINT cat_checklist_item_pkey PRIMARY KEY (codigo);


--
-- Name: cat_estado_orden cat_estado_orden_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.cat_estado_orden
    ADD CONSTRAINT cat_estado_orden_pkey PRIMARY KEY (codigo);


--
-- Name: cat_item_calidad cat_item_calidad_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.cat_item_calidad
    ADD CONSTRAINT cat_item_calidad_pkey PRIMARY KEY (codigo);


--
-- Name: cat_origen_orden cat_origen_orden_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.cat_origen_orden
    ADD CONSTRAINT cat_origen_orden_pkey PRIMARY KEY (codigo);


--
-- Name: control_calidad_detalle control_calidad_detalle_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.control_calidad_detalle
    ADD CONSTRAINT control_calidad_detalle_pkey PRIMARY KEY (id_detalle);


--
-- Name: control_calidad control_calidad_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.control_calidad
    ADD CONSTRAINT control_calidad_pkey PRIMARY KEY (id_control);


--
-- Name: corte_servicio corte_servicio_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.corte_servicio
    ADD CONSTRAINT corte_servicio_pkey PRIMARY KEY (id_corte);


--
-- Name: costo_adicional_orden costo_adicional_orden_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.costo_adicional_orden
    ADD CONSTRAINT costo_adicional_orden_pkey PRIMARY KEY (id_costo_adicional);


--
-- Name: departamento_trabajo departamento_trabajo_nombre_key; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.departamento_trabajo
    ADD CONSTRAINT departamento_trabajo_nombre_key UNIQUE (nombre);


--
-- Name: departamento_trabajo departamento_trabajo_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.departamento_trabajo
    ADD CONSTRAINT departamento_trabajo_pkey PRIMARY KEY (id_departamento);


--
-- Name: detalle_orden_trabajo_material detalle_orden_trabajo_material_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.detalle_orden_trabajo_material
    ADD CONSTRAINT detalle_orden_trabajo_material_pkey PRIMARY KEY (id_detalle_material);


--
-- Name: encuesta_satisfaccion encuesta_satisfaccion_id_orden_trabajo_key; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.encuesta_satisfaccion
    ADD CONSTRAINT encuesta_satisfaccion_id_orden_trabajo_key UNIQUE (id_orden_trabajo);


--
-- Name: encuesta_satisfaccion encuesta_satisfaccion_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.encuesta_satisfaccion
    ADD CONSTRAINT encuesta_satisfaccion_pkey PRIMARY KEY (id_encuesta);


--
-- Name: historial_estado_orden_trabajo historial_estado_orden_trabajo_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.historial_estado_orden_trabajo
    ADD CONSTRAINT historial_estado_orden_trabajo_pkey PRIMARY KEY (id_historial);


--
-- Name: inspeccion_preparacion_detalle inspeccion_preparacion_detalle_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.inspeccion_preparacion_detalle
    ADD CONSTRAINT inspeccion_preparacion_detalle_pkey PRIMARY KEY (id_detalle);


--
-- Name: inspeccion_preparacion inspeccion_preparacion_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.inspeccion_preparacion
    ADD CONSTRAINT inspeccion_preparacion_pkey PRIMARY KEY (id_inspeccion);


--
-- Name: observaciones_orden_trabajo observaciones_orden_trabajo_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.observaciones_orden_trabajo
    ADD CONSTRAINT observaciones_orden_trabajo_pkey PRIMARY KEY (id_observacion);


--
-- Name: orden_trabajo orden_trabajo_codigo_orden_key; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.orden_trabajo
    ADD CONSTRAINT orden_trabajo_codigo_orden_key UNIQUE (codigo_orden);


--
-- Name: orden_trabajo orden_trabajo_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.orden_trabajo
    ADD CONSTRAINT orden_trabajo_pkey PRIMARY KEY (id_orden_trabajo);


--
-- Name: prioridad_orden_trabajo prioridad_orden_trabajo_nivel_key; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.prioridad_orden_trabajo
    ADD CONSTRAINT prioridad_orden_trabajo_nivel_key UNIQUE (nivel);


--
-- Name: prioridad_orden_trabajo prioridad_orden_trabajo_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.prioridad_orden_trabajo
    ADD CONSTRAINT prioridad_orden_trabajo_pkey PRIMARY KEY (id_prioridad);


--
-- Name: rol_trabajador rol_trabajador_nombre_key; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.rol_trabajador
    ADD CONSTRAINT rol_trabajador_nombre_key UNIQUE (nombre);


--
-- Name: rol_trabajador rol_trabajador_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.rol_trabajador
    ADD CONSTRAINT rol_trabajador_pkey PRIMARY KEY (id_rol);


--
-- Name: tipo_trabajo tipo_trabajo_nombre_key; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.tipo_trabajo
    ADD CONSTRAINT tipo_trabajo_nombre_key UNIQUE (nombre);


--
-- Name: tipo_trabajo tipo_trabajo_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.tipo_trabajo
    ADD CONSTRAINT tipo_trabajo_pkey PRIMARY KEY (id_tipo_trabajo);


--
-- Name: asignacion_trabajador_orden uq_asignacion_ot_trabajador; Type: CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.asignacion_trabajador_orden
    ADD CONSTRAINT uq_asignacion_ot_trabajador UNIQUE (id_orden_trabajo, id_trabajador);


--
-- Name: idx_catastro_clave; Type: INDEX; Schema: acometidas; Owner: postgres
--

CREATE INDEX idx_catastro_clave ON acometidas.registro_catastral USING btree (clave_catastral) WHERE (is_deleted = false);


--
-- Name: idx_catastro_geom; Type: INDEX; Schema: acometidas; Owner: postgres
--

CREATE INDEX idx_catastro_geom ON acometidas.registro_catastral USING gist (geom) WHERE (is_deleted = false);


--
-- Name: idx_catastro_medidor; Type: INDEX; Schema: acometidas; Owner: postgres
--

CREATE INDEX idx_catastro_medidor ON acometidas.registro_catastral USING btree (numero_medidor) WHERE (is_deleted = false);


--
-- Name: idx_contrato_servicio_solicitud; Type: INDEX; Schema: acometidas; Owner: postgres
--

CREATE INDEX idx_contrato_servicio_solicitud ON acometidas.contrato_servicio USING btree (id_solicitud, created_at DESC);


--
-- Name: idx_doc_estado; Type: INDEX; Schema: acometidas; Owner: postgres
--

CREATE INDEX idx_doc_estado ON acometidas.documento_adjunto USING btree (estado_validacion) WHERE (is_deleted = false);


--
-- Name: idx_doc_solicitud; Type: INDEX; Schema: acometidas; Owner: postgres
--

CREATE INDEX idx_doc_solicitud ON acometidas.documento_adjunto USING btree (id_solicitud) WHERE (is_deleted = false);


--
-- Name: idx_historial_fecha; Type: INDEX; Schema: acometidas; Owner: postgres
--

CREATE INDEX idx_historial_fecha ON acometidas.historial_estado USING btree (fecha_cambio DESC);


--
-- Name: idx_historial_solicitud; Type: INDEX; Schema: acometidas; Owner: postgres
--

CREATE INDEX idx_historial_solicitud ON acometidas.historial_estado USING btree (id_solicitud);


--
-- Name: idx_informe_instalacion_solicitud; Type: INDEX; Schema: acometidas; Owner: postgres
--

CREATE INDEX idx_informe_instalacion_solicitud ON acometidas.informe_instalacion USING btree (id_solicitud, created_at DESC);


--
-- Name: idx_solicitud_catastral; Type: INDEX; Schema: acometidas; Owner: postgres
--

CREATE INDEX idx_solicitud_catastral ON acometidas.solicitud USING btree (clave_catastral) WHERE (is_deleted = false);


--
-- Name: idx_solicitud_cliente; Type: INDEX; Schema: acometidas; Owner: postgres
--

CREATE INDEX idx_solicitud_cliente ON acometidas.solicitud USING btree (id_cliente) WHERE (is_deleted = false);


--
-- Name: idx_solicitud_datos; Type: INDEX; Schema: acometidas; Owner: postgres
--

CREATE INDEX idx_solicitud_datos ON acometidas.solicitud USING gin (datos_adicionales) WHERE (is_deleted = false);


--
-- Name: idx_solicitud_estado; Type: INDEX; Schema: acometidas; Owner: postgres
--

CREATE INDEX idx_solicitud_estado ON acometidas.solicitud USING btree (estado) WHERE (is_deleted = false);


--
-- Name: idx_solicitud_geom; Type: INDEX; Schema: acometidas; Owner: postgres
--

CREATE INDEX idx_solicitud_geom ON acometidas.solicitud USING gist (geom) WHERE (is_deleted = false);


--
-- Name: idx_solicitud_numero; Type: INDEX; Schema: acometidas; Owner: postgres
--

CREATE INDEX idx_solicitud_numero ON acometidas.solicitud USING btree (numero_solicitud);


--
-- Name: idx_solicitud_ot_ot; Type: INDEX; Schema: acometidas; Owner: postgres
--

CREATE INDEX idx_solicitud_ot_ot ON acometidas.solicitud_orden_trabajo USING btree (id_orden_trabajo);


--
-- Name: idx_solicitud_ot_sol; Type: INDEX; Schema: acometidas; Owner: postgres
--

CREATE INDEX idx_solicitud_ot_sol ON acometidas.solicitud_orden_trabajo USING btree (id_solicitud);


--
-- Name: idx_alerta_no_resuelta; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX idx_alerta_no_resuelta ON audit.alerta USING btree (resuelta, created_at DESC) WHERE (resuelta = false);


--
-- Name: idx_alerta_severidad_ts; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX idx_alerta_severidad_ts ON audit.alerta USING btree (severidad, created_at DESC);


--
-- Name: idx_alerta_tipo; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX idx_alerta_tipo ON audit.alerta USING btree (tipo_alerta, created_at DESC);


--
-- Name: idx_alerta_usuario; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX idx_alerta_usuario ON audit.alerta USING btree (usuario_id, created_at DESC);


--
-- Name: idx_audit_reg_diff_gin; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX idx_audit_reg_diff_gin ON ONLY audit.registro USING gin (diff_jsonb);


--
-- Name: idx_audit_reg_operacion; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX idx_audit_reg_operacion ON ONLY audit.registro USING btree (operacion, audit_timestamp DESC);


--
-- Name: idx_audit_reg_pk_gin; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX idx_audit_reg_pk_gin ON ONLY audit.registro USING gin (pk_valor);


--
-- Name: idx_audit_reg_sesion; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX idx_audit_reg_sesion ON ONLY audit.registro USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: idx_audit_reg_tabla_ts; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX idx_audit_reg_tabla_ts ON ONLY audit.registro USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: idx_audit_reg_ts_desc; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX idx_audit_reg_ts_desc ON ONLY audit.registro USING btree (audit_timestamp DESC);


--
-- Name: idx_audit_reg_usuario_ts; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX idx_audit_reg_usuario_ts ON ONLY audit.registro USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: idx_audit_sesion_evento; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX idx_audit_sesion_evento ON ONLY audit.sesion USING btree (evento, audit_timestamp DESC);


--
-- Name: idx_audit_sesion_ip; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX idx_audit_sesion_ip ON ONLY audit.sesion USING btree (ip_address, audit_timestamp DESC);


--
-- Name: idx_audit_sesion_usuario_ts; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX idx_audit_sesion_usuario_ts ON ONLY audit.sesion USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: idx_refresh_token_expiration; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX idx_refresh_token_expiration ON audit.usuario_refresh_tokens USING btree (expires_at) WHERE (revoked = false);


--
-- Name: idx_refresh_token_hash; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX idx_refresh_token_hash ON audit.usuario_refresh_tokens USING btree (token_hash) WHERE (revoked = false);


--
-- Name: idx_refresh_token_usuario; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX idx_refresh_token_usuario ON audit.usuario_refresh_tokens USING btree (usuario_id);


--
-- Name: registro_2024_01_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_01_audit_timestamp_idx ON audit.registro_2024_01 USING btree (audit_timestamp DESC);


--
-- Name: registro_2024_01_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_01_diff_jsonb_idx ON audit.registro_2024_01 USING gin (diff_jsonb);


--
-- Name: registro_2024_01_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_01_operacion_audit_timestamp_idx ON audit.registro_2024_01 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2024_01_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_01_pk_valor_idx ON audit.registro_2024_01 USING gin (pk_valor);


--
-- Name: registro_2024_01_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_01_sesion_id_idx ON audit.registro_2024_01 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2024_01_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_01_tabla_nombre_audit_timestamp_idx ON audit.registro_2024_01 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2024_01_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_01_usuario_id_audit_timestamp_idx ON audit.registro_2024_01 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2024_02_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_02_audit_timestamp_idx ON audit.registro_2024_02 USING btree (audit_timestamp DESC);


--
-- Name: registro_2024_02_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_02_diff_jsonb_idx ON audit.registro_2024_02 USING gin (diff_jsonb);


--
-- Name: registro_2024_02_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_02_operacion_audit_timestamp_idx ON audit.registro_2024_02 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2024_02_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_02_pk_valor_idx ON audit.registro_2024_02 USING gin (pk_valor);


--
-- Name: registro_2024_02_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_02_sesion_id_idx ON audit.registro_2024_02 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2024_02_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_02_tabla_nombre_audit_timestamp_idx ON audit.registro_2024_02 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2024_02_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_02_usuario_id_audit_timestamp_idx ON audit.registro_2024_02 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2024_03_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_03_audit_timestamp_idx ON audit.registro_2024_03 USING btree (audit_timestamp DESC);


--
-- Name: registro_2024_03_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_03_diff_jsonb_idx ON audit.registro_2024_03 USING gin (diff_jsonb);


--
-- Name: registro_2024_03_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_03_operacion_audit_timestamp_idx ON audit.registro_2024_03 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2024_03_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_03_pk_valor_idx ON audit.registro_2024_03 USING gin (pk_valor);


--
-- Name: registro_2024_03_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_03_sesion_id_idx ON audit.registro_2024_03 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2024_03_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_03_tabla_nombre_audit_timestamp_idx ON audit.registro_2024_03 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2024_03_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_03_usuario_id_audit_timestamp_idx ON audit.registro_2024_03 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2024_04_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_04_audit_timestamp_idx ON audit.registro_2024_04 USING btree (audit_timestamp DESC);


--
-- Name: registro_2024_04_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_04_diff_jsonb_idx ON audit.registro_2024_04 USING gin (diff_jsonb);


--
-- Name: registro_2024_04_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_04_operacion_audit_timestamp_idx ON audit.registro_2024_04 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2024_04_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_04_pk_valor_idx ON audit.registro_2024_04 USING gin (pk_valor);


--
-- Name: registro_2024_04_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_04_sesion_id_idx ON audit.registro_2024_04 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2024_04_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_04_tabla_nombre_audit_timestamp_idx ON audit.registro_2024_04 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2024_04_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_04_usuario_id_audit_timestamp_idx ON audit.registro_2024_04 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2024_05_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_05_audit_timestamp_idx ON audit.registro_2024_05 USING btree (audit_timestamp DESC);


--
-- Name: registro_2024_05_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_05_diff_jsonb_idx ON audit.registro_2024_05 USING gin (diff_jsonb);


--
-- Name: registro_2024_05_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_05_operacion_audit_timestamp_idx ON audit.registro_2024_05 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2024_05_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_05_pk_valor_idx ON audit.registro_2024_05 USING gin (pk_valor);


--
-- Name: registro_2024_05_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_05_sesion_id_idx ON audit.registro_2024_05 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2024_05_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_05_tabla_nombre_audit_timestamp_idx ON audit.registro_2024_05 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2024_05_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_05_usuario_id_audit_timestamp_idx ON audit.registro_2024_05 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2024_06_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_06_audit_timestamp_idx ON audit.registro_2024_06 USING btree (audit_timestamp DESC);


--
-- Name: registro_2024_06_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_06_diff_jsonb_idx ON audit.registro_2024_06 USING gin (diff_jsonb);


--
-- Name: registro_2024_06_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_06_operacion_audit_timestamp_idx ON audit.registro_2024_06 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2024_06_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_06_pk_valor_idx ON audit.registro_2024_06 USING gin (pk_valor);


--
-- Name: registro_2024_06_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_06_sesion_id_idx ON audit.registro_2024_06 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2024_06_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_06_tabla_nombre_audit_timestamp_idx ON audit.registro_2024_06 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2024_06_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_06_usuario_id_audit_timestamp_idx ON audit.registro_2024_06 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2024_07_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_07_audit_timestamp_idx ON audit.registro_2024_07 USING btree (audit_timestamp DESC);


--
-- Name: registro_2024_07_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_07_diff_jsonb_idx ON audit.registro_2024_07 USING gin (diff_jsonb);


--
-- Name: registro_2024_07_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_07_operacion_audit_timestamp_idx ON audit.registro_2024_07 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2024_07_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_07_pk_valor_idx ON audit.registro_2024_07 USING gin (pk_valor);


--
-- Name: registro_2024_07_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_07_sesion_id_idx ON audit.registro_2024_07 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2024_07_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_07_tabla_nombre_audit_timestamp_idx ON audit.registro_2024_07 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2024_07_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_07_usuario_id_audit_timestamp_idx ON audit.registro_2024_07 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2024_08_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_08_audit_timestamp_idx ON audit.registro_2024_08 USING btree (audit_timestamp DESC);


--
-- Name: registro_2024_08_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_08_diff_jsonb_idx ON audit.registro_2024_08 USING gin (diff_jsonb);


--
-- Name: registro_2024_08_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_08_operacion_audit_timestamp_idx ON audit.registro_2024_08 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2024_08_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_08_pk_valor_idx ON audit.registro_2024_08 USING gin (pk_valor);


--
-- Name: registro_2024_08_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_08_sesion_id_idx ON audit.registro_2024_08 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2024_08_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_08_tabla_nombre_audit_timestamp_idx ON audit.registro_2024_08 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2024_08_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_08_usuario_id_audit_timestamp_idx ON audit.registro_2024_08 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2024_09_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_09_audit_timestamp_idx ON audit.registro_2024_09 USING btree (audit_timestamp DESC);


--
-- Name: registro_2024_09_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_09_diff_jsonb_idx ON audit.registro_2024_09 USING gin (diff_jsonb);


--
-- Name: registro_2024_09_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_09_operacion_audit_timestamp_idx ON audit.registro_2024_09 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2024_09_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_09_pk_valor_idx ON audit.registro_2024_09 USING gin (pk_valor);


--
-- Name: registro_2024_09_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_09_sesion_id_idx ON audit.registro_2024_09 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2024_09_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_09_tabla_nombre_audit_timestamp_idx ON audit.registro_2024_09 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2024_09_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_09_usuario_id_audit_timestamp_idx ON audit.registro_2024_09 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2024_10_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_10_audit_timestamp_idx ON audit.registro_2024_10 USING btree (audit_timestamp DESC);


--
-- Name: registro_2024_10_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_10_diff_jsonb_idx ON audit.registro_2024_10 USING gin (diff_jsonb);


--
-- Name: registro_2024_10_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_10_operacion_audit_timestamp_idx ON audit.registro_2024_10 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2024_10_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_10_pk_valor_idx ON audit.registro_2024_10 USING gin (pk_valor);


--
-- Name: registro_2024_10_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_10_sesion_id_idx ON audit.registro_2024_10 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2024_10_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_10_tabla_nombre_audit_timestamp_idx ON audit.registro_2024_10 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2024_10_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_10_usuario_id_audit_timestamp_idx ON audit.registro_2024_10 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2024_11_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_11_audit_timestamp_idx ON audit.registro_2024_11 USING btree (audit_timestamp DESC);


--
-- Name: registro_2024_11_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_11_diff_jsonb_idx ON audit.registro_2024_11 USING gin (diff_jsonb);


--
-- Name: registro_2024_11_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_11_operacion_audit_timestamp_idx ON audit.registro_2024_11 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2024_11_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_11_pk_valor_idx ON audit.registro_2024_11 USING gin (pk_valor);


--
-- Name: registro_2024_11_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_11_sesion_id_idx ON audit.registro_2024_11 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2024_11_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_11_tabla_nombre_audit_timestamp_idx ON audit.registro_2024_11 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2024_11_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_11_usuario_id_audit_timestamp_idx ON audit.registro_2024_11 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2024_12_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_12_audit_timestamp_idx ON audit.registro_2024_12 USING btree (audit_timestamp DESC);


--
-- Name: registro_2024_12_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_12_diff_jsonb_idx ON audit.registro_2024_12 USING gin (diff_jsonb);


--
-- Name: registro_2024_12_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_12_operacion_audit_timestamp_idx ON audit.registro_2024_12 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2024_12_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_12_pk_valor_idx ON audit.registro_2024_12 USING gin (pk_valor);


--
-- Name: registro_2024_12_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_12_sesion_id_idx ON audit.registro_2024_12 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2024_12_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_12_tabla_nombre_audit_timestamp_idx ON audit.registro_2024_12 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2024_12_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2024_12_usuario_id_audit_timestamp_idx ON audit.registro_2024_12 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2025_01_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_01_audit_timestamp_idx ON audit.registro_2025_01 USING btree (audit_timestamp DESC);


--
-- Name: registro_2025_01_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_01_diff_jsonb_idx ON audit.registro_2025_01 USING gin (diff_jsonb);


--
-- Name: registro_2025_01_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_01_operacion_audit_timestamp_idx ON audit.registro_2025_01 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2025_01_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_01_pk_valor_idx ON audit.registro_2025_01 USING gin (pk_valor);


--
-- Name: registro_2025_01_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_01_sesion_id_idx ON audit.registro_2025_01 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2025_01_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_01_tabla_nombre_audit_timestamp_idx ON audit.registro_2025_01 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2025_01_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_01_usuario_id_audit_timestamp_idx ON audit.registro_2025_01 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2025_02_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_02_audit_timestamp_idx ON audit.registro_2025_02 USING btree (audit_timestamp DESC);


--
-- Name: registro_2025_02_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_02_diff_jsonb_idx ON audit.registro_2025_02 USING gin (diff_jsonb);


--
-- Name: registro_2025_02_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_02_operacion_audit_timestamp_idx ON audit.registro_2025_02 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2025_02_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_02_pk_valor_idx ON audit.registro_2025_02 USING gin (pk_valor);


--
-- Name: registro_2025_02_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_02_sesion_id_idx ON audit.registro_2025_02 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2025_02_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_02_tabla_nombre_audit_timestamp_idx ON audit.registro_2025_02 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2025_02_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_02_usuario_id_audit_timestamp_idx ON audit.registro_2025_02 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2025_03_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_03_audit_timestamp_idx ON audit.registro_2025_03 USING btree (audit_timestamp DESC);


--
-- Name: registro_2025_03_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_03_diff_jsonb_idx ON audit.registro_2025_03 USING gin (diff_jsonb);


--
-- Name: registro_2025_03_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_03_operacion_audit_timestamp_idx ON audit.registro_2025_03 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2025_03_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_03_pk_valor_idx ON audit.registro_2025_03 USING gin (pk_valor);


--
-- Name: registro_2025_03_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_03_sesion_id_idx ON audit.registro_2025_03 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2025_03_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_03_tabla_nombre_audit_timestamp_idx ON audit.registro_2025_03 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2025_03_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_03_usuario_id_audit_timestamp_idx ON audit.registro_2025_03 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2025_04_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_04_audit_timestamp_idx ON audit.registro_2025_04 USING btree (audit_timestamp DESC);


--
-- Name: registro_2025_04_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_04_diff_jsonb_idx ON audit.registro_2025_04 USING gin (diff_jsonb);


--
-- Name: registro_2025_04_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_04_operacion_audit_timestamp_idx ON audit.registro_2025_04 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2025_04_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_04_pk_valor_idx ON audit.registro_2025_04 USING gin (pk_valor);


--
-- Name: registro_2025_04_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_04_sesion_id_idx ON audit.registro_2025_04 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2025_04_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_04_tabla_nombre_audit_timestamp_idx ON audit.registro_2025_04 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2025_04_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_04_usuario_id_audit_timestamp_idx ON audit.registro_2025_04 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2025_05_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_05_audit_timestamp_idx ON audit.registro_2025_05 USING btree (audit_timestamp DESC);


--
-- Name: registro_2025_05_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_05_diff_jsonb_idx ON audit.registro_2025_05 USING gin (diff_jsonb);


--
-- Name: registro_2025_05_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_05_operacion_audit_timestamp_idx ON audit.registro_2025_05 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2025_05_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_05_pk_valor_idx ON audit.registro_2025_05 USING gin (pk_valor);


--
-- Name: registro_2025_05_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_05_sesion_id_idx ON audit.registro_2025_05 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2025_05_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_05_tabla_nombre_audit_timestamp_idx ON audit.registro_2025_05 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2025_05_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_05_usuario_id_audit_timestamp_idx ON audit.registro_2025_05 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2025_06_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_06_audit_timestamp_idx ON audit.registro_2025_06 USING btree (audit_timestamp DESC);


--
-- Name: registro_2025_06_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_06_diff_jsonb_idx ON audit.registro_2025_06 USING gin (diff_jsonb);


--
-- Name: registro_2025_06_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_06_operacion_audit_timestamp_idx ON audit.registro_2025_06 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2025_06_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_06_pk_valor_idx ON audit.registro_2025_06 USING gin (pk_valor);


--
-- Name: registro_2025_06_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_06_sesion_id_idx ON audit.registro_2025_06 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2025_06_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_06_tabla_nombre_audit_timestamp_idx ON audit.registro_2025_06 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2025_06_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_06_usuario_id_audit_timestamp_idx ON audit.registro_2025_06 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2025_07_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_07_audit_timestamp_idx ON audit.registro_2025_07 USING btree (audit_timestamp DESC);


--
-- Name: registro_2025_07_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_07_diff_jsonb_idx ON audit.registro_2025_07 USING gin (diff_jsonb);


--
-- Name: registro_2025_07_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_07_operacion_audit_timestamp_idx ON audit.registro_2025_07 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2025_07_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_07_pk_valor_idx ON audit.registro_2025_07 USING gin (pk_valor);


--
-- Name: registro_2025_07_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_07_sesion_id_idx ON audit.registro_2025_07 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2025_07_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_07_tabla_nombre_audit_timestamp_idx ON audit.registro_2025_07 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2025_07_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_07_usuario_id_audit_timestamp_idx ON audit.registro_2025_07 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2025_08_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_08_audit_timestamp_idx ON audit.registro_2025_08 USING btree (audit_timestamp DESC);


--
-- Name: registro_2025_08_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_08_diff_jsonb_idx ON audit.registro_2025_08 USING gin (diff_jsonb);


--
-- Name: registro_2025_08_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_08_operacion_audit_timestamp_idx ON audit.registro_2025_08 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2025_08_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_08_pk_valor_idx ON audit.registro_2025_08 USING gin (pk_valor);


--
-- Name: registro_2025_08_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_08_sesion_id_idx ON audit.registro_2025_08 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2025_08_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_08_tabla_nombre_audit_timestamp_idx ON audit.registro_2025_08 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2025_08_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_08_usuario_id_audit_timestamp_idx ON audit.registro_2025_08 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2025_09_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_09_audit_timestamp_idx ON audit.registro_2025_09 USING btree (audit_timestamp DESC);


--
-- Name: registro_2025_09_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_09_diff_jsonb_idx ON audit.registro_2025_09 USING gin (diff_jsonb);


--
-- Name: registro_2025_09_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_09_operacion_audit_timestamp_idx ON audit.registro_2025_09 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2025_09_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_09_pk_valor_idx ON audit.registro_2025_09 USING gin (pk_valor);


--
-- Name: registro_2025_09_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_09_sesion_id_idx ON audit.registro_2025_09 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2025_09_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_09_tabla_nombre_audit_timestamp_idx ON audit.registro_2025_09 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2025_09_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_09_usuario_id_audit_timestamp_idx ON audit.registro_2025_09 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2025_10_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_10_audit_timestamp_idx ON audit.registro_2025_10 USING btree (audit_timestamp DESC);


--
-- Name: registro_2025_10_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_10_diff_jsonb_idx ON audit.registro_2025_10 USING gin (diff_jsonb);


--
-- Name: registro_2025_10_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_10_operacion_audit_timestamp_idx ON audit.registro_2025_10 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2025_10_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_10_pk_valor_idx ON audit.registro_2025_10 USING gin (pk_valor);


--
-- Name: registro_2025_10_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_10_sesion_id_idx ON audit.registro_2025_10 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2025_10_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_10_tabla_nombre_audit_timestamp_idx ON audit.registro_2025_10 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2025_10_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_10_usuario_id_audit_timestamp_idx ON audit.registro_2025_10 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2025_11_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_11_audit_timestamp_idx ON audit.registro_2025_11 USING btree (audit_timestamp DESC);


--
-- Name: registro_2025_11_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_11_diff_jsonb_idx ON audit.registro_2025_11 USING gin (diff_jsonb);


--
-- Name: registro_2025_11_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_11_operacion_audit_timestamp_idx ON audit.registro_2025_11 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2025_11_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_11_pk_valor_idx ON audit.registro_2025_11 USING gin (pk_valor);


--
-- Name: registro_2025_11_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_11_sesion_id_idx ON audit.registro_2025_11 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2025_11_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_11_tabla_nombre_audit_timestamp_idx ON audit.registro_2025_11 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2025_11_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_11_usuario_id_audit_timestamp_idx ON audit.registro_2025_11 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2025_12_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_12_audit_timestamp_idx ON audit.registro_2025_12 USING btree (audit_timestamp DESC);


--
-- Name: registro_2025_12_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_12_diff_jsonb_idx ON audit.registro_2025_12 USING gin (diff_jsonb);


--
-- Name: registro_2025_12_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_12_operacion_audit_timestamp_idx ON audit.registro_2025_12 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2025_12_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_12_pk_valor_idx ON audit.registro_2025_12 USING gin (pk_valor);


--
-- Name: registro_2025_12_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_12_sesion_id_idx ON audit.registro_2025_12 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2025_12_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_12_tabla_nombre_audit_timestamp_idx ON audit.registro_2025_12 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2025_12_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2025_12_usuario_id_audit_timestamp_idx ON audit.registro_2025_12 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2026_01_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_01_audit_timestamp_idx ON audit.registro_2026_01 USING btree (audit_timestamp DESC);


--
-- Name: registro_2026_01_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_01_diff_jsonb_idx ON audit.registro_2026_01 USING gin (diff_jsonb);


--
-- Name: registro_2026_01_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_01_operacion_audit_timestamp_idx ON audit.registro_2026_01 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2026_01_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_01_pk_valor_idx ON audit.registro_2026_01 USING gin (pk_valor);


--
-- Name: registro_2026_01_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_01_sesion_id_idx ON audit.registro_2026_01 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2026_01_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_01_tabla_nombre_audit_timestamp_idx ON audit.registro_2026_01 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2026_01_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_01_usuario_id_audit_timestamp_idx ON audit.registro_2026_01 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2026_02_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_02_audit_timestamp_idx ON audit.registro_2026_02 USING btree (audit_timestamp DESC);


--
-- Name: registro_2026_02_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_02_diff_jsonb_idx ON audit.registro_2026_02 USING gin (diff_jsonb);


--
-- Name: registro_2026_02_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_02_operacion_audit_timestamp_idx ON audit.registro_2026_02 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2026_02_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_02_pk_valor_idx ON audit.registro_2026_02 USING gin (pk_valor);


--
-- Name: registro_2026_02_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_02_sesion_id_idx ON audit.registro_2026_02 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2026_02_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_02_tabla_nombre_audit_timestamp_idx ON audit.registro_2026_02 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2026_02_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_02_usuario_id_audit_timestamp_idx ON audit.registro_2026_02 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2026_03_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_03_audit_timestamp_idx ON audit.registro_2026_03 USING btree (audit_timestamp DESC);


--
-- Name: registro_2026_03_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_03_diff_jsonb_idx ON audit.registro_2026_03 USING gin (diff_jsonb);


--
-- Name: registro_2026_03_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_03_operacion_audit_timestamp_idx ON audit.registro_2026_03 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2026_03_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_03_pk_valor_idx ON audit.registro_2026_03 USING gin (pk_valor);


--
-- Name: registro_2026_03_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_03_sesion_id_idx ON audit.registro_2026_03 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2026_03_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_03_tabla_nombre_audit_timestamp_idx ON audit.registro_2026_03 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2026_03_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_03_usuario_id_audit_timestamp_idx ON audit.registro_2026_03 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2026_04_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_04_audit_timestamp_idx ON audit.registro_2026_04 USING btree (audit_timestamp DESC);


--
-- Name: registro_2026_04_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_04_diff_jsonb_idx ON audit.registro_2026_04 USING gin (diff_jsonb);


--
-- Name: registro_2026_04_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_04_operacion_audit_timestamp_idx ON audit.registro_2026_04 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2026_04_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_04_pk_valor_idx ON audit.registro_2026_04 USING gin (pk_valor);


--
-- Name: registro_2026_04_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_04_sesion_id_idx ON audit.registro_2026_04 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2026_04_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_04_tabla_nombre_audit_timestamp_idx ON audit.registro_2026_04 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2026_04_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_04_usuario_id_audit_timestamp_idx ON audit.registro_2026_04 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2026_05_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_05_audit_timestamp_idx ON audit.registro_2026_05 USING btree (audit_timestamp DESC);


--
-- Name: registro_2026_05_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_05_diff_jsonb_idx ON audit.registro_2026_05 USING gin (diff_jsonb);


--
-- Name: registro_2026_05_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_05_operacion_audit_timestamp_idx ON audit.registro_2026_05 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2026_05_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_05_pk_valor_idx ON audit.registro_2026_05 USING gin (pk_valor);


--
-- Name: registro_2026_05_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_05_sesion_id_idx ON audit.registro_2026_05 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2026_05_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_05_tabla_nombre_audit_timestamp_idx ON audit.registro_2026_05 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2026_05_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_05_usuario_id_audit_timestamp_idx ON audit.registro_2026_05 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2026_06_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_06_audit_timestamp_idx ON audit.registro_2026_06 USING btree (audit_timestamp DESC);


--
-- Name: registro_2026_06_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_06_diff_jsonb_idx ON audit.registro_2026_06 USING gin (diff_jsonb);


--
-- Name: registro_2026_06_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_06_operacion_audit_timestamp_idx ON audit.registro_2026_06 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2026_06_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_06_pk_valor_idx ON audit.registro_2026_06 USING gin (pk_valor);


--
-- Name: registro_2026_06_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_06_sesion_id_idx ON audit.registro_2026_06 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2026_06_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_06_tabla_nombre_audit_timestamp_idx ON audit.registro_2026_06 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2026_06_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_06_usuario_id_audit_timestamp_idx ON audit.registro_2026_06 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2026_07_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_07_audit_timestamp_idx ON audit.registro_2026_07 USING btree (audit_timestamp DESC);


--
-- Name: registro_2026_07_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_07_diff_jsonb_idx ON audit.registro_2026_07 USING gin (diff_jsonb);


--
-- Name: registro_2026_07_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_07_operacion_audit_timestamp_idx ON audit.registro_2026_07 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2026_07_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_07_pk_valor_idx ON audit.registro_2026_07 USING gin (pk_valor);


--
-- Name: registro_2026_07_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_07_sesion_id_idx ON audit.registro_2026_07 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2026_07_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_07_tabla_nombre_audit_timestamp_idx ON audit.registro_2026_07 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2026_07_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_07_usuario_id_audit_timestamp_idx ON audit.registro_2026_07 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2026_08_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_08_audit_timestamp_idx ON audit.registro_2026_08 USING btree (audit_timestamp DESC);


--
-- Name: registro_2026_08_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_08_diff_jsonb_idx ON audit.registro_2026_08 USING gin (diff_jsonb);


--
-- Name: registro_2026_08_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_08_operacion_audit_timestamp_idx ON audit.registro_2026_08 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2026_08_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_08_pk_valor_idx ON audit.registro_2026_08 USING gin (pk_valor);


--
-- Name: registro_2026_08_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_08_sesion_id_idx ON audit.registro_2026_08 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2026_08_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_08_tabla_nombre_audit_timestamp_idx ON audit.registro_2026_08 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2026_08_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_08_usuario_id_audit_timestamp_idx ON audit.registro_2026_08 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2026_09_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_09_audit_timestamp_idx ON audit.registro_2026_09 USING btree (audit_timestamp DESC);


--
-- Name: registro_2026_09_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_09_diff_jsonb_idx ON audit.registro_2026_09 USING gin (diff_jsonb);


--
-- Name: registro_2026_09_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_09_operacion_audit_timestamp_idx ON audit.registro_2026_09 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2026_09_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_09_pk_valor_idx ON audit.registro_2026_09 USING gin (pk_valor);


--
-- Name: registro_2026_09_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_09_sesion_id_idx ON audit.registro_2026_09 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2026_09_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_09_tabla_nombre_audit_timestamp_idx ON audit.registro_2026_09 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2026_09_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_09_usuario_id_audit_timestamp_idx ON audit.registro_2026_09 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2026_10_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_10_audit_timestamp_idx ON audit.registro_2026_10 USING btree (audit_timestamp DESC);


--
-- Name: registro_2026_10_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_10_diff_jsonb_idx ON audit.registro_2026_10 USING gin (diff_jsonb);


--
-- Name: registro_2026_10_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_10_operacion_audit_timestamp_idx ON audit.registro_2026_10 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2026_10_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_10_pk_valor_idx ON audit.registro_2026_10 USING gin (pk_valor);


--
-- Name: registro_2026_10_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_10_sesion_id_idx ON audit.registro_2026_10 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2026_10_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_10_tabla_nombre_audit_timestamp_idx ON audit.registro_2026_10 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2026_10_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_10_usuario_id_audit_timestamp_idx ON audit.registro_2026_10 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2026_11_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_11_audit_timestamp_idx ON audit.registro_2026_11 USING btree (audit_timestamp DESC);


--
-- Name: registro_2026_11_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_11_diff_jsonb_idx ON audit.registro_2026_11 USING gin (diff_jsonb);


--
-- Name: registro_2026_11_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_11_operacion_audit_timestamp_idx ON audit.registro_2026_11 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2026_11_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_11_pk_valor_idx ON audit.registro_2026_11 USING gin (pk_valor);


--
-- Name: registro_2026_11_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_11_sesion_id_idx ON audit.registro_2026_11 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2026_11_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_11_tabla_nombre_audit_timestamp_idx ON audit.registro_2026_11 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2026_11_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_11_usuario_id_audit_timestamp_idx ON audit.registro_2026_11 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2026_12_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_12_audit_timestamp_idx ON audit.registro_2026_12 USING btree (audit_timestamp DESC);


--
-- Name: registro_2026_12_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_12_diff_jsonb_idx ON audit.registro_2026_12 USING gin (diff_jsonb);


--
-- Name: registro_2026_12_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_12_operacion_audit_timestamp_idx ON audit.registro_2026_12 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2026_12_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_12_pk_valor_idx ON audit.registro_2026_12 USING gin (pk_valor);


--
-- Name: registro_2026_12_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_12_sesion_id_idx ON audit.registro_2026_12 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2026_12_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_12_tabla_nombre_audit_timestamp_idx ON audit.registro_2026_12 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2026_12_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2026_12_usuario_id_audit_timestamp_idx ON audit.registro_2026_12 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2027_01_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_01_audit_timestamp_idx ON audit.registro_2027_01 USING btree (audit_timestamp DESC);


--
-- Name: registro_2027_01_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_01_diff_jsonb_idx ON audit.registro_2027_01 USING gin (diff_jsonb);


--
-- Name: registro_2027_01_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_01_operacion_audit_timestamp_idx ON audit.registro_2027_01 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2027_01_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_01_pk_valor_idx ON audit.registro_2027_01 USING gin (pk_valor);


--
-- Name: registro_2027_01_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_01_sesion_id_idx ON audit.registro_2027_01 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2027_01_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_01_tabla_nombre_audit_timestamp_idx ON audit.registro_2027_01 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2027_01_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_01_usuario_id_audit_timestamp_idx ON audit.registro_2027_01 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2027_02_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_02_audit_timestamp_idx ON audit.registro_2027_02 USING btree (audit_timestamp DESC);


--
-- Name: registro_2027_02_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_02_diff_jsonb_idx ON audit.registro_2027_02 USING gin (diff_jsonb);


--
-- Name: registro_2027_02_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_02_operacion_audit_timestamp_idx ON audit.registro_2027_02 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2027_02_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_02_pk_valor_idx ON audit.registro_2027_02 USING gin (pk_valor);


--
-- Name: registro_2027_02_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_02_sesion_id_idx ON audit.registro_2027_02 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2027_02_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_02_tabla_nombre_audit_timestamp_idx ON audit.registro_2027_02 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2027_02_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_02_usuario_id_audit_timestamp_idx ON audit.registro_2027_02 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2027_03_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_03_audit_timestamp_idx ON audit.registro_2027_03 USING btree (audit_timestamp DESC);


--
-- Name: registro_2027_03_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_03_diff_jsonb_idx ON audit.registro_2027_03 USING gin (diff_jsonb);


--
-- Name: registro_2027_03_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_03_operacion_audit_timestamp_idx ON audit.registro_2027_03 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2027_03_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_03_pk_valor_idx ON audit.registro_2027_03 USING gin (pk_valor);


--
-- Name: registro_2027_03_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_03_sesion_id_idx ON audit.registro_2027_03 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2027_03_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_03_tabla_nombre_audit_timestamp_idx ON audit.registro_2027_03 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2027_03_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_03_usuario_id_audit_timestamp_idx ON audit.registro_2027_03 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2027_04_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_04_audit_timestamp_idx ON audit.registro_2027_04 USING btree (audit_timestamp DESC);


--
-- Name: registro_2027_04_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_04_diff_jsonb_idx ON audit.registro_2027_04 USING gin (diff_jsonb);


--
-- Name: registro_2027_04_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_04_operacion_audit_timestamp_idx ON audit.registro_2027_04 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2027_04_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_04_pk_valor_idx ON audit.registro_2027_04 USING gin (pk_valor);


--
-- Name: registro_2027_04_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_04_sesion_id_idx ON audit.registro_2027_04 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2027_04_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_04_tabla_nombre_audit_timestamp_idx ON audit.registro_2027_04 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2027_04_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_04_usuario_id_audit_timestamp_idx ON audit.registro_2027_04 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2027_05_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_05_audit_timestamp_idx ON audit.registro_2027_05 USING btree (audit_timestamp DESC);


--
-- Name: registro_2027_05_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_05_diff_jsonb_idx ON audit.registro_2027_05 USING gin (diff_jsonb);


--
-- Name: registro_2027_05_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_05_operacion_audit_timestamp_idx ON audit.registro_2027_05 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2027_05_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_05_pk_valor_idx ON audit.registro_2027_05 USING gin (pk_valor);


--
-- Name: registro_2027_05_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_05_sesion_id_idx ON audit.registro_2027_05 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2027_05_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_05_tabla_nombre_audit_timestamp_idx ON audit.registro_2027_05 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2027_05_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_05_usuario_id_audit_timestamp_idx ON audit.registro_2027_05 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2027_06_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_06_audit_timestamp_idx ON audit.registro_2027_06 USING btree (audit_timestamp DESC);


--
-- Name: registro_2027_06_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_06_diff_jsonb_idx ON audit.registro_2027_06 USING gin (diff_jsonb);


--
-- Name: registro_2027_06_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_06_operacion_audit_timestamp_idx ON audit.registro_2027_06 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2027_06_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_06_pk_valor_idx ON audit.registro_2027_06 USING gin (pk_valor);


--
-- Name: registro_2027_06_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_06_sesion_id_idx ON audit.registro_2027_06 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2027_06_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_06_tabla_nombre_audit_timestamp_idx ON audit.registro_2027_06 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2027_06_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_06_usuario_id_audit_timestamp_idx ON audit.registro_2027_06 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2027_07_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_07_audit_timestamp_idx ON audit.registro_2027_07 USING btree (audit_timestamp DESC);


--
-- Name: registro_2027_07_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_07_diff_jsonb_idx ON audit.registro_2027_07 USING gin (diff_jsonb);


--
-- Name: registro_2027_07_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_07_operacion_audit_timestamp_idx ON audit.registro_2027_07 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2027_07_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_07_pk_valor_idx ON audit.registro_2027_07 USING gin (pk_valor);


--
-- Name: registro_2027_07_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_07_sesion_id_idx ON audit.registro_2027_07 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2027_07_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_07_tabla_nombre_audit_timestamp_idx ON audit.registro_2027_07 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2027_07_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_07_usuario_id_audit_timestamp_idx ON audit.registro_2027_07 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2027_08_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_08_audit_timestamp_idx ON audit.registro_2027_08 USING btree (audit_timestamp DESC);


--
-- Name: registro_2027_08_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_08_diff_jsonb_idx ON audit.registro_2027_08 USING gin (diff_jsonb);


--
-- Name: registro_2027_08_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_08_operacion_audit_timestamp_idx ON audit.registro_2027_08 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2027_08_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_08_pk_valor_idx ON audit.registro_2027_08 USING gin (pk_valor);


--
-- Name: registro_2027_08_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_08_sesion_id_idx ON audit.registro_2027_08 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2027_08_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_08_tabla_nombre_audit_timestamp_idx ON audit.registro_2027_08 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2027_08_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_08_usuario_id_audit_timestamp_idx ON audit.registro_2027_08 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2027_09_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_09_audit_timestamp_idx ON audit.registro_2027_09 USING btree (audit_timestamp DESC);


--
-- Name: registro_2027_09_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_09_diff_jsonb_idx ON audit.registro_2027_09 USING gin (diff_jsonb);


--
-- Name: registro_2027_09_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_09_operacion_audit_timestamp_idx ON audit.registro_2027_09 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2027_09_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_09_pk_valor_idx ON audit.registro_2027_09 USING gin (pk_valor);


--
-- Name: registro_2027_09_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_09_sesion_id_idx ON audit.registro_2027_09 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2027_09_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_09_tabla_nombre_audit_timestamp_idx ON audit.registro_2027_09 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2027_09_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_09_usuario_id_audit_timestamp_idx ON audit.registro_2027_09 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2027_10_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_10_audit_timestamp_idx ON audit.registro_2027_10 USING btree (audit_timestamp DESC);


--
-- Name: registro_2027_10_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_10_diff_jsonb_idx ON audit.registro_2027_10 USING gin (diff_jsonb);


--
-- Name: registro_2027_10_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_10_operacion_audit_timestamp_idx ON audit.registro_2027_10 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2027_10_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_10_pk_valor_idx ON audit.registro_2027_10 USING gin (pk_valor);


--
-- Name: registro_2027_10_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_10_sesion_id_idx ON audit.registro_2027_10 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2027_10_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_10_tabla_nombre_audit_timestamp_idx ON audit.registro_2027_10 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2027_10_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_10_usuario_id_audit_timestamp_idx ON audit.registro_2027_10 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2027_11_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_11_audit_timestamp_idx ON audit.registro_2027_11 USING btree (audit_timestamp DESC);


--
-- Name: registro_2027_11_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_11_diff_jsonb_idx ON audit.registro_2027_11 USING gin (diff_jsonb);


--
-- Name: registro_2027_11_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_11_operacion_audit_timestamp_idx ON audit.registro_2027_11 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2027_11_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_11_pk_valor_idx ON audit.registro_2027_11 USING gin (pk_valor);


--
-- Name: registro_2027_11_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_11_sesion_id_idx ON audit.registro_2027_11 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2027_11_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_11_tabla_nombre_audit_timestamp_idx ON audit.registro_2027_11 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2027_11_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_11_usuario_id_audit_timestamp_idx ON audit.registro_2027_11 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_2027_12_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_12_audit_timestamp_idx ON audit.registro_2027_12 USING btree (audit_timestamp DESC);


--
-- Name: registro_2027_12_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_12_diff_jsonb_idx ON audit.registro_2027_12 USING gin (diff_jsonb);


--
-- Name: registro_2027_12_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_12_operacion_audit_timestamp_idx ON audit.registro_2027_12 USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_2027_12_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_12_pk_valor_idx ON audit.registro_2027_12 USING gin (pk_valor);


--
-- Name: registro_2027_12_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_12_sesion_id_idx ON audit.registro_2027_12 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_2027_12_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_12_tabla_nombre_audit_timestamp_idx ON audit.registro_2027_12 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_2027_12_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_2027_12_usuario_id_audit_timestamp_idx ON audit.registro_2027_12 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: registro_default_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_default_audit_timestamp_idx ON audit.registro_default USING btree (audit_timestamp DESC);


--
-- Name: registro_default_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_default_diff_jsonb_idx ON audit.registro_default USING gin (diff_jsonb);


--
-- Name: registro_default_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_default_operacion_audit_timestamp_idx ON audit.registro_default USING btree (operacion, audit_timestamp DESC);


--
-- Name: registro_default_pk_valor_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_default_pk_valor_idx ON audit.registro_default USING gin (pk_valor);


--
-- Name: registro_default_sesion_id_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_default_sesion_id_idx ON audit.registro_default USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- Name: registro_default_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_default_tabla_nombre_audit_timestamp_idx ON audit.registro_default USING btree (tabla_nombre, audit_timestamp DESC);


--
-- Name: registro_default_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX registro_default_usuario_id_audit_timestamp_idx ON audit.registro_default USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: sesion_2026_04_evento_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX sesion_2026_04_evento_audit_timestamp_idx ON audit.sesion_2026_04 USING btree (evento, audit_timestamp DESC);


--
-- Name: sesion_2026_04_ip_address_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX sesion_2026_04_ip_address_audit_timestamp_idx ON audit.sesion_2026_04 USING btree (ip_address, audit_timestamp DESC);


--
-- Name: sesion_2026_04_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX sesion_2026_04_usuario_id_audit_timestamp_idx ON audit.sesion_2026_04 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: sesion_2026_05_evento_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX sesion_2026_05_evento_audit_timestamp_idx ON audit.sesion_2026_05 USING btree (evento, audit_timestamp DESC);


--
-- Name: sesion_2026_05_ip_address_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX sesion_2026_05_ip_address_audit_timestamp_idx ON audit.sesion_2026_05 USING btree (ip_address, audit_timestamp DESC);


--
-- Name: sesion_2026_05_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX sesion_2026_05_usuario_id_audit_timestamp_idx ON audit.sesion_2026_05 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: sesion_2026_06_evento_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX sesion_2026_06_evento_audit_timestamp_idx ON audit.sesion_2026_06 USING btree (evento, audit_timestamp DESC);


--
-- Name: sesion_2026_06_ip_address_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX sesion_2026_06_ip_address_audit_timestamp_idx ON audit.sesion_2026_06 USING btree (ip_address, audit_timestamp DESC);


--
-- Name: sesion_2026_06_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX sesion_2026_06_usuario_id_audit_timestamp_idx ON audit.sesion_2026_06 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: sesion_2026_07_evento_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX sesion_2026_07_evento_audit_timestamp_idx ON audit.sesion_2026_07 USING btree (evento, audit_timestamp DESC);


--
-- Name: sesion_2026_07_ip_address_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX sesion_2026_07_ip_address_audit_timestamp_idx ON audit.sesion_2026_07 USING btree (ip_address, audit_timestamp DESC);


--
-- Name: sesion_2026_07_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX sesion_2026_07_usuario_id_audit_timestamp_idx ON audit.sesion_2026_07 USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: sesion_default_evento_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX sesion_default_evento_audit_timestamp_idx ON audit.sesion_default USING btree (evento, audit_timestamp DESC);


--
-- Name: sesion_default_ip_address_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX sesion_default_ip_address_audit_timestamp_idx ON audit.sesion_default USING btree (ip_address, audit_timestamp DESC);


--
-- Name: sesion_default_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX sesion_default_usuario_id_audit_timestamp_idx ON audit.sesion_default USING btree (usuario_id, audit_timestamp DESC);


--
-- Name: idx_documento_created; Type: INDEX; Schema: documents; Owner: postgres
--

CREATE INDEX idx_documento_created ON documents.documento USING btree (created_at DESC);


--
-- Name: idx_documento_estado; Type: INDEX; Schema: documents; Owner: postgres
--

CREATE INDEX idx_documento_estado ON documents.documento USING btree (estado);


--
-- Name: idx_documento_hash; Type: INDEX; Schema: documents; Owner: postgres
--

CREATE INDEX idx_documento_hash ON documents.documento USING btree (file_hash_sha256);


--
-- Name: idx_documento_metadatos; Type: INDEX; Schema: documents; Owner: postgres
--

CREATE INDEX idx_documento_metadatos ON documents.documento USING gin (metadatos_extras);


--
-- Name: idx_documento_nivel; Type: INDEX; Schema: documents; Owner: postgres
--

CREATE INDEX idx_documento_nivel ON documents.documento USING btree (nivel_acceso);


--
-- Name: idx_documento_tipo; Type: INDEX; Schema: documents; Owner: postgres
--

CREATE INDEX idx_documento_tipo ON documents.documento USING btree (tipo_documento_id);


--
-- Name: idx_historial_doc; Type: INDEX; Schema: documents; Owner: postgres
--

CREATE INDEX idx_historial_doc ON documents.historial_documento USING btree (documento_id);


--
-- Name: idx_rel_acometida; Type: INDEX; Schema: documents; Owner: postgres
--

CREATE INDEX idx_rel_acometida ON documents.relacion_acometida USING btree (acometida_id);


--
-- Name: idx_rel_factura; Type: INDEX; Schema: documents; Owner: postgres
--

CREATE INDEX idx_rel_factura ON documents.relacion_factura USING btree (factura_id);


--
-- Name: idx_rel_lectura; Type: INDEX; Schema: documents; Owner: postgres
--

CREATE INDEX idx_rel_lectura ON documents.relacion_lectura USING btree (lectura_id);


--
-- Name: idx_rel_orden; Type: INDEX; Schema: documents; Owner: postgres
--

CREATE INDEX idx_rel_orden ON documents.relacion_orden_trabajo USING btree (orden_trabajo_id);


--
-- Name: idx_rel_predio; Type: INDEX; Schema: documents; Owner: postgres
--

CREATE INDEX idx_rel_predio ON documents.relacion_predio USING btree (predio_id);


--
-- Name: idx_rel_solicitud; Type: INDEX; Schema: documents; Owner: postgres
--

CREATE INDEX idx_rel_solicitud ON documents.relacion_solicitud USING btree (solicitud_id);


--
-- Name: idx_rel_usuarios; Type: INDEX; Schema: documents; Owner: postgres
--

CREATE INDEX idx_rel_usuarios ON documents.relacion_usuarios USING btree (usuario_id);


--
-- Name: idx_notif_entidad; Type: INDEX; Schema: notifications; Owner: postgres
--

CREATE INDEX idx_notif_entidad ON notifications.user_notification USING btree (entidad_tipo, entidad_id);


--
-- Name: idx_notif_pending_delivery; Type: INDEX; Schema: notifications; Owner: postgres
--

CREATE INDEX idx_notif_pending_delivery ON notifications.user_notification USING btree (created_at) INCLUDE (id_canal, id_estado_envio);


--
-- Name: idx_notif_unread_by_user; Type: INDEX; Schema: notifications; Owner: postgres
--

CREATE INDEX idx_notif_unread_by_user ON notifications.user_notification USING btree (id_usuario, created_at DESC) WHERE (is_read = false);


--
-- Name: idx_acometida_acometida_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_acometida_acometida_id ON public.acometida USING btree (acometida_id);


--
-- Name: idx_acometida_clave_catastral; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_acometida_clave_catastral ON public.acometida USING btree (clave_catastral);


--
-- Name: idx_acometida_cliente_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_acometida_cliente_id ON public.acometida USING btree (cliente_id);


--
-- Name: idx_acometida_cuenta; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_acometida_cuenta ON public.acometida USING btree (cuenta);


--
-- Name: idx_acometida_estado_activo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_acometida_estado_activo ON public.historial_estados_acometida USING btree (acometida_id) WHERE (activo = true);


--
-- Name: idx_acometida_estado_sector; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_acometida_estado_sector ON public.acometida USING btree (estado_id, sector);


--
-- Name: idx_acometida_fecha_inicio_lecturas; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_acometida_fecha_inicio_lecturas ON public.acometida USING btree (fecha_inicio_lecturas) WHERE (fecha_inicio_lecturas IS NOT NULL);


--
-- Name: idx_acometida_fecha_instalacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_acometida_fecha_instalacion ON public.acometida USING btree (fecha_instalacion);


--
-- Name: idx_acometida_numero_medidor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_acometida_numero_medidor ON public.acometida USING btree (numero_medidor);


--
-- Name: idx_acometida_sector; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_acometida_sector ON public.acometida USING btree (sector);


--
-- Name: idx_acometida_tarifa_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_acometida_tarifa_id ON public.acometida USING btree (tarifa_id);


--
-- Name: idx_acometida_zona_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_acometida_zona_id ON public.acometida USING btree (zona_id);


--
-- Name: idx_alerta_anomala_acometida; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alerta_anomala_acometida ON public.alerta_lectura_anomala USING btree (acometida_id);


--
-- Name: idx_alerta_anomala_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alerta_anomala_created_at ON public.alerta_lectura_anomala USING btree (created_at);


--
-- Name: idx_alerta_anomala_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alerta_anomala_estado ON public.alerta_lectura_anomala USING btree (estado_revision);


--
-- Name: idx_audit_busqueda; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_busqueda ON public.auditoria_lectura_sector USING btree (mes_lectura, sector_id, completo);


--
-- Name: idx_canton_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_canton_nombre ON public.canton USING btree (nombre);


--
-- Name: idx_canton_provincia_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_canton_provincia_id ON public.canton USING btree (provincia_id);


--
-- Name: idx_categoria_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_categoria_nombre ON public.categoria USING btree (nombre);


--
-- Name: idx_ciudadano_apellidos; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ciudadano_apellidos ON public.ciudadano USING btree (apellidos);


--
-- Name: idx_ciudadano_estado_civil_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ciudadano_estado_civil_id ON public.ciudadano USING btree (estado_civil_id);


--
-- Name: idx_ciudadano_nombres; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ciudadano_nombres ON public.ciudadano USING btree (nombres);


--
-- Name: idx_ciudadano_parroquia_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ciudadano_parroquia_id ON public.ciudadano USING btree (parroquia_id);


--
-- Name: idx_ciudadano_profesion_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ciudadano_profesion_id ON public.ciudadano USING btree (profesion_id);


--
-- Name: idx_ciudadano_sexo_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ciudadano_sexo_id ON public.ciudadano USING btree (sexo_id);


--
-- Name: idx_cliente_persona_natural_ciudadano_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cliente_persona_natural_ciudadano_id ON public.cliente_persona_natural USING btree (ciudadano_id);


--
-- Name: idx_cliente_persona_natural_cliente_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cliente_persona_natural_cliente_id ON public.cliente_persona_natural USING btree (cliente_id);


--
-- Name: idx_cliente_tipo_identificacion_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cliente_tipo_identificacion_id ON public.cliente USING btree (tipo_identificacion_id);


--
-- Name: idx_cliente_usuario_cliente_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cliente_usuario_cliente_id ON public.cliente_usuario USING btree (cliente_id);


--
-- Name: idx_cliente_usuario_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cliente_usuario_created_at ON public.cliente_usuario USING btree (created_at);


--
-- Name: idx_cliente_usuario_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cliente_usuario_deleted_at ON public.cliente_usuario USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: idx_cliente_usuario_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cliente_usuario_email ON public.cliente_usuario USING btree (email);


--
-- Name: idx_cliente_usuario_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cliente_usuario_estado ON public.cliente_usuario USING btree (estado_cliente_usuario_id);


--
-- Name: idx_cliente_usuario_failed_attempts; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cliente_usuario_failed_attempts ON public.cliente_usuario USING btree (failed_attempts);


--
-- Name: idx_cliente_usuario_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cliente_usuario_is_active ON public.cliente_usuario USING btree (is_active);


--
-- Name: idx_cliente_usuario_locked_out; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cliente_usuario_locked_out ON public.cliente_usuario USING btree (cliente_usuario_id) WHERE (is_locked_out = true);


--
-- Name: idx_componentes_fijos_servicio_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_componentes_fijos_servicio_id ON public.componentes_fijos USING btree (servicio_id);


--
-- Name: idx_componentes_fijos_tarifa_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_componentes_fijos_tarifa_id ON public.componentes_fijos USING btree (tarifa_id);


--
-- Name: idx_consumo_promedio_updated_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_consumo_promedio_updated_at ON public.consumo_promedio USING btree (updated_at);


--
-- Name: idx_correo_electronico_cliente_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_correo_electronico_cliente_id ON public.correo_electronico USING btree (cliente_id);


--
-- Name: idx_correo_electronico_correo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_correo_electronico_correo ON public.correo_electronico USING btree (email);


--
-- Name: idx_correo_empresa_correo_electronico_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_correo_empresa_correo_electronico_id ON public.correo_empresa USING btree (correo_electronico_id);


--
-- Name: idx_correo_empresa_empresa_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_correo_empresa_empresa_id ON public.correo_empresa USING btree (empresa_id);


--
-- Name: idx_correo_persona_natural_cliente_persona_natural_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_correo_persona_natural_cliente_persona_natural_id ON public.correo_persona_natural USING btree (cliente_persona_natural_id);


--
-- Name: idx_correo_persona_natural_correo_electronico_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_correo_persona_natural_correo_electronico_id ON public.correo_persona_natural USING btree (correo_electronico_id);


--
-- Name: idx_direccion_parroquia_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_direccion_parroquia_id ON public.direccion USING btree (parroquia_id);


--
-- Name: idx_empleados_cargo_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_empleados_cargo_id ON public.empleados USING btree (cargo_id);


--
-- Name: idx_empleados_ciudadano_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_empleados_ciudadano_id ON public.empleados USING btree (ciudadano_id);


--
-- Name: idx_empleados_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_empleados_deleted_at ON public.empleados USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: idx_empleados_estado_empleado_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_empleados_estado_empleado_id ON public.empleados USING btree (estado_empleado_id);


--
-- Name: idx_empleados_fecha_ingreso; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_empleados_fecha_ingreso ON public.empleados USING btree (fecha_ingreso);


--
-- Name: idx_empleados_usuario_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_empleados_usuario_id ON public.empleados USING btree (usuario_id);


--
-- Name: idx_empresa_cliente_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_empresa_cliente_id ON public.empresa USING btree (cliente_id);


--
-- Name: idx_empresa_nombre_comercial; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_empresa_nombre_comercial ON public.empresa USING btree (nombre_comercial);


--
-- Name: idx_empresa_parroquia_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_empresa_parroquia_id ON public.empresa USING btree (parroquia_id);


--
-- Name: idx_empresa_razon_social; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_empresa_razon_social ON public.empresa USING btree (razon_social);


--
-- Name: idx_empresa_ruc; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_empresa_ruc ON public.empresa USING btree (ruc);


--
-- Name: idx_estado_civil_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_estado_civil_nombre ON public.estado_civil USING btree (nombre);


--
-- Name: idx_estado_pago_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_estado_pago_nombre ON public.estado_pago USING btree (nombre);


--
-- Name: idx_factura_cliente_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_factura_cliente_id ON public.factura USING btree (cliente_id);


--
-- Name: idx_factura_estado_pago_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_factura_estado_pago_id ON public.factura USING btree (estado_pago_id);


--
-- Name: idx_factura_fecha_registro; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_factura_fecha_registro ON public.factura USING btree (fecha_registro);


--
-- Name: idx_factura_fecha_vencimiento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_factura_fecha_vencimiento ON public.factura USING btree (fecha_vencimiento);


--
-- Name: idx_factura_forma_pago_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_factura_forma_pago_id ON public.factura USING btree (forma_pago_id);


--
-- Name: idx_factura_numero_factura; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_factura_numero_factura ON public.factura USING btree (numero_factura);


--
-- Name: idx_forma_pago_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_forma_pago_nombre ON public.forma_pago USING btree (nombre);


--
-- Name: idx_foto_acometida_acometida_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_foto_acometida_acometida_id ON public.foto_acometida USING btree (acometida_id);


--
-- Name: idx_foto_acometida_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_foto_acometida_created_at ON public.foto_acometida USING btree (created_at);


--
-- Name: idx_foto_lectura_clave_catastral; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_foto_lectura_clave_catastral ON public.foto_lectura USING btree (clave_catastral);


--
-- Name: idx_foto_lectura_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_foto_lectura_created_at ON public.foto_lectura USING btree (created_at);


--
-- Name: idx_foto_lectura_lectura_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_foto_lectura_lectura_id ON public.foto_lectura USING btree (lectura_id);


--
-- Name: idx_incidente_medidor_acometida; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_incidente_medidor_acometida ON public.incidente_medidor USING btree (acometida_id);


--
-- Name: idx_incidente_medidor_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_incidente_medidor_estado ON public.incidente_medidor USING btree (estado);


--
-- Name: idx_incidente_medidor_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_incidente_medidor_fecha ON public.incidente_medidor USING btree (fecha_reporte);


--
-- Name: idx_incidente_medidor_origen; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_incidente_medidor_origen ON public.incidente_medidor USING btree (origen_reporte);


--
-- Name: idx_lectura_acometida_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lectura_acometida_id ON public.lectura USING btree (acometida_id);


--
-- Name: idx_lectura_clave_catastral; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lectura_clave_catastral ON public.lectura USING btree (clave_catastral);


--
-- Name: idx_lectura_clave_fecha_desc; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lectura_clave_fecha_desc ON public.lectura USING btree (clave_catastral, fecha_lectura DESC);


--
-- Name: idx_lectura_cuenta; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lectura_cuenta ON public.lectura USING btree (cuenta);


--
-- Name: idx_lectura_estado_codigo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lectura_estado_codigo ON public.lectura_estado USING btree (codigo);


--
-- Name: idx_lectura_estado_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lectura_estado_nombre ON public.lectura_estado USING btree (nombre);


--
-- Name: idx_lectura_estado_tipo_estado_lectura_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lectura_estado_tipo_estado_lectura_id ON public.lectura_estado USING btree (tipo_estado_lectura_id);


--
-- Name: idx_lectura_fecha_lectura; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lectura_fecha_lectura ON public.lectura USING btree (fecha_lectura);


--
-- Name: idx_lectura_lectura_estado_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lectura_lectura_estado_id ON public.lectura USING btree (lectura_estado_id);


--
-- Name: idx_lectura_mes_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lectura_mes_fecha ON public.lectura USING btree (mes_lectura, fecha_lectura);


--
-- Name: idx_lectura_mes_sector_acometida; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lectura_mes_sector_acometida ON public.lectura USING btree (mes_lectura, sector, acometida_id);


--
-- Name: idx_lectura_sector; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lectura_sector ON public.lectura USING btree (sector);


--
-- Name: idx_lectura_tipo_novedad_lectura_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lectura_tipo_novedad_lectura_id ON public.lectura USING btree (tipo_novedad_lectura_id);


--
-- Name: idx_observacion_acometida_acometida_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_observacion_acometida_acometida_id ON public.observacion_acometida USING btree (acometida_id);


--
-- Name: idx_observacion_acometida_fecha_registro; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_observacion_acometida_fecha_registro ON public.observacion_acometida USING btree (fecha_registro);


--
-- Name: idx_observacion_acometida_observacion_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_observacion_acometida_observacion_id ON public.observacion_acometida USING btree (observacion_id);


--
-- Name: idx_observacion_factura_factura_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_observacion_factura_factura_id ON public.observacion_factura USING btree (factura_id);


--
-- Name: idx_observacion_factura_fecha_registro; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_observacion_factura_fecha_registro ON public.observacion_factura USING btree (fecha_registro);


--
-- Name: idx_observacion_factura_observacion_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_observacion_factura_observacion_id ON public.observacion_factura USING btree (observacion_id);


--
-- Name: idx_observacion_lectura_fecha_registro; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_observacion_lectura_fecha_registro ON public.observacion_lectura USING btree (fecha_registro);


--
-- Name: idx_observacion_lectura_lectura_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_observacion_lectura_lectura_id ON public.observacion_lectura USING btree (lectura_id);


--
-- Name: idx_observacion_lectura_observacion_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_observacion_lectura_observacion_id ON public.observacion_lectura USING btree (observacion_id);


--
-- Name: idx_observacion_titulo_observacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_observacion_titulo_observacion ON public.observacion USING btree (titulo_observacion);


--
-- Name: idx_pais_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pais_nombre ON public.pais USING btree (nombre);


--
-- Name: idx_parroquia_canton_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_parroquia_canton_id ON public.parroquia USING btree (canton_id);


--
-- Name: idx_parroquia_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_parroquia_nombre ON public.parroquia USING btree (nombre);


--
-- Name: idx_parroquia_tipo_parroquia_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_parroquia_tipo_parroquia_id ON public.parroquia USING btree (tipo_parroquia_id);


--
-- Name: idx_permisos_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_permisos_nombre ON public.permisos USING btree (nombre);


--
-- Name: idx_predio_altitud; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_predio_altitud ON public.predio USING btree (altitud);


--
-- Name: idx_predio_area_construccion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_predio_area_construccion ON public.predio USING btree (area_construccion);


--
-- Name: idx_predio_area_terreno; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_predio_area_terreno ON public.predio USING btree (area_terreno);


--
-- Name: idx_predio_callejon; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_predio_callejon ON public.predio USING btree (callejon);


--
-- Name: idx_predio_clave_catastral; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_predio_clave_catastral ON public.predio USING btree (clave_catastral);


--
-- Name: idx_predio_cliente_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_predio_cliente_id ON public.predio USING btree (cliente_id);


--
-- Name: idx_predio_coordenadas; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_predio_coordenadas ON public.predio USING gist (coordenadas);


--
-- Name: idx_predio_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_predio_created_at ON public.predio USING btree (created_at);


--
-- Name: idx_predio_direccion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_predio_direccion ON public.predio USING btree (direccion);


--
-- Name: idx_predio_fecha_geolocalizacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_predio_fecha_geolocalizacion ON public.predio USING btree (fecha_geolocalizacion);


--
-- Name: idx_predio_precision; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_predio_precision ON public.predio USING btree ("precision");


--
-- Name: idx_predio_referencia; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_predio_referencia ON public.predio USING btree (referencia);


--
-- Name: idx_predio_sector; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_predio_sector ON public.predio USING btree (sector);


--
-- Name: idx_predio_tipo_predio_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_predio_tipo_predio_id ON public.predio USING btree (tipo_predio_id);


--
-- Name: idx_predio_updated_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_predio_updated_at ON public.predio USING btree (updated_at);


--
-- Name: idx_predio_valor_comercial; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_predio_valor_comercial ON public.predio USING btree (valor_comercial);


--
-- Name: idx_predio_valor_construccion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_predio_valor_construccion ON public.predio USING btree (valor_construccion);


--
-- Name: idx_predio_valor_terreno; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_predio_valor_terreno ON public.predio USING btree (valor_terreno);


--
-- Name: idx_predio_zona_geometrica; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_predio_zona_geometrica ON public.predio USING gist (zona_geometrica);


--
-- Name: idx_profesion_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_profesion_nombre ON public.profesion USING btree (nombre);


--
-- Name: idx_provincia_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_provincia_nombre ON public.provincia USING btree (nombre);


--
-- Name: idx_provincia_pais_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_provincia_pais_id ON public.provincia USING btree (pais_id);


--
-- Name: idx_qrcode_acometida_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_qrcode_acometida_id ON public.qrcode USING btree (acometida_id);


--
-- Name: idx_qrcode_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_qrcode_created_at ON public.qrcode USING btree (created_at);


--
-- Name: idx_rangos_variables_servicio_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rangos_variables_servicio_id ON public.rangos_variables USING btree (servicio_id);


--
-- Name: idx_rangos_variables_tarifa_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rangos_variables_tarifa_id ON public.rangos_variables USING btree (tarifa_id, min_consumo);


--
-- Name: idx_refresh_expires; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_refresh_expires ON public.refresh_tokens USING btree (expires_at);


--
-- Name: idx_refresh_revoked; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_refresh_revoked ON public.refresh_tokens USING btree (revoked) WHERE (revoked = false);


--
-- Name: idx_refresh_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_refresh_user ON public.refresh_tokens USING btree (usuario_id);


--
-- Name: idx_rol_permisos_permiso_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rol_permisos_permiso_id ON public.rol_permisos USING btree (permiso_id);


--
-- Name: idx_rol_permisos_rol_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rol_permisos_rol_id ON public.rol_permisos USING btree (rol_id);


--
-- Name: idx_roles_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_roles_nombre ON public.roles USING btree (nombre);


--
-- Name: idx_roles_parent_rol_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_roles_parent_rol_id ON public.roles USING btree (parent_rol_id);


--
-- Name: idx_seguimiento_lectura_acometida_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_seguimiento_lectura_acometida_id ON public.seguimiento_lectura USING btree (acometida_id);


--
-- Name: idx_seguimiento_lectura_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_seguimiento_lectura_created_at ON public.seguimiento_lectura USING btree (created_at);


--
-- Name: idx_seguimiento_lectura_lectura_estado_anterior_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_seguimiento_lectura_lectura_estado_anterior_id ON public.seguimiento_lectura USING btree (lectura_estado_anterior_id);


--
-- Name: idx_seguimiento_lectura_lectura_estado_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_seguimiento_lectura_lectura_estado_id ON public.seguimiento_lectura USING btree (lectura_estado_id);


--
-- Name: idx_seguimiento_lectura_lectura_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_seguimiento_lectura_lectura_id ON public.seguimiento_lectura USING btree (lectura_id);


--
-- Name: idx_seguimiento_lectura_usuario_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_seguimiento_lectura_usuario_id ON public.seguimiento_lectura USING btree (usuario_id);


--
-- Name: idx_servicio_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_servicio_nombre ON public.servicio USING btree (nombre);


--
-- Name: idx_sexo_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sexo_nombre ON public.sexo USING btree (nombre);


--
-- Name: idx_siguiente_lectura_acometida_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_siguiente_lectura_acometida_id ON public.siguiente_lectura USING btree (acometida_id);


--
-- Name: idx_siguiente_lectura_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_siguiente_lectura_created_at ON public.siguiente_lectura USING btree (created_at);


--
-- Name: idx_siguiente_lectura_fecha_siguiente_lectura; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_siguiente_lectura_fecha_siguiente_lectura ON public.siguiente_lectura USING btree (fecha_siguiente_lectura);


--
-- Name: idx_siguiente_lectura_ultima_lectura_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_siguiente_lectura_ultima_lectura_id ON public.siguiente_lectura USING btree (ultima_lectura_id);


--
-- Name: idx_tarifa_categoria_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tarifa_categoria_id ON public.tarifa USING btree (categoria_id);


--
-- Name: idx_tarifa_effective_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tarifa_effective_date ON public.tarifa USING btree (effective_date, categoria_id);


--
-- Name: idx_telefono_cliente_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_telefono_cliente_id ON public.telefono USING btree (cliente_id);


--
-- Name: idx_telefono_empresa_empresa_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_telefono_empresa_empresa_id ON public.telefono_empresa USING btree (empresa_id);


--
-- Name: idx_telefono_empresa_telefono_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_telefono_empresa_telefono_id ON public.telefono_empresa USING btree (telefono_id);


--
-- Name: idx_telefono_numero; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_telefono_numero ON public.telefono USING btree (numero);


--
-- Name: idx_telefono_persona_natural_cliente_persona_natural_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_telefono_persona_natural_cliente_persona_natural_id ON public.telefono_persona_natural USING btree (cliente_persona_natural_id);


--
-- Name: idx_telefono_persona_natural_telefono_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_telefono_persona_natural_telefono_id ON public.telefono_persona_natural USING btree (telefono_id);


--
-- Name: idx_telefono_tipo_telefono_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_telefono_tipo_telefono_id ON public.telefono USING btree (tipo_telefono_id);


--
-- Name: idx_tipo_estado_lectura_codigo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tipo_estado_lectura_codigo ON public.tipo_estado_lectura USING btree (codigo);


--
-- Name: idx_tipo_estado_lectura_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tipo_estado_lectura_nombre ON public.tipo_estado_lectura USING btree (nombre);


--
-- Name: idx_tipo_identificacion_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tipo_identificacion_nombre ON public.tipo_identificacion USING btree (nombre);


--
-- Name: idx_tipo_incidente_categoria; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tipo_incidente_categoria ON public.tipo_incidente_medidor USING btree (categoria_incidente_id);


--
-- Name: idx_tipo_novedad_lectura_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tipo_novedad_lectura_nombre ON public.tipo_novedad_lectura USING btree (nombre);


--
-- Name: idx_tipo_parroquia_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tipo_parroquia_nombre ON public.tipo_parroquia USING btree (nombre);


--
-- Name: idx_tipo_relacion_familiar_parentesco; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tipo_relacion_familiar_parentesco ON public.tipo_relacion_familiar USING btree (parentesco);


--
-- Name: idx_tipo_telefono_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tipo_telefono_nombre ON public.tipo_telefono USING btree (nombre);


--
-- Name: idx_tipo_titulo_dato_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tipo_titulo_dato_nombre ON public.tipo_titulo_dato USING btree (nombre);


--
-- Name: idx_titulo_dato_cliente_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_titulo_dato_cliente_id ON public.titulo_dato USING btree (cliente_id);


--
-- Name: idx_titulo_dato_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_titulo_dato_estado ON public.titulo_dato USING btree (estado);


--
-- Name: idx_titulo_dato_fecha_emision; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_titulo_dato_fecha_emision ON public.titulo_dato USING btree (fecha_emision);


--
-- Name: idx_titulo_dato_fecha_vencimiento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_titulo_dato_fecha_vencimiento ON public.titulo_dato USING btree (fecha_vencimiento);


--
-- Name: idx_titulo_dato_tipo_titulo_dato_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_titulo_dato_tipo_titulo_dato_id ON public.titulo_dato USING btree (tipo_titulo_dato_id);


--
-- Name: idx_usuario_factura_factura_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuario_factura_factura_id ON public.usuario_factura USING btree (factura_id);


--
-- Name: idx_usuario_factura_fecha_registro; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuario_factura_fecha_registro ON public.usuario_factura USING btree (fecha_registro);


--
-- Name: idx_usuario_factura_usuario_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuario_factura_usuario_id ON public.usuario_factura USING btree (usuario_id);


--
-- Name: idx_usuario_lectura_lectura_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuario_lectura_lectura_id ON public.usuario_lectura USING btree (lectura_id);


--
-- Name: idx_usuario_lectura_usuario_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuario_lectura_usuario_id ON public.usuario_lectura USING btree (usuario_id);


--
-- Name: idx_usuario_permisos_permiso_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuario_permisos_permiso_id ON public.usuario_permisos USING btree (permiso_id);


--
-- Name: idx_usuario_permisos_usuario_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuario_permisos_usuario_id ON public.usuario_permisos USING btree (usuario_id);


--
-- Name: idx_usuario_roles_rol_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuario_roles_rol_id ON public.usuario_roles USING btree (rol_id);


--
-- Name: idx_usuario_roles_usuario_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuario_roles_usuario_id ON public.usuario_roles USING btree (usuario_id);


--
-- Name: idx_usuarios_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_created_at ON public.usuarios USING btree (created_at);


--
-- Name: idx_usuarios_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_deleted_at ON public.usuarios USING btree (deleted_at);


--
-- Name: idx_usuarios_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_email ON public.usuarios USING btree (email);


--
-- Name: idx_usuarios_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_estado ON public.usuarios USING btree (estado_usuario_id);


--
-- Name: idx_usuarios_failed_att; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_failed_att ON public.usuarios USING btree (failed_attempts);


--
-- Name: idx_usuarios_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_is_active ON public.usuarios USING btree (is_active);


--
-- Name: idx_usuarios_locked_out; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_locked_out ON public.usuarios USING btree (is_locked_out);


--
-- Name: idx_usuarios_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_username ON public.usuarios USING btree (username);


--
-- Name: idx_verificar_cuenta_cliente_usuario_activo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_verificar_cuenta_cliente_usuario_activo ON public.verificar_cuenta_cliente USING btree (cliente_usuario_id, activo, fecha_expiracion) WHERE (activo = true);


--
-- Name: idx_verificar_cuenta_token_unico; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_verificar_cuenta_token_unico ON public.verificar_cuenta_cliente USING btree (token) WHERE ((token IS NOT NULL) AND (activo = true));


--
-- Name: idx_zona_codigo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_zona_codigo ON public.zona USING btree (codigo);


--
-- Name: idx_zona_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_zona_nombre ON public.zona USING btree (nombre);


--
-- Name: idx_aot_orden; Type: INDEX; Schema: work_orders; Owner: postgres
--

CREATE INDEX idx_aot_orden ON work_orders.adjuntos_orden_trabajo USING btree (id_orden_trabajo) WHERE (is_deleted = false);


--
-- Name: idx_ato_orden; Type: INDEX; Schema: work_orders; Owner: postgres
--

CREATE INDEX idx_ato_orden ON work_orders.asignacion_trabajador_orden USING btree (id_orden_trabajo) WHERE (is_deleted = false);


--
-- Name: idx_ato_responsable; Type: INDEX; Schema: work_orders; Owner: postgres
--

CREATE INDEX idx_ato_responsable ON work_orders.asignacion_trabajador_orden USING btree (id_orden_trabajo, es_responsable) WHERE ((is_deleted = false) AND (es_responsable = true));


--
-- Name: idx_ato_trabajador; Type: INDEX; Schema: work_orders; Owner: postgres
--

CREATE INDEX idx_ato_trabajador ON work_orders.asignacion_trabajador_orden USING btree (id_trabajador) WHERE (is_deleted = false);


--
-- Name: idx_caot_orden; Type: INDEX; Schema: work_orders; Owner: postgres
--

CREATE INDEX idx_caot_orden ON work_orders.costo_adicional_orden USING btree (id_orden_trabajo) WHERE (is_deleted = false);


--
-- Name: idx_cc_orden; Type: INDEX; Schema: work_orders; Owner: postgres
--

CREATE INDEX idx_cc_orden ON work_orders.control_calidad USING btree (id_orden_trabajo) WHERE (is_deleted = false);


--
-- Name: idx_cs_orden; Type: INDEX; Schema: work_orders; Owner: postgres
--

CREATE INDEX idx_cs_orden ON work_orders.corte_servicio USING btree (id_orden_trabajo) WHERE (is_deleted = false);


--
-- Name: idx_dotm_orden; Type: INDEX; Schema: work_orders; Owner: postgres
--

CREATE INDEX idx_dotm_orden ON work_orders.detalle_orden_trabajo_material USING btree (id_orden_trabajo) WHERE (is_deleted = false);


--
-- Name: idx_esot_orden; Type: INDEX; Schema: work_orders; Owner: postgres
--

CREATE INDEX idx_esot_orden ON work_orders.encuesta_satisfaccion USING btree (id_orden_trabajo) WHERE (is_deleted = false);


--
-- Name: idx_heot_fecha; Type: INDEX; Schema: work_orders; Owner: postgres
--

CREATE INDEX idx_heot_fecha ON work_orders.historial_estado_orden_trabajo USING btree (fecha_cambio DESC);


--
-- Name: idx_heot_orden; Type: INDEX; Schema: work_orders; Owner: postgres
--

CREATE INDEX idx_heot_orden ON work_orders.historial_estado_orden_trabajo USING btree (id_orden_trabajo);


--
-- Name: idx_ip_orden; Type: INDEX; Schema: work_orders; Owner: postgres
--

CREATE INDEX idx_ip_orden ON work_orders.inspeccion_preparacion USING btree (id_orden_trabajo) WHERE (is_deleted = false);


--
-- Name: idx_oot_orden; Type: INDEX; Schema: work_orders; Owner: postgres
--

CREATE INDEX idx_oot_orden ON work_orders.observaciones_orden_trabajo USING btree (id_orden_trabajo) WHERE (is_deleted = false);


--
-- Name: idx_ot_cliente; Type: INDEX; Schema: work_orders; Owner: postgres
--

CREATE INDEX idx_ot_cliente ON work_orders.orden_trabajo USING btree (id_cliente) WHERE (is_deleted = false);


--
-- Name: idx_ot_estado; Type: INDEX; Schema: work_orders; Owner: postgres
--

CREATE INDEX idx_ot_estado ON work_orders.orden_trabajo USING btree (estado) WHERE (is_deleted = false);


--
-- Name: idx_ot_geom_area; Type: INDEX; Schema: work_orders; Owner: postgres
--

CREATE INDEX idx_ot_geom_area ON work_orders.orden_trabajo USING gist (geom_area);


--
-- Name: idx_ot_geom_punto; Type: INDEX; Schema: work_orders; Owner: postgres
--

CREATE INDEX idx_ot_geom_punto ON work_orders.orden_trabajo USING gist (geom_punto);


--
-- Name: idx_ot_geom_trazado; Type: INDEX; Schema: work_orders; Owner: postgres
--

CREATE INDEX idx_ot_geom_trazado ON work_orders.orden_trabajo USING gist (geom_trazado);


--
-- Name: idx_ot_individual; Type: INDEX; Schema: work_orders; Owner: postgres
--

CREATE INDEX idx_ot_individual ON work_orders.orden_trabajo USING btree (usuario_asignado) WHERE ((usuario_asignado IS NOT NULL) AND (is_deleted = false));


--
-- Name: idx_ot_metadata; Type: INDEX; Schema: work_orders; Owner: postgres
--

CREATE INDEX idx_ot_metadata ON work_orders.orden_trabajo USING gin (metadata);


--
-- Name: idx_ot_padre; Type: INDEX; Schema: work_orders; Owner: postgres
--

CREATE INDEX idx_ot_padre ON work_orders.orden_trabajo USING btree (id_orden_padre) WHERE (id_orden_padre IS NOT NULL);


--
-- Name: registro_2024_01_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2024_01_audit_timestamp_idx;


--
-- Name: registro_2024_01_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2024_01_diff_jsonb_idx;


--
-- Name: registro_2024_01_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2024_01_operacion_audit_timestamp_idx;


--
-- Name: registro_2024_01_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2024_01_pk_valor_idx;


--
-- Name: registro_2024_01_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2024_01_pkey;


--
-- Name: registro_2024_01_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2024_01_sesion_id_idx;


--
-- Name: registro_2024_01_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2024_01_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2024_01_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2024_01_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2024_02_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2024_02_audit_timestamp_idx;


--
-- Name: registro_2024_02_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2024_02_diff_jsonb_idx;


--
-- Name: registro_2024_02_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2024_02_operacion_audit_timestamp_idx;


--
-- Name: registro_2024_02_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2024_02_pk_valor_idx;


--
-- Name: registro_2024_02_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2024_02_pkey;


--
-- Name: registro_2024_02_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2024_02_sesion_id_idx;


--
-- Name: registro_2024_02_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2024_02_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2024_02_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2024_02_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2024_03_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2024_03_audit_timestamp_idx;


--
-- Name: registro_2024_03_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2024_03_diff_jsonb_idx;


--
-- Name: registro_2024_03_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2024_03_operacion_audit_timestamp_idx;


--
-- Name: registro_2024_03_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2024_03_pk_valor_idx;


--
-- Name: registro_2024_03_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2024_03_pkey;


--
-- Name: registro_2024_03_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2024_03_sesion_id_idx;


--
-- Name: registro_2024_03_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2024_03_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2024_03_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2024_03_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2024_04_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2024_04_audit_timestamp_idx;


--
-- Name: registro_2024_04_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2024_04_diff_jsonb_idx;


--
-- Name: registro_2024_04_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2024_04_operacion_audit_timestamp_idx;


--
-- Name: registro_2024_04_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2024_04_pk_valor_idx;


--
-- Name: registro_2024_04_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2024_04_pkey;


--
-- Name: registro_2024_04_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2024_04_sesion_id_idx;


--
-- Name: registro_2024_04_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2024_04_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2024_04_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2024_04_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2024_05_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2024_05_audit_timestamp_idx;


--
-- Name: registro_2024_05_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2024_05_diff_jsonb_idx;


--
-- Name: registro_2024_05_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2024_05_operacion_audit_timestamp_idx;


--
-- Name: registro_2024_05_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2024_05_pk_valor_idx;


--
-- Name: registro_2024_05_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2024_05_pkey;


--
-- Name: registro_2024_05_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2024_05_sesion_id_idx;


--
-- Name: registro_2024_05_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2024_05_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2024_05_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2024_05_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2024_06_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2024_06_audit_timestamp_idx;


--
-- Name: registro_2024_06_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2024_06_diff_jsonb_idx;


--
-- Name: registro_2024_06_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2024_06_operacion_audit_timestamp_idx;


--
-- Name: registro_2024_06_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2024_06_pk_valor_idx;


--
-- Name: registro_2024_06_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2024_06_pkey;


--
-- Name: registro_2024_06_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2024_06_sesion_id_idx;


--
-- Name: registro_2024_06_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2024_06_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2024_06_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2024_06_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2024_07_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2024_07_audit_timestamp_idx;


--
-- Name: registro_2024_07_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2024_07_diff_jsonb_idx;


--
-- Name: registro_2024_07_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2024_07_operacion_audit_timestamp_idx;


--
-- Name: registro_2024_07_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2024_07_pk_valor_idx;


--
-- Name: registro_2024_07_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2024_07_pkey;


--
-- Name: registro_2024_07_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2024_07_sesion_id_idx;


--
-- Name: registro_2024_07_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2024_07_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2024_07_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2024_07_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2024_08_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2024_08_audit_timestamp_idx;


--
-- Name: registro_2024_08_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2024_08_diff_jsonb_idx;


--
-- Name: registro_2024_08_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2024_08_operacion_audit_timestamp_idx;


--
-- Name: registro_2024_08_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2024_08_pk_valor_idx;


--
-- Name: registro_2024_08_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2024_08_pkey;


--
-- Name: registro_2024_08_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2024_08_sesion_id_idx;


--
-- Name: registro_2024_08_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2024_08_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2024_08_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2024_08_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2024_09_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2024_09_audit_timestamp_idx;


--
-- Name: registro_2024_09_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2024_09_diff_jsonb_idx;


--
-- Name: registro_2024_09_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2024_09_operacion_audit_timestamp_idx;


--
-- Name: registro_2024_09_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2024_09_pk_valor_idx;


--
-- Name: registro_2024_09_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2024_09_pkey;


--
-- Name: registro_2024_09_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2024_09_sesion_id_idx;


--
-- Name: registro_2024_09_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2024_09_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2024_09_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2024_09_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2024_10_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2024_10_audit_timestamp_idx;


--
-- Name: registro_2024_10_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2024_10_diff_jsonb_idx;


--
-- Name: registro_2024_10_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2024_10_operacion_audit_timestamp_idx;


--
-- Name: registro_2024_10_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2024_10_pk_valor_idx;


--
-- Name: registro_2024_10_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2024_10_pkey;


--
-- Name: registro_2024_10_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2024_10_sesion_id_idx;


--
-- Name: registro_2024_10_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2024_10_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2024_10_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2024_10_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2024_11_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2024_11_audit_timestamp_idx;


--
-- Name: registro_2024_11_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2024_11_diff_jsonb_idx;


--
-- Name: registro_2024_11_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2024_11_operacion_audit_timestamp_idx;


--
-- Name: registro_2024_11_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2024_11_pk_valor_idx;


--
-- Name: registro_2024_11_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2024_11_pkey;


--
-- Name: registro_2024_11_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2024_11_sesion_id_idx;


--
-- Name: registro_2024_11_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2024_11_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2024_11_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2024_11_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2024_12_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2024_12_audit_timestamp_idx;


--
-- Name: registro_2024_12_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2024_12_diff_jsonb_idx;


--
-- Name: registro_2024_12_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2024_12_operacion_audit_timestamp_idx;


--
-- Name: registro_2024_12_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2024_12_pk_valor_idx;


--
-- Name: registro_2024_12_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2024_12_pkey;


--
-- Name: registro_2024_12_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2024_12_sesion_id_idx;


--
-- Name: registro_2024_12_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2024_12_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2024_12_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2024_12_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2025_01_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2025_01_audit_timestamp_idx;


--
-- Name: registro_2025_01_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2025_01_diff_jsonb_idx;


--
-- Name: registro_2025_01_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2025_01_operacion_audit_timestamp_idx;


--
-- Name: registro_2025_01_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2025_01_pk_valor_idx;


--
-- Name: registro_2025_01_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2025_01_pkey;


--
-- Name: registro_2025_01_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2025_01_sesion_id_idx;


--
-- Name: registro_2025_01_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2025_01_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2025_01_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2025_01_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2025_02_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2025_02_audit_timestamp_idx;


--
-- Name: registro_2025_02_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2025_02_diff_jsonb_idx;


--
-- Name: registro_2025_02_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2025_02_operacion_audit_timestamp_idx;


--
-- Name: registro_2025_02_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2025_02_pk_valor_idx;


--
-- Name: registro_2025_02_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2025_02_pkey;


--
-- Name: registro_2025_02_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2025_02_sesion_id_idx;


--
-- Name: registro_2025_02_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2025_02_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2025_02_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2025_02_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2025_03_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2025_03_audit_timestamp_idx;


--
-- Name: registro_2025_03_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2025_03_diff_jsonb_idx;


--
-- Name: registro_2025_03_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2025_03_operacion_audit_timestamp_idx;


--
-- Name: registro_2025_03_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2025_03_pk_valor_idx;


--
-- Name: registro_2025_03_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2025_03_pkey;


--
-- Name: registro_2025_03_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2025_03_sesion_id_idx;


--
-- Name: registro_2025_03_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2025_03_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2025_03_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2025_03_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2025_04_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2025_04_audit_timestamp_idx;


--
-- Name: registro_2025_04_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2025_04_diff_jsonb_idx;


--
-- Name: registro_2025_04_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2025_04_operacion_audit_timestamp_idx;


--
-- Name: registro_2025_04_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2025_04_pk_valor_idx;


--
-- Name: registro_2025_04_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2025_04_pkey;


--
-- Name: registro_2025_04_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2025_04_sesion_id_idx;


--
-- Name: registro_2025_04_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2025_04_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2025_04_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2025_04_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2025_05_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2025_05_audit_timestamp_idx;


--
-- Name: registro_2025_05_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2025_05_diff_jsonb_idx;


--
-- Name: registro_2025_05_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2025_05_operacion_audit_timestamp_idx;


--
-- Name: registro_2025_05_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2025_05_pk_valor_idx;


--
-- Name: registro_2025_05_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2025_05_pkey;


--
-- Name: registro_2025_05_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2025_05_sesion_id_idx;


--
-- Name: registro_2025_05_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2025_05_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2025_05_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2025_05_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2025_06_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2025_06_audit_timestamp_idx;


--
-- Name: registro_2025_06_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2025_06_diff_jsonb_idx;


--
-- Name: registro_2025_06_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2025_06_operacion_audit_timestamp_idx;


--
-- Name: registro_2025_06_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2025_06_pk_valor_idx;


--
-- Name: registro_2025_06_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2025_06_pkey;


--
-- Name: registro_2025_06_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2025_06_sesion_id_idx;


--
-- Name: registro_2025_06_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2025_06_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2025_06_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2025_06_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2025_07_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2025_07_audit_timestamp_idx;


--
-- Name: registro_2025_07_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2025_07_diff_jsonb_idx;


--
-- Name: registro_2025_07_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2025_07_operacion_audit_timestamp_idx;


--
-- Name: registro_2025_07_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2025_07_pk_valor_idx;


--
-- Name: registro_2025_07_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2025_07_pkey;


--
-- Name: registro_2025_07_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2025_07_sesion_id_idx;


--
-- Name: registro_2025_07_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2025_07_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2025_07_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2025_07_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2025_08_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2025_08_audit_timestamp_idx;


--
-- Name: registro_2025_08_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2025_08_diff_jsonb_idx;


--
-- Name: registro_2025_08_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2025_08_operacion_audit_timestamp_idx;


--
-- Name: registro_2025_08_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2025_08_pk_valor_idx;


--
-- Name: registro_2025_08_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2025_08_pkey;


--
-- Name: registro_2025_08_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2025_08_sesion_id_idx;


--
-- Name: registro_2025_08_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2025_08_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2025_08_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2025_08_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2025_09_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2025_09_audit_timestamp_idx;


--
-- Name: registro_2025_09_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2025_09_diff_jsonb_idx;


--
-- Name: registro_2025_09_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2025_09_operacion_audit_timestamp_idx;


--
-- Name: registro_2025_09_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2025_09_pk_valor_idx;


--
-- Name: registro_2025_09_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2025_09_pkey;


--
-- Name: registro_2025_09_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2025_09_sesion_id_idx;


--
-- Name: registro_2025_09_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2025_09_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2025_09_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2025_09_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2025_10_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2025_10_audit_timestamp_idx;


--
-- Name: registro_2025_10_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2025_10_diff_jsonb_idx;


--
-- Name: registro_2025_10_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2025_10_operacion_audit_timestamp_idx;


--
-- Name: registro_2025_10_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2025_10_pk_valor_idx;


--
-- Name: registro_2025_10_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2025_10_pkey;


--
-- Name: registro_2025_10_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2025_10_sesion_id_idx;


--
-- Name: registro_2025_10_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2025_10_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2025_10_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2025_10_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2025_11_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2025_11_audit_timestamp_idx;


--
-- Name: registro_2025_11_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2025_11_diff_jsonb_idx;


--
-- Name: registro_2025_11_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2025_11_operacion_audit_timestamp_idx;


--
-- Name: registro_2025_11_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2025_11_pk_valor_idx;


--
-- Name: registro_2025_11_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2025_11_pkey;


--
-- Name: registro_2025_11_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2025_11_sesion_id_idx;


--
-- Name: registro_2025_11_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2025_11_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2025_11_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2025_11_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2025_12_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2025_12_audit_timestamp_idx;


--
-- Name: registro_2025_12_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2025_12_diff_jsonb_idx;


--
-- Name: registro_2025_12_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2025_12_operacion_audit_timestamp_idx;


--
-- Name: registro_2025_12_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2025_12_pk_valor_idx;


--
-- Name: registro_2025_12_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2025_12_pkey;


--
-- Name: registro_2025_12_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2025_12_sesion_id_idx;


--
-- Name: registro_2025_12_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2025_12_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2025_12_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2025_12_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2026_01_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2026_01_audit_timestamp_idx;


--
-- Name: registro_2026_01_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2026_01_diff_jsonb_idx;


--
-- Name: registro_2026_01_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2026_01_operacion_audit_timestamp_idx;


--
-- Name: registro_2026_01_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2026_01_pk_valor_idx;


--
-- Name: registro_2026_01_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2026_01_pkey;


--
-- Name: registro_2026_01_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2026_01_sesion_id_idx;


--
-- Name: registro_2026_01_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2026_01_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2026_01_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2026_01_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2026_02_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2026_02_audit_timestamp_idx;


--
-- Name: registro_2026_02_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2026_02_diff_jsonb_idx;


--
-- Name: registro_2026_02_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2026_02_operacion_audit_timestamp_idx;


--
-- Name: registro_2026_02_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2026_02_pk_valor_idx;


--
-- Name: registro_2026_02_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2026_02_pkey;


--
-- Name: registro_2026_02_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2026_02_sesion_id_idx;


--
-- Name: registro_2026_02_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2026_02_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2026_02_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2026_02_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2026_03_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2026_03_audit_timestamp_idx;


--
-- Name: registro_2026_03_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2026_03_diff_jsonb_idx;


--
-- Name: registro_2026_03_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2026_03_operacion_audit_timestamp_idx;


--
-- Name: registro_2026_03_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2026_03_pk_valor_idx;


--
-- Name: registro_2026_03_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2026_03_pkey;


--
-- Name: registro_2026_03_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2026_03_sesion_id_idx;


--
-- Name: registro_2026_03_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2026_03_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2026_03_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2026_03_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2026_04_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2026_04_audit_timestamp_idx;


--
-- Name: registro_2026_04_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2026_04_diff_jsonb_idx;


--
-- Name: registro_2026_04_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2026_04_operacion_audit_timestamp_idx;


--
-- Name: registro_2026_04_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2026_04_pk_valor_idx;


--
-- Name: registro_2026_04_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2026_04_pkey;


--
-- Name: registro_2026_04_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2026_04_sesion_id_idx;


--
-- Name: registro_2026_04_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2026_04_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2026_04_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2026_04_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2026_05_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2026_05_audit_timestamp_idx;


--
-- Name: registro_2026_05_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2026_05_diff_jsonb_idx;


--
-- Name: registro_2026_05_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2026_05_operacion_audit_timestamp_idx;


--
-- Name: registro_2026_05_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2026_05_pk_valor_idx;


--
-- Name: registro_2026_05_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2026_05_pkey;


--
-- Name: registro_2026_05_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2026_05_sesion_id_idx;


--
-- Name: registro_2026_05_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2026_05_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2026_05_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2026_05_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2026_06_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2026_06_audit_timestamp_idx;


--
-- Name: registro_2026_06_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2026_06_diff_jsonb_idx;


--
-- Name: registro_2026_06_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2026_06_operacion_audit_timestamp_idx;


--
-- Name: registro_2026_06_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2026_06_pk_valor_idx;


--
-- Name: registro_2026_06_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2026_06_pkey;


--
-- Name: registro_2026_06_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2026_06_sesion_id_idx;


--
-- Name: registro_2026_06_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2026_06_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2026_06_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2026_06_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2026_07_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2026_07_audit_timestamp_idx;


--
-- Name: registro_2026_07_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2026_07_diff_jsonb_idx;


--
-- Name: registro_2026_07_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2026_07_operacion_audit_timestamp_idx;


--
-- Name: registro_2026_07_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2026_07_pk_valor_idx;


--
-- Name: registro_2026_07_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2026_07_pkey;


--
-- Name: registro_2026_07_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2026_07_sesion_id_idx;


--
-- Name: registro_2026_07_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2026_07_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2026_07_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2026_07_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2026_08_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2026_08_audit_timestamp_idx;


--
-- Name: registro_2026_08_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2026_08_diff_jsonb_idx;


--
-- Name: registro_2026_08_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2026_08_operacion_audit_timestamp_idx;


--
-- Name: registro_2026_08_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2026_08_pk_valor_idx;


--
-- Name: registro_2026_08_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2026_08_pkey;


--
-- Name: registro_2026_08_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2026_08_sesion_id_idx;


--
-- Name: registro_2026_08_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2026_08_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2026_08_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2026_08_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2026_09_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2026_09_audit_timestamp_idx;


--
-- Name: registro_2026_09_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2026_09_diff_jsonb_idx;


--
-- Name: registro_2026_09_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2026_09_operacion_audit_timestamp_idx;


--
-- Name: registro_2026_09_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2026_09_pk_valor_idx;


--
-- Name: registro_2026_09_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2026_09_pkey;


--
-- Name: registro_2026_09_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2026_09_sesion_id_idx;


--
-- Name: registro_2026_09_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2026_09_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2026_09_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2026_09_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2026_10_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2026_10_audit_timestamp_idx;


--
-- Name: registro_2026_10_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2026_10_diff_jsonb_idx;


--
-- Name: registro_2026_10_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2026_10_operacion_audit_timestamp_idx;


--
-- Name: registro_2026_10_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2026_10_pk_valor_idx;


--
-- Name: registro_2026_10_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2026_10_pkey;


--
-- Name: registro_2026_10_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2026_10_sesion_id_idx;


--
-- Name: registro_2026_10_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2026_10_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2026_10_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2026_10_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2026_11_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2026_11_audit_timestamp_idx;


--
-- Name: registro_2026_11_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2026_11_diff_jsonb_idx;


--
-- Name: registro_2026_11_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2026_11_operacion_audit_timestamp_idx;


--
-- Name: registro_2026_11_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2026_11_pk_valor_idx;


--
-- Name: registro_2026_11_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2026_11_pkey;


--
-- Name: registro_2026_11_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2026_11_sesion_id_idx;


--
-- Name: registro_2026_11_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2026_11_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2026_11_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2026_11_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2026_12_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2026_12_audit_timestamp_idx;


--
-- Name: registro_2026_12_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2026_12_diff_jsonb_idx;


--
-- Name: registro_2026_12_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2026_12_operacion_audit_timestamp_idx;


--
-- Name: registro_2026_12_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2026_12_pk_valor_idx;


--
-- Name: registro_2026_12_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2026_12_pkey;


--
-- Name: registro_2026_12_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2026_12_sesion_id_idx;


--
-- Name: registro_2026_12_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2026_12_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2026_12_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2026_12_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2027_01_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2027_01_audit_timestamp_idx;


--
-- Name: registro_2027_01_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2027_01_diff_jsonb_idx;


--
-- Name: registro_2027_01_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2027_01_operacion_audit_timestamp_idx;


--
-- Name: registro_2027_01_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2027_01_pk_valor_idx;


--
-- Name: registro_2027_01_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2027_01_pkey;


--
-- Name: registro_2027_01_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2027_01_sesion_id_idx;


--
-- Name: registro_2027_01_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2027_01_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2027_01_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2027_01_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2027_02_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2027_02_audit_timestamp_idx;


--
-- Name: registro_2027_02_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2027_02_diff_jsonb_idx;


--
-- Name: registro_2027_02_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2027_02_operacion_audit_timestamp_idx;


--
-- Name: registro_2027_02_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2027_02_pk_valor_idx;


--
-- Name: registro_2027_02_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2027_02_pkey;


--
-- Name: registro_2027_02_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2027_02_sesion_id_idx;


--
-- Name: registro_2027_02_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2027_02_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2027_02_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2027_02_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2027_03_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2027_03_audit_timestamp_idx;


--
-- Name: registro_2027_03_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2027_03_diff_jsonb_idx;


--
-- Name: registro_2027_03_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2027_03_operacion_audit_timestamp_idx;


--
-- Name: registro_2027_03_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2027_03_pk_valor_idx;


--
-- Name: registro_2027_03_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2027_03_pkey;


--
-- Name: registro_2027_03_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2027_03_sesion_id_idx;


--
-- Name: registro_2027_03_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2027_03_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2027_03_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2027_03_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2027_04_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2027_04_audit_timestamp_idx;


--
-- Name: registro_2027_04_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2027_04_diff_jsonb_idx;


--
-- Name: registro_2027_04_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2027_04_operacion_audit_timestamp_idx;


--
-- Name: registro_2027_04_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2027_04_pk_valor_idx;


--
-- Name: registro_2027_04_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2027_04_pkey;


--
-- Name: registro_2027_04_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2027_04_sesion_id_idx;


--
-- Name: registro_2027_04_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2027_04_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2027_04_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2027_04_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2027_05_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2027_05_audit_timestamp_idx;


--
-- Name: registro_2027_05_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2027_05_diff_jsonb_idx;


--
-- Name: registro_2027_05_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2027_05_operacion_audit_timestamp_idx;


--
-- Name: registro_2027_05_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2027_05_pk_valor_idx;


--
-- Name: registro_2027_05_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2027_05_pkey;


--
-- Name: registro_2027_05_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2027_05_sesion_id_idx;


--
-- Name: registro_2027_05_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2027_05_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2027_05_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2027_05_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2027_06_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2027_06_audit_timestamp_idx;


--
-- Name: registro_2027_06_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2027_06_diff_jsonb_idx;


--
-- Name: registro_2027_06_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2027_06_operacion_audit_timestamp_idx;


--
-- Name: registro_2027_06_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2027_06_pk_valor_idx;


--
-- Name: registro_2027_06_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2027_06_pkey;


--
-- Name: registro_2027_06_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2027_06_sesion_id_idx;


--
-- Name: registro_2027_06_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2027_06_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2027_06_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2027_06_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2027_07_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2027_07_audit_timestamp_idx;


--
-- Name: registro_2027_07_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2027_07_diff_jsonb_idx;


--
-- Name: registro_2027_07_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2027_07_operacion_audit_timestamp_idx;


--
-- Name: registro_2027_07_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2027_07_pk_valor_idx;


--
-- Name: registro_2027_07_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2027_07_pkey;


--
-- Name: registro_2027_07_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2027_07_sesion_id_idx;


--
-- Name: registro_2027_07_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2027_07_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2027_07_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2027_07_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2027_08_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2027_08_audit_timestamp_idx;


--
-- Name: registro_2027_08_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2027_08_diff_jsonb_idx;


--
-- Name: registro_2027_08_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2027_08_operacion_audit_timestamp_idx;


--
-- Name: registro_2027_08_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2027_08_pk_valor_idx;


--
-- Name: registro_2027_08_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2027_08_pkey;


--
-- Name: registro_2027_08_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2027_08_sesion_id_idx;


--
-- Name: registro_2027_08_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2027_08_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2027_08_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2027_08_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2027_09_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2027_09_audit_timestamp_idx;


--
-- Name: registro_2027_09_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2027_09_diff_jsonb_idx;


--
-- Name: registro_2027_09_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2027_09_operacion_audit_timestamp_idx;


--
-- Name: registro_2027_09_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2027_09_pk_valor_idx;


--
-- Name: registro_2027_09_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2027_09_pkey;


--
-- Name: registro_2027_09_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2027_09_sesion_id_idx;


--
-- Name: registro_2027_09_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2027_09_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2027_09_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2027_09_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2027_10_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2027_10_audit_timestamp_idx;


--
-- Name: registro_2027_10_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2027_10_diff_jsonb_idx;


--
-- Name: registro_2027_10_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2027_10_operacion_audit_timestamp_idx;


--
-- Name: registro_2027_10_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2027_10_pk_valor_idx;


--
-- Name: registro_2027_10_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2027_10_pkey;


--
-- Name: registro_2027_10_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2027_10_sesion_id_idx;


--
-- Name: registro_2027_10_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2027_10_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2027_10_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2027_10_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2027_11_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2027_11_audit_timestamp_idx;


--
-- Name: registro_2027_11_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2027_11_diff_jsonb_idx;


--
-- Name: registro_2027_11_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2027_11_operacion_audit_timestamp_idx;


--
-- Name: registro_2027_11_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2027_11_pk_valor_idx;


--
-- Name: registro_2027_11_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2027_11_pkey;


--
-- Name: registro_2027_11_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2027_11_sesion_id_idx;


--
-- Name: registro_2027_11_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2027_11_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2027_11_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2027_11_usuario_id_audit_timestamp_idx;


--
-- Name: registro_2027_12_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2027_12_audit_timestamp_idx;


--
-- Name: registro_2027_12_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2027_12_diff_jsonb_idx;


--
-- Name: registro_2027_12_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2027_12_operacion_audit_timestamp_idx;


--
-- Name: registro_2027_12_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2027_12_pk_valor_idx;


--
-- Name: registro_2027_12_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2027_12_pkey;


--
-- Name: registro_2027_12_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2027_12_sesion_id_idx;


--
-- Name: registro_2027_12_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2027_12_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_2027_12_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2027_12_usuario_id_audit_timestamp_idx;


--
-- Name: registro_default_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_default_audit_timestamp_idx;


--
-- Name: registro_default_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_default_diff_jsonb_idx;


--
-- Name: registro_default_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_default_operacion_audit_timestamp_idx;


--
-- Name: registro_default_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_default_pk_valor_idx;


--
-- Name: registro_default_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_default_pkey;


--
-- Name: registro_default_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_default_sesion_id_idx;


--
-- Name: registro_default_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_default_tabla_nombre_audit_timestamp_idx;


--
-- Name: registro_default_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_default_usuario_id_audit_timestamp_idx;


--
-- Name: sesion_2026_04_evento_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_sesion_evento ATTACH PARTITION audit.sesion_2026_04_evento_audit_timestamp_idx;


--
-- Name: sesion_2026_04_ip_address_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_sesion_ip ATTACH PARTITION audit.sesion_2026_04_ip_address_audit_timestamp_idx;


--
-- Name: sesion_2026_04_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.sesion_pkey ATTACH PARTITION audit.sesion_2026_04_pkey;


--
-- Name: sesion_2026_04_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_sesion_usuario_ts ATTACH PARTITION audit.sesion_2026_04_usuario_id_audit_timestamp_idx;


--
-- Name: sesion_2026_05_evento_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_sesion_evento ATTACH PARTITION audit.sesion_2026_05_evento_audit_timestamp_idx;


--
-- Name: sesion_2026_05_ip_address_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_sesion_ip ATTACH PARTITION audit.sesion_2026_05_ip_address_audit_timestamp_idx;


--
-- Name: sesion_2026_05_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.sesion_pkey ATTACH PARTITION audit.sesion_2026_05_pkey;


--
-- Name: sesion_2026_05_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_sesion_usuario_ts ATTACH PARTITION audit.sesion_2026_05_usuario_id_audit_timestamp_idx;


--
-- Name: sesion_2026_06_evento_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_sesion_evento ATTACH PARTITION audit.sesion_2026_06_evento_audit_timestamp_idx;


--
-- Name: sesion_2026_06_ip_address_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_sesion_ip ATTACH PARTITION audit.sesion_2026_06_ip_address_audit_timestamp_idx;


--
-- Name: sesion_2026_06_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.sesion_pkey ATTACH PARTITION audit.sesion_2026_06_pkey;


--
-- Name: sesion_2026_06_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_sesion_usuario_ts ATTACH PARTITION audit.sesion_2026_06_usuario_id_audit_timestamp_idx;


--
-- Name: sesion_2026_07_evento_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_sesion_evento ATTACH PARTITION audit.sesion_2026_07_evento_audit_timestamp_idx;


--
-- Name: sesion_2026_07_ip_address_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_sesion_ip ATTACH PARTITION audit.sesion_2026_07_ip_address_audit_timestamp_idx;


--
-- Name: sesion_2026_07_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.sesion_pkey ATTACH PARTITION audit.sesion_2026_07_pkey;


--
-- Name: sesion_2026_07_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_sesion_usuario_ts ATTACH PARTITION audit.sesion_2026_07_usuario_id_audit_timestamp_idx;


--
-- Name: sesion_default_evento_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_sesion_evento ATTACH PARTITION audit.sesion_default_evento_audit_timestamp_idx;


--
-- Name: sesion_default_ip_address_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_sesion_ip ATTACH PARTITION audit.sesion_default_ip_address_audit_timestamp_idx;


--
-- Name: sesion_default_pkey; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.sesion_pkey ATTACH PARTITION audit.sesion_default_pkey;


--
-- Name: sesion_default_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: postgres
--

ALTER INDEX audit.idx_audit_sesion_usuario_ts ATTACH PARTITION audit.sesion_default_usuario_id_audit_timestamp_idx;


--
-- Name: cat_estado_firma trg_audit_cat_estado_firma; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_audit_cat_estado_firma AFTER INSERT OR DELETE OR UPDATE ON acometidas.cat_estado_firma FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: cat_estado_orden trg_audit_cat_estado_orden; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_audit_cat_estado_orden AFTER INSERT OR DELETE OR UPDATE ON acometidas.cat_estado_orden FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: cat_estado_pago trg_audit_cat_estado_pago; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_audit_cat_estado_pago AFTER INSERT OR DELETE OR UPDATE ON acometidas.cat_estado_pago FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: cat_estado_solicitud trg_audit_cat_estado_solicitud; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_audit_cat_estado_solicitud AFTER INSERT OR DELETE OR UPDATE ON acometidas.cat_estado_solicitud FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: cat_estado_validacion_doc trg_audit_cat_estado_validacion_doc; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_audit_cat_estado_validacion_doc AFTER INSERT OR DELETE OR UPDATE ON acometidas.cat_estado_validacion_doc FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: cat_resultado_inspeccion trg_audit_cat_resultado_inspeccion; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_audit_cat_resultado_inspeccion AFTER INSERT OR DELETE OR UPDATE ON acometidas.cat_resultado_inspeccion FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: cat_tipo_acometida trg_audit_cat_tipo_acometida; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_audit_cat_tipo_acometida AFTER INSERT OR DELETE OR UPDATE ON acometidas.cat_tipo_acometida FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: cat_tipo_orden trg_audit_cat_tipo_orden; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_audit_cat_tipo_orden AFTER INSERT OR DELETE OR UPDATE ON acometidas.cat_tipo_orden FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: cat_tipo_persona trg_audit_cat_tipo_persona; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_audit_cat_tipo_persona AFTER INSERT OR DELETE OR UPDATE ON acometidas.cat_tipo_persona FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: cat_uso_predio trg_audit_cat_uso_predio; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_audit_cat_uso_predio AFTER INSERT OR DELETE OR UPDATE ON acometidas.cat_uso_predio FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: catalogo_concepto_factura trg_audit_catalogo_concepto_factura; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_audit_catalogo_concepto_factura AFTER INSERT OR DELETE OR UPDATE ON acometidas.catalogo_concepto_factura FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: catalogo_tipo_documento trg_audit_catalogo_tipo_documento; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_audit_catalogo_tipo_documento AFTER INSERT OR DELETE OR UPDATE ON acometidas.catalogo_tipo_documento FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: contrato_servicio trg_audit_contrato_servicio; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_audit_contrato_servicio AFTER INSERT OR DELETE OR UPDATE ON acometidas.contrato_servicio FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: documento_adjunto trg_audit_documento_adjunto; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_audit_documento_adjunto AFTER INSERT OR DELETE OR UPDATE ON acometidas.documento_adjunto FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: factura_inspeccion trg_audit_factura_inspeccion; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_audit_factura_inspeccion AFTER INSERT OR DELETE OR UPDATE ON acometidas.factura_inspeccion FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: historial_estado trg_audit_historial_estado; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_audit_historial_estado AFTER INSERT OR DELETE OR UPDATE ON acometidas.historial_estado FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: informe_inspeccion trg_audit_informe_inspeccion; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_audit_informe_inspeccion AFTER INSERT OR DELETE OR UPDATE ON acometidas.informe_inspeccion FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: informe_instalacion trg_audit_informe_instalacion; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_audit_informe_instalacion AFTER INSERT OR DELETE OR UPDATE ON acometidas.informe_instalacion FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: inventario_medidor trg_audit_inventario_medidor; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_audit_inventario_medidor AFTER INSERT OR DELETE OR UPDATE ON acometidas.inventario_medidor FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: registro_catastral trg_audit_registro_catastral; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_audit_registro_catastral AFTER INSERT OR DELETE OR UPDATE ON acometidas.registro_catastral FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: solicitud trg_audit_solicitud; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_audit_solicitud AFTER INSERT OR DELETE OR UPDATE ON acometidas.solicitud FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: solicitud_orden_trabajo trg_audit_solicitud_orden_trabajo; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_audit_solicitud_orden_trabajo AFTER INSERT OR DELETE OR UPDATE ON acometidas.solicitud_orden_trabajo FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: registro_catastral trg_catastro_updated_at; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_catastro_updated_at BEFORE UPDATE ON acometidas.registro_catastral FOR EACH ROW EXECUTE FUNCTION acometidas.fn_set_updated_at();


--
-- Name: contrato_servicio trg_contrato_updated_at; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_contrato_updated_at BEFORE UPDATE ON acometidas.contrato_servicio FOR EACH ROW EXECUTE FUNCTION acometidas.fn_set_updated_at();


--
-- Name: documento_adjunto trg_documento_resubmitted; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_documento_resubmitted BEFORE INSERT OR UPDATE ON acometidas.documento_adjunto FOR EACH ROW EXECUTE FUNCTION acometidas.fn_trg_documento_resubmitted();


--
-- Name: documento_adjunto trg_documento_updated_at; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_documento_updated_at BEFORE UPDATE ON acometidas.documento_adjunto FOR EACH ROW EXECUTE FUNCTION acometidas.fn_set_updated_at();


--
-- Name: factura_inspeccion trg_factura_inspeccion_created; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_factura_inspeccion_created AFTER INSERT ON acometidas.factura_inspeccion FOR EACH ROW EXECUTE FUNCTION acometidas.fn_trg_factura_inspeccion_created();


--
-- Name: factura_inspeccion trg_factura_inspeccion_updated; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_factura_inspeccion_updated BEFORE UPDATE ON acometidas.factura_inspeccion FOR EACH ROW EXECUTE FUNCTION acometidas.fn_trg_factura_inspeccion_updated();


--
-- Name: factura_inspeccion trg_factura_updated_at; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_factura_updated_at BEFORE UPDATE ON acometidas.factura_inspeccion FOR EACH ROW EXECUTE FUNCTION acometidas.fn_set_updated_at();


--
-- Name: solicitud trg_generar_numero_solicitud; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_generar_numero_solicitud BEFORE INSERT ON acometidas.solicitud FOR EACH ROW EXECUTE FUNCTION acometidas.fn_generar_numero_solicitud();


--
-- Name: informe_instalacion trg_informe_instalacion_updated_at; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_informe_instalacion_updated_at BEFORE UPDATE ON acometidas.informe_instalacion FOR EACH ROW EXECUTE FUNCTION acometidas.fn_set_updated_at();


--
-- Name: informe_inspeccion trg_informe_updated_at; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_informe_updated_at BEFORE UPDATE ON acometidas.informe_inspeccion FOR EACH ROW EXECUTE FUNCTION acometidas.fn_set_updated_at();


--
-- Name: inventario_medidor trg_medidor_updated_at; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_medidor_updated_at BEFORE UPDATE ON acometidas.inventario_medidor FOR EACH ROW EXECUTE FUNCTION acometidas.fn_set_updated_at();


--
-- Name: registro_catastral trg_sincronizar_acometida_legacy; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_sincronizar_acometida_legacy AFTER INSERT ON acometidas.registro_catastral FOR EACH ROW EXECUTE FUNCTION acometidas.fn_trg_sincronizar_acometida_legacy();


--
-- Name: solicitud trg_solicitud_updated_at; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_solicitud_updated_at BEFORE UPDATE ON acometidas.solicitud FOR EACH ROW EXECUTE FUNCTION acometidas.fn_set_updated_at();


--
-- Name: solicitud trg_state_machine; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_state_machine BEFORE UPDATE OF estado ON acometidas.solicitud FOR EACH ROW EXECUTE FUNCTION acometidas.fn_enforce_state_machine();


--
-- Name: registro_catastral trg_sync_catastro_definitivo; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_sync_catastro_definitivo AFTER INSERT OR UPDATE OF clave_catastral ON acometidas.registro_catastral FOR EACH ROW EXECUTE FUNCTION acometidas.fn_sync_clave_catastral_definitiva();


--
-- Name: historial_estado trg_validar_usuario_accion; Type: TRIGGER; Schema: acometidas; Owner: postgres
--

CREATE TRIGGER trg_validar_usuario_accion BEFORE INSERT OR UPDATE ON acometidas.historial_estado FOR EACH ROW EXECUTE FUNCTION acometidas.fn_validar_usuario_accion();


--
-- Name: tabla_config trg_config_updated_at; Type: TRIGGER; Schema: audit; Owner: postgres
--

CREATE TRIGGER trg_config_updated_at BEFORE UPDATE ON audit.tabla_config FOR EACH ROW EXECUTE FUNCTION audit.fn_config_updated_at();


--
-- Name: documento trg_documento_updated_at; Type: TRIGGER; Schema: documents; Owner: postgres
--

CREATE TRIGGER trg_documento_updated_at BEFORE UPDATE ON documents.documento FOR EACH ROW EXECUTE FUNCTION documents.fn_update_timestamp();


--
-- Name: tipo_documento trg_tipo_doc_updated_at; Type: TRIGGER; Schema: documents; Owner: postgres
--

CREATE TRIGGER trg_tipo_doc_updated_at BEFORE UPDATE ON documents.tipo_documento FOR EACH ROW EXECUTE FUNCTION documents.fn_update_timestamp();


--
-- Name: user_notification trg_emit_realtime_notification; Type: TRIGGER; Schema: notifications; Owner: postgres
--

CREATE TRIGGER trg_emit_realtime_notification AFTER INSERT ON notifications.user_notification FOR EACH ROW EXECUTE FUNCTION notifications.broadcast_realtime_notification();


--
-- Name: user_notification trg_user_notification_updated; Type: TRIGGER; Schema: notifications; Owner: postgres
--

CREATE TRIGGER trg_user_notification_updated BEFORE UPDATE ON notifications.user_notification FOR EACH ROW EXECUTE FUNCTION notifications.set_updated_at();


--
-- Name: user_notification trg_validar_usuario_notificacion; Type: TRIGGER; Schema: notifications; Owner: postgres
--

CREATE TRIGGER trg_validar_usuario_notificacion BEFORE INSERT OR UPDATE ON notifications.user_notification FOR EACH ROW EXECUTE FUNCTION notifications.fn_validar_usuario_notificacion();


--
-- Name: cliente_usuario tr_asign_rol_for_client_user; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tr_asign_rol_for_client_user AFTER INSERT ON public.cliente_usuario FOR EACH ROW EXECUTE FUNCTION public.insert_rol_for_client_user_default();


--
-- Name: acometida trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.acometida FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: canton trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.canton FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: cargo trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.cargo FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: categoria trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.categoria FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: ciudadano trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.ciudadano FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: claves_sql2000 trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.claves_sql2000 FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: cliente trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.cliente FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: cliente_persona_natural trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.cliente_persona_natural FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: cliente_usuario trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.cliente_usuario FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: componentes_fijos trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.componentes_fijos FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: consumo_promedio trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.consumo_promedio FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: correo_electronico trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.correo_electronico FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: correo_empresa trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.correo_empresa FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: correo_persona_natural trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.correo_persona_natural FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: direccion trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.direccion FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: empleado_zona trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.empleado_zona FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: empleados trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.empleados FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: empresa trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.empresa FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: estado_civil trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.estado_civil FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: estado_cliente_usuario trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.estado_cliente_usuario FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: estado_empleado trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.estado_empleado FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: estado_pago trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.estado_pago FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: factura trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.factura FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: forma_pago trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.forma_pago FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: foto_acometida trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.foto_acometida FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: foto_lectura trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.foto_lectura FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: lectura trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.lectura FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: lectura_estado trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.lectura_estado FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: observacion trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.observacion FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: observacion_acometida trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.observacion_acometida FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: observacion_factura trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.observacion_factura FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: observacion_lectura trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.observacion_lectura FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: pais trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.pais FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: parroquia trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.parroquia FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: permiso_categoria trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.permiso_categoria FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: permisos trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.permisos FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: predio trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.predio FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: profesion trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.profesion FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: provincia trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.provincia FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: qrcode trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.qrcode FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: rangos_variables trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.rangos_variables FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: refresh_tokens trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.refresh_tokens FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: rol_permisos trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.rol_permisos FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: roles trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: seguimiento_lectura trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.seguimiento_lectura FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: servicio trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.servicio FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: sexo trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.sexo FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: siguiente_lectura trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.siguiente_lectura FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: tarifa trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.tarifa FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: telefono trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.telefono FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: telefono_empresa trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.telefono_empresa FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: telefono_persona_natural trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.telefono_persona_natural FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: tipo_contrato trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.tipo_contrato FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: tipo_estado_lectura trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.tipo_estado_lectura FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: tipo_identificacion trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.tipo_identificacion FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: tipo_novedad_lectura trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.tipo_novedad_lectura FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: tipo_parroquia trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.tipo_parroquia FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: tipo_predio trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.tipo_predio FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: tipo_relacion_familiar trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.tipo_relacion_familiar FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: tipo_telefono trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.tipo_telefono FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: tipo_titulo_dato trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.tipo_titulo_dato FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: titulo_dato trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.titulo_dato FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: usuario_factura trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.usuario_factura FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: usuario_lectura trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.usuario_lectura FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: usuario_permisos trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.usuario_permisos FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: usuario_roles trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.usuario_roles FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: usuarios trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: zona trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.zona FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: categoria_incidente_medidor trg_actualizar_updated_at_categoria_incidente; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at_categoria_incidente BEFORE UPDATE ON public.categoria_incidente_medidor FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: foto_incidente trg_actualizar_updated_at_foto_incidente; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at_foto_incidente BEFORE UPDATE ON public.foto_incidente FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: incidente_medidor trg_actualizar_updated_at_incidente; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at_incidente BEFORE UPDATE ON public.incidente_medidor FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: tipo_incidente_medidor trg_actualizar_updated_at_tipo_incidente; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_updated_at_tipo_incidente BEFORE UPDATE ON public.tipo_incidente_medidor FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- Name: acometida trg_audit_acometida; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_acometida AFTER INSERT OR DELETE OR UPDATE ON public.acometida FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: auditoria_lectura_sector trg_audit_auditoria_lectura_sector; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_auditoria_lectura_sector AFTER INSERT OR DELETE OR UPDATE ON public.auditoria_lectura_sector FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: canton trg_audit_canton; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_canton AFTER INSERT OR DELETE OR UPDATE ON public.canton FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: cargo trg_audit_cargo; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_cargo AFTER INSERT OR DELETE OR UPDATE ON public.cargo FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: cat_action_types trg_audit_cat_action_types; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_cat_action_types AFTER INSERT OR DELETE OR UPDATE ON public.cat_action_types FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: cat_estados_acometida trg_audit_cat_estados_acometida; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_cat_estados_acometida AFTER INSERT OR DELETE OR UPDATE ON public.cat_estados_acometida FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: categoria trg_audit_categoria; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_categoria AFTER INSERT OR DELETE OR UPDATE ON public.categoria FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: ciudadano trg_audit_ciudadano; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_ciudadano AFTER INSERT OR DELETE OR UPDATE ON public.ciudadano FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: claves_sql2000 trg_audit_claves_sql2000; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_claves_sql2000 AFTER INSERT OR DELETE OR UPDATE ON public.claves_sql2000 FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: cliente trg_audit_cliente; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_cliente AFTER INSERT OR DELETE OR UPDATE ON public.cliente FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: cliente_persona_natural trg_audit_cliente_persona_natural; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_cliente_persona_natural AFTER INSERT OR DELETE OR UPDATE ON public.cliente_persona_natural FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: cliente_usuario trg_audit_cliente_usuario; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_cliente_usuario AFTER INSERT OR DELETE OR UPDATE ON public.cliente_usuario FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: cliente_usuario_permisos trg_audit_cliente_usuario_permisos; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_cliente_usuario_permisos AFTER INSERT OR DELETE OR UPDATE ON public.cliente_usuario_permisos FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: cliente_usuario_roles trg_audit_cliente_usuario_roles; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_cliente_usuario_roles AFTER INSERT OR DELETE OR UPDATE ON public.cliente_usuario_roles FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: componentes_fijos trg_audit_componentes_fijos; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_componentes_fijos AFTER INSERT OR DELETE OR UPDATE ON public.componentes_fijos FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: consumo_promedio trg_audit_consumo_promedio; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_consumo_promedio AFTER INSERT OR DELETE OR UPDATE ON public.consumo_promedio FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: correo_electronico trg_audit_correo_electronico; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_correo_electronico AFTER INSERT OR DELETE OR UPDATE ON public.correo_electronico FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: correo_empresa trg_audit_correo_empresa; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_correo_empresa AFTER INSERT OR DELETE OR UPDATE ON public.correo_empresa FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: correo_persona_natural trg_audit_correo_persona_natural; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_correo_persona_natural AFTER INSERT OR DELETE OR UPDATE ON public.correo_persona_natural FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: direccion trg_audit_direccion; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_direccion AFTER INSERT OR DELETE OR UPDATE ON public.direccion FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: empleado_zona trg_audit_empleado_zona; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_empleado_zona AFTER INSERT OR DELETE OR UPDATE ON public.empleado_zona FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: empleados trg_audit_empleados; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_empleados AFTER INSERT OR DELETE OR UPDATE ON public.empleados FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: empresa trg_audit_empresa; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_empresa AFTER INSERT OR DELETE OR UPDATE ON public.empresa FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: estado_civil trg_audit_estado_civil; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_estado_civil AFTER INSERT OR DELETE OR UPDATE ON public.estado_civil FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: estado_cliente_usuario trg_audit_estado_cliente_usuario; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_estado_cliente_usuario AFTER INSERT OR DELETE OR UPDATE ON public.estado_cliente_usuario FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: estado_empleado trg_audit_estado_empleado; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_estado_empleado AFTER INSERT OR DELETE OR UPDATE ON public.estado_empleado FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: estado_pago trg_audit_estado_pago; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_estado_pago AFTER INSERT OR DELETE OR UPDATE ON public.estado_pago FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: factura trg_audit_factura; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_factura AFTER INSERT OR DELETE OR UPDATE ON public.factura FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: forma_pago trg_audit_forma_pago; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_forma_pago AFTER INSERT OR DELETE OR UPDATE ON public.forma_pago FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: foto_acometida trg_audit_foto_acometida; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_foto_acometida AFTER INSERT OR DELETE OR UPDATE ON public.foto_acometida FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: foto_lectura trg_audit_foto_lectura; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_foto_lectura AFTER INSERT OR DELETE OR UPDATE ON public.foto_lectura FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: foto_lectura_copia trg_audit_foto_lectura_copia; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_foto_lectura_copia AFTER INSERT OR DELETE OR UPDATE ON public.foto_lectura_copia FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: historial_estados_acometida trg_audit_historial_estados_acometida; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_historial_estados_acometida AFTER INSERT OR DELETE OR UPDATE ON public.historial_estados_acometida FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: historial_medidores trg_audit_historial_medidores; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_historial_medidores AFTER INSERT OR DELETE OR UPDATE ON public.historial_medidores FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: lectura trg_audit_lectura; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_lectura AFTER INSERT OR DELETE OR UPDATE ON public.lectura FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: lectura_estado trg_audit_lectura_estado; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_lectura_estado AFTER INSERT OR DELETE OR UPDATE ON public.lectura_estado FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: observacion trg_audit_observacion; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_observacion AFTER INSERT OR DELETE OR UPDATE ON public.observacion FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: observacion_acometida trg_audit_observacion_acometida; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_observacion_acometida AFTER INSERT OR DELETE OR UPDATE ON public.observacion_acometida FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: observacion_factura trg_audit_observacion_factura; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_observacion_factura AFTER INSERT OR DELETE OR UPDATE ON public.observacion_factura FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: observacion_lectura trg_audit_observacion_lectura; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_observacion_lectura AFTER INSERT OR DELETE OR UPDATE ON public.observacion_lectura FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: pais trg_audit_pais; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_pais AFTER INSERT OR DELETE OR UPDATE ON public.pais FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: parroquia trg_audit_parroquia; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_parroquia AFTER INSERT OR DELETE OR UPDATE ON public.parroquia FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: permiso_categoria trg_audit_permiso_categoria; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_permiso_categoria AFTER INSERT OR DELETE OR UPDATE ON public.permiso_categoria FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: permisos trg_audit_permisos; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_permisos AFTER INSERT OR DELETE OR UPDATE ON public.permisos FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: predio trg_audit_predio; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_predio AFTER INSERT OR DELETE OR UPDATE ON public.predio FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: profesion trg_audit_profesion; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_profesion AFTER INSERT OR DELETE OR UPDATE ON public.profesion FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: provincia trg_audit_provincia; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_provincia AFTER INSERT OR DELETE OR UPDATE ON public.provincia FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: qrcode trg_audit_qrcode; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_qrcode AFTER INSERT OR DELETE OR UPDATE ON public.qrcode FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: rangos_variables trg_audit_rangos_variables; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_rangos_variables AFTER INSERT OR DELETE OR UPDATE ON public.rangos_variables FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: refresh_tokens trg_audit_refresh_tokens; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_refresh_tokens AFTER INSERT OR DELETE OR UPDATE ON public.refresh_tokens FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: rol_permisos trg_audit_rol_permisos; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_rol_permisos AFTER INSERT OR DELETE OR UPDATE ON public.rol_permisos FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: roles trg_audit_roles; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_roles AFTER INSERT OR DELETE OR UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: seguimiento_lectura trg_audit_seguimiento_lectura; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_seguimiento_lectura AFTER INSERT OR DELETE OR UPDATE ON public.seguimiento_lectura FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: servicio trg_audit_servicio; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_servicio AFTER INSERT OR DELETE OR UPDATE ON public.servicio FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: sexo trg_audit_sexo; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_sexo AFTER INSERT OR DELETE OR UPDATE ON public.sexo FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: siguiente_lectura trg_audit_siguiente_lectura; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_siguiente_lectura AFTER INSERT OR DELETE OR UPDATE ON public.siguiente_lectura FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: tarifa trg_audit_tarifa; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_tarifa AFTER INSERT OR DELETE OR UPDATE ON public.tarifa FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: telefono trg_audit_telefono; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_telefono AFTER INSERT OR DELETE OR UPDATE ON public.telefono FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: telefono_empresa trg_audit_telefono_empresa; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_telefono_empresa AFTER INSERT OR DELETE OR UPDATE ON public.telefono_empresa FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: telefono_persona_natural trg_audit_telefono_persona_natural; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_telefono_persona_natural AFTER INSERT OR DELETE OR UPDATE ON public.telefono_persona_natural FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: temp_acometida_update trg_audit_temp_acometida_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_temp_acometida_update AFTER INSERT OR DELETE OR UPDATE ON public.temp_acometida_update FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: temp_correo_electronico trg_audit_temp_correo_electronico; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_temp_correo_electronico AFTER INSERT OR DELETE OR UPDATE ON public.temp_correo_electronico FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: tipo_contrato trg_audit_tipo_contrato; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_tipo_contrato AFTER INSERT OR DELETE OR UPDATE ON public.tipo_contrato FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: tipo_estado_lectura trg_audit_tipo_estado_lectura; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_tipo_estado_lectura AFTER INSERT OR DELETE OR UPDATE ON public.tipo_estado_lectura FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: tipo_identificacion trg_audit_tipo_identificacion; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_tipo_identificacion AFTER INSERT OR DELETE OR UPDATE ON public.tipo_identificacion FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: tipo_novedad_lectura trg_audit_tipo_novedad_lectura; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_tipo_novedad_lectura AFTER INSERT OR DELETE OR UPDATE ON public.tipo_novedad_lectura FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: tipo_parroquia trg_audit_tipo_parroquia; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_tipo_parroquia AFTER INSERT OR DELETE OR UPDATE ON public.tipo_parroquia FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: tipo_predio trg_audit_tipo_predio; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_tipo_predio AFTER INSERT OR DELETE OR UPDATE ON public.tipo_predio FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: tipo_relacion_familiar trg_audit_tipo_relacion_familiar; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_tipo_relacion_familiar AFTER INSERT OR DELETE OR UPDATE ON public.tipo_relacion_familiar FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: tipo_telefono trg_audit_tipo_telefono; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_tipo_telefono AFTER INSERT OR DELETE OR UPDATE ON public.tipo_telefono FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: tipo_titulo_dato trg_audit_tipo_titulo_dato; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_tipo_titulo_dato AFTER INSERT OR DELETE OR UPDATE ON public.tipo_titulo_dato FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: tipo_verificacion trg_audit_tipo_verificacion; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_tipo_verificacion AFTER INSERT OR DELETE OR UPDATE ON public.tipo_verificacion FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: titulo_dato trg_audit_titulo_dato; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_titulo_dato AFTER INSERT OR DELETE OR UPDATE ON public.titulo_dato FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: usuario_factura trg_audit_usuario_factura; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_usuario_factura AFTER INSERT OR DELETE OR UPDATE ON public.usuario_factura FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: usuario_lectura trg_audit_usuario_lectura; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_usuario_lectura AFTER INSERT OR DELETE OR UPDATE ON public.usuario_lectura FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: usuario_permisos trg_audit_usuario_permisos; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_usuario_permisos AFTER INSERT OR DELETE OR UPDATE ON public.usuario_permisos FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: usuario_roles trg_audit_usuario_roles; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_usuario_roles AFTER INSERT OR DELETE OR UPDATE ON public.usuario_roles FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: usuarios trg_audit_usuarios; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_usuarios AFTER INSERT OR DELETE OR UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: verificar_cuenta_cliente trg_audit_verificar_cuenta_cliente; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_verificar_cuenta_cliente AFTER INSERT OR DELETE OR UPDATE ON public.verificar_cuenta_cliente FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: zona trg_audit_zona; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_zona AFTER INSERT OR DELETE OR UPDATE ON public.zona FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- Name: lectura trg_auditar_lectura; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditar_lectura AFTER INSERT OR UPDATE OF lectura_estado_id ON public.lectura FOR EACH ROW EXECUTE FUNCTION public.fn_auditar_cambio_estado();


--
-- Name: auditoria_lectura_sector trg_auto_cierre_auditoria; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auto_cierre_auditoria BEFORE UPDATE OF total_completadas, total_esperado, completo ON public.auditoria_lectura_sector FOR EACH ROW EXECUTE FUNCTION public.fn_auto_cierre_auditoria();


--
-- Name: lectura trg_block_duplicate_lectura; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_block_duplicate_lectura BEFORE INSERT ON public.lectura FOR EACH ROW EXECUTE FUNCTION public.fn_block_duplicate_lectura();


--
-- Name: cliente_usuario trg_cliente_usuario_lifecycle; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_cliente_usuario_lifecycle BEFORE INSERT OR UPDATE OF email_verified, telefono_verified, failed_attempts, deleted_at, estado_cliente_usuario_id ON public.cliente_usuario FOR EACH ROW EXECUTE FUNCTION public.fn_cliente_usuario_lifecycle();


--
-- Name: cliente_usuario trg_cliente_usuario_lockout; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_cliente_usuario_lockout BEFORE INSERT OR UPDATE OF lockout_until ON public.cliente_usuario FOR EACH ROW EXECUTE FUNCTION public.trg_update_is_locked_out();


--
-- Name: lectura trg_control_siguiente_mensual; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_control_siguiente_mensual AFTER INSERT ON public.lectura FOR EACH ROW EXECUTE FUNCTION public.fn_control_siguiente_lectura_mensual();


--
-- Name: historial_estados_acometida trg_gestionar_estados; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_gestionar_estados BEFORE INSERT ON public.historial_estados_acometida FOR EACH ROW EXECUTE FUNCTION public.fn_actualizar_estado_activo();


--
-- Name: acometida trg_historial_medidores_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_historial_medidores_insert AFTER INSERT ON public.acometida FOR EACH ROW WHEN ((new.numero_medidor IS NOT NULL)) EXECUTE FUNCTION public.fn_registrar_historial_medidor();


--
-- Name: acometida trg_historial_medidores_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_historial_medidores_update AFTER UPDATE ON public.acometida FOR EACH ROW WHEN (((old.numero_medidor)::text IS DISTINCT FROM (new.numero_medidor)::text)) EXECUTE FUNCTION public.fn_registrar_historial_medidor();


--
-- Name: acometida trg_insert_cambio_medidor_reading; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_insert_cambio_medidor_reading AFTER UPDATE OF numero_medidor ON public.acometida FOR EACH ROW WHEN (((old.numero_medidor)::text IS DISTINCT FROM (new.numero_medidor)::text)) EXECUTE FUNCTION public.fn_insert_cambio_medidor_reading();


--
-- Name: acometida trg_insert_initial_reading_full; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_insert_initial_reading_full AFTER INSERT ON public.acometida FOR EACH ROW EXECUTE FUNCTION public.fn_insert_initial_reading_full();


--
-- Name: incidente_medidor trg_registrar_historial_incidente; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_registrar_historial_incidente AFTER INSERT OR UPDATE ON public.incidente_medidor FOR EACH ROW EXECUTE FUNCTION public.fn_registrar_historial_incidente();


--
-- Name: lectura trg_sync_lectura_auditoria; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_sync_lectura_auditoria AFTER INSERT OR DELETE ON public.lectura FOR EACH ROW EXECUTE FUNCTION public.fn_sync_lectura_auditoria();


--
-- Name: cliente_usuario trg_update_cliente_usuario_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_cliente_usuario_timestamp BEFORE UPDATE ON public.cliente_usuario FOR EACH ROW EXECUTE FUNCTION public.update_cliente_usuario_timestamp();


--
-- Name: lectura trg_update_consumo_promedio; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_consumo_promedio AFTER INSERT OR UPDATE ON public.lectura FOR EACH ROW EXECUTE FUNCTION public.update_consumo_promedio();


--
-- Name: empleados trg_update_empleados_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_empleados_timestamp BEFORE UPDATE ON public.empleados FOR EACH ROW EXECUTE FUNCTION public.update_empleados_timestamp();


--
-- Name: acometida trg_update_meter_reading; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_meter_reading AFTER UPDATE OF numero_medidor ON public.acometida FOR EACH ROW WHEN ((((old.numero_medidor)::text IS DISTINCT FROM (new.numero_medidor)::text) AND (new.numero_medidor IS NOT NULL))) EXECUTE FUNCTION public.fn_update_meter_reading_initial();


--
-- Name: seguimiento_lectura trg_update_timestamp_seguimiento_lectura; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_timestamp_seguimiento_lectura BEFORE UPDATE ON public.seguimiento_lectura FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: siguiente_lectura trg_update_timestamp_siguiente_lectura; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_timestamp_siguiente_lectura BEFORE UPDATE ON public.siguiente_lectura FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: usuarios trg_usuarios_lifecycle; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_usuarios_lifecycle BEFORE INSERT OR UPDATE OF email_verified, telefono_verified, failed_attempts, deleted_at, estado_usuario_id ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.fn_usuarios_lifecycle();


--
-- Name: usuarios trg_usuarios_lockout; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_usuarios_lockout BEFORE INSERT OR UPDATE OF lockout_until ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.trg_update_is_locked_out();


--
-- Name: verificar_cuenta_cliente trg_verificar_cuenta_cliente_updated; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_verificar_cuenta_cliente_updated BEFORE UPDATE ON public.verificar_cuenta_cliente FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at_verificar_cuenta();


--
-- Name: cat_action_types update_cat_action_types_modtime; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_cat_action_types_modtime BEFORE UPDATE ON public.cat_action_types FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: adjuntos_orden_trabajo trg_adjuntos_updated_at; Type: TRIGGER; Schema: work_orders; Owner: postgres
--

CREATE TRIGGER trg_adjuntos_updated_at BEFORE UPDATE ON work_orders.adjuntos_orden_trabajo FOR EACH ROW EXECUTE FUNCTION work_orders.fn_update_timestamp();


--
-- Name: asignacion_trabajador_orden trg_asignacion_trabajador_updated_at; Type: TRIGGER; Schema: work_orders; Owner: postgres
--

CREATE TRIGGER trg_asignacion_trabajador_updated_at BEFORE UPDATE ON work_orders.asignacion_trabajador_orden FOR EACH ROW EXECUTE FUNCTION work_orders.fn_update_timestamp();


--
-- Name: control_calidad_detalle trg_control_calidad_det_updated_at; Type: TRIGGER; Schema: work_orders; Owner: postgres
--

CREATE TRIGGER trg_control_calidad_det_updated_at BEFORE UPDATE ON work_orders.control_calidad_detalle FOR EACH ROW EXECUTE FUNCTION work_orders.fn_update_timestamp();


--
-- Name: control_calidad trg_control_calidad_updated_at; Type: TRIGGER; Schema: work_orders; Owner: postgres
--

CREATE TRIGGER trg_control_calidad_updated_at BEFORE UPDATE ON work_orders.control_calidad FOR EACH ROW EXECUTE FUNCTION work_orders.fn_update_timestamp();


--
-- Name: corte_servicio trg_corte_servicio_updated_at; Type: TRIGGER; Schema: work_orders; Owner: postgres
--

CREATE TRIGGER trg_corte_servicio_updated_at BEFORE UPDATE ON work_orders.corte_servicio FOR EACH ROW EXECUTE FUNCTION work_orders.fn_update_timestamp();


--
-- Name: costo_adicional_orden trg_costo_adicional_updated_at; Type: TRIGGER; Schema: work_orders; Owner: postgres
--

CREATE TRIGGER trg_costo_adicional_updated_at BEFORE UPDATE ON work_orders.costo_adicional_orden FOR EACH ROW EXECUTE FUNCTION work_orders.fn_update_timestamp();


--
-- Name: detalle_orden_trabajo_material trg_detalle_material_updated_at; Type: TRIGGER; Schema: work_orders; Owner: postgres
--

CREATE TRIGGER trg_detalle_material_updated_at BEFORE UPDATE ON work_orders.detalle_orden_trabajo_material FOR EACH ROW EXECUTE FUNCTION work_orders.fn_update_timestamp();


--
-- Name: encuesta_satisfaccion trg_encuesta_satisfaccion_updated_at; Type: TRIGGER; Schema: work_orders; Owner: postgres
--

CREATE TRIGGER trg_encuesta_satisfaccion_updated_at BEFORE UPDATE ON work_orders.encuesta_satisfaccion FOR EACH ROW EXECUTE FUNCTION work_orders.fn_update_timestamp();


--
-- Name: orden_trabajo trg_generar_codigo_orden; Type: TRIGGER; Schema: work_orders; Owner: postgres
--

CREATE TRIGGER trg_generar_codigo_orden BEFORE INSERT ON work_orders.orden_trabajo FOR EACH ROW EXECUTE FUNCTION work_orders.fn_generar_codigo_orden();


--
-- Name: inspeccion_preparacion_detalle trg_inspeccion_det_updated_at; Type: TRIGGER; Schema: work_orders; Owner: postgres
--

CREATE TRIGGER trg_inspeccion_det_updated_at BEFORE UPDATE ON work_orders.inspeccion_preparacion_detalle FOR EACH ROW EXECUTE FUNCTION work_orders.fn_update_timestamp();


--
-- Name: inspeccion_preparacion trg_inspeccion_updated_at; Type: TRIGGER; Schema: work_orders; Owner: postgres
--

CREATE TRIGGER trg_inspeccion_updated_at BEFORE UPDATE ON work_orders.inspeccion_preparacion FOR EACH ROW EXECUTE FUNCTION work_orders.fn_update_timestamp();


--
-- Name: observaciones_orden_trabajo trg_observaciones_updated_at; Type: TRIGGER; Schema: work_orders; Owner: postgres
--

CREATE TRIGGER trg_observaciones_updated_at BEFORE UPDATE ON work_orders.observaciones_orden_trabajo FOR EACH ROW EXECUTE FUNCTION work_orders.fn_update_timestamp();


--
-- Name: orden_trabajo trg_orden_trabajo_updated_at; Type: TRIGGER; Schema: work_orders; Owner: postgres
--

CREATE TRIGGER trg_orden_trabajo_updated_at BEFORE UPDATE ON work_orders.orden_trabajo FOR EACH ROW EXECUTE FUNCTION work_orders.fn_update_timestamp();


--
-- Name: orden_trabajo trg_registrar_historial_creacion_ot; Type: TRIGGER; Schema: work_orders; Owner: postgres
--

CREATE TRIGGER trg_registrar_historial_creacion_ot AFTER INSERT ON work_orders.orden_trabajo FOR EACH ROW EXECUTE FUNCTION work_orders.fn_registrar_historial_creacion_ot();


--
-- Name: orden_trabajo trg_state_machine_ot; Type: TRIGGER; Schema: work_orders; Owner: postgres
--

CREATE TRIGGER trg_state_machine_ot BEFORE UPDATE OF estado, version ON work_orders.orden_trabajo FOR EACH ROW EXECUTE FUNCTION work_orders.fn_enforce_state_machine();


--
-- Name: contrato_servicio contrato_servicio_estado_firma_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.contrato_servicio
    ADD CONSTRAINT contrato_servicio_estado_firma_fkey FOREIGN KEY (estado_firma) REFERENCES acometidas.cat_estado_firma(codigo);


--
-- Name: contrato_servicio contrato_servicio_id_generador_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.contrato_servicio
    ADD CONSTRAINT contrato_servicio_id_generador_fkey FOREIGN KEY (id_generador) REFERENCES public.usuarios(usuario_id);


--
-- Name: contrato_servicio contrato_servicio_id_medidor_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.contrato_servicio
    ADD CONSTRAINT contrato_servicio_id_medidor_fkey FOREIGN KEY (id_medidor) REFERENCES acometidas.inventario_medidor(id_medidor);


--
-- Name: contrato_servicio contrato_servicio_id_solicitud_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.contrato_servicio
    ADD CONSTRAINT contrato_servicio_id_solicitud_fkey FOREIGN KEY (id_solicitud) REFERENCES acometidas.solicitud(id_solicitud);


--
-- Name: contrato_servicio contrato_servicio_id_tarifa_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.contrato_servicio
    ADD CONSTRAINT contrato_servicio_id_tarifa_fkey FOREIGN KEY (id_tarifa) REFERENCES public.tarifa(tarifa_id);


--
-- Name: documento_adjunto documento_adjunto_estado_validacion_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.documento_adjunto
    ADD CONSTRAINT documento_adjunto_estado_validacion_fkey FOREIGN KEY (estado_validacion) REFERENCES acometidas.cat_estado_validacion_doc(codigo);


--
-- Name: documento_adjunto documento_adjunto_id_solicitud_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.documento_adjunto
    ADD CONSTRAINT documento_adjunto_id_solicitud_fkey FOREIGN KEY (id_solicitud) REFERENCES acometidas.solicitud(id_solicitud) ON DELETE CASCADE;


--
-- Name: documento_adjunto documento_adjunto_id_tipo_documento_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.documento_adjunto
    ADD CONSTRAINT documento_adjunto_id_tipo_documento_fkey FOREIGN KEY (id_tipo_documento) REFERENCES acometidas.catalogo_tipo_documento(id);


--
-- Name: documento_adjunto documento_adjunto_id_validador_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.documento_adjunto
    ADD CONSTRAINT documento_adjunto_id_validador_fkey FOREIGN KEY (id_validador) REFERENCES public.usuarios(usuario_id);


--
-- Name: factura_inspeccion factura_inspeccion_estado_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.factura_inspeccion
    ADD CONSTRAINT factura_inspeccion_estado_fkey FOREIGN KEY (estado) REFERENCES acometidas.cat_estado_pago(codigo);


--
-- Name: factura_inspeccion factura_inspeccion_id_cajero_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.factura_inspeccion
    ADD CONSTRAINT factura_inspeccion_id_cajero_fkey FOREIGN KEY (id_cajero) REFERENCES public.usuarios(usuario_id);


--
-- Name: factura_inspeccion factura_inspeccion_id_concepto_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.factura_inspeccion
    ADD CONSTRAINT factura_inspeccion_id_concepto_fkey FOREIGN KEY (id_concepto) REFERENCES acometidas.catalogo_concepto_factura(id);


--
-- Name: factura_inspeccion factura_inspeccion_id_solicitud_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.factura_inspeccion
    ADD CONSTRAINT factura_inspeccion_id_solicitud_fkey FOREIGN KEY (id_solicitud) REFERENCES acometidas.solicitud(id_solicitud);


--
-- Name: solicitud fk_solicitud_tipo_acometida; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.solicitud
    ADD CONSTRAINT fk_solicitud_tipo_acometida FOREIGN KEY (tipo_acometida) REFERENCES acometidas.tipo_acometida(codigo);


--
-- Name: historial_estado historial_estado_estado_anterior_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.historial_estado
    ADD CONSTRAINT historial_estado_estado_anterior_fkey FOREIGN KEY (estado_anterior) REFERENCES acometidas.cat_estado_solicitud(codigo);


--
-- Name: historial_estado historial_estado_estado_nuevo_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.historial_estado
    ADD CONSTRAINT historial_estado_estado_nuevo_fkey FOREIGN KEY (estado_nuevo) REFERENCES acometidas.cat_estado_solicitud(codigo);


--
-- Name: historial_estado historial_estado_id_solicitud_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.historial_estado
    ADD CONSTRAINT historial_estado_id_solicitud_fkey FOREIGN KEY (id_solicitud) REFERENCES acometidas.solicitud(id_solicitud) ON DELETE CASCADE;


--
-- Name: informe_inspeccion informe_inspeccion_id_aprobador_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.informe_inspeccion
    ADD CONSTRAINT informe_inspeccion_id_aprobador_fkey FOREIGN KEY (id_aprobador) REFERENCES public.usuarios(usuario_id);


--
-- Name: informe_inspeccion informe_inspeccion_id_solicitud_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.informe_inspeccion
    ADD CONSTRAINT informe_inspeccion_id_solicitud_fkey FOREIGN KEY (id_solicitud) REFERENCES acometidas.solicitud(id_solicitud);


--
-- Name: informe_inspeccion informe_inspeccion_resultado_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.informe_inspeccion
    ADD CONSTRAINT informe_inspeccion_resultado_fkey FOREIGN KEY (resultado) REFERENCES acometidas.cat_resultado_inspeccion(codigo);


--
-- Name: informe_instalacion informe_instalacion_aprobador_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.informe_instalacion
    ADD CONSTRAINT informe_instalacion_aprobador_fkey FOREIGN KEY (id_aprobador) REFERENCES public.usuarios(usuario_id);


--
-- Name: informe_instalacion informe_instalacion_solicitud_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.informe_instalacion
    ADD CONSTRAINT informe_instalacion_solicitud_fkey FOREIGN KEY (id_solicitud) REFERENCES acometidas.solicitud(id_solicitud);


--
-- Name: registro_catastral registro_catastral_id_contrato_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.registro_catastral
    ADD CONSTRAINT registro_catastral_id_contrato_fkey FOREIGN KEY (id_contrato) REFERENCES acometidas.contrato_servicio(id_contrato);


--
-- Name: registro_catastral registro_catastral_id_registrador_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.registro_catastral
    ADD CONSTRAINT registro_catastral_id_registrador_fkey FOREIGN KEY (id_registrador) REFERENCES public.usuarios(usuario_id);


--
-- Name: registro_catastral registro_catastral_id_solicitud_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.registro_catastral
    ADD CONSTRAINT registro_catastral_id_solicitud_fkey FOREIGN KEY (id_solicitud) REFERENCES acometidas.solicitud(id_solicitud);


--
-- Name: solicitud solicitud_estado_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.solicitud
    ADD CONSTRAINT solicitud_estado_fkey FOREIGN KEY (estado) REFERENCES acometidas.cat_estado_solicitud(codigo);


--
-- Name: solicitud solicitud_id_analista_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.solicitud
    ADD CONSTRAINT solicitud_id_analista_fkey FOREIGN KEY (id_analista) REFERENCES public.usuarios(usuario_id);


--
-- Name: solicitud solicitud_id_cliente_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.solicitud
    ADD CONSTRAINT solicitud_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.cliente(cliente_id);


--
-- Name: solicitud solicitud_id_tipo_solicitud_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.solicitud
    ADD CONSTRAINT solicitud_id_tipo_solicitud_fkey FOREIGN KEY (id_tipo_solicitud) REFERENCES acometidas.tipo_solicitud(id_tipo_solicitud);


--
-- Name: solicitud_orden_trabajo solicitud_orden_trabajo_id_solicitud_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.solicitud_orden_trabajo
    ADD CONSTRAINT solicitud_orden_trabajo_id_solicitud_fkey FOREIGN KEY (id_solicitud) REFERENCES acometidas.solicitud(id_solicitud) ON DELETE CASCADE;


--
-- Name: solicitud_orden_trabajo solicitud_orden_trabajo_tipo_orden_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.solicitud_orden_trabajo
    ADD CONSTRAINT solicitud_orden_trabajo_tipo_orden_fkey FOREIGN KEY (tipo_orden) REFERENCES acometidas.cat_tipo_orden(codigo);


--
-- Name: solicitud solicitud_tipo_acometida_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.solicitud
    ADD CONSTRAINT solicitud_tipo_acometida_fkey FOREIGN KEY (tipo_acometida) REFERENCES acometidas.cat_tipo_acometida(codigo);


--
-- Name: solicitud solicitud_tipo_persona_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.solicitud
    ADD CONSTRAINT solicitud_tipo_persona_fkey FOREIGN KEY (tipo_persona) REFERENCES acometidas.cat_tipo_persona(codigo);


--
-- Name: solicitud solicitud_uso_predio_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: postgres
--

ALTER TABLE ONLY acometidas.solicitud
    ADD CONSTRAINT solicitud_uso_predio_fkey FOREIGN KEY (uso_predio) REFERENCES acometidas.cat_uso_predio(codigo);


--
-- Name: documento documento_estado_fkey; Type: FK CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.documento
    ADD CONSTRAINT documento_estado_fkey FOREIGN KEY (estado) REFERENCES documents.estado_documento(estado_id);


--
-- Name: documento documento_nivel_acceso_fkey; Type: FK CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.documento
    ADD CONSTRAINT documento_nivel_acceso_fkey FOREIGN KEY (nivel_acceso) REFERENCES documents.nivel_acceso(nivel_id);


--
-- Name: documento documento_tipo_documento_id_fkey; Type: FK CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.documento
    ADD CONSTRAINT documento_tipo_documento_id_fkey FOREIGN KEY (tipo_documento_id) REFERENCES documents.tipo_documento(tipo_documento_id);


--
-- Name: historial_documento historial_documento_documento_id_fkey; Type: FK CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.historial_documento
    ADD CONSTRAINT historial_documento_documento_id_fkey FOREIGN KEY (documento_id) REFERENCES documents.documento(documento_id) ON DELETE CASCADE;


--
-- Name: historial_documento historial_documento_estado_anterior_fkey; Type: FK CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.historial_documento
    ADD CONSTRAINT historial_documento_estado_anterior_fkey FOREIGN KEY (estado_anterior) REFERENCES documents.estado_documento(estado_id);


--
-- Name: historial_documento historial_documento_estado_nuevo_fkey; Type: FK CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.historial_documento
    ADD CONSTRAINT historial_documento_estado_nuevo_fkey FOREIGN KEY (estado_nuevo) REFERENCES documents.estado_documento(estado_id);


--
-- Name: relacion_acometida relacion_acometida_acometida_id_fkey; Type: FK CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.relacion_acometida
    ADD CONSTRAINT relacion_acometida_acometida_id_fkey FOREIGN KEY (acometida_id) REFERENCES public.acometida(acometida_id) ON DELETE CASCADE;


--
-- Name: relacion_acometida relacion_acometida_documento_id_fkey; Type: FK CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.relacion_acometida
    ADD CONSTRAINT relacion_acometida_documento_id_fkey FOREIGN KEY (documento_id) REFERENCES documents.documento(documento_id) ON DELETE CASCADE;


--
-- Name: relacion_factura relacion_factura_documento_id_fkey; Type: FK CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.relacion_factura
    ADD CONSTRAINT relacion_factura_documento_id_fkey FOREIGN KEY (documento_id) REFERENCES documents.documento(documento_id) ON DELETE CASCADE;


--
-- Name: relacion_factura relacion_factura_factura_id_fkey; Type: FK CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.relacion_factura
    ADD CONSTRAINT relacion_factura_factura_id_fkey FOREIGN KEY (factura_id) REFERENCES public.factura(factura_id) ON DELETE CASCADE;


--
-- Name: relacion_lectura relacion_lectura_documento_id_fkey; Type: FK CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.relacion_lectura
    ADD CONSTRAINT relacion_lectura_documento_id_fkey FOREIGN KEY (documento_id) REFERENCES documents.documento(documento_id) ON DELETE CASCADE;


--
-- Name: relacion_lectura relacion_lectura_lectura_id_fkey; Type: FK CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.relacion_lectura
    ADD CONSTRAINT relacion_lectura_lectura_id_fkey FOREIGN KEY (lectura_id) REFERENCES public.lectura(lectura_id) ON DELETE CASCADE;


--
-- Name: relacion_orden_trabajo relacion_orden_trabajo_documento_id_fkey; Type: FK CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.relacion_orden_trabajo
    ADD CONSTRAINT relacion_orden_trabajo_documento_id_fkey FOREIGN KEY (documento_id) REFERENCES documents.documento(documento_id) ON DELETE CASCADE;


--
-- Name: relacion_predio relacion_predio_documento_id_fkey; Type: FK CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.relacion_predio
    ADD CONSTRAINT relacion_predio_documento_id_fkey FOREIGN KEY (documento_id) REFERENCES documents.documento(documento_id) ON DELETE CASCADE;


--
-- Name: relacion_predio relacion_predio_predio_id_fkey; Type: FK CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.relacion_predio
    ADD CONSTRAINT relacion_predio_predio_id_fkey FOREIGN KEY (predio_id) REFERENCES public.predio(predio_id) ON DELETE CASCADE;


--
-- Name: relacion_solicitud relacion_solicitud_documento_id_fkey; Type: FK CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.relacion_solicitud
    ADD CONSTRAINT relacion_solicitud_documento_id_fkey FOREIGN KEY (documento_id) REFERENCES documents.documento(documento_id) ON DELETE CASCADE;


--
-- Name: relacion_solicitud relacion_solicitud_solicitud_id_fkey; Type: FK CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.relacion_solicitud
    ADD CONSTRAINT relacion_solicitud_solicitud_id_fkey FOREIGN KEY (solicitud_id) REFERENCES acometidas.solicitud(id_solicitud) ON DELETE CASCADE;


--
-- Name: relacion_usuarios relacion_usuarios_documento_id_fkey; Type: FK CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.relacion_usuarios
    ADD CONSTRAINT relacion_usuarios_documento_id_fkey FOREIGN KEY (documento_id) REFERENCES documents.documento(documento_id) ON DELETE CASCADE;


--
-- Name: relacion_usuarios relacion_usuarios_usuario_id_fkey; Type: FK CONSTRAINT; Schema: documents; Owner: postgres
--

ALTER TABLE ONLY documents.relacion_usuarios
    ADD CONSTRAINT relacion_usuarios_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id) ON DELETE CASCADE;


--
-- Name: user_notification_dispatch_log fk_dispatch_estado; Type: FK CONSTRAINT; Schema: notifications; Owner: postgres
--

ALTER TABLE ONLY notifications.user_notification_dispatch_log
    ADD CONSTRAINT fk_dispatch_estado FOREIGN KEY (id_estado_envio) REFERENCES notifications.estado_envio(id_estado_envio);


--
-- Name: user_notification_dispatch_log fk_dispatch_notification; Type: FK CONSTRAINT; Schema: notifications; Owner: postgres
--

ALTER TABLE ONLY notifications.user_notification_dispatch_log
    ADD CONSTRAINT fk_dispatch_notification FOREIGN KEY (notification_id) REFERENCES notifications.user_notification(notification_id) ON DELETE CASCADE;


--
-- Name: user_notification fk_notif_canal; Type: FK CONSTRAINT; Schema: notifications; Owner: postgres
--

ALTER TABLE ONLY notifications.user_notification
    ADD CONSTRAINT fk_notif_canal FOREIGN KEY (id_canal) REFERENCES notifications.canal(id_canal);


--
-- Name: user_notification fk_notif_estado; Type: FK CONSTRAINT; Schema: notifications; Owner: postgres
--

ALTER TABLE ONLY notifications.user_notification
    ADD CONSTRAINT fk_notif_estado FOREIGN KEY (id_estado_envio) REFERENCES notifications.estado_envio(id_estado_envio);


--
-- Name: user_notification fk_notif_prioridad; Type: FK CONSTRAINT; Schema: notifications; Owner: postgres
--

ALTER TABLE ONLY notifications.user_notification
    ADD CONSTRAINT fk_notif_prioridad FOREIGN KEY (id_prioridad) REFERENCES notifications.prioridad(id_prioridad);


--
-- Name: template fk_template_canal; Type: FK CONSTRAINT; Schema: notifications; Owner: postgres
--

ALTER TABLE ONLY notifications.template
    ADD CONSTRAINT fk_template_canal FOREIGN KEY (id_canal_predeterminado) REFERENCES notifications.canal(id_canal);


--
-- Name: template fk_template_prioridad; Type: FK CONSTRAINT; Schema: notifications; Owner: postgres
--

ALTER TABLE ONLY notifications.template
    ADD CONSTRAINT fk_template_prioridad FOREIGN KEY (id_prioridad_predeterminada) REFERENCES notifications.prioridad(id_prioridad);


--
-- Name: acometida acometida_estado_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acometida
    ADD CONSTRAINT acometida_estado_id_fkey FOREIGN KEY (estado_id) REFERENCES public.cat_estados_acometida(id_estado);


--
-- Name: cliente_usuario cliente_usuario_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente_usuario
    ADD CONSTRAINT cliente_usuario_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuarios(usuario_id);


--
-- Name: cliente_usuario cliente_usuario_estado_cliente_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente_usuario
    ADD CONSTRAINT cliente_usuario_estado_cliente_usuario_id_fkey FOREIGN KEY (estado_cliente_usuario_id) REFERENCES public.estado_cliente_usuario(estado_cliente_usuario_id);


--
-- Name: cliente_usuario cliente_usuario_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente_usuario
    ADD CONSTRAINT cliente_usuario_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.usuarios(usuario_id);


--
-- Name: componentes_fijos componentes_fijos_servicio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.componentes_fijos
    ADD CONSTRAINT componentes_fijos_servicio_id_fkey FOREIGN KEY (servicio_id) REFERENCES public.servicio(servicio_id);


--
-- Name: componentes_fijos componentes_fijos_tarifa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.componentes_fijos
    ADD CONSTRAINT componentes_fijos_tarifa_id_fkey FOREIGN KEY (tarifa_id) REFERENCES public.tarifa(tarifa_id);


--
-- Name: empleado_zona empleado_zona_empleado_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleado_zona
    ADD CONSTRAINT empleado_zona_empleado_id_fkey FOREIGN KEY (empleado_id) REFERENCES public.empleados(empleado_id) ON DELETE CASCADE;


--
-- Name: empleado_zona empleado_zona_zona_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleado_zona
    ADD CONSTRAINT empleado_zona_zona_id_fkey FOREIGN KEY (zona_id) REFERENCES public.zona(zona_id) ON DELETE CASCADE;


--
-- Name: empleados empleados_cargo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_cargo_id_fkey FOREIGN KEY (cargo_id) REFERENCES public.cargo(cargo_id);


--
-- Name: empleados empleados_ciudadano_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_ciudadano_id_fkey FOREIGN KEY (ciudadano_id) REFERENCES public.ciudadano(ciudadano_id) ON DELETE SET NULL;


--
-- Name: empleados empleados_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuarios(usuario_id);


--
-- Name: empleados empleados_estado_empleado_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_estado_empleado_id_fkey FOREIGN KEY (estado_empleado_id) REFERENCES public.estado_empleado(estado_empleado_id);


--
-- Name: empleados empleados_sexo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_sexo_id_fkey FOREIGN KEY (sexo_id) REFERENCES public.sexo(sexo_id);


--
-- Name: empleados empleados_supervisor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_supervisor_id_fkey FOREIGN KEY (supervisor_id) REFERENCES public.empleados(empleado_id);


--
-- Name: empleados empleados_tipo_contrato_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_tipo_contrato_id_fkey FOREIGN KEY (tipo_contrato_id) REFERENCES public.tipo_contrato(tipo_contrato_id);


--
-- Name: empleados empleados_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.usuarios(usuario_id);


--
-- Name: acometida fk_acometida_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acometida
    ADD CONSTRAINT fk_acometida_cliente FOREIGN KEY (cliente_id) REFERENCES public.cliente(cliente_id);


--
-- Name: acometida fk_acometida_predio; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acometida
    ADD CONSTRAINT fk_acometida_predio FOREIGN KEY (predio_clave_catastral) REFERENCES public.predio(clave_catastral) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: acometida fk_acometida_tarifa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acometida
    ADD CONSTRAINT fk_acometida_tarifa FOREIGN KEY (tarifa_id) REFERENCES public.tarifa(tarifa_id);


--
-- Name: acometida fk_acometida_tipo_acometida; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acometida
    ADD CONSTRAINT fk_acometida_tipo_acometida FOREIGN KEY (tipo_acometida) REFERENCES acometidas.tipo_acometida(codigo);


--
-- Name: acometida fk_acometida_zona; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acometida
    ADD CONSTRAINT fk_acometida_zona FOREIGN KEY (zona_id) REFERENCES public.zona(zona_id);


--
-- Name: canton fk_canton_provincia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.canton
    ADD CONSTRAINT fk_canton_provincia FOREIGN KEY (provincia_id) REFERENCES public.provincia(provincia_id);


--
-- Name: ciudadano fk_ciudadano_estado_civil; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudadano
    ADD CONSTRAINT fk_ciudadano_estado_civil FOREIGN KEY (estado_civil_id) REFERENCES public.estado_civil(estado_civil_id);


--
-- Name: ciudadano fk_ciudadano_parroquia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudadano
    ADD CONSTRAINT fk_ciudadano_parroquia FOREIGN KEY (parroquia_id) REFERENCES public.parroquia(parroquia_id);


--
-- Name: ciudadano fk_ciudadano_profesion; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudadano
    ADD CONSTRAINT fk_ciudadano_profesion FOREIGN KEY (profesion_id) REFERENCES public.profesion(profesion_id);


--
-- Name: ciudadano fk_ciudadano_sexo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudadano
    ADD CONSTRAINT fk_ciudadano_sexo FOREIGN KEY (sexo_id) REFERENCES public.sexo(sexo_id);


--
-- Name: cliente_persona_natural fk_cliente_persona_natural_ciudadano; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente_persona_natural
    ADD CONSTRAINT fk_cliente_persona_natural_ciudadano FOREIGN KEY (ciudadano_id) REFERENCES public.ciudadano(ciudadano_id);


--
-- Name: cliente_persona_natural fk_cliente_persona_natural_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente_persona_natural
    ADD CONSTRAINT fk_cliente_persona_natural_cliente FOREIGN KEY (cliente_id) REFERENCES public.cliente(cliente_id);


--
-- Name: predio fk_cliente_predio; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predio
    ADD CONSTRAINT fk_cliente_predio FOREIGN KEY (cliente_id) REFERENCES public.cliente(cliente_id);


--
-- Name: cliente fk_cliente_tipo_identificacion; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT fk_cliente_tipo_identificacion FOREIGN KEY (tipo_identificacion_id) REFERENCES public.tipo_identificacion(tipo_identificacion_id);


--
-- Name: cliente_usuario fk_cliente_usuario_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente_usuario
    ADD CONSTRAINT fk_cliente_usuario_cliente FOREIGN KEY (cliente_id) REFERENCES public.cliente(cliente_id) ON DELETE CASCADE;


--
-- Name: cliente_usuario_permisos fk_cliente_usuario_permisos_permiso; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente_usuario_permisos
    ADD CONSTRAINT fk_cliente_usuario_permisos_permiso FOREIGN KEY (permiso_id) REFERENCES public.permisos(permiso_id) ON DELETE CASCADE;


--
-- Name: cliente_usuario_permisos fk_cliente_usuario_permisos_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente_usuario_permisos
    ADD CONSTRAINT fk_cliente_usuario_permisos_usuario FOREIGN KEY (cliente_usuario_id) REFERENCES public.cliente_usuario(cliente_usuario_id) ON DELETE CASCADE;


--
-- Name: cliente_usuario_roles fk_cliente_usuario_roles_rol; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente_usuario_roles
    ADD CONSTRAINT fk_cliente_usuario_roles_rol FOREIGN KEY (rol_id) REFERENCES public.roles(rol_id) ON DELETE CASCADE;


--
-- Name: cliente_usuario_roles fk_cliente_usuario_roles_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente_usuario_roles
    ADD CONSTRAINT fk_cliente_usuario_roles_usuario FOREIGN KEY (cliente_usuario_id) REFERENCES public.cliente_usuario(cliente_usuario_id) ON DELETE CASCADE;


--
-- Name: consumo_promedio fk_consumo_promedio_acometida; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consumo_promedio
    ADD CONSTRAINT fk_consumo_promedio_acometida FOREIGN KEY (acometida_id) REFERENCES public.acometida(acometida_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: correo_electronico fk_correo_electronico_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.correo_electronico
    ADD CONSTRAINT fk_correo_electronico_cliente FOREIGN KEY (cliente_id) REFERENCES public.cliente(cliente_id);


--
-- Name: correo_empresa fk_correo_empresa_correo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.correo_empresa
    ADD CONSTRAINT fk_correo_empresa_correo FOREIGN KEY (correo_electronico_id) REFERENCES public.correo_electronico(correo_electronico_id);


--
-- Name: correo_empresa fk_correo_empresa_empresa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.correo_empresa
    ADD CONSTRAINT fk_correo_empresa_empresa FOREIGN KEY (empresa_id) REFERENCES public.empresa(empresa_id);


--
-- Name: correo_persona_natural fk_correo_persona_natural_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.correo_persona_natural
    ADD CONSTRAINT fk_correo_persona_natural_cliente FOREIGN KEY (cliente_persona_natural_id) REFERENCES public.cliente_persona_natural(cliente_persona_natural_id);


--
-- Name: correo_persona_natural fk_correo_persona_natural_correo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.correo_persona_natural
    ADD CONSTRAINT fk_correo_persona_natural_correo FOREIGN KEY (correo_electronico_id) REFERENCES public.correo_electronico(correo_electronico_id);


--
-- Name: direccion fk_direccion_parroquia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.direccion
    ADD CONSTRAINT fk_direccion_parroquia FOREIGN KEY (parroquia_id) REFERENCES public.parroquia(parroquia_id);


--
-- Name: empleados fk_empleados_ciudadano; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT fk_empleados_ciudadano FOREIGN KEY (ciudadano_id) REFERENCES public.ciudadano(ciudadano_id) ON DELETE SET NULL;


--
-- Name: empleados fk_empleados_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT fk_empleados_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id) ON DELETE CASCADE;


--
-- Name: empresa fk_empresa_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT fk_empresa_cliente FOREIGN KEY (cliente_id) REFERENCES public.cliente(cliente_id);


--
-- Name: empresa fk_empresa_parroquia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT fk_empresa_parroquia FOREIGN KEY (parroquia_id) REFERENCES public.parroquia(parroquia_id);


--
-- Name: factura fk_factura_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT fk_factura_cliente FOREIGN KEY (cliente_id) REFERENCES public.cliente(cliente_id);


--
-- Name: factura fk_factura_estado_pago; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT fk_factura_estado_pago FOREIGN KEY (estado_pago_id) REFERENCES public.estado_pago(estado_pago_id);


--
-- Name: factura fk_factura_forma_pago; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT fk_factura_forma_pago FOREIGN KEY (forma_pago_id) REFERENCES public.forma_pago(forma_pago_id);


--
-- Name: foto_acometida fk_foto_acometida_acometida; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.foto_acometida
    ADD CONSTRAINT fk_foto_acometida_acometida FOREIGN KEY (acometida_id) REFERENCES public.acometida(acometida_id) ON DELETE CASCADE;


--
-- Name: foto_incidente fk_foto_incidente_incidente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.foto_incidente
    ADD CONSTRAINT fk_foto_incidente_incidente FOREIGN KEY (incidente_id) REFERENCES public.incidente_medidor(incidente_id) ON DELETE CASCADE;


--
-- Name: foto_lectura fk_foto_lectura_lectura; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.foto_lectura
    ADD CONSTRAINT fk_foto_lectura_lectura FOREIGN KEY (lectura_id) REFERENCES public.lectura(lectura_id);


--
-- Name: historial_incidente fk_historial_incidente_incidente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_incidente
    ADD CONSTRAINT fk_historial_incidente_incidente FOREIGN KEY (incidente_id) REFERENCES public.incidente_medidor(incidente_id) ON DELETE CASCADE;


--
-- Name: historial_incidente fk_historial_incidente_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_incidente
    ADD CONSTRAINT fk_historial_incidente_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id) ON DELETE SET NULL;


--
-- Name: incidente_medidor fk_incidente_acometida; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidente_medidor
    ADD CONSTRAINT fk_incidente_acometida FOREIGN KEY (acometida_id) REFERENCES public.acometida(acometida_id) ON DELETE CASCADE;


--
-- Name: incidente_medidor fk_incidente_cliente_usuario_reporta; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidente_medidor
    ADD CONSTRAINT fk_incidente_cliente_usuario_reporta FOREIGN KEY (cliente_usuario_reporta_id) REFERENCES public.cliente_usuario(cliente_usuario_id) ON DELETE SET NULL;


--
-- Name: incidente_medidor fk_incidente_lectura; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidente_medidor
    ADD CONSTRAINT fk_incidente_lectura FOREIGN KEY (lectura_id) REFERENCES public.lectura(lectura_id) ON DELETE SET NULL;


--
-- Name: incidente_medidor fk_incidente_tipo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidente_medidor
    ADD CONSTRAINT fk_incidente_tipo FOREIGN KEY (tipo_incidente_id) REFERENCES public.tipo_incidente_medidor(tipo_incidente_id);


--
-- Name: incidente_medidor fk_incidente_usuario_reporta; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidente_medidor
    ADD CONSTRAINT fk_incidente_usuario_reporta FOREIGN KEY (usuario_reporta_id) REFERENCES public.usuarios(usuario_id) ON DELETE SET NULL;


--
-- Name: incidente_medidor fk_incidente_usuario_resuelve; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidente_medidor
    ADD CONSTRAINT fk_incidente_usuario_resuelve FOREIGN KEY (usuario_resuelve_id) REFERENCES public.usuarios(usuario_id) ON DELETE SET NULL;


--
-- Name: lectura fk_lectura_acometida; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lectura
    ADD CONSTRAINT fk_lectura_acometida FOREIGN KEY (acometida_id) REFERENCES public.acometida(acometida_id);


--
-- Name: lectura_estado fk_lectura_estado_tipo_estado_lectura; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lectura_estado
    ADD CONSTRAINT fk_lectura_estado_tipo_estado_lectura FOREIGN KEY (tipo_estado_lectura_id) REFERENCES public.tipo_estado_lectura(tipo_estado_lectura_id);


--
-- Name: lectura fk_lectura_lectura_estado; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lectura
    ADD CONSTRAINT fk_lectura_lectura_estado FOREIGN KEY (lectura_estado_id) REFERENCES public.lectura_estado(lectura_estado_id);


--
-- Name: lectura fk_lectura_tipo_novedad_lectura; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lectura
    ADD CONSTRAINT fk_lectura_tipo_novedad_lectura FOREIGN KEY (tipo_novedad_lectura_id) REFERENCES public.tipo_novedad_lectura(tipo_novedad_lectura_id);


--
-- Name: observacion_acometida fk_observacion_acometida_acometida; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observacion_acometida
    ADD CONSTRAINT fk_observacion_acometida_acometida FOREIGN KEY (acometida_id) REFERENCES public.acometida(acometida_id);


--
-- Name: observacion_acometida fk_observacion_acometida_observacion; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observacion_acometida
    ADD CONSTRAINT fk_observacion_acometida_observacion FOREIGN KEY (observacion_id) REFERENCES public.observacion(observacion_id);


--
-- Name: observacion_factura fk_observacion_factura_factura; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observacion_factura
    ADD CONSTRAINT fk_observacion_factura_factura FOREIGN KEY (factura_id) REFERENCES public.factura(factura_id);


--
-- Name: observacion_factura fk_observacion_factura_observacion; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observacion_factura
    ADD CONSTRAINT fk_observacion_factura_observacion FOREIGN KEY (observacion_id) REFERENCES public.observacion(observacion_id);


--
-- Name: observacion_lectura fk_observacion_lectura_lectura; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observacion_lectura
    ADD CONSTRAINT fk_observacion_lectura_lectura FOREIGN KEY (lectura_id) REFERENCES public.lectura(lectura_id);


--
-- Name: observacion_lectura fk_observacion_lectura_observacion; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observacion_lectura
    ADD CONSTRAINT fk_observacion_lectura_observacion FOREIGN KEY (observacion_id) REFERENCES public.observacion(observacion_id);


--
-- Name: parroquia fk_parroquia_canton; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parroquia
    ADD CONSTRAINT fk_parroquia_canton FOREIGN KEY (canton_id) REFERENCES public.canton(canton_id);


--
-- Name: parroquia fk_parroquia_tipo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parroquia
    ADD CONSTRAINT fk_parroquia_tipo FOREIGN KEY (tipo_parroquia_id) REFERENCES public.tipo_parroquia(tipo_parroquia_id);


--
-- Name: permisos fk_permisos_categoria; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos
    ADD CONSTRAINT fk_permisos_categoria FOREIGN KEY (categoria_id) REFERENCES public.permiso_categoria(categoria_id) ON DELETE SET NULL;


--
-- Name: predio fk_predio_tipo_predio; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predio
    ADD CONSTRAINT fk_predio_tipo_predio FOREIGN KEY (tipo_predio_id) REFERENCES public.tipo_predio(tipo_predio_id);


--
-- Name: provincia fk_provincia_pais; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provincia
    ADD CONSTRAINT fk_provincia_pais FOREIGN KEY (pais_id) REFERENCES public.pais(pais_id);


--
-- Name: telefono fk_telefono_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telefono
    ADD CONSTRAINT fk_telefono_cliente FOREIGN KEY (cliente_id) REFERENCES public.cliente(cliente_id);


--
-- Name: telefono_empresa fk_telefono_empresa_empresa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telefono_empresa
    ADD CONSTRAINT fk_telefono_empresa_empresa FOREIGN KEY (empresa_id) REFERENCES public.empresa(empresa_id);


--
-- Name: telefono_empresa fk_telefono_empresa_telefono; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telefono_empresa
    ADD CONSTRAINT fk_telefono_empresa_telefono FOREIGN KEY (telefono_id) REFERENCES public.telefono(telefono_id);


--
-- Name: telefono_persona_natural fk_telefono_persona_natural_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telefono_persona_natural
    ADD CONSTRAINT fk_telefono_persona_natural_cliente FOREIGN KEY (cliente_persona_natural_id) REFERENCES public.cliente_persona_natural(cliente_persona_natural_id);


--
-- Name: telefono_persona_natural fk_telefono_persona_natural_telefono; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telefono_persona_natural
    ADD CONSTRAINT fk_telefono_persona_natural_telefono FOREIGN KEY (telefono_id) REFERENCES public.telefono(telefono_id);


--
-- Name: telefono fk_telefono_tipo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telefono
    ADD CONSTRAINT fk_telefono_tipo FOREIGN KEY (tipo_telefono_id) REFERENCES public.tipo_telefono(tipo_telefono_id);


--
-- Name: tipo_incidente_medidor fk_tipo_incidente_categoria; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_incidente_medidor
    ADD CONSTRAINT fk_tipo_incidente_categoria FOREIGN KEY (categoria_incidente_id) REFERENCES public.categoria_incidente_medidor(categoria_incidente_id);


--
-- Name: titulo_dato fk_titulo_dato_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titulo_dato
    ADD CONSTRAINT fk_titulo_dato_cliente FOREIGN KEY (cliente_id) REFERENCES public.cliente(cliente_id);


--
-- Name: titulo_dato fk_titulo_dato_tipo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titulo_dato
    ADD CONSTRAINT fk_titulo_dato_tipo FOREIGN KEY (tipo_titulo_dato_id) REFERENCES public.tipo_titulo_dato(tipo_titulo_dato_id);


--
-- Name: usuario_lectura fk_user_reading_action; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_lectura
    ADD CONSTRAINT fk_user_reading_action FOREIGN KEY (action_type_id) REFERENCES public.cat_action_types(id) ON DELETE SET NULL;


--
-- Name: usuario_factura fk_usuario_factura_factura; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_factura
    ADD CONSTRAINT fk_usuario_factura_factura FOREIGN KEY (factura_id) REFERENCES public.factura(factura_id);


--
-- Name: usuario_factura fk_usuario_factura_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_factura
    ADD CONSTRAINT fk_usuario_factura_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- Name: usuario_lectura fk_usuario_lectura_lectura; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_lectura
    ADD CONSTRAINT fk_usuario_lectura_lectura FOREIGN KEY (lectura_id) REFERENCES public.lectura(lectura_id);


--
-- Name: usuario_lectura fk_usuario_lectura_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_lectura
    ADD CONSTRAINT fk_usuario_lectura_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- Name: usuarios fk_usuarios_cliente_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT fk_usuarios_cliente_id FOREIGN KEY (cliente_id) REFERENCES public.cliente(cliente_id) ON DELETE SET NULL;


--
-- Name: usuarios fk_usuarios_estado_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT fk_usuarios_estado_usuario FOREIGN KEY (estado_usuario_id) REFERENCES public.estado_cliente_usuario(estado_cliente_usuario_id);


--
-- Name: verificar_cuenta_cliente fk_verificar_cuenta_cliente_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verificar_cuenta_cliente
    ADD CONSTRAINT fk_verificar_cuenta_cliente_usuario FOREIGN KEY (cliente_usuario_id) REFERENCES public.cliente_usuario(cliente_usuario_id) ON DELETE CASCADE;


--
-- Name: verificar_cuenta_cliente fk_verificar_cuenta_tipo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verificar_cuenta_cliente
    ADD CONSTRAINT fk_verificar_cuenta_tipo FOREIGN KEY (tipo_verificacion_id) REFERENCES public.tipo_verificacion(tipo_verificacion_id);


--
-- Name: historial_estados_acometida historial_estados_acometida_acometida_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estados_acometida
    ADD CONSTRAINT historial_estados_acometida_acometida_id_fkey FOREIGN KEY (acometida_id) REFERENCES public.acometida(acometida_id);


--
-- Name: historial_estados_acometida historial_estados_acometida_estado_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estados_acometida
    ADD CONSTRAINT historial_estados_acometida_estado_id_fkey FOREIGN KEY (estado_id) REFERENCES public.cat_estados_acometida(id_estado);


--
-- Name: historial_estados_acometida historial_estados_acometida_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estados_acometida
    ADD CONSTRAINT historial_estados_acometida_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- Name: historial_medidores historial_medidores_id_acometida_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_medidores
    ADD CONSTRAINT historial_medidores_id_acometida_fkey FOREIGN KEY (id_acometida) REFERENCES public.acometida(acometida_id) ON DELETE CASCADE;


--
-- Name: historial_medidores historial_medidores_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_medidores
    ADD CONSTRAINT historial_medidores_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.cliente(cliente_id) ON DELETE CASCADE;


--
-- Name: qrcode qrcode_acometida_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qrcode
    ADD CONSTRAINT qrcode_acometida_id_fkey FOREIGN KEY (acometida_id) REFERENCES public.acometida(acometida_id) ON DELETE CASCADE;


--
-- Name: rangos_variables rangos_variables_servicio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rangos_variables
    ADD CONSTRAINT rangos_variables_servicio_id_fkey FOREIGN KEY (servicio_id) REFERENCES public.servicio(servicio_id);


--
-- Name: rangos_variables rangos_variables_tarifa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rangos_variables
    ADD CONSTRAINT rangos_variables_tarifa_id_fkey FOREIGN KEY (tarifa_id) REFERENCES public.tarifa(tarifa_id);


--
-- Name: refresh_tokens refresh_tokens_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id) ON DELETE CASCADE;


--
-- Name: rol_permisos rol_permisos_permiso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_permisos
    ADD CONSTRAINT rol_permisos_permiso_id_fkey FOREIGN KEY (permiso_id) REFERENCES public.permisos(permiso_id) ON DELETE CASCADE;


--
-- Name: rol_permisos rol_permisos_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_permisos
    ADD CONSTRAINT rol_permisos_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(rol_id) ON DELETE CASCADE;


--
-- Name: roles roles_parent_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_parent_rol_id_fkey FOREIGN KEY (parent_rol_id) REFERENCES public.roles(rol_id);


--
-- Name: seguimiento_lectura seguimiento_lectura_acometida_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimiento_lectura
    ADD CONSTRAINT seguimiento_lectura_acometida_id_fkey FOREIGN KEY (acometida_id) REFERENCES public.acometida(acometida_id);


--
-- Name: seguimiento_lectura seguimiento_lectura_lectura_estado_anterior_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimiento_lectura
    ADD CONSTRAINT seguimiento_lectura_lectura_estado_anterior_id_fkey FOREIGN KEY (lectura_estado_anterior_id) REFERENCES public.lectura_estado(lectura_estado_id);


--
-- Name: seguimiento_lectura seguimiento_lectura_lectura_estado_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimiento_lectura
    ADD CONSTRAINT seguimiento_lectura_lectura_estado_id_fkey FOREIGN KEY (lectura_estado_id) REFERENCES public.lectura_estado(lectura_estado_id);


--
-- Name: seguimiento_lectura seguimiento_lectura_lectura_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimiento_lectura
    ADD CONSTRAINT seguimiento_lectura_lectura_id_fkey FOREIGN KEY (lectura_id) REFERENCES public.lectura(lectura_id);


--
-- Name: seguimiento_lectura seguimiento_lectura_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimiento_lectura
    ADD CONSTRAINT seguimiento_lectura_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- Name: siguiente_lectura siguiente_lectura_acometida_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.siguiente_lectura
    ADD CONSTRAINT siguiente_lectura_acometida_id_fkey FOREIGN KEY (acometida_id) REFERENCES public.acometida(acometida_id);


--
-- Name: siguiente_lectura siguiente_lectura_ultima_lectura_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.siguiente_lectura
    ADD CONSTRAINT siguiente_lectura_ultima_lectura_id_fkey FOREIGN KEY (ultima_lectura_id) REFERENCES public.lectura(lectura_id);


--
-- Name: tarifa tarifa_categoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarifa
    ADD CONSTRAINT tarifa_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categoria(categoria_id);


--
-- Name: usuario_permisos usuario_permisos_permiso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_permisos
    ADD CONSTRAINT usuario_permisos_permiso_id_fkey FOREIGN KEY (permiso_id) REFERENCES public.permisos(permiso_id) ON DELETE CASCADE;


--
-- Name: usuario_permisos usuario_permisos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_permisos
    ADD CONSTRAINT usuario_permisos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id) ON DELETE CASCADE;


--
-- Name: usuario_roles usuario_roles_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT usuario_roles_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(rol_id) ON DELETE CASCADE;


--
-- Name: usuario_roles usuario_roles_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT usuario_roles_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id) ON DELETE CASCADE;


--
-- Name: adjuntos_orden_trabajo adjuntos_orden_trabajo_created_by_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.adjuntos_orden_trabajo
    ADD CONSTRAINT adjuntos_orden_trabajo_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuarios(usuario_id) ON DELETE RESTRICT;


--
-- Name: adjuntos_orden_trabajo adjuntos_orden_trabajo_id_orden_trabajo_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.adjuntos_orden_trabajo
    ADD CONSTRAINT adjuntos_orden_trabajo_id_orden_trabajo_fkey FOREIGN KEY (id_orden_trabajo) REFERENCES work_orders.orden_trabajo(id_orden_trabajo) ON DELETE CASCADE;


--
-- Name: asignacion_trabajador_orden asignacion_trabajador_orden_created_by_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.asignacion_trabajador_orden
    ADD CONSTRAINT asignacion_trabajador_orden_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuarios(usuario_id) ON DELETE RESTRICT;


--
-- Name: asignacion_trabajador_orden asignacion_trabajador_orden_id_orden_trabajo_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.asignacion_trabajador_orden
    ADD CONSTRAINT asignacion_trabajador_orden_id_orden_trabajo_fkey FOREIGN KEY (id_orden_trabajo) REFERENCES work_orders.orden_trabajo(id_orden_trabajo) ON DELETE CASCADE;


--
-- Name: asignacion_trabajador_orden asignacion_trabajador_orden_id_rol_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.asignacion_trabajador_orden
    ADD CONSTRAINT asignacion_trabajador_orden_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES work_orders.rol_trabajador(id_rol) ON DELETE RESTRICT;


--
-- Name: asignacion_trabajador_orden asignacion_trabajador_orden_id_trabajador_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.asignacion_trabajador_orden
    ADD CONSTRAINT asignacion_trabajador_orden_id_trabajador_fkey FOREIGN KEY (id_trabajador) REFERENCES public.usuarios(usuario_id) ON DELETE RESTRICT;


--
-- Name: control_calidad control_calidad_created_by_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.control_calidad
    ADD CONSTRAINT control_calidad_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuarios(usuario_id) ON DELETE RESTRICT;


--
-- Name: control_calidad_detalle control_calidad_detalle_codigo_item_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.control_calidad_detalle
    ADD CONSTRAINT control_calidad_detalle_codigo_item_fkey FOREIGN KEY (codigo_item) REFERENCES work_orders.cat_item_calidad(codigo);


--
-- Name: control_calidad_detalle control_calidad_detalle_created_by_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.control_calidad_detalle
    ADD CONSTRAINT control_calidad_detalle_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuarios(usuario_id) ON DELETE RESTRICT;


--
-- Name: control_calidad_detalle control_calidad_detalle_id_control_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.control_calidad_detalle
    ADD CONSTRAINT control_calidad_detalle_id_control_fkey FOREIGN KEY (id_control) REFERENCES work_orders.control_calidad(id_control) ON DELETE CASCADE;


--
-- Name: control_calidad control_calidad_id_orden_trabajo_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.control_calidad
    ADD CONSTRAINT control_calidad_id_orden_trabajo_fkey FOREIGN KEY (id_orden_trabajo) REFERENCES work_orders.orden_trabajo(id_orden_trabajo) ON DELETE CASCADE;


--
-- Name: corte_servicio corte_servicio_created_by_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.corte_servicio
    ADD CONSTRAINT corte_servicio_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuarios(usuario_id) ON DELETE RESTRICT;


--
-- Name: corte_servicio corte_servicio_id_orden_trabajo_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.corte_servicio
    ADD CONSTRAINT corte_servicio_id_orden_trabajo_fkey FOREIGN KEY (id_orden_trabajo) REFERENCES work_orders.orden_trabajo(id_orden_trabajo) ON DELETE CASCADE;


--
-- Name: costo_adicional_orden costo_adicional_orden_created_by_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.costo_adicional_orden
    ADD CONSTRAINT costo_adicional_orden_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuarios(usuario_id) ON DELETE RESTRICT;


--
-- Name: costo_adicional_orden costo_adicional_orden_id_orden_trabajo_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.costo_adicional_orden
    ADD CONSTRAINT costo_adicional_orden_id_orden_trabajo_fkey FOREIGN KEY (id_orden_trabajo) REFERENCES work_orders.orden_trabajo(id_orden_trabajo) ON DELETE CASCADE;


--
-- Name: detalle_orden_trabajo_material detalle_orden_trabajo_material_created_by_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.detalle_orden_trabajo_material
    ADD CONSTRAINT detalle_orden_trabajo_material_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuarios(usuario_id) ON DELETE RESTRICT;


--
-- Name: detalle_orden_trabajo_material detalle_orden_trabajo_material_id_orden_trabajo_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.detalle_orden_trabajo_material
    ADD CONSTRAINT detalle_orden_trabajo_material_id_orden_trabajo_fkey FOREIGN KEY (id_orden_trabajo) REFERENCES work_orders.orden_trabajo(id_orden_trabajo) ON DELETE CASCADE;


--
-- Name: encuesta_satisfaccion encuesta_satisfaccion_created_by_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.encuesta_satisfaccion
    ADD CONSTRAINT encuesta_satisfaccion_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuarios(usuario_id) ON DELETE RESTRICT;


--
-- Name: encuesta_satisfaccion encuesta_satisfaccion_id_orden_trabajo_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.encuesta_satisfaccion
    ADD CONSTRAINT encuesta_satisfaccion_id_orden_trabajo_fkey FOREIGN KEY (id_orden_trabajo) REFERENCES work_orders.orden_trabajo(id_orden_trabajo) ON DELETE CASCADE;


--
-- Name: historial_estado_orden_trabajo historial_estado_orden_trabajo_estado_anterior_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.historial_estado_orden_trabajo
    ADD CONSTRAINT historial_estado_orden_trabajo_estado_anterior_fkey FOREIGN KEY (estado_anterior) REFERENCES work_orders.cat_estado_orden(codigo);


--
-- Name: historial_estado_orden_trabajo historial_estado_orden_trabajo_estado_nuevo_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.historial_estado_orden_trabajo
    ADD CONSTRAINT historial_estado_orden_trabajo_estado_nuevo_fkey FOREIGN KEY (estado_nuevo) REFERENCES work_orders.cat_estado_orden(codigo);


--
-- Name: historial_estado_orden_trabajo historial_estado_orden_trabajo_id_orden_trabajo_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.historial_estado_orden_trabajo
    ADD CONSTRAINT historial_estado_orden_trabajo_id_orden_trabajo_fkey FOREIGN KEY (id_orden_trabajo) REFERENCES work_orders.orden_trabajo(id_orden_trabajo) ON DELETE CASCADE;


--
-- Name: historial_estado_orden_trabajo historial_estado_orden_trabajo_id_usuario_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.historial_estado_orden_trabajo
    ADD CONSTRAINT historial_estado_orden_trabajo_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(usuario_id) ON DELETE RESTRICT;


--
-- Name: inspeccion_preparacion inspeccion_preparacion_created_by_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.inspeccion_preparacion
    ADD CONSTRAINT inspeccion_preparacion_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuarios(usuario_id) ON DELETE RESTRICT;


--
-- Name: inspeccion_preparacion_detalle inspeccion_preparacion_detalle_codigo_item_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.inspeccion_preparacion_detalle
    ADD CONSTRAINT inspeccion_preparacion_detalle_codigo_item_fkey FOREIGN KEY (codigo_item) REFERENCES work_orders.cat_checklist_item(codigo);


--
-- Name: inspeccion_preparacion_detalle inspeccion_preparacion_detalle_created_by_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.inspeccion_preparacion_detalle
    ADD CONSTRAINT inspeccion_preparacion_detalle_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuarios(usuario_id) ON DELETE RESTRICT;


--
-- Name: inspeccion_preparacion_detalle inspeccion_preparacion_detalle_id_inspeccion_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.inspeccion_preparacion_detalle
    ADD CONSTRAINT inspeccion_preparacion_detalle_id_inspeccion_fkey FOREIGN KEY (id_inspeccion) REFERENCES work_orders.inspeccion_preparacion(id_inspeccion) ON DELETE CASCADE;


--
-- Name: inspeccion_preparacion inspeccion_preparacion_id_orden_trabajo_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.inspeccion_preparacion
    ADD CONSTRAINT inspeccion_preparacion_id_orden_trabajo_fkey FOREIGN KEY (id_orden_trabajo) REFERENCES work_orders.orden_trabajo(id_orden_trabajo) ON DELETE CASCADE;


--
-- Name: observaciones_orden_trabajo observaciones_orden_trabajo_created_by_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.observaciones_orden_trabajo
    ADD CONSTRAINT observaciones_orden_trabajo_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuarios(usuario_id) ON DELETE RESTRICT;


--
-- Name: observaciones_orden_trabajo observaciones_orden_trabajo_id_orden_trabajo_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.observaciones_orden_trabajo
    ADD CONSTRAINT observaciones_orden_trabajo_id_orden_trabajo_fkey FOREIGN KEY (id_orden_trabajo) REFERENCES work_orders.orden_trabajo(id_orden_trabajo) ON DELETE CASCADE;


--
-- Name: orden_trabajo orden_trabajo_created_by_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.orden_trabajo
    ADD CONSTRAINT orden_trabajo_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuarios(usuario_id) ON DELETE RESTRICT;


--
-- Name: orden_trabajo orden_trabajo_estado_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.orden_trabajo
    ADD CONSTRAINT orden_trabajo_estado_fkey FOREIGN KEY (estado) REFERENCES work_orders.cat_estado_orden(codigo);


--
-- Name: orden_trabajo orden_trabajo_id_cliente_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.orden_trabajo
    ADD CONSTRAINT orden_trabajo_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.cliente(cliente_id) ON DELETE RESTRICT;


--
-- Name: orden_trabajo orden_trabajo_id_orden_padre_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.orden_trabajo
    ADD CONSTRAINT orden_trabajo_id_orden_padre_fkey FOREIGN KEY (id_orden_padre) REFERENCES work_orders.orden_trabajo(id_orden_trabajo) ON DELETE SET NULL;


--
-- Name: orden_trabajo orden_trabajo_id_prioridad_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.orden_trabajo
    ADD CONSTRAINT orden_trabajo_id_prioridad_fkey FOREIGN KEY (id_prioridad) REFERENCES work_orders.prioridad_orden_trabajo(id_prioridad);


--
-- Name: orden_trabajo orden_trabajo_id_tipo_trabajo_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.orden_trabajo
    ADD CONSTRAINT orden_trabajo_id_tipo_trabajo_fkey FOREIGN KEY (id_tipo_trabajo) REFERENCES work_orders.tipo_trabajo(id_tipo_trabajo);


--
-- Name: orden_trabajo orden_trabajo_origen_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.orden_trabajo
    ADD CONSTRAINT orden_trabajo_origen_fkey FOREIGN KEY (origen) REFERENCES work_orders.cat_origen_orden(codigo);


--
-- Name: orden_trabajo orden_trabajo_usuario_asignacion_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.orden_trabajo
    ADD CONSTRAINT orden_trabajo_usuario_asignacion_fkey FOREIGN KEY (usuario_asignacion) REFERENCES public.usuarios(usuario_id) ON DELETE RESTRICT;


--
-- Name: orden_trabajo orden_trabajo_usuario_asignado_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.orden_trabajo
    ADD CONSTRAINT orden_trabajo_usuario_asignado_fkey FOREIGN KEY (usuario_asignado) REFERENCES public.usuarios(usuario_id) ON DELETE RESTRICT;


--
-- Name: orden_trabajo orden_trabajo_usuario_completacion_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.orden_trabajo
    ADD CONSTRAINT orden_trabajo_usuario_completacion_fkey FOREIGN KEY (usuario_completacion) REFERENCES public.usuarios(usuario_id) ON DELETE RESTRICT;


--
-- Name: tipo_trabajo tipo_trabajo_id_departamento_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: postgres
--

ALTER TABLE ONLY work_orders.tipo_trabajo
    ADD CONSTRAINT tipo_trabajo_id_departamento_fkey FOREIGN KEY (id_departamento) REFERENCES work_orders.departamento_trabajo(id_departamento);


--
-- Name: alerta; Type: ROW SECURITY; Schema: audit; Owner: postgres
--

ALTER TABLE audit.alerta ENABLE ROW LEVEL SECURITY;

--
-- Name: alerta alerta_admin; Type: POLICY; Schema: audit; Owner: postgres
--

CREATE POLICY alerta_admin ON audit.alerta TO audit_admin USING (true) WITH CHECK (true);


--
-- Name: alerta alerta_reader; Type: POLICY; Schema: audit; Owner: postgres
--

CREATE POLICY alerta_reader ON audit.alerta FOR SELECT TO audit_reader USING (true);


--
-- Name: registro audit_admin_full; Type: POLICY; Schema: audit; Owner: postgres
--

CREATE POLICY audit_admin_full ON audit.registro FOR SELECT TO audit_admin USING (true);


--
-- Name: registro audit_reader_full; Type: POLICY; Schema: audit; Owner: postgres
--

CREATE POLICY audit_reader_full ON audit.registro FOR SELECT TO audit_reader USING (true);


--
-- Name: registro audit_superuser_full; Type: POLICY; Schema: audit; Owner: postgres
--

CREATE POLICY audit_superuser_full ON audit.registro USING (((COALESCE((NULLIF(current_setting('app.es_admin'::text, true), ''::text))::boolean, false) = true) OR (usuario_id = (NULLIF(current_setting('app.usuario_id'::text, true), ''::text))::uuid)));


--
-- Name: registro; Type: ROW SECURITY; Schema: audit; Owner: postgres
--

ALTER TABLE audit.registro ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict 4xi8fdhWdq0jCikdZWdAFMRza2i1eUnXQMQst9gOzI1NapdXDFzgh8eypoHSZ9L

