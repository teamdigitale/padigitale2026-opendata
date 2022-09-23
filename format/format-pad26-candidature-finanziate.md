# PA digitale 2026 format "Candidature Finanziate"

## Aggiornamento dati
- Quotidiano, alle TBD. 

## Formato dati

**Reference file:** 
* candidature_comuni_finanziate.csv<br>
* candidature_scuole_finanziate.csv<br>
* candidature_altrienti_finanziate.csv<br>

Le candidature sono state separate in un file distinto per ogni cluster di pubbliche amministrazioni: Comuni, Scuole e altri enti. 
I file sono tutti strutturati nella seguente maniera:

| Campo | Tipo di dati | Descrizione | Formato |
| --- | --- | --- | --- |
| Codice IPA | string | Codice identificativo estratto dall'Indice delle Pubbliche Amministrazioni | |
| Comune | string | Comune associato alla PA, come riportato in IPA. | |
| Provincia | string | Provincia associata alla PA, come riportato in IPA. | |
| Regione | string | Regione associata alla PA, come riportato in IPA. | |
| Importo Finanziamento | integer | Importo del voucher richiesto dalla PA nella candidatura | |
| Avviso | string | Avviso a cui l'ente si è candidato | |
| Data Invio Candidatura | datetime | Data in cui la PA ha trasmetto la sua candidatura al Dipartimento della Trasformazione Digitale.  | yyyy-MM-ddTHH:mm:ss.SSS Z|
| Data Finanziamento | datetime | Data in cui è stato decretato l'assegnazione del voucher. | yyyy-MM-dd |
| Codice CUP | string | Codice CUP, trasmesso dalla PA, associato al progetto della candidatura. | |
| Numero Finestra Temporale | integer | Progessivo numerico indicativo della finestra temporale in cui la PA si è candidata al rispettivo avviso. | |
| Numero di Protocollo | integer | Progressivo numerico relativo al decreto di finanziamento in cui alla candidatura è stato assegnato il finanziamento.| |

Questi dati sono disponibili anche in formato json.
