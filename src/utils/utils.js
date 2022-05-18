export const formatHashtags = (string) => {
  return string.split(',').map((item) => {
    return `#${item}`
  })
}
