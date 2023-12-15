import { partOne as dayOnePartOne, partTwo as dayOnePartTwo } from '@/day1/'
import { partOne as dayTwoPartOne, partTwo as dayTwoPartTwo } from '@/day2'
import { partOne as dayThreePartOne, partTwo as dayThreePartTwo } from '@/day3'
import { partOne as dayFourPartOne, partTwo as dayFourPartTwo } from '@/day4'
// import { partOne as dayFivePartOne, partTwo as dayFivePartTwo } from '@/day5'
import { partOne as daySixPartOne, partTwo as daySixPartTwo } from '@/day6'
import { partOne as daySevenPartOne, partTwo as daySevenPartTwo } from '@/day7'
import { partOne as dayEightPartOne, partTwo as dayEightPartTwo } from '@/day8'
import { partOne as dayNinePartOne } from '@/day9'

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
  console.log(await dayFourPartTwo('./day4/input/pile-of-scratch-cards.txt'))
  console.log()
}

//NOTE: Be carefull with part two of day five, it takes too long to resolve!
const dayFive = async () => {
  console.log('Day 5 results: ')
  // console.log(await dayFivePartOne('./day5/input/almanac.txt'))
  // console.log(await dayFivePartTwo('./day5/input/almanac.txt'))
  console.log()
}

const daySix = async () => {
  console.log('Day 6 results: ')
  console.log(await daySixPartOne('./day6/input/sheet-of-paper.txt'))
  console.log(await daySixPartTwo('./day6/input/sheet-of-paper.txt'))
  console.log()
}

const daySeven = async () => {
  console.log('Day 7 results: ')
  console.log(await daySevenPartOne('./day7/input/camel-cards.txt'))
  console.log(await daySevenPartTwo('./day7/input/camel-cards.txt'))
  console.log()
}

const dayEight = async () => {
  console.log('Day 8 results: ')
  console.log(await dayEightPartOne('./day8/input/map.txt'))
  console.log(await dayEightPartTwo('./day8/input/map.txt'))
  console.log()
}

const dayNine = async () => {
  console.log('Day 9 results: ')
  console.log(await dayNinePartOne('./day9/input/report.txt'))
  console.log()
}

const main = async () => {
  await dayOne()
  await dayTwo()
  await dayThree()
  await dayFour()
  await dayFive()
  await daySix()
  await daySeven()
  await dayEight()
  await dayNine()
}

main()
