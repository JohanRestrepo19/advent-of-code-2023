import { parseInputFileToArr } from '@/lib/parse'
import { type DayProblem, type Point as Position } from '@/lib/types'
import { distanceBetweenPoints, transponseMatrix } from '@/lib/utils'

type Image = string[]

type UniverseInfo = {
  image: Image
  galaxiesPositions: Map<number, Position>
}

const DIRECTIONS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
]

const parseImage = (image: string[]): UniverseInfo => {
  let galaxyId = 1
  const parsedImage: string[][] = []
  const galaxiesPositions: UniverseInfo['galaxiesPositions'] = new Map()

  for (let row = 0; row < image.length; row++) {
    const line: string[] = []
    for (let col = 0; col < image[row].length; col++) {
      if (image[row][col] === '#') {
        line.push(`${galaxyId}`)
        galaxiesPositions.set(galaxyId, { x: col, y: row })
        galaxyId++
      } else {
        line.push(image[row][col])
      }
    }
    parsedImage.push(line)
  }

  return {
    image: parsedImage.map(line => line.join('')),
    galaxiesPositions,
  }
}

const expandRows = (image: string[]): string[] => {
  const result: string[] = []

  for (const line of image) {
    if (!line.includes('#')) result.push(line)
    result.push(line)
  }

  return result
}

const expandCols = (image: string[]): string[] => {
  const invertedImage: string[] = transponseMatrix(
    image.map(el => el.split(''))
  ).map(el => el.join(''))

  const expandedRows = expandRows(invertedImage)

  return transponseMatrix(expandedRows.map(el => el.split(''))).map(el =>
    el.join('')
  )
}

const expandSpace = (image: string[]): string[] => {
  let result = expandRows(image)
  result = expandCols(result)
  return result
}

const getPairsFromNumber = (n: number): number[][] => {
  const pairs: number[][] = []

  for (let i = 1; i < n; i++)
    for (let j = i + 1; j <= n; j++) pairs.push([i, j])

  return pairs
}

const findPlanetsMinDistance = (
  image: UniverseInfo['image'],
  current: Position,
  endPlanetPos: Position,
  steps = 0
): number => {
  if (current.x === endPlanetPos.x && current.y === endPlanetPos.y) return steps

  let currMinDistance = Infinity
  let nextPos: Position = { x: 0, y: 0 }

  for (const [x, y] of DIRECTIONS) {
    const candidate = { x: current.x + x, y: current.y + y }
    if (
      candidate.x < 0 ||
      candidate.x >= image[0].length ||
      candidate.y < 0 ||
      candidate.y >= image.length
    )
      continue

    const distance = distanceBetweenPoints(candidate, endPlanetPos)

    if (distance < currMinDistance) {
      currMinDistance = distance
      nextPos = candidate
    }
  }

  return findPlanetsMinDistance(image, nextPos, endPlanetPos, steps + 1)
}

const findShortestPlanetsPath = (
  universerInfo: UniverseInfo,
  pairs: number[][]
): number[] => {
  const { image, galaxiesPositions } = universerInfo
  const distances: number[] = []

  for (const [initialPlanet, endPlanet] of pairs) {
    const initialPlanetPos = galaxiesPositions.get(initialPlanet) as Position
    const endPlanetPos = galaxiesPositions.get(endPlanet) as Position
    distances.push(
      findPlanetsMinDistance(image, initialPlanetPos, endPlanetPos)
    )
  }

  return distances
}

export const partOne: DayProblem = async inputFileName => {
  const spaceImage = await parseInputFileToArr(inputFileName)
  const expandedImage = expandSpace(spaceImage)
  const universerInfo = parseImage(expandedImage)
  const planetPairs = getPairsFromNumber(universerInfo.galaxiesPositions.size)

  return findShortestPlanetsPath(universerInfo, planetPairs).reduce(
    (prev, curr) => prev + curr
  )
}
