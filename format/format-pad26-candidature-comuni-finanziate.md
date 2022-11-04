# PA digitale 2026 format "Candidature Comuni Finanziate"

## Aggiornamento dati
- Quotidiano, alle 2:00 (UTC). 

## Formato dati

**Reference file:** 
* candidature_comuni_finanziate.csv<br>
* candidature_comuni_finanziate.json<br>

Il dataset contiene la lista delle proposte di finanziamento, richieste dai Comuni, che hanno superato i controlli di ricevibilità e ammissibilità e per le quali gli enti hanno provveduto alla comunicazione del codice CUP. 

Le candidature sono state separate in un file distinto per ogni cluster di pubbliche amministrazioni: Comuni, Scuole e altri enti.
I file sono tutti strutturati nella seguente maniera:

| Campo | Tipo di dati | Descrizione | Formato |
| --- | --- | --- | --- |
| codice_ipa | string | Codice identificativo estratto dall'Indice delle Pubbliche Amministrazioni | |
| comune | string | Comune associato alla PA, come riportato in IPA. | |
| provincia | string | Provincia associata alla PA, come riportato in IPA. | |
| cod_provincia | string | Codice ISTAT della provincia associata alla PA | |
| regione | string | Regione associata alla PA, come riportato in IPA. | |
| cod_regione | string | Codice ISTAT della regione associata alla PA | |
| importo_finanziamento | float | Importo del voucher richiesto dalla PA nella candidatura | |
| avviso | string | Avviso a cui l'ente si è candidato | |
| data_invio_candidatura | datetime | Data in cui la PA ha trasmetto la sua candidatura al Dipartimento della Trasformazione Digitale.  | yyyy-MM-ddTHH:mm:ss.SSS Z|
| data_finanziamento | datetime | Data in cui è stato decretato l'assegnazione del voucher. | yyyy-MM-dd |
| codice_cup| string | Codice CUP, trasmesso dalla PA, associato al progetto della candidatura. | |
| numero_finestra_temporale | integer | Progessivo numerico indicativo della finestra temporale in cui la PA si è candidata al rispettivo avviso. | |
| numero_di_protocollo | integer | Progressivo numerico relativo al decreto di finanziamento in cui alla candidatura è stato assegnato il finanziamento.| |

Questi dati sono disponibili anche in formato json.
