<script setup>

import { onMounted, ref } from "vue";
import { newEditor } from "./helpers/editorHelpers";
import { setDefaultContent, updateDefaultContent, newComment, addInput, importWord, compareContent } from "./helpers/toolbarHelpers"
import { commentLink } from "./helpers/handlerHelpers"
import EditorToolbar from "./components/editorToolbar.vue";

var editor, editorContentArea, comments;

editorContentArea = ref();
comments = ref([]);
const isDarkTheme = ref(true);

onMounted(() => {
  editor = newEditor(editorContentArea, ".editorToolbar")
  setDefaultContent(editor)
  document.body.classList.add('dark-theme')
})

const createComment = () => {
  comments = newComment(comments)
}

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  document.body.classList.toggle('dark-theme');
}
</script>

<template>
  <div class="container">
    <button @click="toggleTheme" class="theme-toggle">
      <i :class="isDarkTheme ? 'fas fa-sun' : 'fas fa-moon'"></i>
    </button>
    <section>
      <div class="editorContainer">
        <EditorToolbar @setDefaultContent="setDefaultContent(editor)" @updateDefaultContent="updateDefaultContent" @compareContent="compareContent" @newComment="createComment" @addInput="addInput" />
        <div class="editorContentContainer">
          <div class="editorContentHeaders"></div>
          <div ref="editorContentArea" class="editorContent"></div>
          <div class="editorContentComments">
            <h3>Word Import</h3>
            <input type="file" @change="importWord" />
            <h3>Comments</h3>
            <div class="commentsArea">
              <a v-if="comments.length == 0" href="#">There is no comment...</a>
              <a v-if="comments" v-for="(item, index) in comments" :key="index"
                @click.prevent="commentLink(index, comments)" href="#">{{ item.comment }}</a>
            </div>
            <h3>Inputs</h3>
            <div id="inputsArea"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
