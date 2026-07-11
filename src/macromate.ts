import { ref } from 'vue'
import { formatString } from './util.ts'
import { gzip } from 'pako'
import { useClipboard } from '@vueuse/core'

const source = ref('')
const { text, copy, copied, isSupported } = useClipboard({ source })

import Macro from './Macro.vue'
type MacroProps = InstanceType<typeof Macro>['$props']

export function copyMacroMate(macros: MacroProps[]) {
  let xml =
    `<?xml version="1.0" encoding="utf-16"?>` +
    `<MateNodeXML xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xsi:type="GroupXML">` +
    `<Name>DMU Limit Cut</Name>` +
    `<Nodes>`
  for (const m in macros) {
    if (macros[m])
      xml += formatString(
        '<Macro><Name>{0}</Name><Lines>{1}</Lines></Macro>',
        macros[m].name,
        macros[m].lines,
      )
  }

  xml += `</Nodes></MateNodeXML>`

  const b64xml = window.btoa(String.fromCharCode.apply(null, [...gzip(xml)]))
  copy(b64xml)
}
