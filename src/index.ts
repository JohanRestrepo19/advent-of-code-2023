import { partOne as dayOnePartOne, partTwo as dayOnePartTwo } from '@/day1/'
import { partOne as dayTwoPartOne, partTwo as dayTwoPartTwo } from '@/day2'

export const dayOne = async () => {
  console.log(await dayOnePartOne('./day1/input/calibration-document.txt'))
  console.log(await dayOnePartTwo('./day1/input/calibration-document.txt'))
}

export const dayTwo = async () => {
  console.log(await dayTwoPartOne('./day2/input/puzzle-input.txt'))
  console.log(await dayTwoPartTwo('./day2/input/puzzle-input.txt'))
}

const main = async () => {
  await dayOne()
  await dayTwo()
}

main()
