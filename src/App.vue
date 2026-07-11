<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import Macro from './Macro.vue'
import * as mb from './macrobuilder.ts'
import { useToast } from 'vue-toast-notification'
import { copyMacroMate } from './macromate.ts'

const $toast = useToast()

type MacroProps = InstanceType<typeof Macro>['$props']
const macros: Ref<MacroProps[]> = ref([])

const waymarkSetModel = defineModel('waymarkSetModel', { default: 'NW' })
const kefkaOrientModel = defineModel('kefkaOrientModel', { default: 'End' })
const chatModeModel = defineModel('chatModeModel', { default: 'e' })
const nameFormatModel = defineModel('nameFormatModel', { default: 'Limit Cut {orient} [{rotate}]' })
const lineFormatModel = defineModel('lineFormatModel', { default: '{player} -> {mark1}{mark2}' })
const directionFormatModel = defineModel('directionFormatModel', {
  default: 'New North: {north} [Look {rotate}]',
})
const headerModel = defineModel('headerModel', { default: '' })
const footerModel = defineModel('footerModel', { default: '' })

watch(waymarkSetModel,()=>{update()})
watch(kefkaOrientModel,()=>{update()})
watch(chatModeModel,()=>{update()})
watch(nameFormatModel,()=>{update()})
watch(lineFormatModel,()=>{update()})
watch(directionFormatModel,()=>{update()})
watch(headerModel,()=>{update()})
watch(footerModel,()=>{update()})

function update() {
  const macroFormat: mb.MacroFormat = {
    waymarkSet:
      waymarkSetModel.value == 'NW' ? mb.WaymarkSet.OneNorthEast : mb.WaymarkSet.OneNorthWest,
    kefkaOrient: kefkaOrientModel.value == 'End' ? mb.Origin.KefkaEnd : mb.Origin.KefkaStart,
    chatMode: chatModeModel.value,
    name: nameFormatModel.value,
    line: lineFormatModel.value,
    direction: directionFormatModel.value,
    header: headerModel.value,
    footer: footerModel.value,
  }
  macros.value = mb.buildMacros(macroFormat)
}
update();


function _copyMM() {
  copyMacroMate(macros.value)
  $toast.success('Copied Macro Mate Code')
}
</script>

<template>
  <h1>Dancing Mad (Ultimate) Limit Cut Macros</h1>

  <h2>Options</h2>

  <div class="options">
    <div>Waymark Set</div>
    <input type="radio" id="NW" value="NW" v-model="waymarkSetModel" />
    <label for="NW">One NW</label>
    <input type="radio" id="NE" value="NE" v-model="waymarkSetModel" />
    <label for="NE">One NE</label>
  </div>

  <div class="options">
    <div>Orientation Waymark</div>
    <input type="radio" id="Start" value="Start" v-model="kefkaOrientModel" />
    <label for="Start">Dash Start</label>
    <input type="radio" id="End" value="End" v-model="kefkaOrientModel" />
    <label for="End">Dash End</label>
  </div>

<br />


  <div class="options">
    <div>Macro Name Format</div>
    <input class="text" type="text" v-model="nameFormatModel"></input>
  </div>

  <div class="options">
    <div>Direction Format</div>
    <input class="text" type="text" v-model="directionFormatModel"></input>
  </div>

  <div class="options">
    <div>Line Format</div>
    <input class="text" type="text" v-model="lineFormatModel"></input>
  </div>
  <br />
  <div class="options">
    <div>Chat Mode</div>
    <input class="text" type="text" v-model="chatModeModel"></input>
  </div>

  <div class="options">
    <div>Header Line</div>
    <input class="text" type="text" id="headerLine" v-model="headerModel"></input>
  </div>

  <div class="options">
    <div>Footer Line</div>
    <input class="text" type="text" id="footerLine" v-model="footerModel"></input>
  </div>

  <br />
  <div class="options">
    <pre>
    Placeholders:
      {north} : Kefka's first dash ends here.       {rotate} : Rotation direction for players.
    {kefkaat} : Kefka's first dash starts here.   {kefkarot} : Kefka's rotation direction.
     {orient} : Macro orientation waymark.

    Only available in Line Format:
     {player} : The limit cut number.  {mark1} : First waymark.   {mark2} : Second waymark. </pre></div>
<br/>

  <button @click="_copyMM()">Copy Macro Mate Code</button>

  <h2>Output</h2>
  <div id="copyDisclaimer">
    Click a macro to copy it to your clipboard, or click <code>Copy Macro Mate Code</code> above to
    get a Macro Mate import code.
  </div>

  <span v-for="(m, i) in macros">
    <h3 v-if="i == 0">Counter Clockwise</h3>
    <h3 v-if="i == 8">Clockwise</h3>
    <Macro :name="m.name" :lines="m.lines"></Macro>
    <br v-if="(i + 1) % 4 == 0" />
    </span>
</template>
