import { parseInputFileToArr } from '@/lib/parse'
import { type DayProblem, type Point } from '@/lib/types'
import { cartesianDistanceBetweenPoints, transposeMatrix } from '@/lib/utils'

type Image = string[]

type UniverseInfo = {
    image: Image
    galaxiesPositions: Map<number, Point>
}

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
    const invertedImage: string[] = transposeMatrix(
        image.map(el => el.split(''))
    ).map(el => el.join(''))

    const expandedRows = expandRows(invertedImage)

    return transposeMatrix(expandedRows.map(el => el.split(''))).map(el =>
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

const findShortestPlanetsPath = (
    galaxiesPositions: UniverseInfo['galaxiesPositions'],
    pairs: number[][]
): number => {
    let distances = 0

    for (const [initialPlanet, endPlanet] of pairs) {
        const initialPlanetPos = galaxiesPositions.get(initialPlanet) as Point
        const endPlanetPos = galaxiesPositions.get(endPlanet) as Point
        const distanceBetweenPoints = cartesianDistanceBetweenPoints(
            initialPlanetPos,
            endPlanetPos
        )
        distances += distanceBetweenPoints
    }

    return distances
}

export const partOne: DayProblem = async inputFileName => {
    const spaceImage = await parseInputFileToArr(inputFileName)
    const expandedImage = expandSpace(spaceImage)
    const universerInfo = parseImage(expandedImage)
    const planetPairs = getPairsFromNumber(universerInfo.galaxiesPositions.size)

    return findShortestPlanetsPath(universerInfo.galaxiesPositions, planetPairs)
}

//--------------------------------------------------------------------

type Spaces = {
    rowsIdx: number[]
    colsIdx: number[]
}

const identifySpacesPositions = (image: Image): Spaces => {
    const rowsIdx: number[] = []
    const colsIdx: number[] = []
    const splittedImage = image.map(el => el.split(''))
    const transposedImage = transposeMatrix(splittedImage)

    for (let i = 0; i < splittedImage.length; i++)
        if (splittedImage[i].every(el => el === '.')) rowsIdx.push(i)

    for (let i = 0; i < transposedImage.length; i++)
        if (transposedImage[i].every(el => el === '.')) colsIdx.push(i)

    return {
        rowsIdx,
        colsIdx,
    }
}

const identifyGalaxiesPositions = (
    image: Image
): UniverseInfo['galaxiesPositions'] => {
    const galaxiesPositions: UniverseInfo['galaxiesPositions'] = new Map()
    const splittedImage = image.map(el => el.split(''))
    let galaxyId = 1

    for (let y = 0; y < splittedImage.length; y++) {
        for (let x = 0; x < splittedImage[0].length; x++) {
            if (splittedImage[y][x] === '#') {
                galaxiesPositions.set(galaxyId, { x, y })
                galaxyId++
            }
        }
    }

    return galaxiesPositions
}

const expandUniverse = (
    spacesIdx: Spaces,
    galaxiesPositions: UniverseInfo['galaxiesPositions'],
    expandFactor = 2
): {
    galaxiesPositions: UniverseInfo['galaxiesPositions']
} => {
    const updatedGalaxiesPositions = new Map(galaxiesPositions)

    const { rowsIdx, colsIdx } = spacesIdx

    for (const spaceRowId of rowsIdx) {
        for (const [galaxyId, position] of galaxiesPositions) {
            if (position.y > spaceRowId) {
                const updatedGalaxyPos = updatedGalaxiesPositions.get(
                    galaxyId
                ) as Point
                updatedGalaxiesPositions.set(galaxyId, {
                    ...updatedGalaxyPos,
                    y: updatedGalaxyPos.y + expandFactor - 1,
                })
            }
        }
    }

    for (const spaceColId of colsIdx) {
        for (const [galaxyId, position] of galaxiesPositions) {
            if (position.x > spaceColId) {
                const updatedGalaxyPos = updatedGalaxiesPositions.get(
                    galaxyId
                ) as Point
                updatedGalaxiesPositions.set(galaxyId, {
                    ...updatedGalaxyPos,
                    x: updatedGalaxyPos.x + expandFactor - 1,
                })
            }
        }
    }

    return { galaxiesPositions: updatedGalaxiesPositions }
}

export const partTwo: DayProblem = async inputFileName => {
    const spaceImage = await parseInputFileToArr(inputFileName)
    const spacesIdx = identifySpacesPositions(spaceImage)
    const galaxiesPositions = identifyGalaxiesPositions(spaceImage)
    const { galaxiesPositions: updatedGalaxiesPositions } = expandUniverse(
        spacesIdx,
        galaxiesPositions,
        1000000
    )

    const planetPairs = getPairsFromNumber(updatedGalaxiesPositions.size)

    return findShortestPlanetsPath(updatedGalaxiesPositions, planetPairs)
}
