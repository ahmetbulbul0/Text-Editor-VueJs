import mammoth from "mammoth";
import { getEditor, getContent, setContent } from "./editorHelpers";
import { inputChangeHandler } from "./handlerHelpers";

var defaultContent, defaultContentText;

function setDefaultContent() {
    var delta;
    if (!localStorage.getItem("defaultContent")) {
        let defaultHtml = `<h1>Hello Visitor</h1>`;
        let defaultHtmlDelta = getEditor().clipboard.convert(defaultHtml);
        localStorage.setItem("defaultContent", JSON.stringify(defaultHtmlDelta));
    }
    delta = JSON.parse(localStorage.getItem("defaultContent"));
    setContent(delta);
    defaultContent = getContent();
    defaultContentText = getEditor().getText();
}

function updateDefaultContent() {
    let currentContent = getContent(getEditor());
    localStorage.setItem("defaultContent", JSON.stringify(currentContent));
}

function newComment(comments) {
    var prompt = window.prompt("Please enter Comment", "");
    if (prompt == null || prompt == "") {
        console.log("User cancelled the prompt.");
    } else {
        var range = getEditor().getSelection();
        if (range) {
            if (range.length == 0) {
                alert("Please select text", range.index);
            } else {
                comments.value.push({ range: range, comment: prompt });
                getEditor().formatText(range.index, range.length, {
                    background: "#fff72b",
                });
            }
        } else {
            console.log("User cursor is not in editor");
        }
    }
    return comments;
}

function addInput() {
    let range = getEditor().getSelection();
    if (range && range.length != 0) {
        let text = getEditor().getText(range.index, range.length);
        let input = "<input value='" + text + "' name='editorInputs' rangeLength='" + range.length + "' rangeIndex='" + range.index + "'>";
        let inputElement = document.createElement("div");
        inputElement.innerHTML = input;
        let actualInputElement = inputElement.firstChild;
        document.getElementById("inputsArea").appendChild(actualInputElement);
        actualInputElement.addEventListener("input", inputChangeHandler);
    }
}

function importWord(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            mammoth
                .convertToHtml({ arrayBuffer: event.target.result })
                .then((result) => {
                    getEditor().clipboard.dangerouslyPasteHTML(result.value);
                })
                .catch((err) => {
                    console.error("Error converting Word to HTML:", err);
                });
        };
        reader.readAsArrayBuffer(file);
    }
}

function compareContent() {
    let newContent = getContent();
    var diff = defaultContent.diff(newContent);
    for (var i = 0; i < diff.ops.length; i++) {
        var op = diff.ops[i];
        if (op.hasOwnProperty("insert")) {
            op.attributes = {
                ...op.attributes,
                background: "#cce8cc",
                color: "#003700",
            };
        }
        if (op.hasOwnProperty("delete")) {
            op.retain = op.delete;
            delete op.delete;
            op.attributes = {
                ...op.attributes,
                background: "#e8cccc",
                color: "#370000",
                strike: true,
            };
        }
    }
    var adjusted = defaultContent.compose(diff);
    getEditor().setContents(adjusted);
}

export { setDefaultContent, updateDefaultContent, newComment, addInput, importWord, compareContent };
