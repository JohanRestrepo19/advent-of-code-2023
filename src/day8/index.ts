import { parseInputFileToArr } from '@/lib/parse'
import { LCM } from '@/lib/utils'
import { type DayProblem } from '@/lib/types'

type Documents = {
  instructions: string[]
  network: Map<string, [string, string]>
}

const parseDocuments = (documentsInfo: string[]): Documents => {
  const instructions = documentsInfo[0].split('')
  const network: Documents['network'] = new Map()

  const nodes = documentsInfo.slice(2)

  for (const node of nodes) {
    const [current, left, right] = node
      .match(/\w+/g)
      ?.map(str => str) as string[]
    network.set(current, [left, right])
  }

  return { instructions, network }
}

const traverseNetwork = (
  documents: Documents,
  initialNode = 'AAA',
  finalNode = 'ZZZ'
): number => {
  const { instructions, network } = documents

  let currentNode = initialNode
  let currentNodeOptions = network.get(currentNode) as [string, string]

  let steps = 0

  while (true) {
    if (currentNode === finalNode) return steps

    const currentInstruction = instructions[steps % instructions.length]

    if (currentInstruction === 'L') currentNode = currentNodeOptions[0]
    if (currentInstruction === 'R') currentNode = currentNodeOptions[1]

    currentNodeOptions = network.get(currentNode) as [string, string]

    steps++
  }
}

export const partOne: DayProblem = async inputFileName => {
  const documentsInfo = await parseInputFileToArr(inputFileName)
  const documents = parseDocuments(documentsInfo)
  return traverseNetwork(documents)
}

//--------------------------------------------------------------------

const getStartingNodes = (
  network: Documents['network'],
  startingLetter = 'A'
): string[] => {
  const keys = [...network.keys()]

  return keys.filter(key => key[key.length - 1] === startingLetter)
}

const traverseGhostNetwork = (
  documents: Documents,
  initialNode: string
): number => {
  const { instructions, network } = documents

  let currentNode = initialNode
  let currentNodeOptions = network.get(currentNode) as [string, string]

  let steps = 0

  while (!(currentNode[currentNode.length - 1] === 'Z')) {
    const currentInstruction = instructions[steps % instructions.length]

    if (currentInstruction === 'L') currentNode = currentNodeOptions[0]
    if (currentInstruction === 'R') currentNode = currentNodeOptions[1]

    currentNodeOptions = network.get(currentNode) as [string, string]

    steps++
  }
  return steps
}

export const partTwo: DayProblem = async inputFileName => {
  const documentsInfo = await parseInputFileToArr(inputFileName)
  const documents = parseDocuments(documentsInfo)
  const startingNodes = getStartingNodes(documents.network)

  const ghostsResults = startingNodes.map(node =>
    traverseGhostNetwork(documents, node)
  )

  return LCM(ghostsResults)
}
