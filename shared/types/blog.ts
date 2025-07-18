import type { Section } from "./cms";

export type BlogPost = {
  createdAt: string;
  updatedAt: string;
  posterUrl: string;
} & Record<'uk' | 'en', {
  publishedAt: string;
  published: boolean;
  title: string;
  content: string;
  excerpt: string;
  sections: Section[];
  seo: {
    canonical: string;
    description: string;
    keywords: string;
    ogImage: string;
    title: string;
    twitterCard: string;
  }
}>;