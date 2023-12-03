import { readCalibrationDocument } from "@/lib/parse"

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
