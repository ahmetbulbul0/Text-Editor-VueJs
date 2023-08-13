<script setup>

import { onMounted, ref } from "vue";
import { newEditor, setContent, getContent, compareContent, commentLink, addComment } from "./helpers/editorHelpers";

var editor;
const editorContent = ref(null);
var defaultContent, defaultContentText;
var commentsData = ref([])

const setDefaultContent = () => {
  var delta;
  if (!localStorage.getItem("defaultContent")) {
    let defaultHtml = `<p><strong>bold</strong></p><p><em>italic</em></p><p><u>underline</u></p><p><s>strike</s></p><p><a href="lşilşi" target="_blank">link</a></p><blockquote>block quote</blockquote><pre class="ql-syntax" spellcheck="false">code</pre><h1>h1</h1><h2>h2</h2><ol><li>list</li></ol><ul><li>list</li></ul><p>X<sub>2</sub></p><p>X<sup>2</sup></p><p class="ql-indent-1">FGFGDF</p><p class="ql-align-right ql-direction-rtl">-NKJKHJKJ</p><p><span class="ql-size-small">SMALL</span></p><p>NORMAL</p><p><span class="ql-size-large">LARGE</span></p><p><span class="ql-size-huge">HUGE</span></p><h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3><h4>Heading 4</h4><h5>Heading 5</h5><h6>Heading 6</h6><p><br></p><p>sans-serif</p><p><span class="ql-font-serif">serif</span></p><p><span class="ql-font-monospace">monospace</span></p><p>left</p><p class="ql-align-center">center</p><p class="ql-align-right">right</p><p><br></p>`
    let defaultHtmlDelta = editor.clipboard.convert(defaultHtml);
    localStorage.setItem("defaultContent", JSON.stringify(defaultHtmlDelta))
  }
  delta = JSON.parse(localStorage.getItem("defaultContent"))
  setContent(editor, delta)
  defaultContent = getContent(editor)
  defaultContentText = editor.getText()
}
const updateDefaultContent = () => {
  let currentContent = getContent(editor)
  localStorage.setItem("defaultContent", JSON.stringify(currentContent))
}
const compareCurrentAndDefaultContent = () => {
  let currentContent = editor.getContents()
  compareContent(editor, defaultContent, currentContent, defaultContentText)
}
const newComment = () => {
  commentsData = addComment(editor, commentsData)
}
onMounted(() => {
  editor = newEditor(editorContent)
  setDefaultContent()
})

</script>

<template>
  <div class="container">
    <section>
      <div class="editorContainer">
        <div class="editorToolbar">
          <button class="ql-bold">Bold</button>
          <button class="ql-italic">Italic</button>
          <button class="ql-underline">Underline</button>
          <button class="ql-strike">Strike</button>
          <button class="ql-link">Link</button>
          <button class="ql-image">Image</button>
          <button class="ql-blockquote">Blockquote</button>
          <button class="ql-code-block">Code Block</button>
          <button class="ql-list" value="ordered">Ordered</button>
          <button class="ql-list" value="bullet">Bullet</button>
          <button class="ql-script" value="sub">Subscript</button>
          <button class="ql-script" value="super">Superscript</button>
          <button class="ql-indent" value="-1">Decrease Indent</button>
          <button class="ql-indent" value="+1">Increase Indent</button>
          <button class="ql-direction" value="rtl">Right-to-Left</button>
          <select class="ql-size">
            <option value="small">Small</option>
            <option selected value="normal">Normal</option>
            <option value="large">Large</option>
            <option value="huge">Huge</option>
          </select>
          <select class="ql-header">
            <option value="1">Header 1</option>
            <option value="2">Header 2</option>
            <option value="3">Header 3</option>
            <option value="4">Header 4</option>
            <option value="5">Header 5</option>
            <option value="6">Header 6</option>
            <option selected>Header</option>
          </select>
          <select class="ql-color"></select>
          <select class="ql-background"></select>
          <select class="ql-font">
            <option value="sans-serif" selected></option>
            <option value="serif"></option>
            <option value="monospace"></option>
          </select>
          <select class="ql-align"></select>
          <button class="ql-clean">Clean</button>

          <!-- CUSTOM ACTIONS -->
          <a class="custom-act" @click="setDefaultContent">
            <i class="fa-solid fa-hammer"></i>
          </a>
          <a class="custom-act" @click="updateDefaultContent">
            <i class="fa-solid fa-wrench"></i>
          </a>
          <a class="custom-act" @click="compareCurrentAndDefaultContent">
            <i class="fa-solid fa-compress"></i>
          </a>
          <a class="custom-act" @click="newComment">
            <i class="fa-solid fa-comment"></i>
          </a>

        </div>
        <div class="editorContentContainer">
          <div class="editorContentHeaders"></div>
          <div ref="editorContent" class="editorContent"></div>
          <div class="editorContentComments">
            <h3>Comments</h3>
            <div class="commentsArea">
              <a v-if="commentsData.length == 0" href="#">There is no comment...</a>
              <a v-if="commentsData" v-for="(item, index) in commentsData" :key="index" @click.prevent="commentLink(index, editor, commentsData)" href="#">{{ item.comment }}</a>
            </div>
          </div>
        </div>
      </div>
      <div id="linksContainer">

      </div>
    </section>
  </div>
</template>
