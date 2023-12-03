import { part1, part2 } from '@/day1/'

const day1 = async () => {
  console.log(await part1('./day1/input/calibration-document.txt'))
  console.log(await part2('./day1/input/calibration-document.txt'))
}

day1()
