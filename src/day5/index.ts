import { parseInputFile } from '@/lib/parse'
import { type DayProblem } from '@/lib/types'

type Ranges = {
    source: [number, number]
    destination: [number, number]
}

type Almanac = {
    seeds: number[]
    maps: Map<string, Ranges[]>
}

function parseGardenerSeeds(seedsString: string): number[] {
    const numbers = seedsString.match(/(\d+[^\n]+)+/g)?.map(m => m) as string[]
    return numbers[0].split(' ').map<number>(el => Number(el))
}

function parseGardenerMap(mapString: string): [string, Ranges[]] {
    const name = mapString.match(/\w+-\w+-\w+/g)?.map(m => m)[0] as string

    const rawRanges = mapString
        .match(/(\d+[^\n]+)+/g)
        ?.map(m => m)
        .map<number[]>(match =>
            match.split(' ').map<number>(el => Number(el))
        ) as number[][]

    const ranges: Ranges[] = rawRanges.map<Ranges>(range => ({
        source: [range[1], range[1] + range[2] - 1],
        destination: [range[0], range[0] + range[2] - 1],
    }))

    return [name, ranges]
}

function parseAlmanacString(almanacString: string): Almanac {
    const [seedsString, ...mapsString] = almanacString
        .match(/(\D+):\s\b(\d+\s+)+/g)
        ?.map(value => value) as string[]

    const seeds = parseGardenerSeeds(seedsString)
    const maps: Almanac['maps'] = new Map()

    mapsString.forEach(mapString => {
        const [name, ranges] = parseGardenerMap(mapString)
        maps.set(name, ranges)
    })

    return { seeds, maps: maps }
}

function findDestinationNumber(
    sourceNumber: number,
    categoryMap: Ranges[]
): number {
    for (const range of categoryMap) {
        const { destination, source } = range
        const isSourceMapped =
            source[0] <= sourceNumber && sourceNumber <= source[1]

        if (!isSourceMapped) continue

        const distance = sourceNumber - source[0]
        const destinationNumber = destination[0] + distance

        return destinationNumber
    }
    return sourceNumber
}

function findSeedLocationNumber(seed: number, maps: Almanac['maps']) {
    let destinationNumber = seed
    for (const [, ranges] of maps) {
        destinationNumber = findDestinationNumber(destinationNumber, ranges)
    }

    return destinationNumber
}

function findLowestLocationNumber(almanac: Almanac): number {
    const { seeds, maps } = almanac

    const locationNumbers = seeds.map(seed =>
        findSeedLocationNumber(seed, maps)
    )
    return locationNumbers.reduce((prev, curr) => {
        if (curr < prev) return curr
        return prev
    }, Infinity)
}

export const partOne: DayProblem = async inputFileName => {
    const almanacString = await parseInputFile(inputFileName)
    const almanac = parseAlmanacString(almanacString)
    return findLowestLocationNumber(almanac)
}

//--------------------------------------------------------------------

type SeedRange = [number, number]

function findSeedsRanges(seeds: number[]): SeedRange[] {
    const ranges: SeedRange[] = []

    for (let i = 0; i < seeds.length - 1; i = i + 2) {
        const range: SeedRange = [seeds[i], seeds[i] + seeds[i + 1] - 1]
        ranges.push(range)
    }
    return ranges
}

function findLowestLocationNumberInRage(
    seedRange: SeedRange,
    maps: Almanac['maps']
): number {
    const [low, high] = seedRange
    let lowestLocationNumber = Infinity

    for (let i = low; i <= high; i++) {
        const currentLocationNumber = findSeedLocationNumber(i, maps)
        if (currentLocationNumber < lowestLocationNumber)
            lowestLocationNumber = currentLocationNumber
    }

    return lowestLocationNumber
}

export const partTwo: DayProblem = async inputFileName => {
    const almanacString = await parseInputFile(inputFileName)
    const almanac = parseAlmanacString(almanacString)
    const seedsRanges = findSeedsRanges(almanac.seeds)
    const locationNumbers = seedsRanges.map(seedRange =>
        findLowestLocationNumberInRage(seedRange, almanac.maps)
    )
    return locationNumbers.reduce(
        (prev, curr) => (curr < prev ? curr : prev),
        Infinity
    )
}
