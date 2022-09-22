<h1 align="center">PA digitale 2026 - Open Data</h1>

<div align="center">
<img width="256" height="256" src="img/site-logo.png">
</div>

<br />
<div align="center">
    <!-- CoC -->
    <a href="CODE_OF_CONDUCT.md">
      <img src="https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg" />
    </a>
    <!-- last commit -->
    <a href="https://github.com/XXX">
      <img src="https://img.shields.io/github/last-commit/XXX" />
    </a>

</div>

# Descrizione

Questa repository contiene i dati pubblici estratti da PA digitale 2026.

Nello specifico, i seguenti dati sono aggiornati quotidianamente alle XXX: 
- Candidature a cui è stato assegnato un finanziamento dal relativo decreto. 

# Contenuto

- [Struttura Repository](#repository-structure)
- [Formato Dati](#data-format)
- [Aggiornamento Dati](#data-update)
- [Licenza](#license)


# Repository structure
```
XXX/
│
├── data/
│   ├── XXX.csv
│   ├── XXX.json
│   ├── XXX-latest.csv
│   ├── XXX-latest.json
```

# Formato Dati
- [Candidature Finanziate](https://github.com/XXX)

Nella repository si possono trovare le tabelle, in formato .json e .csv, relative alle candidature finanziate. E' stata creata una tabella per ogni tipologia di enti candidati. In particolare, al momento le tipologie sono le seguenti: Comuni, Scuole, Altri Enti. 
I campi di ogni tabella sono schematizzati come segue:
| Campo | Tipo di dati | Descrizione |
| --- | --- | --- |
| Codice IPA | string | Codice identificativo estratto dall'Indice delle Pubbliche Amministrazioni |
| Comune | string | Comune associato alla PA, come riportato in IPA. |
| Provincia | string | Provincia associata alla PA, come riportato in IPA. |
| Regione | string | Regione associata alla PA, come riportato in IPA. |
| Importo Finanziamento | integer | Importo del voucher richiesto dalla PA nella candidatura |
| Avviso | string | Avviso a cui l'ente si è candidato |
| Data Invio Candidatura | datetime | Data in cui la PA ha trasmetto la sua candidatura al Dipartimento della Trasformazione Digitale.  |
| Data Finanziamento | datetime | Data in cui è stato decretato l'assegnazione del voucher. |
| Codice CUP | string | Codice CUP, trasmesso dalla PA, associato al progetto della candidatura. |
| Numero Finestra Temporale | integer | Progessivo numerico indicativo della finestra temporale in cui la PA si è candidata al rispettivo avviso. |
| Numero di Protocollo | integer | Progressivo numerico relativo al decreto di finanziamento in cui alla candidatura è stato assegnato il finanziamento.|

# Aggiornamento Dati
Dati Candidature Finanziate: ogni giorno alle XXX.

# Licenza

## Authors / Copyright / Maintainers

Copyright 2022 (c) XXX.

Please check the [AUTHORS](AUTHORS) file for extended reference.

## Third-party component licences

## Licence details

The licence for this repository is a Creative Commons Attribution 4.0 International. Please see the [LICENSE](LICENSE) file for full reference.