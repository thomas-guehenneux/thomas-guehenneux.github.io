import { component, defineMarkdocConfig } from '@astrojs/markdoc/config'

export default defineMarkdocConfig({
  tags: {
    AnimatedImage: {
      render: component('./src/components/ui/AnimatedImage.astro'),
      attributes: {
        mp4Src: { type: String },
        webmSrc: { type: String },
      },
    },
    ImageWithCaption: {
      render: component('./src/components/ui/ImageWithCaption.astro'),
      attributes: {
        imagePath: { type: String },
        alt: { type: String },
      },
    },
    YouTubeVideo: {
      render: component('./src/components/ui/EmbedYouTube.astro'),
      attributes: {
        videoId: { type: String },
      },
    },
    VimeoVideo: {
      render: component('./src/components/ui/EmbedVimeo.astro'),
      attributes: {
        videoId: { type: String },
      },
    },
    Tweet: {
      render: component('./src/components/ui/EmbedTweet.astro'),
      attributes: {
        tweetId: { type: String },
      },
    },
  },
})
