function removeAt(originalString, index, length) {
    return originalString.substring(0, index) + originalString.substring(index + length);
}

export { removeAt };
