import { buildClient, LogLevel } from "@datocms/cma-client-node";
import type { Item } from "@datocms/cma-client/dist/types/generated/SimpleSchemaTypes";
import Papa from "papaparse";

const log = process.env.LOG ? true : false;
const apiToken = process.env.DATOCMS_API_TOKEN || "";
const environment = process.env.DATOCMS_ENV || "";
const buildTriggerId = process.env.DATOCMS_BUILD_TRIGGHER || "";
const logLevel = log ? LogLevel.BASIC : LogLevel.NONE;
const client = buildClient({ apiToken, environment, logLevel });

const DATAVIZ = "dataviz";
const KPI = "kpi_element";

async function getRecords(type = DATAVIZ) {
  const records = await client.items.list({
    filter: {
      type, //,"dataviz,kpi_element",
    },
  });
  return records;
}

function parse(data: any) {
  return new Promise((resolve, reject) => {
    try {
      return Papa.parse(data, {
        header: false,
        skipEmptyLines: true,
        complete: (results: any) => {
          resolve(results.data);
        },
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function getOpendataFile(fileName: string) {
  const pathname = `../../data/dataviz/${fileName}`;
  const data = await Bun.file(pathname).text();
  return parse(data);
}

async function findRecordByOpenDataPath(name: string) {
  const results = await client.items.list({
    filter: {
      type: DATAVIZ,
      fields: {
        open_data_path: { eq: name },
      },
    },
  });
  return results[0] || null;
}

async function bulkPublish(ids: string[]) {
  const result = await client.items.bulkPublish({
    items: ids.map((id) => {
      return {
        type: "item",
        id,
      };
    }),
  });
  return result;
}

async function updateChartRecord(itemId: string, data: object) {
  const item = await client.items.update(itemId, {
    chart_data: JSON.stringify(data),
  });

  return item;
}
async function updateKpiRecord(itemId: string, newValue: string) {
  const item = await client.items.update(itemId, {
    value: newValue,
  });

  return item;
}

async function processRecord(item: Item, recordType: string) {
  const { id, open_data_path } = item;
  //GET FRESH DATA
  const parsedData = await getOpendataFile(open_data_path as string);

  if (!parsedData) {
    if (log) {
      console.log(
        "no data found",
        recordType,
        ":",
        item.id,
        "-",
        open_data_path
      );
    }
    return false;
  }

  //UPDATE DATA
  if (recordType === KPI) {
    const prevValue = (item.value as string) || "";
    const newValue = (parsedData as [string[]]).flat()[1] || prevValue;
    await updateKpiRecord(id, newValue);
  } else {
    const prevData = JSON.parse(item.chart_data as string);
    const newData = {
      ...prevData,
      data: parsedData,
    };
    await updateChartRecord(id, newData);
  }
  return true;
}

async function processRecords(recordType = DATAVIZ) {
  const records = (await getRecords(recordType)).filter(
    (i) => i.open_data_path
  );
  const ids = [];
  for (const r of records) {
    const result = await processRecord(r, recordType);
    if (result) {
      ids.push(r.id);
    }
  }

  return ids;
}
(async () => {
  const start = Date.now();
  const charts_ids = await processRecords(DATAVIZ);
  if (log) console.log("charts_ids", charts_ids.length);
  const kpis_ids = await processRecords(KPI);
  if (log) console.log("kpis_ids", kpis_ids.length);
  const ids = [...charts_ids, ...kpis_ids];
  if (log) console.log("UPDATES:", ids);
  if (ids.length > 0) {
    //BULK PUBLISH
    if (log) console.log("PUBLISH!");
    await bulkPublish(ids);
    //TRIGGHER BUILD
    if (buildTriggerId) {
      if (log) console.log("BUILD!");
      await client.buildTriggers.trigger(buildTriggerId);
    }
  }
  const elapsed = Math.ceil((Date.now() - start) / 60000);
  if (log) console.log("finished in", elapsed, "secs");
})();
