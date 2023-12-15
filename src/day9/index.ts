import { parseInputFileToArr } from '@/lib/parse'
import { type DayProblem } from '@/lib/types'

type History = number[]

const parseHistory = (history: string): History => {
  return history.match(/-?\d+/g)?.map(Number) as number[]
}

const isEveryItemZero = (arr: number[]): boolean =>
  arr.every(value => value === 0)

const getAllHistorySequences = (history: History): number[][] => {
  const sequences: number[][] = []
  sequences.push(history)

  while (!isEveryItemZero(sequences[sequences.length - 1])) {
    const lastSequence = sequences[sequences.length - 1]
    const newSequence: number[] = []

    if (lastSequence.length > 1)
      for (let i = 0; i < lastSequence.length - 1; i++)
        newSequence.push(lastSequence[i + 1] - lastSequence[i])
    else newSequence.push(0)

    sequences.push(newSequence)
  }

  return sequences
}

const predictNextHistoryValue = (history: History): number => {
  const historySequences = getAllHistorySequences(history)

  for (
    let sequenceIdx = historySequences.length - 2;
    sequenceIdx >= 0;
    sequenceIdx--
  ) {
    const currentSeq = historySequences[sequenceIdx]
    const belowSeq = historySequences[sequenceIdx + 1]
    const belowValue = belowSeq[belowSeq.length - 1]

    currentSeq.push(belowValue + currentSeq[currentSeq.length - 1])
  }

  return historySequences[0].pop() as number
}

export const partOne: DayProblem = async inputFilename => {
  return (await parseInputFileToArr(inputFilename))
    .map(parseHistory)
    .map(predictNextHistoryValue)
    .reduce((prev, curr) => prev + curr)
}
