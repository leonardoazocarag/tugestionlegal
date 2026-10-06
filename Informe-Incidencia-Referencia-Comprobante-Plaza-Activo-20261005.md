# Informe de incidencia — Referencia en comprobante (Banco Plaza / Banco Activo)

**Fecha de evidencia:** 05/10/2026  
**Ambiente:** QA — `MeritopCreditWebApiXtraCashQA`  
**Fuente:** `WebApiLog20261005.json`  
**Aplicación:** xtracash  

> Las referencias **L####** indican el número de línea en `WebApiLog20261005.json` donde se obtuvo cada evidencia.

---

## 1. Resumen ejecutivo

En transferencias Banco Plaza que quedan **En Proceso** y luego **Fallidas**, el comprobante de la app muestra la **referencia interna Meritop** (formato `yyyyMMdd` + cédula + hora), no la **referencia bancaria** generada por el banco.

| Concepto | Campo API | Ejemplo (caso Bs 3,60) |
|----------|-----------|-------------------------|
| Referencia bancaria | `payment_reference` / `payment_detail.payment_reference` | `13245691` |
| Referencia interna Meritop | `internal_reference` / top-level `reference` | `20261005018994049173140288` |
| Lo que muestra la app en “Referencia” | — | Interna Meritop |

La referencia bancaria **sí existe** en la respuesta de la API y en la respuesta del banco. El problema es **qué campo se presenta** en el comprobante.

El mismo contrato de campos aplica a **Banco Activo**.

---

## 2. Caso principal — Transferencia Plaza Bs 3,60 (Fallida)

| Campo | Valor |
|-------|--------|
| Monto | Bs 3,60 |
| Canal UI | TRANSFERENCIA |
| Banco origen | 0138 – Plaza |
| Cuenta origen | `01380040560400011719` |
| Destino | V18994049 / `04166118055` / 0134 – Banesco |
| Fecha/hora | 05/10/2026 ~17:31 (hora local) / `2026-10-05T21:31:41Z` UTC |
| Trace | `60bc1d0c725296d538dd5590ca6a973a` |
| `payid` | 49 |
| Estado final | Fallido / RVD (+ reverso) |

### 2.1 JSON enviado al banco (CCE `pagoO`)

**Evidencia log:** línea **L7198**  
`POST https://openapi.bancoplaza.com/cce/v1/v1/cce/pagoO/J00311498966`

```json
{
  "moneda": "VES",
  "canal": "23",
  "tipo_cce": "E",
  "tipo_proposito": "220",
  "tipo_instrumento_b": "T",
  "identificacion_o": "J00311498966",
  "identificacion_b": "V00018994049",
  "cuenta_origen": "01380040560400011719",
  "cuenta_destino": "",
  "telefono": "04166118055",
  "correo": "",
  "cod_banco_d": "0138",
  "cod_banco_a": "0134",
  "nombre_d": "VALE CANJEABLE TICKETVEN, C.A",
  "nombre_a": "Carla Garcia",
  "monto": 3.6,
  "concepto": "Pago Móvil",
  "direccion_ip": "127.0.0.1"
}
```

### 2.2 JSON recibido del banco

**Evidencia log:** línea **L7201**

```json
{
  "numeroReferencia": "13245691"
}
```

### 2.3 JSON de respuesta a la app — `addPurchase` (inmediato, En Proceso)

**Evidencia log:** línea **L7210**  
`POST /transaction/addPurchase` — `2026-10-05T21:31:42Z`

```json
{
  "client": {
    "doctype": "V",
    "docid": 18994049
  },
  "payid": 49,
  "payment_dest": {
    "bankname": "Banco Plaza",
    "bankcode": "0138",
    "clientid": "J311498966",
    "account": "01380040560400011719",
    "accountname": "VALE CANJEABLE TICKETVEN C.A",
    "phonenumber": "04123139239",
    "payment_reference": "13245691",
    "internal_reference": "20261005018994049173140288",
    "payment_typeid": 656,
    "payment_type": "Transferencia",
    "payment_statusid": 657,
    "payment_status": "En Proceso"
  },
  "status": 200,
  "code": 915,
  "message": "Transacción 49 creada exitosamente"
}
```

### 2.4 JSON de respuesta a la app — `transaction/detail` (ya Fallido)

**Evidencia log:** línea **L7376** (repetido en **L7402**)  
`POST /transaction/detail` — `2026-10-05T21:40:14Z`

```json
{
  "id": 49,
  "transaction_date": "2026-10-05T17:31:40.2866667",
  "transaction_typeid": 674,
  "transaction_desc": "Consumo",
  "cardnumber": "4147189940490000",
  "currencyid": 639,
  "transaction_amt": 3.6,
  "transaction_converted_amt": 3.6,
  "transaction_exchangerate": 1.0,
  "statusid": 682,
  "transaction_uvcc_amt": 0.0,
  "current_idi_amt": 0.0,
  "hist_idi_amt": 0.0,
  "concept": "Pago Móvil",
  "cardholder": true,
  "cardnumber_suppl": "",
  "payment_orig": {
    "bankcode": "0138",
    "clientid": "J00311498966",
    "phonenumber": "01380040560400011719"
  },
  "payment_dest": {
    "bankcode": "0134",
    "clientid": "V18994049",
    "phonenumber": "04166118055"
  },
  "payment_detail": {
    "payment_date": "2026-10-05T17:31:40.2866667",
    "payment_reference": "13245691",
    "transfer_reference": null,
    "payment_orig_bankcode": "0138",
    "payment_orig_clientid": "J00311498966",
    "payment_orig_account": "01380040560400011719",
    "payment_dest_bankcode": "0134",
    "payment_dest_clientid": "V18994049",
    "payment_dest_account": "04166118055",
    "payment_typeid": 656,
    "payment_type": "Transferencia",
    "payment_statusid": 659,
    "payment_status": "Fallido"
  },
  "status": "RVD",
  "reference": "20261005018994049173140288"
}
```

**Lectura de la evidencia:**

- Banco → `13245691` (en `payment_detail.payment_reference`).
- Comprobante → muestra `reference` = `20261005018994049173140288` (interna Meritop).

### 2.5 Secuencia y liquidación

| Paso | Evidencia log | Descripción |
|------|---------------|-------------|
| 1 | — | Se genera referencia interna Meritop |
| 2 | **L7201** | Plaza responde `numeroReferencia: 13245691` |
| 3 | **L7210** | Estado **En Proceso** |
| 4 | **L7247–L7252** | `consultaLiq` con `referencia=13245691` → respuesta vacía `[]` |
| 5 | **L7376** | Estado **Fallido** / RVD |
| 6 | **L7376** | El comprobante usa top-level `reference` (interna) |

---

## 3. Contraste — Plaza Exitoso (mismo día)

**Evidencia log:** línea **L6141** (repetido en **L6154**)  
`POST /transaction/detail` — payid 43, Bs 3,00, **Exitoso**

```json
{
  "id": 43,
  "transaction_date": "2026-10-05T17:02:14.97",
  "transaction_typeid": 674,
  "transaction_desc": "Consumo",
  "cardnumber": "4147189940490000",
  "currencyid": 639,
  "transaction_amt": 3.0,
  "transaction_converted_amt": 3.0,
  "transaction_exchangerate": 1.0,
  "statusid": 681,
  "transaction_uvcc_amt": 0.0,
  "current_idi_amt": 0.0,
  "hist_idi_amt": 0.0,
  "concept": "Pago Móvil",
  "cardholder": true,
  "cardnumber_suppl": "",
  "payment_orig": {
    "bankcode": "0138",
    "clientid": "J00311498966",
    "phonenumber": "01380040560400011719"
  },
  "payment_dest": {
    "bankcode": "0138",
    "clientid": "J000202001",
    "phonenumber": "04241380042"
  },
  "payment_detail": {
    "payment_date": "2026-10-05T17:02:14.97",
    "payment_reference": "13245150",
    "transfer_reference": null,
    "payment_orig_bankcode": "0138",
    "payment_orig_clientid": "J00311498966",
    "payment_orig_account": "01380040560400011719",
    "payment_dest_bankcode": "0138",
    "payment_dest_clientid": "J000202001",
    "payment_dest_account": "04241380042",
    "payment_typeid": 656,
    "payment_type": "Transferencia",
    "payment_statusid": 658,
    "payment_status": "Exitoso"
  },
  "status": "APR",
  "reference": "20261005018994049170214970"
}
```

**Misma estructura** en Exitoso y Fallido: bancaria en `payment_detail.payment_reference`; interna en `reference`. La API no pierde la bancaria en el rechazo.

---

## 4. Análisis de commits — desde cuándo y quién

| Ítem | Detalle |
|------|---------|
| Ticket | **MGI-1449** |
| Commit principal (detalle/listado) | `175b20f363610ccdf31d323f4c99672c9e7a10b4` |
| Fecha | **16/12/2025** 14:32 (-0400) |
| Autor | **desarrollador3meritop** \<desarrollador3@citasalud.com\> |
| Mensaje | `feat!: MGI-1449: ... Se agregan campos de status, referencia, tipo de pago y status de pago en los responses de consulta de transacciones, transacciones por mes y detalle de transacción.` |

**Qué cambió:**

- Se creó el modelo `TransactionDetail` con campo top-level `reference`.
- Se mapeó `reference` desde `cridx_CreditDetail.reference` (referencia **interna Meritop**).
- **Antes** de este commit, el detalle **no exponía** `reference` top-level; la bancaria ya estaba en `payment_detail.payment_reference`.

| Commit hermano | Fecha | Autor | Efecto |
|----------------|-------|-------|--------|
| `a279d10` | 17/12/2025 | desarrollador3meritop | En `addPurchase` se agrega `internal_reference` (Meritop) junto a `payment_reference` (banco) |

**Alcance:** el mapeo es del `TransactionController` (listado / mes / detalle). **No filtra por banco**: aplica a Plaza, Activo y cualquier otro.

**Nota:** la reconciliación Plaza InProcess (`ae4014b`, 30/08/2026) actualiza estatus/`payment_reference` en `cridx_CreditPayment`, pero **no cambia** `CreditDetail.reference`. No es la causa de que el comprobante muestre la interna.

---

## 5. Pruebas Banco Activo en el mismo log (exitosas)

### 5.1 Caso A — Pago móvil Bs 2,00 → Neovalores (payid 938849)

| Evidencia | Línea log |
|-----------|-----------|
| Respuesta banco P2P (`nroReferencia`) | **L2582** |
| Respuesta a la app `addPurchase` | **L2597** |
| Respuesta a la app `transaction/detail` | **L2741** |

**Respuesta del banco (P2P)** — L2582:

```json
{
  "code": "200",
  "nroReferencia": "000000406968"
}
```

**Respuesta a la app** — L2597:

```json
{
  "client": {
    "doctype": "V",
    "docid": 15394971
  },
  "payid": 938849,
  "payment_dest": {
    "bankname": "Banco Activo",
    "bankcode": "0171",
    "clientid": "J407981994",
    "account": "01710002576003190543",
    "accountname": "Meritop, C.A",
    "phonenumber": "04242318020",
    "payment_reference": "000000406968",
    "internal_reference": "20261005015394971144146735",
    "payment_typeid": 655,
    "payment_type": "Pago móvil",
    "payment_statusid": 658,
    "payment_status": "Exitoso"
  },
  "status": 200,
  "code": 915,
  "message": "Transacción 938849 creada exitosamente"
}
```

**Detalle** — L2741:

```json
{
  "id": 938849,
  "transaction_amt": 2.0,
  "payment_detail": {
    "payment_reference": "000000406968",
    "payment_type": "Pago móvil",
    "payment_status": "Exitoso"
  },
  "status": "Activo",
  "reference": "20261005015394971144146735"
}
```

### 5.2 Caso B — Transferencia Activo Exitosa (payid 938847)

**Evidencia log:** respuesta a la app — línea **L1912**

```json
{
  "client": {
    "doctype": "V",
    "docid": 15394971
  },
  "payid": 938847,
  "payment_dest": {
    "bankname": "Banco Activo",
    "bankcode": "0171",
    "clientid": "J407981994",
    "account": "01710002576003190543",
    "accountname": "Meritop, C.A",
    "phonenumber": "04242318020",
    "payment_reference": "552559018",
    "internal_reference": "20261005015394971135030010",
    "payment_typeid": 656,
    "payment_type": "Transferencia",
    "payment_statusid": 658,
    "payment_status": "Exitoso"
  },
  "status": 200,
  "code": 915,
  "message": "Transacción 938847 creada exitosamente"
}
```

### 5.3 Caso C — Pago móvil Activo Exitoso (payid 938842)

| Evidencia | Línea log |
|-----------|-----------|
| Respuesta banco P2P | **L570** |
| Respuesta a la app `addPurchase` | **L585** |

**Respuesta del banco** — L570:

```json
{
  "code": "200",
  "nroReferencia": "000000399224"
}
```

**Respuesta a la app** — L585:

```json
{
  "client": {
    "doctype": "V",
    "docid": 15394971
  },
  "payid": 938842,
  "payment_dest": {
    "bankname": "Banco Activo",
    "bankcode": "0171",
    "clientid": "J407981994",
    "account": "01710002576003190543",
    "accountname": "Meritop, C.A",
    "phonenumber": "04242318020",
    "payment_reference": "000000399224",
    "internal_reference": "20261005015394971111236434",
    "payment_typeid": 655,
    "payment_type": "Pago móvil",
    "payment_statusid": 658,
    "payment_status": "Exitoso"
  },
  "status": 200,
  "code": 915,
  "message": "Transacción 938842 creada exitosamente"
}
```

En todos los casos Activo Exitoso se confirma el mismo dualismo: **banco** en `payment_reference` / `nroReferencia`; **interna Meritop** en `internal_reference` / `reference`.

---

## 6. Conclusiones

1. En el caso Plaza Bs 3,60 el banco entregó referencia **`13245691`** (**L7201**); la app mostró la interna **`20261005018994049173140288`** (**L7376**).  
2. Ambos valores coexisten en la respuesta API; el comprobante usa el campo de la interna.  
3. El comportamiento se introdujo con **MGI-1449** el **16/12/2025** (`175b20f`, autor `desarrollador3meritop`) al exponer `reference` = `CreditDetail.reference`.  
4. Aplica a **Plaza y Activo** por igual.  
5. En Activo Exitoso se confirma el mismo dualismo (`payment_reference` vs `internal_reference` / `reference`) — evidencias **L585**, **L1912**, **L2597**, **L2741**.

---

## 7. Recomendación

- En el campo **“Referencia”** del comprobante mostrar `payment_detail.payment_reference` (o `payment_dest.payment_reference`) cuando exista referencia bancaria.  
- Mantener la interna Meritop en `internal_reference` / auditoría.  
- Homologar el criterio para Exitoso, En Proceso y Fallido, en Plaza y Activo.  
- Para reclamos bancarios del caso Bs 3,60 usar **`13245691`**, no `20261005…`.

---

## 8. Referencias técnicas

| Recurso | Valor |
|---------|--------|
| Log | `WebApiLog20261005.json` |
| Trace Plaza 3,60 | `60bc1d0c725296d538dd5590ca6a973a` |
| Líneas clave Plaza 3,60 | L7198, L7201, L7210, L7247–L7252, L7376 |
| Línea Plaza Exitoso | L6141 |
| Líneas Activo Exitoso | L570, L585, L1912, L2582, L2597, L2741 |
| Commit detalle | `175b20f` (16/12/2025) |
| Commit addPurchase | `a279d10` (17/12/2025) |
| Ticket | MGI-1449 |
