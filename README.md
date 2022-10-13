<h1 align="center">PA digitale 2026 - Open Data</h1>

<div align="center">
<img width="256" height="256" src="img/site-logo.svg">
</div>

<br />
<div align="center">
    <!-- CoC -->
    <a href="CODE_OF_CONDUCT.md">
      <img src="https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg" />
    </a>
    <!-- last commit -->
    <a href="https://github.com/teamdigitale/padigitale2026-opendata/commits/main">
      <img src="https://img.shields.io/github/last-commit/teamdigitale/padigitale2026-opendata" />
    </a>

</div>

# Descrizione

Questa repository contiene i dati pubblici estratti da [PA digitale 2026](https://padigitale2026.gov.it/).

Nello specifico, i seguenti dati sono aggiornati quotidianamente alle 2:00 (UTC): 
- Candidature a cui è stato assegnato un finanziamento dal relativo decreto
- Avvisi su PA digitale 2026

# Contenuto

- [Struttura Repository](#struttura-repository)
- [Formato Dati](#formato-dati)
- [Aggiornamento Dati](#aggiornamento-dati)
- [Licenza](#licenza)


# Struttura repository
La repository è strutturata in principalmente in 4 cartelle, secondo lo schema seguente:

```
padigitale2026-opendata/
│
├── data/
│   ├── avvisi.csv
│   ├── avvisi.json
│   ├── candidature_comuni_finanziate.csv
│   ├── candidature_comuni_finanziate.json
│   ├── candidature_scuole_finanziate.csv
│   ├── candidature_scuole_finanziate.json
│   ├── candidature_altrienti_finanziate.csv
│   ├── candidature_altrienti_finanziate.json
├── format/
│   ├── format-pad26-avvisi.md
│   ├── format-pad26-candidature-finanziate.md
├── img/
├── metadata/
│   ├── pad26-opendata.rdf
```
Nella cartella data sono raccolti tutti i dataset che costituiscono la repository. 

Le specifiche dei dati sono riassunte nei file nella cartella format. Infine, nella cartella metadata è possibile trovare il file .rdf per l'integrazione della repository nel catalogo [dati.gov.it](https://dati.gov.it/).

# Formato Dati
- [Avvisi PA digitale 2026](https://github.com/teamdigitale/padigitale2026-opendata/blob/main/format/format-pad26-avvisi.md)
- [Candidature Finanziate](https://github.com/teamdigitale/padigitale2026-opendata/blob/main/format/format-pad26-candidature-finanziate.md)


Nella repository si possono trovare le tabelle, in formato .json e .csv, relative alle candidature finanziate e agli avvisi pubblicati su PA digitale 2026. 


# Aggiornamento Dati
Dati Candidature Finanziate: ogni giorno alle 2:00 (UTC).

# Licenza

## Authors / Copyright

Copyright 2022 (c) Dipartimento per la trasformazione digitale.

Far riferimento al file [AUTHORS](AUTHORS) per il corretto riferimento esteso. 

## Dettagli Licenza

La licenza di questa repository è una CC-BY-4.0 (Creative Commons Attribution 4.0 International). 

Far riferimento al file [LICENSE](LICENSE) per il dettaglio della licenza.