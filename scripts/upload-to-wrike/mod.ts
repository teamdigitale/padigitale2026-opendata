import { getAvvisi } from "./avvisi.ts";
import { getFaq } from "./faq.ts";

const wrikeAccessToken = Deno.env.get("WRIKE_ACCESS_TOKEN") ?? "";
const wrikeStatusId = Deno.env.get("WRIKE_WORK_IN_PROGRESS_STATUS_ID") ?? "";
const wrikeTaskId = Deno.env.get("WRIKE_TASK_ID") ?? "";
const wrikeUrl = "https://app-eu.wrike.com/api/v4";

const avvisiAttachmentId = Deno.env.get("WRIKE_AVVISI_ATTACHMENT_ID") ?? "";
const avvisiAttachmentFilename =
  Deno.env.get("WRIKE_AVVISI_ATTACHMENT_FILENAME") ?? "";
const faqAttachmentId = Deno.env.get("WRIKE_FAQ_ATTACHMENT_ID") ?? "";
const faqAttachmentFilename = Deno.env.get("WRIKE_FAQ_ATTACHMENT_FILENAME") ??
  "";

async function updateAttachment(
  attachmentId: string,
  filename: string,
  content: string,
) {
  const res = await fetch(
    `${wrikeUrl}/attachments/${attachmentId}`,
    {
      method: "PUT",
      body: content,
      headers: {
        Authorization: `Bearer ${wrikeAccessToken}`,
        "X-File-Name": filename,
      },
    },
  );
  if (!res.ok) {
    throw new Error(
      `Failed to upload attachment to Wrike: ${res.statusText}`,
    );
  }
}

async function resetStatus() {
  const params = new URLSearchParams();
  params.append("customStatus", wrikeStatusId);
  const res = await fetch(`${wrikeUrl}/tasks/${wrikeTaskId}?${params}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${wrikeAccessToken}`,
    },
  });
  if (!res.ok) {
    throw new Error(
      `Failed to set status of Wrike task: ${res.statusText}`,
    );
  }
}

try {
  const avvisi = await getAvvisi();
  await updateAttachment(avvisiAttachmentId, avvisiAttachmentFilename, avvisi);

  const faqs = await getFaq();
  await updateAttachment(faqAttachmentId, faqAttachmentFilename, faqs);

  await resetStatus();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  Deno.exit(1);
}
