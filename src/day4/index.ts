import { parseFileInputToArr } from '@/lib/parse'

type Card = {
  winningNumbers: number[]
  numbers: number[]
}

const parseInputIntoCards = (input: string[]): Card[] => {
  return input.map<Card>(card => {
    const [, winningNumbersString, numbersString] = card.split(/:|\|/g)
    const winningNumbers = winningNumbersString
      .match(/\d+/g)
      ?.map(str => Number(str)) as number[]

    const numbers = numbersString
      .match(/\d+/g)
      ?.map(str => Number(str)) as number[]

    return { winningNumbers, numbers }
  })
}

const findCardValue = (card: Card): number => {
  const { winningNumbers, numbers } = card
  const elfWiningNumbers: number[] = []

  for (const number of numbers) {
    for (const winningNumber of winningNumbers) {
      if (number === winningNumber) {
        elfWiningNumbers.push(number)
        break
      }
    }
  }

  if (elfWiningNumbers.length > 0)
    return Math.pow(2, elfWiningNumbers.length - 1)

  return 0
}

export const partOne = async (inputFileName: string): Promise<number> => {
  const input = await parseFileInputToArr(inputFileName)
  const cards = parseInputIntoCards(input)
  const worthPoints = cards.map(card => findCardValue(card))
  return worthPoints.reduce((prev, curr) => prev + curr)
}
