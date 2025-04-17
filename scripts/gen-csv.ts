import jsforce from "jsforce";
import { createWriteStream } from "node:fs";
import { parse, stringify } from "jsr:@std/csv";

import { PaDigitale2026 } from "./schema.d.ts";

const conn = new jsforce.Connection<PaDigitale2026>();

const username = Deno.env.get("SF_USERNAME") || "";
const password = Deno.env.get("SF_PASSWORD") || "";
const securityToken = Deno.env.get("SF_SECURITY_TOKEN") || "";

const avvisiCsv = "grafici/avvisi.csv";

const registatiInPiattaformaCsv = (name: string) =>
  `grafici/registrati-in-piattaforma-${name}.csv`;

const progettiSulTerritorioCsv = (name: string) =>
  `grafici/progetti-sul-territorio-${name}.csv`;

const totalePerMisuraCsv = "data/KPI/totale_per_misura.csv";
const misure = [
  "1.1 Infrastrutture digitali",
  "1.2 Abilitazione e facilitazione migrazione al Cloud",
  "1.3.1 Piattaforma Digitale Nazionale Dati",
  "1.4.1 Esperienza del cittadino nei servizi pubblici",
  "1.4.3 Adozione PagoPA e AppIO",
  "1.4.4 Adozione identità digitale",
  "1.4.5 Digitalizzazione degli avvisi pubblici",
] as const;
const avanzamentoDeiProgettiCsv = "grafici/avanzamento_dei_progetti.csv";

const enti = [
  "ASL",
  "Università",
  "Istituti di ricerca e AFAM",
  "Aziende Ospedaliere",
  "Agenzie Regionali Sanitarie",
  "Comuni",
  "Scuole",
  "PA Centrali",
  "Province",
  "Enti Regionali",
  "Altri enti",
  "Citta Metropolitane",
  "AOO",
  "Istituti Zooprofilattici Sperimentali",
  "Aziende Pubbliche di Servizi alla Persona",
  "PROVINCE AUTONOME",
] as const;

try {
  await conn.login(username, password + securityToken);

  conn
    .query(
      "SELECT Ente_promotore__c, Count(id) FROM outfunds__Funding_Program__c WHERE outfunds__Parent_Funding_Program__c != null GROUP BY Ente_promotore__c"
    )
    .stream("csv")
    .pipe(createWriteStream(avvisiCsv));

  for (const ente of enti) {
    console.log(
      await conn.query(
        `SELECT SUM(Fondi_disponibili__c) FROM outfunds__Funding_Program__c WHERE outfunds__Parent_Funding_Program__c != null and SOGGETTI_DESTINATARI__C includes ('${ente}')`
      )
    );
  }

  const totalePerMisura = await Deno.readTextFile(totalePerMisuraCsv);

  const data = parse(totalePerMisura, {
    skipFirstRow: true,
    columns: ["Misura", ...misure],
  });

  const liquidate: Record<string, unknown> = { Misura: "Liquidate" };
  const stanziateNonLiquidate: Record<string, unknown> = {
    Misura: "Stanziate, non liquidate",
  };
  const ancoraADispsizine: Record<string, unknown> = {
    Misura: "Ancora a disposizione",
  };
  for (const misura of misure) {
    liquidate[misura] = data[2][misura];
    stanziateNonLiquidate[misura] =
      Number(data[0][misura]) - Number(data[2][misura]);
    ancoraADispsizine[misura] =
      Number(data[1][misura]) - Number(data[0][misura]);
  }
  const avanzamentoProgetti = [
    liquidate,
    stanziateNonLiquidate,
    ancoraADispsizine,
  ];

  await Deno.writeTextFile(
    avanzamentoDeiProgettiCsv,
    stringify(avanzamentoProgetti, { columns: ["Misura", ...misure] })
  );

  for (const ente of enti) {
    conn
      .query(
        `SELECT Count(id) FROM account WHERE Tipologia_Ente__c = '${ente}' AND IsDeleted = false AND Stato_giuridico__c = 'Attivo' AND Name != 'XXDTD_C' AND Name != 'XXDTD_C2' AND Name != 'YYDTD_A' AND Name != 'YYACN_R' AND Name != 'ACCOUNTSCATOLA' AND Name != 'Account Marketing Cloud 1' AND Name != 'Account Marketing Cloud Temporaneo' AND Active__c = 1`
      )
      .stream("csv")
      .pipe(createWriteStream(registatiInPiattaformaCsv(ente)));
  }

  conn
    .query(
      `SELECT Count(id) FROM account WHERE IsDeleted = false AND Stato_giuridico__c = 'Attivo' AND Name != 'XXDTD_C' AND Name != 'XXDTD_C2' AND Name != 'YYDTD_A' AND Name != 'YYACN_R' AND Name != 'ACCOUNTSCATOLA' AND Name != 'Account Marketing Cloud 1' AND Name != 'Account Marketing Cloud Temporaneo' AND Active__c = 1`
    )
    .stream("csv")
    .pipe(createWriteStream(registatiInPiattaformaCsv("tutti")));

  const misureSplit = [
    "1.1%",
    "1.2%",
    "1.3.1%",
    "1.4.1%",
    "1.4.3%app IO%",
    "1.4.3%pagoPA%",
    "1.4.4%SPID%",
    "1.4.4%ansc%",
    "1.4.5%",
  ] as const;

  for (const misura of misureSplit) {
    conn
      .query(
        `SELECT outfunds__Applying_Organization__r.Regione__c, COUNT(Id) FROM outfunds__Funding_Request__c WHERE Data_Finanziamento__c != null and Finestra_Temporale__r.Protocollo_n__c != null and outfunds__FundingProgram__r.Name LIKE '${misura}' GROUP BY outfunds__Applying_Organization__r.Regione__c`
      )
      .stream("csv")
      .pipe(createWriteStream(progettiSulTerritorioCsv(misura)));
  }

  conn
    .query(
      "SELECT outfunds__Applying_Organization__r.Regione__c, COUNT(Id) FROM outfunds__Funding_Request__c WHERE Data_Finanziamento__c != null and Finestra_Temporale__r.Protocollo_n__c != null GROUP BY outfunds__Applying_Organization__r.Regione__c"
    )
    .stream("csv")
    .pipe(createWriteStream(progettiSulTerritorioCsv("tutti")));
} catch (error) {
  console.error(error);
  Deno.exit(1);
}
