import { parseInputFileToArr } from '@/lib/parse'

enum HandType {
  'fiveOfAKind' = 7,
  'fourOfAKind' = 6,
  'fullHouse' = 5,
  'threeOfAKind' = 4,
  'twoPair' = 3,
  'onePair' = 2,
  'highCard' = 1,
}

type Hand = {
  cards: string
  bid: number
  type?: HandType | string
}

// prettier-ignore
type Card = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A'

type GetCardsOccurrences = (cards: Card[]) => Map<string, number>

const getCardsOccurrencesPartOne: GetCardsOccurrences = cards => {
  const cardsOccurrences: Map<string, number> = new Map()

  for (const card of cards) {
    const cardOcurrence = cardsOccurrences.get(card)
    if (cardOcurrence) cardsOccurrences.set(card, cardOcurrence + 1)
    else cardsOccurrences.set(card, 1)
  }

  return cardsOccurrences
}

const getHandType = (
  cardsString: string,
  getCardsOccurrences: GetCardsOccurrences
): HandType => {
  const cards = cardsString.split('')
  const cardsOccurrences = getCardsOccurrences(cards as Card[])

  if (cardsOccurrences.size === 1) return HandType.fiveOfAKind

  if (cardsOccurrences.size === 2) {
    for (const [, occ] of cardsOccurrences)
      if (occ === 4) return HandType.fourOfAKind
    return HandType.fullHouse
  }

  if (cardsOccurrences.size === 3) {
    for (const [, occ] of cardsOccurrences)
      if (occ === 3) return HandType.threeOfAKind
    return HandType.twoPair
  }

  if (cardsOccurrences.size === 4) return HandType.onePair

  return HandType.highCard
}

const parseFileContentsToHands = (
  fileContents: string[],
  getCardsOccurrences: GetCardsOccurrences
): Hand[] => {
  return fileContents.map<Hand>(handInfo => {
    const [cards, bid] = handInfo.split(' ')
    return {
      cards,
      bid: Number(bid),
      type: HandType[getHandType(cards, getCardsOccurrences)],
    }
  })
}

const compareHands = (a: Hand, b: Hand, cardsStrength: Card[]): number => {
  const handTypeA = HandType[a.type as keyof typeof HandType]
  const handTypeB = HandType[b.type as keyof typeof HandType]

  if (handTypeA < handTypeB) return -1
  if (handTypeA > handTypeB) return 1

  for (let i = 0; i < a.cards.length; i++) {
    const indexOfCardOfHandA = cardsStrength.indexOf(a.cards[i] as Card)
    const indexOfCardOfHandB = cardsStrength.indexOf(b.cards[i] as Card)

    if (indexOfCardOfHandA < indexOfCardOfHandB) return -1
    if (indexOfCardOfHandA > indexOfCardOfHandB) return 1
  }

  return 0
}

const determineTotalWinnings = (rankedHands: Hand[]): number => {
  return rankedHands
    .map((hand, index) => (index + 1) * hand.bid)
    .reduce((prev, curr) => prev + curr)
}

export const partOne = async (inputFileName: string): Promise<number> => {
  // prettier-ignore
  const cardsStrength: Card[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
  const fileContents = await parseInputFileToArr(inputFileName)
  const hands = parseFileContentsToHands(
    fileContents,
    getCardsOccurrencesPartOne
  )
  const rankedHands = hands.toSorted((a, b) =>
    compareHands(a, b, cardsStrength)
  )
  return determineTotalWinnings(rankedHands)
}

//--------------------------------------------------------------------

const getCardsOccurrencesPartTwo: GetCardsOccurrences = cards => {
  const cardsOccurrences: Map<string, number> = new Map()
  let jokerOccurrences = 0

  for (const card of cards) {
    if (card === 'J') {
      jokerOccurrences++
      continue
    }

    const cardOcurrence = cardsOccurrences.get(card)
    if (cardOcurrence) cardsOccurrences.set(card, cardOcurrence + 1)
    else cardsOccurrences.set(card, 1)
  }

  let higherValueKey = ''
  let higherValue = 0

  for (const [key, value] of cardsOccurrences) {
    if (value > higherValue) {
      higherValue = value
      higherValueKey = key
    }
  }

  const higherOccurrence = cardsOccurrences.get(higherValueKey)
  cardsOccurrences.set(
    higherValueKey,
    (higherOccurrence as number) + jokerOccurrences
  )

  return cardsOccurrences
}

export const partTwo = async (inputFileName: string): Promise<number> => {
  // prettier-ignore
  const cardsStrength: Card[] = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A']
  const fileContents = await parseInputFileToArr(inputFileName)

  const hands = parseFileContentsToHands(
    fileContents,
    getCardsOccurrencesPartTwo
  )

  const rankedHands = hands.toSorted((a, b) =>
    compareHands(a, b, cardsStrength)
  )

  return determineTotalWinnings(rankedHands)

}
