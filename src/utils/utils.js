export const formatHashtags = (hashtags) => {
  return hashtags.split(',').map((item) => {
    return `#${item}`
  })
}
