import type { Section } from "./cms";

export type BlogPost = {
  id?: string;
  createdAt: string;
  updatedAt: string;
  posterUrl: string;
  publishedAt: string;
  published: boolean;
  categories: string[]
  readingTime?: number; // Reading time in minutes
} & Record<'uk' | 'en', {
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

export type BlogCategory = {
  id?: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}