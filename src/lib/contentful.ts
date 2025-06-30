import { createClient } from 'contentful';

const SPACE_ID = import.meta.env.CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = import.meta.env.CONTENTFUL_ACCESS_TOKEN;

const client = createClient({
  space: SPACE_ID,
  accessToken: ACCESS_TOKEN,
});

function getImageUrl(image) {
  if (
    image &&
    typeof image === 'object' &&
    'fields' in image &&
    image.fields.file &&
    image.fields.file.url
  ) {
    return image.fields.file.url.startsWith('http')
      ? image.fields.file.url
      : 'https:' + image.fields.file.url;
  }
  return null;
}

// Fetch all case studies for the portfolio (homepage, etc)
export async function getCaseStudyPageData() {
  const entries = await client.getEntries({
    content_type: 'caseStudy',
    order: ['-sys.createdAt'],
  });
  return entries.items.map(item => {
    const fields = item.fields;
    return {
      ...fields,
      id: item.sys.id,
      slug: fields.slug,
      mainImageUrl: getImageUrl(fields.mainImage), // always use mainImage
      isFeatured: fields.isFeatured || false,
    };
  });
}

// Fetch a single case study by slug
export async function getCaseStudyBySlug(slug) {
  const entries = await client.getEntries({
    content_type: 'caseStudy',
    'fields.slug': slug,
    limit: 1,
  });
  if (!entries.items.length) return null;
  const item = entries.items[0];
  return {
    id: item.sys.id,
    title: item.fields.title,
    slug: item.fields.slug,
    summary: item.fields.summary,
    fullDescription: item.fields.fullDescription,
    servicesUsed: item.fields.servicesUsed,
    link: item.fields.link,
    mainImage: getImageUrl(item.fields.mainImage),
    publishedDate: item.fields.publishedDate,
    isFeatured: item.fields.isFeatured,
  };
}

// Fetch all blog posts - UPDATED
export async function getBlogPosts() {
  const entries = await client.getEntries({
    content_type: 'blogPost',
    order: ['-fields.date', '-sys.createdAt'],
    include: 2, // Crucial: Fetch linked entries (like Tags and embedded VideoEmbeds)
  });
  return entries.items.map(item => ({
    id: item.sys.id,
    title: item.fields.title,
    slug: item.fields.slug,
    date: item.fields.date,
    description: item.fields.description,
    content: item.fields.content, // RichText content
    mainImage: getImageUrl(item.fields.mainImage), // Standardized to mainImage
    // Process tags: map array of tag references to array of tag names
    tags: item.fields.tags
      ? item.fields.tags.map(tagRef => tagRef.fields.name)
      : [],
    // Add other fields from item.fields as needed if they exist in Contentful
  }));
}

// Fetch a single blog post by slug - UPDATED
export async function getBlogPostBySlug(slug) {
  const entries = await client.getEntries({
    content_type: 'blogPost',
    'fields.slug': slug,
    limit: 1,
    include: 2, // Crucial: Fetch linked entries (like Tags and embedded VideoEmbeds)
  });
  if (!entries.items.length) return null;
  const item = entries.items[0];
  return {
    id: item.sys.id,
    mainImage: getImageUrl(item.fields.mainImage),
    title: item.fields.title,
    slug: item.fields.slug,
    date: item.fields.date,
    description: item.fields.description,
    content: item.fields.content, // RichText content
    // Process tags: map array of tag references to array of tag names
    tags: item.fields.tags
      ? item.fields.tags.map(tagRef => tagRef.fields.name)
      : [],
    // Add other fields from item.fields as needed if they exist in Contentful
  };
}