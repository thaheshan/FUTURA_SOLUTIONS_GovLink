export async function showError(e, text = 'Something went wrong, please try again later') {
    const message = console
    const error = await e;
    message.error(error?.message || error?.message?.message || text);
  }

  export function getThumbnail(item, defaultThumb = '/leaf.jpg') {
    const images = item.files?.filter((f) => f.type === 'feed-photo') || [];
    const videos = item.files?.filter((f) => f.type === 'feed-video') || [];
    return (item?.thumbnail?.thumbnails && item?.thumbnail?.thumbnails[0])
      || (images && images[0] && images[0]?.thumbnails && images[0]?.thumbnails[0])
      || (item?.teaser && item?.teaser?.thumbnails && item?.teaser?.thumbnails[0])
      || (videos && videos[0] && videos[0]?.thumbnails && videos[0]?.thumbnails[0])
      || defaultThumb;
  }