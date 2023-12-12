import { parseInputFile } from '@/lib/parse'

type PartNumber = {
  index: number
  value: string
}

const findPartNumberCandidates = (engineSchematic: string): PartNumber[] => {
  const candidates = engineSchematic.matchAll(/\d+/g)
  const result: PartNumber[] = []

  for (const candidate of candidates)
    result.push({ index: candidate.index as number, value: candidate[0] })

  return result
}

const getNumberNeighbors = (
  idx: number,
  engineSchematic: string
): (string | undefined)[] => {
  const schematicCols = engineSchematic.indexOf('\n') + 1

  return [
    engineSchematic[idx - schematicCols - 1],
    engineSchematic[idx - schematicCols - 0],
    engineSchematic[idx - schematicCols + 1],
    engineSchematic[idx + 0 + 1],
    engineSchematic[idx + schematicCols + 1],
    engineSchematic[idx + schematicCols + 0],
    engineSchematic[idx + schematicCols - 1],
    engineSchematic[idx + 0 - 1],
  ]
}

const isValidPartNumber = (
  partNumber: PartNumber,
  engineSchematic: string
): boolean => {
  const { index: partIdx, value: partNumberCandidate } = partNumber

  for (let i = partIdx; i < partIdx + partNumberCandidate.length; i++) {
    const neighbors = getNumberNeighbors(i, engineSchematic)

    for (const neighbor of neighbors) {
      if (neighbor) {
        const isValidNeighbor = neighbor?.match(/[^\d|.|\s]/g)
        if (isValidNeighbor) return true
      }
    }
  }

  return false
}

export const partOne = async (inputFileName: string): Promise<number> => {
  const engineSchematic = await parseInputFile(inputFileName)
  const partNumberCandidates = findPartNumberCandidates(engineSchematic)

  return partNumberCandidates
    .filter(partNumber => isValidPartNumber(partNumber, engineSchematic))
    .reduce((prev, curr) => prev + Number(curr.value), 0)
}

//--------------------------------------------------------------------

type PartNumberWithIndexes = {
  value: string
  indexes: number[]
}

const getGearNeighborIndexes = (
  idx: number,
  engineSchematic: string
): number[] => {
  const schematicCols = engineSchematic.indexOf('\n') + 1

  return [
    idx - schematicCols - 1,
    idx - schematicCols - 0,
    idx - schematicCols + 1,
    idx + 0 + 1,
    idx + schematicCols + 1,
    idx + schematicCols + 0,
    idx + schematicCols - 1,
    idx + 0 - 1,
  ]
}

const isIndexIncludedInSurroundings = (
  index: number,
  surroundingIndexes: number[]
): boolean => {
  return surroundingIndexes.includes(index)
}

const findGearNeighborParts = (
  gearIndex: number,
  partNumbers: PartNumberWithIndexes[],
  engineSchematic: string
): PartNumberWithIndexes[] => {
  const partNumberNeigbors: PartNumberWithIndexes[] = []
  const surroundingIndexes = getGearNeighborIndexes(gearIndex, engineSchematic)

  for (const pn of partNumbers) {
    for (const index of pn.indexes) {
      if (isIndexIncludedInSurroundings(index, surroundingIndexes)) {
        partNumberNeigbors.push(pn)
        break
      }
    }
  }

  return partNumberNeigbors
}

const findGearCandidatesIndexes = (engineSchematic: string): number[] => {
  const candidates = engineSchematic.matchAll(/\*/g)
  const indexes: number[] = []
  for (const candidate of candidates) indexes.push(candidate.index as number)

  return indexes
}

const getGearsRatios = (
  gearCandidatesIndexes: number[],
  partNumbers: PartNumberWithIndexes[],
  engineSchematic: string
): number[] => {
  const gearNeighbors: PartNumberWithIndexes[][] = []

  for (const gearIdx of gearCandidatesIndexes) {
    gearNeighbors.push(
      findGearNeighborParts(gearIdx, partNumbers, engineSchematic)
    )
  }

  const validGearNeighborsSets = gearNeighbors.filter(
    neighborSet => neighborSet.length === 2
  )

  return validGearNeighborsSets.map(
    neighborSet => Number(neighborSet[0].value) * Number(neighborSet[1].value)
  )
}

export const partTwo = async (inputFileName: string): Promise<number> => {
  const engineSchematic = await parseInputFile(inputFileName)

  const partNumbersWithIndexes = findPartNumberCandidates(engineSchematic)
    .filter(pn => isValidPartNumber(pn, engineSchematic))
    .map<PartNumberWithIndexes>(pn => {
      const indexes: number[] = []
      for (let i = 0; i < pn.value.length; i++) indexes.push(pn.index + i)
      return { value: pn.value, indexes }
    })

  const gearCandidatesIndexes = findGearCandidatesIndexes(engineSchematic)

  return getGearsRatios(
    gearCandidatesIndexes,
    partNumbersWithIndexes,
    engineSchematic
  ).reduce((prev, curr) => prev + curr)
}
