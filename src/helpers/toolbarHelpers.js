import mammoth from "mammoth";
import { getEditor, getContent, setContent } from "./editorHelpers";
import { inputChangeHandler } from "./handlerHelpers";

function setDefaultContent() {
    var delta;
    if (!localStorage.getItem("defaultContent")) {
        let defaultHtml = `<h1>Hello Visitor</h1>`;
        let defaultHtmlDelta = getEditor().clipboard.convert(defaultHtml);
        localStorage.setItem("defaultContent", JSON.stringify(defaultHtmlDelta));
    }
    delta = JSON.parse(localStorage.getItem("defaultContent"));
    setContent(delta);
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
            alert("User cursor is not in editor");
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
// TO-DO
function compareContent(editor, oldContent, newContent, oldContentText) {
    const differences = {
        insert: [],
        delete: [],
    };

    var diff = oldContent.diff(newContent);
    for (var i = 0; i < diff.ops.length; i++) {
        var op = diff.ops[i];
        if (op.hasOwnProperty("insert")) {
            differences.insert.push(op.insert); // need fix
            op.attributes = {
                ...op.attributes,
                background: "#cce8cc",
                color: "#003700",
            };
        }
        if (op.hasOwnProperty("delete")) {
            let deletedText = oldContentText.substring(oldContentText.length - op.delete - 1); // need fix
            differences.delete.push(deletedText);
            op.retain = op.delete; // need fix
            delete op.delete;
            op.attributes = {
                ...op.attributes,
                background: "#e8cccc",
                color: "#370000",
                strike: true,
            };
        }
    }
    var adjusted = oldContent.compose(diff);
    editor.setContents(adjusted);
}
// TO-DO

export { setDefaultContent, updateDefaultContent, newComment, addInput, importWord, compareContent };
