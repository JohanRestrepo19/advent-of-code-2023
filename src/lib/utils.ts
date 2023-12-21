import { Point } from './types'

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

export const transponseMatrix = <T>(matrix: T[][]): T[][] => {
  const result: T[][] = new Array(matrix[0].length)

  for (let i = 0; i < result.length; i++) {
    result[i] = new Array(matrix.length).fill(null)
  }

  for (let row = 0; row < result.length; row++)
    for (let col = 0; col < result[row].length; col++)
      result[row][col] = matrix[col][row]

  return result
}

export const distanceBetweenPoints = (
  initialPoint: Point,
  finalPoint: Point
): number =>
  Math.sqrt(
    Math.pow(finalPoint.x - initialPoint.x, 2) +
    Math.pow(finalPoint.y - initialPoint.y, 2)
  )
