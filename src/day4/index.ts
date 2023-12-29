import { parseInputFileToArr } from '@/lib/parse'
import { type DayProblem } from '@/lib/types'

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

const findCardMatchingsAmount = (card: Card): number => {
    const { winningNumbers, numbers } = card
    let matchingsAmount = 0

    for (const number of numbers) {
        for (const winningNumber of winningNumbers) {
            if (number === winningNumber) {
                matchingsAmount++
                break
            }
        }
    }

    return matchingsAmount
}

const findCardValue = (card: Card): number => {
    const matchingsAmount = findCardMatchingsAmount(card)
    return matchingsAmount > 0 ? Math.pow(2, matchingsAmount - 1) : 0
}

export const partOne: DayProblem = async inputFileName => {
    const input = await parseInputFileToArr(inputFileName)
    const cards = parseInputIntoCards(input)
    const worthPoints = cards.map(card => findCardValue(card))
    return worthPoints.reduce((prev, curr) => prev + curr)
}

//--------------------------------------------------------------------

type CardsMatchings = {
    [index: string]: number
}

type CardsOccurrences = {
    [index: string]: number
}

const findCardsMatchings = (cards: Card[]): CardsMatchings => {
    const cardsMatchings: CardsMatchings = {}

    for (let i = 0; i < cards.length; i++)
        cardsMatchings[i + 1] = findCardMatchingsAmount(cards[i])

    return cardsMatchings
}

const processCards = (cardsMatchings: CardsMatchings): CardsOccurrences => {
    const pile: string[] = Object.keys(cardsMatchings)
    const occurrences: CardsOccurrences = {}
    let i = 0

    while (pile[i]) {
        occurrences[pile[i]] =
            occurrences[pile[i]] >= 1 ? occurrences[pile[i]] + 1 : 1

        for (let j = 1; j <= cardsMatchings[pile[i]]; j++)
            pile.push(`${Number(pile[i]) + j}`)

        i++
    }

    return occurrences
}

export const partTwo: DayProblem = async inputFileName => {
    const input = await parseInputFileToArr(inputFileName)
    const cards = parseInputIntoCards(input)
    const cardsMatchings = findCardsMatchings(cards)
    const cardsOccurrences = Object.values(processCards(cardsMatchings))
    return cardsOccurrences.reduce((prev, curr) => prev + curr)
}
