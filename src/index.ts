import { partOne as dayOnePartOne, partTwo as dayOnePartTwo } from '@/day1/'
import { partOne as dayTwoPartOne, partTwo as dayTwoPartTwo } from '@/day2'
import { partOne as dayThreePartOne, partTwo as dayThreePartTwo } from '@/day3'
import { partOne as dayFourPartOne } from '@/day4'

const dayOne = async () => {
  console.log('Day 1 results: ')
  console.log(await dayOnePartOne('./day1/input/calibration-document.txt'))
  console.log(await dayOnePartTwo('./day1/input/calibration-document.txt'))
  console.log()
}

const dayTwo = async () => {
  console.log('Day 2 results: ')
  console.log(await dayTwoPartOne('./day2/input/puzzle-input.txt'))
  console.log(await dayTwoPartTwo('./day2/input/puzzle-input.txt'))
  console.log()
}

const dayThree = async () => {
  console.log('Day 3 results: ')
  console.log(await dayThreePartOne('./day3/input/engine-schematic.txt'))
  console.log(await dayThreePartTwo('./day3/input/engine-schematic.txt'))
  console.log()
}

const dayFour = async () => {
  console.log('Day 4 results: ')
  console.log(await dayFourPartOne('./day4/input/pile-of-scratch-cards.txt'))
  console.log()
}

const main = async () => {
  await dayOne()
  await dayTwo()
  await dayThree()
  await dayFour()
}

main()
