import jsforce from "jsforce";
import { createWriteStream } from "node:fs";
import { parse, stringify } from "jsr:@std/csv";

import { PaDigitale2026 } from "./schema.d.ts";

const conn = new jsforce.Connection<PaDigitale2026>();

const username = Deno.env.get("SF_USERNAME") || "";
const password = Deno.env.get("SF_PASSWORD") || "";
const securityToken = Deno.env.get("SF_SECURITY_TOKEN") || "";

const avvisiCsv = "grafici/avvisi.csv";

const totalePerMisuraCsv = "data/KPI/totale_per_misura.csv";
const misure = [
  "1.1 Infrastrutture digitali",
  "1.2 Abilitazione e facilitazione migrazione al Cloud",
  "1.3.1 Piattaforma Digitale Nazionale Dati",
  "1.4.1 Esperienza del cittadino nei servizi pubblici",
  "1.4.3 Adozione PagoPA e AppIO",
  "1.4.4 Adozione identità digitale",
  "1.4.5 Digitalizzazione degli avvisi pubblici",
];
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
];

try {
  await conn.login(username, password + securityToken);

  conn
    .query(
      "SELECT Ente_promotore__c, Count(id) FROM outfunds__Funding_Program__c WHERE outfunds__Parent_Funding_Program__c != null GROUP BY Ente_promotore__c"
    )
    .stream()
    .pipe(createWriteStream(avvisiCsv));

  /*
  for (const ente of enti) {
    await conn.query(
      `SELECT SUM(Fondi_disponibili__c) FROM outfunds__Funding_Program__c WHERE outfunds__Parent_Funding_Program__c != null and SOGGETTI_DESTINATARI__C includes ('${ente}')`
    );
  }
  */

  const totalePerMisura = await Deno.readTextFile(totalePerMisuraCsv);

  let data = parse(totalePerMisura, {
    skipFirstRow: true,
    columns: ["Misura", ...misure],
  });
  console.log(stringify(data, { columns: ["Misura", ...misure] }));

  const liquidate = { Misura: "Liquidate" };
  const stanziateNonLiquidate = { Misura: "Stanziate, non liquidate" };
  const ancoraADispsizine = { Misura: "Ancora a disposizione" };
  for (const misura of misure) {
    liquidate[misura] = data[2][misura];
    stanziateNonLiquidate[misura] = data[0][misura] - data[2][misura];
    ancoraADispsizine[misura] = data[1][misura] - data[0][misura];
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
} catch (error) {
  console.error(error);
  Deno.exit(1);
}
