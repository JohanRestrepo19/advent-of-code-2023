import { parseFileInput } from '@/lib/parse'

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

export const partOne = async (inputFileName: string) => {
  const fileContents = await parseFileInput(inputFileName)
  const gameLog = parseInputToGames(fileContents)
  const validGames = filterValidGames(gameLog, { red: 12, green: 13, blue: 14 })
  return sumGamesIds(validGames)
}
