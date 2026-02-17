export function parseTweetUrl(url: string): string | null {
  const patterns = [
    /twitter\.com\/\w+\/status\/(\d+)/,
    /x\.com\/\w+\/status\/(\d+)/,
    /mobile\.twitter\.com\/\w+\/status\/(\d+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}

export function isValidTweetUrl(url: string): boolean {
  return parseTweetUrl(url) !== null
}

export function generateTweetUrl(tweetId: string): string {
  return `https://twitter.com/i/status/${tweetId}`
}
