import { parseInputFile, parseInputFileToArr } from '@/lib/parse'
import { type DayProblem } from '@/lib/types'

type Point = { x: number; y: number }

const directions = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
]

// const validPipesToMove = [
//   ['|', '7', 'F'],
//   ['-', 'J', '7'],
//   ['|', 'L', 'J'],
//   ['-', 'L', 'F'],
// ]

// prettier-ignore
const pipesValidMovements = {
  '|': [['|', '7', 'F'], [], ['|', 'L', 'J'], []],
  '-': [[], ['-', 'J', '7'], [], ['-', 'L', 'F']],
  'L': [['|', '7', 'F'], ['-', 'J', '7'], [], []],
  'J': [['|', '7', 'F'], [], [], ['-', 'L', 'F']],
  '7': [[], [], ['|', 'L', 'J'], ['-', 'L', 'F']],
  'F': [[], ['-', 'J', '7'], ['|', 'L', 'J'], []],
}

const findStartingPoint = (rawSketch: string): Point => {
    const sketchLen = rawSketch.indexOf('\n')
    const cleanSketch = rawSketch.replaceAll(/\n/g, '')
    const indexOfStarting = cleanSketch.indexOf('S')
    return {
        y: Math.floor(indexOfStarting / sketchLen),
        x: indexOfStarting % sketchLen,
    }
}

const isValidPipe = (
    sketch: string[],
    prev: Point,
    curr: Point,
    directionIdx: number
): boolean => {
    const currentPipe = sketch[curr.y][curr.x]
    const prevPipe = sketch[prev.y][prev.x]
    const movements =
        pipesValidMovements[prevPipe as keyof typeof pipesValidMovements][
            directionIdx
        ]

    console.log({ currentPipe, prevPipe, movements })

    if (movements.length === 0) return false

    if (movements.includes(currentPipe)) return true

    return false
}

//NOTE: Se podría tener un contador para el numero de veces que se ha pasado por el origen.
const walk = (
    sketch: string[],
    path: Point[],
    seen: boolean[][],
    start: Point,
    current: Point,
    prev?: Point,
    directionIdx?: number
): boolean => {
    // NOTE: Casos base

    //fuera de los limites
    if (
        current.x < 0 ||
        current.x >= sketch[0].length ||
        current.y < 0 ||
        current.y >= sketch.length
    ) {
        return false
    }

    // Meta(?) aquí puede haber problemas con la resolución del camino.
    if (
        seen[current.y][current.x] &&
        start.x === current.x &&
        start.y === current.y
    ) {
        path.push(current)
        return true
    }

    //NOTE: descomentar
    // // Pipe válido
    if (directionIdx && prev) {
        if (!isValidPipe(sketch, current, prev, directionIdx)) return false
    }

    // Ficha ya visitada
    if (seen[current.y][current.x]) {
        return false
    }

    //NOTE: Caso recursivo.

    seen[current.y][current.x] = true
    path.push(current)

    for (let dirIdx = 0; dirIdx < directions.length; dirIdx++) {
        const [x, y] = directions[dirIdx]
        if (
            walk(
                sketch,
                path,
                seen,
                start,
                {
                    x: current.x + x,
                    y: current.y + y,
                },
                current,
                dirIdx
            )
        )
            return true
    }

    path.pop()

    return false
}

const findLoop = (sketch: string[], start: Point): Point[] => {
    const path: Point[] = []
    const seen: boolean[][] = []

    for (let i = 0; i < sketch.length; i++) {
        seen.push(new Array(sketch[0].length).fill(false))
    }

    walk(sketch, path, seen, start, start)

    path.forEach(point => console.log(sketch[point.y][point.x]))

    return path
}

export const partOne: DayProblem = async inputFileName => {
    const rawSketch = await parseInputFile(inputFileName)
    const sketch = await parseInputFileToArr(inputFileName)
    const startingPoint = findStartingPoint(rawSketch)
    const loop = findLoop(sketch, startingPoint)
    return -1
}
