import { defineCollection, reference, z } from 'astro:content'

const authors = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    nameJa: z.string().optional(),
    about: z.string().optional(),
    occupation: z.string().optional(),
    twitter: z.string().optional(),
    github: z.string().optional(),
    slack: z.string().optional(),
    image: z.string().optional(),
  }),
})

const posts = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1, { message: 'Title is required' }),
      image: image(),
      tags: z.array(z.string()),
      categories: z.array(reference('categories')),
      authorIds: z.array(reference('authors')),
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
