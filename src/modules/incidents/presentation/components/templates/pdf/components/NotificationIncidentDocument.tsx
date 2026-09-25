import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
} from '@react-pdf/renderer';
import { styles } from './stylesNotificationIncidentTemplate';
import type { IncidentDetailRowResponse } from '../../../../../domain/schemas/dtos/response/view_incident.response';
import type { ConnectionWithProperty } from '@/modules/connections/domain/models/Connection';

export interface NotificationIncidentItem {
  incident: IncidentDetailRowResponse;
  connection?: ConnectionWithProperty | null;
}

interface Props {
  items: NotificationIncidentItem[];
}

export const NotificationIncidentDocument: React.FC<Props> = ({ items }) => {
  return (
    <Document>
      {items.map(({ incident, connection }, index) => {
        const person = connection?.person || incident.person;
        const company = connection?.company || incident.company;

        const userName = person
          ? `${person.firstName || person.firstName || ''} ${person.lastName || ''}`.trim()
          : company?.businessName || company?.commercialName || '';

        const userId = person?.personId || company?.ruc || '';
        const userAddress = connection?.connectionAddress || person?.address || company?.address || incident.referenceAddress || '';
        const cadastralKey = incident.connectionId || '';

        return (
          <Page key={`page-${incident.incidentId}-${index}`} size="A4" style={styles.page}>

            {/* BACKGROUND IMAGE (MARCAS DE COLORES) 
                Asegúrate de guardar la imagen de fondo sin texto como 'sigepaa.png' en la carpeta public/ */}
            <Image src="/sigepaa.png" style={styles.backgroundImage} fixed />

            <View style={styles.contentWrapper}>

              {/* FECHA Example  Atuntaqui, 24 de septiembre de 2026*/}
              <Text style={styles.dateText}>Atuntaqui, {new Date().toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>

              {/* DOCUMENT TITLE */}
              <View style={styles.titleContainer}>
                <Text style={styles.documentTitle}>NOTIFICACIÓN</Text>
                {/**Numero de control */}
                <Text style={styles.documentControl}>Nº: {incident.incidentCode}</Text>
              </View>

              {/* INFO SECTION */}
              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>USUARIO:</Text>
                  <Text style={[styles.infoValue, !userName ? styles.infoValueEmpty : {}]}>{userName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>CI/RUC:</Text>
                  <Text style={[styles.infoValue, !userId ? styles.infoValueEmpty : {}]}>{userId}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>CLAVE:</Text>
                  <Text style={[styles.infoValue, !cadastralKey ? styles.infoValueEmpty : {}]}>{cadastralKey}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>DIRECCIÓN:</Text>
                  <Text style={[styles.infoValue, !userAddress ? styles.infoValueEmpty : {}]}>{userAddress}</Text>
                </View>
              </View>

              {/* BODY TEXT */}
              <Text style={styles.bodyText}>
                Le recordamos que la Empresa Pública de Antonio Ante EPAA-AA, según el “<Text style={styles.boldItalic}>Reglamento General Sustitutivo para la prestación de servicios de agua Potable y Alcantarillado de Antonio Ante EPAA-AA</Text>”, determina que la persona que realice una conexión o acometida clandestina y/o fraudulenta será sancionada.
              </Text>

              <Text style={styles.articleText}>
                Art. 72.- Acometidas Clandestinas y Fraudulentas. – Son las acometidas de agua potable y alcantarillado no autorizadas por la EPAA-AA.
              </Text>

              <Text style={styles.articleText}>
                Art. 73.- Se suspenderá el servicio del agua potable a las personas naturales o jurídicas que se hayan instalado las conexiones de agua potable o alcantarillado sin autorización de la EPAA-AA.
              </Text>

              <Text style={styles.articleText}>
                La Empresa cobrará una multa correspondiente a un salario básico unificado más el costo de las acometidas, por cada una de las conexiones o acometidas clandestinas y/o fraudulentas; quedando bajo la responsabilidad del interesado la regularización del trámite del servicio. En conexiones de agua potable se hará la recuperación de los metros cúbicos no contabilizados, de acuerdo con el informe técnico, para lo cual se debe de permitir el acceso total al inmueble para verificación del número de aparatos sanitarios existentes. En el caso de que los metros cúbicos no contabilizados sea superior a la multa de un salario básico unificado, se procederá a cobrar el valor más alto. Además, en conexiones de agua potable se hará la recuperación de los metros cúbicos no contabilizados, de acuerdo con el informe técnico.
              </Text>

              <Text style={styles.footerText}>
                Por tal motivo, la EMPRESA PUBLICA DE AGUA POTABLE Y ALCANTARILLADO DE ANTONIO ANTE EPAA-AA le solicita realizar los trámites pertinentes de manera <Text style={styles.bold}>INMEDIATA.</Text>
              </Text>

              {/* SIGNATURES */}
              <View style={styles.signaturesContainer}>
                {/* LEFT COLUMN */}
                <View style={styles.signatureBox}>
                  <Text style={styles.signatureLabel}>NOTIFICADOR</Text>
                  <View style={styles.signatureSpace} />
                  <View style={styles.signatureLineDotted} />
                  <View style={styles.signatureSubLine}>
                    <Text style={styles.signatureSubLabel}>FECHA:</Text>
                    <View style={styles.dottedFill} />
                  </View>
                </View>

                {/* RIGHT COLUMN */}
                <View style={styles.signatureBox}>
                  <Text style={styles.signatureLabel}>FIRMA DE USUARIO</Text>
                  <View style={styles.signatureSpace} />
                  <View style={styles.signatureLineDotted} />
                  <View style={styles.signatureSubLine}>
                    <Text style={styles.signatureSubLabel}>C.C/RUC:</Text>
                    <Text style={[styles.signatureValue, !userId ? styles.signatureValueEmpty : {}]}>{userId}</Text>
                    <View style={[styles.signatureValue, !userId ? styles.signatureValueEmpty : {}]} />
                  </View>
                </View>
              </View>

            </View>

          </Page>
        );
      })}
    </Document>
  );
};
