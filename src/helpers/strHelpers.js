function parseString(input) {
    const startIndex = input.indexOf("<");
    const endIndex = input.indexOf(">");
    if (startIndex === -1 || endIndex === -1) {
        return null;
    }
    const parts = input.slice(startIndex + 1, endIndex).split(" ");
    return parts[0];
}

function splitHTMLIntoArray(html) {
    const elementArray = [];
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const childNodes = tempDiv.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
        const child = childNodes[i];
        if (child.nodeType === Node.ELEMENT_NODE) {
            elementArray.push(child.outerHTML);
        }
    }
    return elementArray;
}

function removeAt(originalString, index, length) {
    return originalString.substring(0, index) + originalString.substring(index + length);
}

export { parseString, splitHTMLIntoArray, removeAt };
