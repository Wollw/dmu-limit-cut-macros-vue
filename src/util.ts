export function formatString(template: string, ...args: string[]): string {
  return template.replace(/{(\d+)}/g, (match, index) => {
    return typeof args[index] !== 'undefined' ? args[index] : match
  })
}
export function formatStringStr(template: string, args: Map<string, string>) {
  return template.replace(/{(\w+)}/g, (match: string): string => {
    match = match.replace('{', '').replace('}', '')
    const s = args.get(match)
    return s !== undefined ? s : '{' + match + '}'
  })
}
