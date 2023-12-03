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
