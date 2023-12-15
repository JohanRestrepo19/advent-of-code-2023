export const invertString = (str: string): string => {
  let result = ''
  for (let i = str.length - 1; i >= 0; i--) result += str[i]
  return result
}

//NOTE: this is a naive implementation of LCM.
export const LCM = (numbers: number[]): number => {
  let results: number[] = [...numbers]
  let divisor = 2
  const factors: number[] = []

  while (!results.every(value => value === 1)) {
    if (results.some(value => value % divisor === 0)) {
      results = results.map<number>(value => {
        if (value % divisor === 0) return value / divisor
        else return value
      })
      factors.push(divisor)
    }

    divisor++
  }

  return factors.reduce((prev, curr) => prev * curr, 1)
}
