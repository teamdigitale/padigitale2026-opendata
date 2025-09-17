import jsforce from "jsforce";
import { PaDigitale2026 } from "../schema.d.ts";

const conn = new jsforce.Connection<PaDigitale2026>();

const username = Deno.env.get("SF_USERNAME") ?? "";
const password = Deno.env.get("SF_PASSWORD") ?? "";
const securityToken = Deno.env.get("SF_SECURITY_TOKEN") ?? "";

export async function getAvvisi() {
  await conn.login(username, password + securityToken);

  const records = await conn
    .sobject("outfunds__Funding_Program__c")
    .find({})
    .autoFetch(true);

  const avvisi = records
    .filter((r) => r.outfunds__Parent_Funding_Program__c !== null)
    .map((r) =>
      `${r.Name}

${r.Oggetto_Avviso__c}
`
    );

  console.log(`Fetched ${avvisi.length} avvisi.`);

  return avvisi.join("\n---\n\n");
}
