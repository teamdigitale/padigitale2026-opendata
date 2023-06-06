# Documentazione degli Script

Benvenuto nella documentazione degli script presenti nella cartella 'script'. Qui troverai informazioni dettagliate sui script presenti in questa cartella.
Questa documentazione ti fornirà una panoramica delle funzionalità di ciascuno script e ti aiuterà a comprenderne l'utilizzo e le funzionalità.

## build_kpis.py

Lo script 'build_kpis.py' è progettato per generare KPI (Indicatori chiave di prestazione) basati sui dati delle candidature finanziate disponibili in 'data'. 
Di seguito sono elencate le principali funzionalità e l'utilizzo dello script:

### Funzionalità principali

Carica i dataset necessari, inclusi dati da file CSV presenti nella [repository](https://github.com/teamdigitale/padigitale2026-opendata/tree/main/data) e richieste HTTP per dati remoti.

- Calcola diversi KPI basati sui dataset caricati.
- Salva i risultati dei KPI in file CSV (vedere [format-pad26-KPI](https://github.com/teamdigitale/padigitale2026-opendata/blob/main/format/format-pad26-avvisi.md) per dettaglio).

### Utilizzo

Lo script prevede l'utilizzo dei moduli 'pandas' e 'requests'.
Nella repository viene richiamato tramite il workflow file per le GitHub Action.
Lo script caricherà i dataset da URL remoti e genererà i diversi KPI specificati nel codice.
I risultati dei KPI saranno salvati in file CSV nella cartella specificata dalla costante KPI_FOLDER.
Uno step successivo dell'Action effettua poi il commit di tutti i file aggiunti.

## split_avvisi.py

Lo script 'split_avvisi.py' è progettato per suddividere i dati delle candidature finanziate in base alla misura di finanziamento e non per tipologia ente come fatto dai dataset principali presenti nella repository.
Di seguito sono elencate le principali funzionalità e l'utilizzo dello script:

### Funzionalità principali

- Carica i file delle candidature finanziate ('candidature_*_finanziate.csv') presenti nella cartella 'data'.
- Carica il file 'avvisi.csv' contenente le informazioni sulle misure di finanziamento.
- Crea un dizionario di mapping tra i titoli degli avvisi e le relative misure.
- Aggiunge una colonna 'misura' al DataFrame delle candidature finanziate, basata sul mapping dei titoli.
- Suddivide i dati delle candidature finanziate in file separati per ciascuna misura.
- Salva i file suddivisi in formato CSV e JSON.

### Utilizzo

Lo script prevede l'utilizzo dei moduli 'pandas' e 'os'.
Nella repository viene richiamato tramite il workflow file per le GitHub Action.
I dati delle candidature finanziate saranno suddivisi in file separati per ciascuna misura e salvati nella cartella 'data' con il formato 'candidature_finanziate_{numero_misura}.csv' e 'candidature_finanziate_{numero_misura}.json'.
Uno step successivo dell'Action effettua poi il commit di tutti i file aggiunti.