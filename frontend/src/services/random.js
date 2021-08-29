export const randomRange = (min, max) => Math.random() * (max - min) + min

export const randomSpeed = () => randomRange(8 / 1000, 2 / 100)

export const randomColor = () => {
  const letters = '0123456789ABCDEF'
  return Array.from(Array(6).keys()).reduce(
    (acc, _) => {
      const letter = letters[Math.floor(Math.random() * 16)]
      return `${acc}${letter}`
    },
    '#'
  )
}

export const randomBackgound = (width, height) => `https://source.unsplash.com/collection/3330445/${width}x${height}`
