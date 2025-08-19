export function random(min = 5000, max = 10000) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
