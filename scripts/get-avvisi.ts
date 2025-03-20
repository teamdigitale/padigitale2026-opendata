import jsforce from "jsforce";
import { PaDigitale2026 } from "./schema.d.ts";

const conn = new jsforce.Connection<PaDigitale2026>();

const username = Deno.env.get("SF_USERNAME");
const password = Deno.env.get("SF_PASSWORD");
const securityToken = Deno.env.get("SF_SECURITY_TOKEN");

const avvisiJson = "dati/avvisi.json";

try {
  if (
    typeof username === "undefined" ||
    typeof password === "undefined" ||
    typeof securityToken === "undefined"
  ) {
    throw new Error("missing credentials");
  }

  await conn.login(username, password + securityToken);

  const records = await conn
    .sobject("outfunds__Funding_Program__c")
    .find({})
    .autoFetch(true);

  const misure = records.filter(
    (r) => r.outfunds__Parent_Funding_Program__c === null
  );

  const avvisi = records
    .filter((r) => r.outfunds__Parent_Funding_Program__c !== null)
    .map((r) => ({
      id: r.Id,
      name: r.Name,
      startDate: r.outfunds__Start_Date__c,
      endDate: r.outfunds__End_Date__c,
      status: r.outfunds__Status__c,
      entePromotore: r.Ente_promotore__c,
      fondiDisponibili: r.Fondi_disponibili__c,
      fondiDisponibili1: r.Fondi_disponibili_Padre_1__c,
      fondiDisponibili2: r.Fondi_disponibili_Padre_2__c,
      totalProgramAmount: r.outfunds__Total_Program_Amount__c,
      beneficiari: r.SOGGETTI_DESTINATARI__c?.split(";"),
      plateaPotenziale: r.Platea_potenziale__c,
      oggettoBando: r.Oggetto_Bando__c,
      misura: misure.find(
        ({ Id }) => r.outfunds__Parent_Funding_Program__c === Id
      )?.Name,
    }));

  console.log(`Fetched ${misure.length} misure and ${avvisi.length} avvisi.`);

  await Deno.writeTextFile(avvisiJson, JSON.stringify(avvisi, null, 2));
} catch (error) {
  console.error(error);
  Deno.exit(1);
}
