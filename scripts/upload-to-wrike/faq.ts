import {
  render,
  StructuredTextDocument,
} from "datocms-structured-text-to-plain-text";

const datoToken = Deno.env.get("DATOCMS_API_TOKEN") ?? "";

const query = `{
  allFaqs(first: 500, skip: 0) {
    title
    slug
    body {
      ... on RichTextSectionRecord {
        id
        content {
          value
        }
      }
    }
  }
}`;

export async function getFaq(): Promise<string> {
  const datoRes = await fetch("https://graphql.datocms.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${datoToken}`,
    },
    body: JSON.stringify({ query }),
  });
  if (!datoRes.ok) {
    throw new Error(`Failed to retrieve FAQs from DatoCMS`);
  }

  const body = await datoRes.json();

  const faqs = body.data.allFaqs;

  console.log(`Fetched ${faqs.length} FAQs.`);

  return faqs.map((
    { title, body, slug }: {
      title: string;
      body: Array<{ content: StructuredTextDocument }>;
      slug: string;
    },
  ) =>
    `${title}

${render(body[0].content)}

https://padigitale2026.gov.it/${slug}
`
  ).join(`\n---\n\n`);
}
