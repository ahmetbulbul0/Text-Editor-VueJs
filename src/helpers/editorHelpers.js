import Quill from "quill";
import { removeAt } from "./strHelpers";

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
        if (source === "user") {
            let indexChange = delta.ops[0]?.retain || 0;
            let changeType,
                lengthChange = null;
            if (delta.ops[1].insert) {
                changeType = "insert";
                lengthChange = delta.ops[1].insert.length;
            } else if (delta.ops[1].delete) {
                changeType = "delete";
                lengthChange = delta.ops[1].delete;
            }
            updateInputIndices(indexChange, lengthChange, changeType);
        }
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

function checkHeaders() {
    const header1s = document.querySelectorAll(".ql-editor h1");
    var headerLinks = "";
    header1s.forEach((header, index) => {
        if (header.innerHTML != "" && header.innerHTML != null && header.innerHTML != "<br>") {
            let id = "header-" + (index + 1);
            header.setAttribute("id", id);
            headerLinks += "<a href='#" + id + "' class='medium'>" + header.innerHTML + "</a>";
        }
    });
    document.querySelector(".editorContentHeaders").innerHTML = headerLinks;
}

function updateInputIndices(indexChange, lengthChange, changeType) {
    var editorInputs = document.querySelectorAll("[name='editorInputs']");
    editorInputs.forEach((input) => {
        let inputIndex = parseInt(input.getAttribute("rangeIndex"));
        let inputLength = parseInt(input.getAttribute("rangeLength"));

        if (inputIndex <= indexChange && inputIndex + inputLength >= indexChange) {
            let value = input.value;
            let newText = removeAt(value, indexChange - inputIndex, lengthChange);
            input.setAttribute("rangeLength", newText.length.toString());
            input.value = newText;
        }

        if (inputIndex >= indexChange) {
            switch (changeType) {
                case "insert":
                    input.setAttribute("rangeIndex", inputIndex + lengthChange);
                    break; // "insert" durumu için bir break ekledim
                case "delete":
                    input.setAttribute("rangeIndex", inputIndex - lengthChange);
                    break;
            }
        }
    });
}

export { newEditor, setContent, getContent, getEditor };