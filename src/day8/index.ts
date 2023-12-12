import { parseInputFileToArr } from '@/lib/parse'

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

  const {instructions, network} = documents

  let currentNode = initialNode
  let currentNodeOptions = network.get(currentNode) as [string, string]

  let steps = 0

  while (true){
    if(currentNode === finalNode) return steps

    const currentInstruction = instructions[steps % instructions.length]

    if(currentInstruction === 'L') currentNode = currentNodeOptions[0]
    if(currentInstruction === 'R') currentNode = currentNodeOptions[1]

    currentNodeOptions = network.get(currentNode) as [string, string]

    steps++
  }


}

export const partOne = async (inputFileName: string): Promise<number> => {
  const documentsInfo = await parseInputFileToArr(inputFileName)
  const documents = parseDocuments(documentsInfo)
  return traverseNetwork(documents)
}
