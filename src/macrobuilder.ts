import Macro from './Macro.vue'
import { formatString } from './util.ts'

type MacroProps = InstanceType<typeof Macro>['$props']

export interface MacroFormat {
  waymarkSet: WaymarkSet
  kefkaOrient: Origin

  chatMode: string
  name: string
  line: string

  direction: string | undefined
  header: string | undefined
  footer: string | undefined
}

export enum Direction {
  KefkaClockwise,
  KefkaCounterclockwise,
}

export enum WaymarkSet {
  OneNorthWest,
  OneNorthEast,
}

export enum Origin {
  KefkaStart,
  KefkaEnd,
}

export function buildMacros(format: MacroFormat): MacroProps[] {
  if (format.waymarkSet === undefined || format.kefkaOrient === undefined) return []
  // Get the waymark layout for this macro.
  const waymarks: string[] | undefined = (() => {
    switch (format.waymarkSet) {
      case WaymarkSet.OneNorthWest:
        return 'A2B3C4D1'.split('')
      case WaymarkSet.OneNorthEast:
        return 'A1B2C3D4'.split('')
      default:
        return undefined
    }
  })()
  if (waymarks === undefined) return []

  const macros: MacroProps[] = []
  for (let i = 0; i < waymarks.length; i++) {
    macros[i] = buildMacro(
      waymarks,
      format.kefkaOrient,
      Direction.KefkaClockwise,
      waymarks[i],
      format,
    )
    waymarks.reverse()
    macros[waymarks.length * 2 - 1 - i] = buildMacro(
      waymarks,
      format.kefkaOrient,
      Direction.KefkaCounterclockwise,
      waymarks[i],
      format,
    )
    waymarks.reverse()
  }
  if (macros) return macros
  else return []
}

export function generateMacroMateCode() {}

function buildMacro(
  waymarks: string[],
  origin: Origin,
  direction: Direction,
  newNorth: string | undefined,
  format: MacroFormat,
): MacroProps {
  const errorValue = { name: 'Bad Macro', lines: '' }
  if (!newNorth) return errorValue
  // Create our format strings.
  const chatMode = format.chatMode ? '/' + format.chatMode + ' ' : ''
  const nameFormat = format.name
  const directionFormat = format.direction ? chatMode + format.direction : undefined
  const iconFormat = '/micon {0} waymark'
  const lineFormat = chatMode + format.line

  const newNorthIndex = waymarks.findIndex((w: string) => w === newNorth)
  if (newNorthIndex < 0) return errorValue

  // Get our waymark of interest depending on if we're orienting to kefka's origin or destination
  const orientationWaymark: string | undefined = (() => {
    switch (origin) {
      case Origin.KefkaEnd:
        return newNorth
      case Origin.KefkaStart:
        return waymarks.at((newNorthIndex + waymarks.length / 2) % waymarks.length)
    }
  })()
  if (orientationWaymark === undefined) return errorValue

  // Build direction line
  // Look clockwise if Kefka went CCW, etc
  const lookDirectionString = direction === Direction.KefkaClockwise ? 'CCW' : 'CW'
  const directionLine = directionFormat
    ? formatString(directionFormat, newNorth, lookDirectionString)
    : undefined

  // Build macro name
  const macroName: string | undefined = formatString(
    nameFormat,
    orientationWaymark,
    lookDirectionString,
  )
  //
  // Build macro icon line
  const iconLine = formatString(iconFormat, orientationWaymark)

  let macroLines = format.header ? format.header + '\r\n' : ''
  macroLines += directionLine ? directionLine + '\r\n' : ''
  for (let limitCutMarker: number = 1; limitCutMarker <= waymarks.length; limitCutMarker++) {
    const w1 = waymarks[(limitCutMarker - 1 + newNorthIndex) % waymarks.length]
    const w2 = waymarks[(limitCutMarker + newNorthIndex) % waymarks.length]
    if (w1 === undefined || w2 == undefined) return errorValue
    if (direction === Direction.KefkaClockwise)
      macroLines += formatString(lineFormat, limitCutMarker.toString(), w1, w2)
    else macroLines += formatString(lineFormat, limitCutMarker.toString(), w2, w1)
    macroLines += '\r\n'
  }
  macroLines += format.footer ? format.footer + '\r\n' : ''
  macroLines += iconLine

  return {
    name: macroName,
    lines: macroLines,
  }
}
