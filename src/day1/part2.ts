import { invertString } from '../lib/utils'
import { readCalibrationDocument } from './part1'

enum DigitsEnum {
  one = 1,
  two = 2,
  three = 3,
  four = 4,
  five = 5,
  six = 6,
  seven = 7,
  eight = 8,
  nine = 9,
}

const findFirstDigit = (value: string) => {
  const digitsRegex = /[1-9]|(one|two|three|four|five|six|seven|eight|nine)/g
  const matchingDigits = value.match(digitsRegex)?.map(digit => digit) || []
  return matchingDigits[0]
}

const findLastDigit = (value: string) => {
  const digitsRegex = /[1-9]|(eno|owt|eerht|ruof|evif|xis|neves|thgie|enin)/g
  const reversedValue = invertString(value)
  const matchingDigits =
    reversedValue.match(digitsRegex)?.map(digit => digit) || []
  return invertString(matchingDigits[0])
}

const findDigits = (calibrationValue: string): string[] => {
  return [findFirstDigit(calibrationValue), findLastDigit(calibrationValue)]
}

const parseCalibrationValue = (calibrationValues: string[]): number => {
  let result = ''
  calibrationValues.forEach(value => {
    if (value.length > 1) result += DigitsEnum[value as keyof typeof DigitsEnum]
    else result += value
  })
  return Number(result)
}

export const main = async (inputFileName: string) => {
  const calibrationLines = await readCalibrationDocument(inputFileName)
  return calibrationLines
    .map(findDigits)
    .map(parseCalibrationValue)
    .reduce((prev, curr) => prev + curr, 0)
}
