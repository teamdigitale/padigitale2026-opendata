import { buildClient, LogLevel } from "@datocms/cma-client-node";
import type { Item } from "@datocms/cma-client/dist/types/generated/SimpleSchemaTypes";
import axios from "axios";
import Papa from "papaparse";

const apiToken = process.env.DATOCMS_API_TOKEN || "";
const environment = process.env.DATOCMS_ENV || "";
const buildTriggerId = process.env.DATOCMS_BUILD_TRIGGHER || "";
const logLevel = LogLevel.NONE;
const client = buildClient({ apiToken, environment, logLevel });

const OPENDATA_BASEURL = process.env.RAW_REPO_URL;
const DATAVIZ = "dataviz";
const KPI = "kpi_element";

async function readCsv(url: string) {
  try {
    axios.defaults.timeout = 5000;
    const response = await axios.get(url);
    // console.log("response.data", response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

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
  const url = `${OPENDATA_BASEURL}/dataviz/${fileName}`;
  const data = await readCsv(url);
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

async function processRecord(item: Item, type: string) {
  const { id, chart_data, open_data_path } = item;
  const prevData = JSON.parse(chart_data as string);
  // console.log("prev data", prevData.data);
  //GET FRESH DATA
  const parsedData = await getOpendataFile(open_data_path as string);
  // console.log("new data", parsedData);
  // TODO string to numbers
  if (!parsedData) return false;
  if (type === KPI) {
    // const newValue = parsedData[1]
    console.log("parsedData", parsedData);
  } else {
    //UPDATE DATA
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
    const result = await processRecord(r);
    if (result) {
      ids.push(r.id);
    }
  }
  return ids;
}
(async () => {
  const start = Date.now();
  const ids = await processRecords(DATAVIZ);
  console.log("UPDATES:", ids);
  if (ids.length > 0) {
    //BULK PUBLISH
    console.log("PUBLISH");
    await bulkPublish(ids);
    //TRIGGHER BUILD
    if (buildTriggerId) {
      console.log("BUILD");
      await client.buildTriggers.trigger(buildTriggerId);
    }
  }
  const elapsed = Math.ceil((Date.now() - start) / 60000);
  console.log("finished in", elapsed, "secs");
})();
