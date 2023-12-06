import { parseFileInputToArr } from '@/lib/parse'

type CubeSubset = {
  red: number
  green: number
  blue: number
}

type Game = CubeSubset[]

type GameLog = {
  [index: number | string]: Game
}

const parseSubsets = (subsets: string[]): Game => {
  return subsets.map(subset => {
    const cubes = subset.replace(/\s/g, '').split(',')
    const cubeSubset: CubeSubset = { red: 0, green: 0, blue: 0 }

    cubes.forEach(cube => {
      const color = `${cube.match(/red|green|blue/g)}` as keyof CubeSubset
      const amount = cube.match(/\d+/g)
      cubeSubset[color] = Number(amount)
    })

    return cubeSubset
  })
}

const parseInputToGames = (input: string[]): GameLog => {
  const gameLog: GameLog = {}

  input.forEach((gameStr, idx) => {
    const subsets = gameStr.split(':')[1].split(';')
    gameLog[idx + 1] = parseSubsets(subsets)
  })

  return gameLog
}

const filterValidGames = (gameLog: GameLog, validConfig: CubeSubset) => {
  const entries = Object.entries(gameLog)

  const filteredEntries = entries.filter(([_, game]) => {
    for (const subset of game) {
      if (subset.red > validConfig.red) return false
      if (subset.green > validConfig.green) return false
      if (subset.blue > validConfig.blue) return false
    }

    return true
  })

  return Object.fromEntries(filteredEntries)
}

const sumGamesIds = (games: GameLog) => {
  const keys = Object.keys(games)
  return keys.reduce((prev, curr) => Number(prev) + Number(curr), 0)
}

const findFewestNumberOfCubes = (gameLog: GameLog): CubeSubset[] => {
  const values = Object.values(gameLog)

  return values.map(game => {
    return game.reduce(
      (prevSubset, currentSubset) => {
        if (currentSubset.red > prevSubset.red)
          prevSubset.red = currentSubset.red
        if (currentSubset.green > prevSubset.green)
          prevSubset.green = currentSubset.green
        if (currentSubset.blue > prevSubset.blue)
          prevSubset.blue = currentSubset.blue
        return prevSubset
      },
      { red: 0, green: 0, blue: 0 }
    )
  })
}

const findSubsetsPower = (subsets: CubeSubset[]) => {
  return subsets.map(subset => subset.red * subset.green * subset.blue)
}

export const partOne = async (inputFileName: string) => {
  const fileContents = await parseFileInputToArr(inputFileName)
  const gameLog = parseInputToGames(fileContents)
  const validGames = filterValidGames(gameLog, { red: 12, green: 13, blue: 14 })
  return sumGamesIds(validGames)
}

export const partTwo = async (inputFileName: string) => {
  const fileContents = await parseFileInputToArr(inputFileName)
  const gameLog = parseInputToGames(fileContents)
  const fewestNumberOfCubes = findFewestNumberOfCubes(gameLog)
  const subsetsPower = findSubsetsPower(fewestNumberOfCubes)
  return subsetsPower.reduce((prev, curr) => prev + curr)
}
