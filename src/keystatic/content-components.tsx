import { fields } from '@keystatic/core'
import { wrapper } from '@keystatic/core/content-components'

export const ImageWithCaption = wrapper({
  label: 'Image with caption',
  description: 'An image with a caption',
  schema: {
    src: fields.image({ label: 'Image', directory: './../' }),
    caption: fields.text({ label: 'Caption' }),
  },
})
