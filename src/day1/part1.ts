import { readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { argv } from 'node:process'

export const readCalibrationDocument = async (
  inputFileName: string
): Promise<string[]> => {
  const currentDir = dirname(argv[1])
  const path = join(currentDir, inputFileName)

  try {
    const calibrationString = await readFile(path, { encoding: 'utf-8' })
    const result = calibrationString.split('\n').slice(0, -1)
    return result
  } catch (error) {
    throw new Error(error.messages)
  }
}

const recoverDigitsFromCalibrationLine = (calibrationLine: string): number => {
  let digits = ''
  for (let i = 0; i < calibrationLine.length; i++) {
    if (!isNaN(Number(calibrationLine[i]))) {
      digits += calibrationLine[i]
      break
    }
  }

  for (let i = calibrationLine.length - 1; i >= 0; i--) {
    if (!isNaN(Number(calibrationLine[i]))) {
      digits += calibrationLine[i]
      break
    }
  }

  return Number(digits)
}
export const main = async (inputFileName: string) => {
  const calibrationLines = await readCalibrationDocument(inputFileName)
  const digits = calibrationLines.map(recoverDigitsFromCalibrationLine)
  return digits.reduce((prev, curr) => prev + curr, 0)
}
