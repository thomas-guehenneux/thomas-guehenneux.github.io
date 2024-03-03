/** @jsxImportSource react */

import { collection, config, fields } from '@keystatic/core'
import { block, wrapper } from '@keystatic/core/content-components'
import { Tweet } from 'react-tweet'

// Convert Uint8Array to img src
function bufferToBase64(buf: Uint8Array) {
  const binStr = Array.from(buf)
    .map((byte) => String.fromCharCode(byte))
    .join('')
  return `data:image/png;base64,${window.btoa(binStr)}`
}

const animatedImage = (directory: string, publicPath: string) => {
  return wrapper({
    label: 'Animated Image',
    description: 'An animated image',
    schema: {
      mp4Src: fields.file({
        label: 'MP4',
        directory,
        publicPath,
        validation: { isRequired: true },
      }),
      webmSrc: fields.file({
        label: 'WebM',
        directory,
        publicPath,
        validation: { isRequired: true },
      }),
    },
    ContentView: (data) =>
      data.value.mp4Src &&
      data.value.webmSrc && (
        <figure style={{ textAlign: 'center' }}>
          <video autoPlay loop muted playsInline style={{ maxWidth: '100%' }}>
            <source src={bufferToBase64(data.value.webmSrc.data)} type="video/webm" />
            <source src={bufferToBase64(data.value.mp4Src.data)} type="video/mp4" />
          </video>
          {data.children && <figcaption>{data.children}</figcaption>}
        </figure>
      ),
  })
}

const imageWithCaption = (directory: string, publicPath: string) => {
  return wrapper({
    label: 'Image with caption',
    description: 'An image with a caption',
    ContentView: (data) =>
      data.value.imagePath?.data && (
        <figure>
          <img
            src={bufferToBase64(data.value.imagePath.data)}
            style={{ maxHeight: '600px', margin: 'auto', display: 'block' }}
          />
          <figcaption style={{ textAlign: 'center' }}>{data.children}</figcaption>
        </figure>
      ),
    schema: {
      imagePath: fields.image({
        label: 'Image',
        directory,
        publicPath,
      }),
      alt: fields.text({ label: 'Caption' }),
    },
  })
}

const youtubeVideo = wrapper({
  label: 'YouTube Video',
  description: 'A YouTube video',
  schema: {
    videoId: fields.text({ label: 'Video ID', validation: { isRequired: true } }),
  },
  ContentView: (data) =>
    data.value.videoId ? (
      <figure style={{ textAlign: 'center' }}>
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${data.value.videoId}`}
          title="YouTube video player"
          frame-border="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allow-full-screen
        ></iframe>
        {data.children && <figcaption>{data.children}</figcaption>}
      </figure>
    ) : (
      <p>Please add a YouTube video id and a caption (optional)</p>
    ),
})

const vimeoVideo = wrapper({
  label: 'Vimeo Video',
  description: 'A Vimeo video',
  schema: {
    videoId: fields.text({ label: 'Video ID', validation: { isRequired: true } }),
  },
  ContentView: (data) =>
    data.value.videoId ? (
      <figure style={{ textAlign: 'center' }}>
        <iframe
          src={`https://player.vimeo.com/video/${data.value.videoId}`}
          width="640"
          height="512"
          frame-border="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        ></iframe>
        {data.children && <figcaption>{data.children}</figcaption>}
      </figure>
    ) : (
      <p>Please add a Vimeo video id and a caption (optional)</p>
    ),
})

const video = (directory: string, publicPath: string) => {
  return wrapper({
    label: 'Video',
    description: 'A video',
    schema: {
      mp4Src: fields.file({
        label: 'MP4',
        directory,
        publicPath,
        validation: { isRequired: true },
      }),
      webmSrc: fields.file({
        label: 'WebM',
        directory,
        publicPath,
        validation: { isRequired: true },
      }),
    },
    ContentView: (data) =>
      data.value.mp4Src && data.value.webmSrc ? (
        <figure style={{ textAlign: 'center' }}>
          <video controls preload="none" style={{ maxWidth: '100%' }}>
            <source src={bufferToBase64(data.value.webmSrc.data)} type="video/webm" />
            <source src={bufferToBase64(data.value.mp4Src.data)} type="video/mp4" />
          </video>
          {data.children && <figcaption>{data.children}</figcaption>}
        </figure>
      ) : (
        <p>Please add a video in both mp4 (h264) and webM(vp9) formats</p>
      ),
  })
}

const tweet = block({
  label: 'Tweet',
  description: 'A tweet',
  schema: {
    tweetId: fields.text({ label: 'Tweet ID', validation: { isRequired: true } }),
  },
  ContentView: (data) => data.value.tweetId && <Tweet id={data.value.tweetId} />,
})

type Path = `${string}/*` | `${string}/**` | `${string}/*/${string}` | `${string}/**/${string}` | undefined

const postCollection = (collectionPath: Path, directory: string, publicPath: string, collectionName: string) => {
  return collection({
    label: collectionName,
    slugField: 'title',
    path: collectionPath,
    format: { contentField: 'content' },
    entryLayout: 'content',
    schema: {
      title: fields.slug({ name: { label: 'Title' } }),
      header: fields.image({
        label: 'Image',
        directory,
        publicPath,
      }),
      authors: fields.array(
        fields.relationship({
          label: 'Authors',
          description: 'A list of authors for this post',
          collection: 'authors',
        }),
        {
          label: 'Authors',
          itemLabel: (props) => props.value || 'Select author(s)',
        },
      ),
      categories: fields.array(
        fields.relationship({
          label: 'Categories',
          description: 'A list of categories for this post',
          collection: 'categories',
        }),
        {
          label: 'Categories',
          itemLabel: (props) => props.value || 'Select one category or more',
        },
      ),
      content: fields.markdoc({
        label: 'Content',
        options: {
          image: {
            directory,
            publicPath,
            schema: {
              alt: fields.text({ label: 'Alt' }),
              title: fields.text({ label: 'Title' }),
            },
          },
          heading: {
            levels: [2, 3, 4, 5, 6],
            schema: {},
          },
        },
        components: {
          AnimatedImage: animatedImage(directory, publicPath),
          ImageWithCaption: imageWithCaption(directory, publicPath),
          YouTubeVideo: youtubeVideo,
          VimeoVideo: vimeoVideo,
          Tweet: tweet,
          Video: video(directory, publicPath),
        },
      }),
      date: fields.date({ label: 'Date', validation: { isRequired: true } }),
      tags: fields.array(fields.text({ label: 'Tag' }), {
        label: 'Tag',
        itemLabel: (props) => props.value,
      }),
    },
  })
}

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    authors: collection({
      label: 'Authors',
      slugField: 'name',
      path: 'src/content/authors/*/',
      format: { contentField: 'content' },
      schema: {
        name: fields.slug({ name: { label: 'Name', validation: { isRequired: true } } }),
        occupation: fields.text({ label: 'Occupation' }),
        about: fields.text({ label: 'About' }),
        twitter: fields.text({ label: 'Twitter' }),
        github: fields.text({ label: 'Github' }),
        slack: fields.text({ label: 'Slack' }),
        image: fields.image({ label: 'Image', directory: 'src/content/authors', publicPath: 'src/content/authors/' }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
          images: true,
        }),
      },
    }),
    categories: collection({
      label: 'Categories',
      slugField: 'name',
      path: 'src/content/categories/*',
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
      },
    }),
    postsEn: postCollection(
      'src/content/posts/en/*/',
      'src/content/posts/en',
      'src/content/posts/en/',
      'Posts in English',
    ),
    postsJa: postCollection(
      'src/content/posts/ja/*/',
      'src/content/posts/ja',
      'src/content/posts/ja/',
      'Posts in Japanese',
    ),
    // posts: collection({
    //   label: 'Posts in English',
    //   slugField: 'title',
    //   path: 'src/content/posts/en/*/',
    //   format: { contentField: 'content' },
    //   entryLayout: 'content',
    //   schema: {
    //     title: fields.slug({ name: { label: 'Title' } }),
    //     header: fields.image({
    //       label: 'Image',
    //       directory: 'src/content/posts/en',
    //       publicPath: 'src/content/posts/en/',
    //     }),
    //     authors: fields.array(
    //       fields.relationship({
    //         label: 'Authors',
    //         description: 'A list of authors for this post',
    //         collection: 'authors',
    //       }),
    //       {
    //         label: 'Authors',
    //         itemLabel: (props) => props.value || 'Select author(s)',
    //       },
    //     ),
    //     categories: fields.array(
    //       fields.relationship({
    //         label: 'Categories',
    //         description: 'A list of categories for this post',
    //         collection: 'categories',
    //       }),
    //       {
    //         label: 'Categories',
    //         itemLabel: (props) => props.value || 'Select one category or more',
    //       },
    //     ),
    //     content: fields.markdoc({
    //       label: 'Content',
    //       options: {
    //         image: {
    //           directory: '/src/content/posts/en',
    //           publicPath: '/src/content/posts/en/',
    //           schema: {
    //             alt: fields.text({ label: 'Alt' }),
    //             title: fields.text({ label: 'Title' }),
    //           },
    //         },
    //         heading: {
    //           levels: [2, 3, 4, 5, 6],
    //           schema: {},
    //         },
    //       },
    //       components: {
    //         AnimatedImage: animatedImage('src/content/posts/en', '/src/content/posts/en/'),
    //         ImageWithCaption: imageWithCaption('src/content/posts/en', '/src/content/posts/en/'),
    //         YouTubeVideo: youtubeVideo,
    //         VimeoVideo: vimeoVideo,
    //         Tweet: tweet,
    //         Video: video('src/content/posts/en', '/src/content/posts/en/'),
    //       },
    //     }),
    //     date: fields.date({ label: 'Date', validation: { isRequired: true } }),
    //     tags: fields.array(
    //       fields.text({ label: 'Tag' }),
    //       // Labelling options
    //       {
    //         label: 'Tag',
    //         itemLabel: (props) => props.value,
    //       },
    //     ),
    //   },
    // }),
    // jaPosts: collection({
    //   label: 'Posts in Japanese',
    //   slugField: 'title',
    //   path: 'src/content/posts/ja/*/',
    //   format: { contentField: 'content' },
    //   entryLayout: 'content',
    //   schema: {
    //     title: fields.slug({ name: { label: 'Title' } }),
    //     header: fields.image({
    //       label: 'Image',
    //       directory: 'src/content/posts/ja',
    //       publicPath: 'src/content/posts/ja/',
    //     }),
    //     authors: fields.array(
    //       fields.relationship({
    //         label: 'Authors',
    //         description: 'A list of authors for this post',
    //         collection: 'authors',
    //       }),
    //       {
    //         label: 'Authors',
    //         itemLabel: (props) => props.value || 'Select author(s)',
    //       },
    //     ),
    //     categories: fields.array(
    //       fields.relationship({
    //         label: 'Categories',
    //         description: 'A list of categories for this post',
    //         collection: 'categories',
    //       }),
    //       {
    //         label: 'Categories',
    //         itemLabel: (props) => props.value || 'Select one category or more',
    //       },
    //     ),
    //     content: fields.markdoc({
    //       label: 'Content',
    //       options: {
    //         image: {
    //           directory: '/src/content/posts/ja',
    //           publicPath: '/src/content/posts/ja/',
    //           schema: {
    //             alt: fields.text({ label: 'Alt' }),
    //             title: fields.text({ label: 'Title' }),
    //           },
    //         },
    //         heading: {
    //           levels: [2, 3, 4, 5, 6],
    //           schema: {},
    //         },
    //       },
    //       components: {
    //         AnimatedImage: animatedImage('src/content/posts/ja', '/src/content/posts/ja/'),
    //         ImageWithCaption: imageWithCaption('src/content/posts/ja', '/src/content/posts/ja/'),
    //         YouTubeVideo: youtubeVideo,
    //         VimeoVideo: vimeoVideo,
    //         Tweet: tweet,
    //         Video: video('src/content/posts/ja', '/src/content/posts/ja/'),
    //       },
    //     }),
    //     date: fields.date({ label: 'Date', validation: { isRequired: true } }),
    //     tags: fields.array(
    //       fields.text({ label: 'Tag' }),
    //       // Labelling options
    //       {
    //         label: 'Tag',
    //         itemLabel: (props) => props.value,
    //       },
    //     ),
    //   },
    // }),
  },
})
