import { getEditor } from "./editorHelpers";

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
    }
}

export { commentLink, inputChangeHandler }