import Quill from "quill";
import { checkHeaders, checkInputIndicies } from "./handlerHelpers"

var globalEditor;

function newEditor(editorContentArea, toolbarDOM) {
    let editor = new Quill(editorContentArea.value, {
        modules: {
            toolbar: {
                container: toolbarDOM,
            },
            history: {
                delay: 2000,
                maxStack: 500,
                userOnly: true,
            },
        },
        theme: "snow",
    });

    editor.on("text-change", function (delta, oldDelta, source) {
        checkHeaders();
        checkInputIndicies(delta, source);
    });

    globalEditor = editor;
    return editor;
}

function setContent(content) {
    globalEditor.setContents(content);
}

function getContent() {
    let content = globalEditor.getContents();
    return content;
}

function getEditor() {
    return globalEditor;
}

export { newEditor, setContent, getContent, getEditor };
