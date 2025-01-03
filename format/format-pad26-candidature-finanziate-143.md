# PA digitale 2026 format "Candidature Finanziate"

## Aggiornamento dati
- Quotidiano, alle 2:00 (UTC). 

## Formato dati

**Reference file:** 
* candidature_finanziate_143.csv<br>
* candidature_finanziate_143.json<br>

Il dataset contiene la lista delle proposte di finanziamento relative alla misura "1.4.3 Adozione PagoPA e App IO" che hanno superato i controlli di ricevibilità e ammissibilità e per le quali gli enti hanno provveduto alla comunicazione del codice CUP. 

Il file è strutturato come segue:

| Campo | Tipo di dati | Descrizione | Formato |
| --- | --- | --- | --- |
| codice_ipa | string | Codice identificativo estratto dall'Indice delle Pubbliche Amministrazioni | |
| ente | string | Nome descrittivo dell'ente | varchar(250) |
| tipologia_ente | string | Tipologia dell'ente tra le platee destinatarie degli avvisi  | Comune, Scuole, Altri Enti |
| comune | string | Comune associato alla PA, come riportato in IPA. | |
| cod_comune | string | Codice ISTAT del comune associata alla PA | |
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
| decreto_finanziamento | string | Riferimento del decreto di finanziamento tramite cui sono state confermate le candidature assegnatarie di un finanziamento.| |
| stato_candidatura | string | Stato aggiornato della candidatura. Al momento può assumere i seguenti valori: 'A', se la candidatura risulta assegnataria di un finanziamento; 'R', se è stata decretata la richiesta di rinuncia fatta dell'ente; 'E', se è stato erogato il finanziamento in seguito all'asseverazione del progetto.  | |
| data_stato_candidatura | string | Data di riferimento dello stato aggiornato della candidatura. Equivale a: data del decreto di finanziamento se 'A'; data di rinuncia se 'R'; data di erogazione del finanziamento se 'E' | |
| misura | string | Misura di riferimento dell'avviso a cui l'ente si è candidato  | |

Questi dati sono disponibili anche in formato json.
