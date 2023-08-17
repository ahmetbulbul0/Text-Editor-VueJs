import mammoth from "mammoth";
import { getEditor, getContent, setContent } from "./editorHelpers";
import { inputChangeHandler } from "./handlerHelpers";

var defaultContent, defaultContentText;

function setDefaultContent() {
    getEditor().enable(true);
    document.getElementById("inputsArea").innerHTML = ""
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
    if (getEditor().isEnabled() == false) {
        console.log("Editor Disabled");
        return;
    }
    let currentContent = getContent(getEditor());
    localStorage.setItem("defaultContent", JSON.stringify(currentContent));
}

function newComment(comments) {
    if (getEditor().isEnabled() == false) {
        console.log("Editor Disabled");
        return;
    }
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
    if (getEditor().isEnabled() == false) {
        console.log("Editor Disabled");
        return;
    }
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
    if (getEditor().isEnabled() == false) {
        console.log("Editor Disabled");
        return;
    }
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
    if (getEditor().isEnabled() == false) {
        console.log("Editor Disabled");
        return;
    }
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

function setFixedInputs() {
    getEditor().setContents({
        ops: [
            { insert: "Title \n", attributes: { header: 1 } },
            { insert: "\n" },
            { insert: "Description \n", attributes: { italic: true } },
            { insert: "\n" },
            { insert: "Sub Title \n", attributes: { header: 2 } },
            { insert: "\n" },
            { insert: "Sub Description \n", attributes: { italic: true, size: "small" } },
        ],
    });

    let contentText = getEditor().getText();
    let titleIndex = contentText.indexOf("Title");
    let descriptionIndex = contentText.indexOf("Description");
    let subTitleIndex = contentText.indexOf("Sub Title");
    let subDescriptionIndex = contentText.indexOf("Sub Description");

    let inputs = [];
    inputs.push("<input value='Title' name='editorInputs' rangeLength='5' rangeIndex='" + titleIndex + "'>");
    inputs.push("<textarea value='Description' name='editorInputs' rangeLength='11' rangeIndex='" + descriptionIndex + "'>Description</textarea>");
    inputs.push("<input value='Sub Title' name='editorInputs' rangeLength='9' rangeIndex='" + subTitleIndex + "'>");
    inputs.push("<textarea value='Sub Description' name='editorInputs' rangeLength='15' rangeIndex='" + subDescriptionIndex + "'>Sub Description</textarea>");

    inputs.forEach((input) => {
        let inputElement = document.createElement("div");
        inputElement.innerHTML = input;
        let actualInputElement = inputElement.firstChild;
        document.getElementById("inputsArea").appendChild(actualInputElement);
        actualInputElement.addEventListener("input", inputChangeHandler);
    });

    getEditor().enable(false);
}

export { setDefaultContent, updateDefaultContent, newComment, addInput, importWord, compareContent, setFixedInputs };
