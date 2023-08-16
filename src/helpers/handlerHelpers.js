import { getEditor } from "./editorHelpers";
import { removeAt } from "./strHelpers";

function commentLink(index, comments) {
    var data = comments[index];
    getEditor().setSelection(data.range.index, data.range.length);
}

function inputChangeHandler(event) {
    var content = event.target.value;
    var rangeLength = parseInt(event.target.attributes.rangeLength.value);
    var rangeIndex = parseInt(event.target.attributes.rangeIndex.value);

    getEditor().deleteText(rangeIndex, rangeLength);
    getEditor().insertText(rangeIndex, content);

    if (content.length !== rangeLength) {
        event.target.setAttribute("rangeLength", content.length.toString());
        let indexChange, lengthChange, changeType;

        if (content.length > rangeLength) {
            indexChange = rangeIndex + content.length - 1;
            lengthChange = 1;
            changeType = "insert";
        } else {
            indexChange = rangeIndex + content.length - 1;
            lengthChange = 1;
            changeType = "delete";
        }

        var editorInputs = document.querySelectorAll("[name='editorInputs']");
        editorInputs.forEach((input) => {
            let inputIndex = parseInt(input.getAttribute("rangeIndex"));
            let inputLength = parseInt(input.getAttribute("rangeLength"));
            if (inputIndex >= indexChange) {
                switch (changeType) {
                    case "insert":
                        input.setAttribute("rangeIndex", inputIndex + lengthChange);
                        break;
                    case "delete":
                        input.setAttribute("rangeIndex", inputIndex - lengthChange);
                        break;
                }
            }
        });
    }
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

function checkInputIndicies(delta, source) {
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
}

function updateInputIndices(indexChange, lengthChange, changeType) {
    var editorInputs = document.querySelectorAll("[name='editorInputs']");
    editorInputs.forEach((input) => {
        let inputIndex = parseInt(input.getAttribute("rangeIndex"));
        let inputLength = parseInt(input.getAttribute("rangeLength"));

        if (indexChange >= inputIndex && indexChange < inputIndex + inputLength) {
            let value = input.value;
            let newText = removeAt(value, indexChange - inputIndex, lengthChange);
            input.setAttribute("rangeLength", newText.length.toString());
            input.value = newText;
        }

        if (inputIndex >= indexChange) {
            switch (changeType) {
                case "insert":
                    input.setAttribute("rangeIndex", inputIndex + lengthChange);
                    break;
                case "delete":
                    input.setAttribute("rangeIndex", inputIndex - lengthChange);
                    break;
            }
        }
    });
}

export { commentLink, inputChangeHandler, checkHeaders, checkInputIndicies, updateInputIndices };
