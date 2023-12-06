import { parseFileInput } from '@/lib/parse'

type PartNumberCandidate = {
  index: number
  partNumber: string
}

const findPartNumberCandidates = (
  engineSchematic: string
): PartNumberCandidate[] => {
  const neighbors = engineSchematic.matchAll(/\d+/g)
  const result: PartNumberCandidate[] = []

  for (const n of neighbors)
    result.push({ index: n.index as number, partNumber: n[0] })

  return result
}

const numberNeighbors = (
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
  partNumber: PartNumberCandidate,
  engineSchematic: string
): boolean => {
  const { index: partIdx, partNumber: partNumberCandidate } = partNumber

  for (let i = partIdx; i < partIdx + partNumberCandidate.length; i++) {
    const neighbors = numberNeighbors(i, engineSchematic)

    for (const neighbor of neighbors) {
      if (neighbor) {
        const isValidNeighbor = neighbor?.match(/[^\d|.|\s]/g)
        if (isValidNeighbor) return true
      }
    }
  }

  return false
}

export const partOne = async (inputFileName: string) => {
  const engineSchematic = await parseFileInput(inputFileName)
  const partNumberCandidates = findPartNumberCandidates(engineSchematic)

  return partNumberCandidates
    .filter(partNumber => {
      return isValidPartNumber(partNumber, engineSchematic)
    })
    .reduce((prev, curr) => {
      return prev + Number(curr.partNumber)
    }, 0)
}
