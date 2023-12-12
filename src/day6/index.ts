import { parseInputFileToArr } from '@/lib/parse'

type Race = {
  time: number
  distance: number
}

const parseRacesInfo = (racesInfo: string[]): Race[] => {
  const result: Race[] = []

  const [times, distances] = racesInfo.map<number[]>(raceString => {
    return raceString
      .split(':')[1]
      .match(/\d+/g)
      ?.map<number>(Number) as number[]
  })

  for (let i = 0; i < times.length; i++)
    result.push({ time: times[i], distance: distances[i] })

  return result
}

const findNumberOfWaysToBeatRace = (race: Race): number => {
  const { time, distance: recordDistance } = race
  let waysToBeatAmount = 0

  for (let timeForButton = 0; timeForButton <= time; timeForButton++) {
    const timeForTravel = time - timeForButton
    const totalDistance = timeForTravel * timeForButton
    if (totalDistance > recordDistance) waysToBeatAmount++
  }

  return waysToBeatAmount
}

export const partOne = async (inputFileName: string): Promise<number> => {
  const racesInfo = await parseInputFileToArr(inputFileName)
  const races = parseRacesInfo(racesInfo)
  const waysToBeatRaces = races.map(race => findNumberOfWaysToBeatRace(race))
  return waysToBeatRaces.reduce((prev, curr) => prev * curr, 1)
}

//--------------------------------------------------------------------

const parseSingleRaceInfo = (raceInfo: string[]): Race => {
  const [time, distance] = raceInfo.map<number>(raceString => {
    return Number(raceString.split(':')[1].match(/\d+/g)?.join(''))
  })

  return {time, distance}
}

export const partTwo = async (inputFileName: string): Promise<number> => {
  const raceInfo = await parseInputFileToArr(inputFileName)
  const race = parseSingleRaceInfo(raceInfo)
  return findNumberOfWaysToBeatRace(race)
}