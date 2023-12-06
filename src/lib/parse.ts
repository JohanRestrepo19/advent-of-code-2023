import { readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { argv } from 'node:process'

export const parseFileInput = async (inputFileName: string): Promise<string> => {
  const currentDir = dirname(argv[1])
  const path = join(currentDir, inputFileName)

  try {
    return await readFile(path, { encoding: 'utf8' })
  } catch (error) {
    throw new Error(error.messages)
  }
}

export const parseFileInputToArr = async (
  inputFileName: string
): Promise<string[]> => {
  const inputString = await parseFileInput(inputFileName)
  return inputString.slice(0, -1).split('\n')
}

