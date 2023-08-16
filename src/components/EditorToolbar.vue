<script setup>

const emits = defineEmits([
    "setDefaultContent",
    "updateDefaultContent",
    "compareCurrentAndDefaultContent",
    "newComment",
    "addInput",
])

</script>

<template>
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
        <a class="custom-act" @click="emits('setDefaultContent')">
            <i class="fa-solid fa-hammer"></i>
        </a>
        <a class="custom-act" @click="emits('updateDefaultContent')">
            <i class="fa-solid fa-wrench"></i>
        </a>
        <a class="custom-act" @click="emits('compareContent')">
            <i class="fa-solid fa-compress"></i>
        </a>
        <a class="custom-act" @click="emits('newComment')">
            <i class="fa-solid fa-comment"></i>
        </a>
        <a class="custom-act" @click="emits('addInput')">
            <i class="fa-solid fa-keyboard"></i>
        </a>
    </div>
</template>