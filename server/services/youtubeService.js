const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;



const searchYouTubeVideos = async (keyword, maxResults = 6) => {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YouTube API key is not configured.');
  }

  const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');

  searchUrl.searchParams.set('part', 'snippet');
  searchUrl.searchParams.set('q', keyword);
  searchUrl.searchParams.set('type', 'video');
  searchUrl.searchParams.set('order', 'relevance');
  searchUrl.searchParams.set('maxResults', String(maxResults));
  searchUrl.searchParams.set('key', YOUTUBE_API_KEY);

  const searchResponse = await fetch(searchUrl);

  if (!searchResponse.ok) {
    const errorText = await searchResponse.text();
    console.error('YouTube search API response:', errorText);
    throw new Error('Failed to fetch YouTube search results.');
  }

  const searchData = await searchResponse.json();

  const videoIds = searchData.items
    .map((item) => item.id?.videoId)
    .filter(Boolean)
    .join(',');

  if (!videoIds) {
    return [];
  }

  const videosUrl = new URL('https://www.googleapis.com/youtube/v3/videos');

  videosUrl.searchParams.set('part', 'snippet,statistics');
  videosUrl.searchParams.set('id', videoIds);
  videosUrl.searchParams.set('key', YOUTUBE_API_KEY);

  const videosResponse = await fetch(videosUrl);

  if (!videosResponse.ok) {
    const errorText = await videosResponse.text();
    console.error('YouTube videos API response:', errorText);
    throw new Error('Failed to fetch YouTube video details.');
  }

  const videosData = await videosResponse.json();

  return videosData.items.map((video) => ({
    id: video.id,
    title: video.snippet?.title || 'Untitled video',
    channelTitle: video.snippet?.channelTitle || 'Unknown channel',
    description: video.snippet?.description || '',
    publishedAt: video.snippet?.publishedAt || null,
    thumbnail: video.snippet?.thumbnails?.medium?.url || '',
    url: `https://www.youtube.com/watch?v=${video.id}`,
    views: Number(video.statistics?.viewCount || 0),
    likes: Number(video.statistics?.likeCount || 0),
    comments: Number(video.statistics?.commentCount || 0),
  }));
};

module.exports = {
  searchYouTubeVideos,
};