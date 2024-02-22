import { defineCollection, reference, z } from 'astro:content'

const authors = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1, { message: 'Name is required' }),
      nameJa: z.string().nullish(),
      about: z.string().nullish(),
      occupation: z.string().nullish(),
      twitter: z.string().nullish(),
      github: z.string().nullish(),
      slack: z.string().nullish(),
      image: image().nullish(),
    }),
})

const posts = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1, { message: 'Title is required' }),
      image: image().optional(),
      tags: z.array(z.string()).optional(),
      categories: z.array(reference('categories')).optional(),
      authors: z.array(reference('authors')),
      date: z.date(),
    }),
})

const categories = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
  }),
})

export const collections = { authors, posts, categories }
