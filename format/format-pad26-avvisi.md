# PA digitale 2026 format "Avvisi"

## Aggiornamento dati
- Quotidiano, alle 2:00 (UTC). 

## Formato dati

**Reference file:** 
* avvisi.csv<br>

| Campo | Tipo di dati | Descrizione | Formato |
| --- | --- | --- | --- |
| titolo | string | Titolo descrittivo dell'avviso pubblicato su PA digitale 2026 e riportato nelle candidature| |
| misura | string | Misura del PNRR a cui l'avviso appartiene | |
| data_inizio_bando | datetime | Data di pubblicazione dell'avviso | YYYY-MM-dd|
| data_fine_bando | datetime | Data di scadenza dell'avviso, entro cui è possibile inviare una candidatura | YYYY-MM-dd|
| stato| string | Stato attuale dell'avviso | |
| totale_importo_stanziato | float | Fondi stanziati per il finanziamento delle candidature dell'avviso | |
| totale_importo_misura | float | Fondi totali previsti da PNRR per la singola misura. | |
| soggetti_destinatari | string | Soggetti destinatari dell'avviso che si possono candidare su PA digitale 2026 | |

Questi dati sono disponibili anche in formato json.
