import Quill from "quill";

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

function getToolbarOptions() {
    var toolbarOptions = [
        "bold",
        "italic",
        "underline",
        "strike",
        "link",
        "image",
        "blockquote",
        "code-block",
        { header: 1 },
        { header: 2 },
        { list: "ordered" },
        { list: "bullet" },
        { script: "sub" },
        { script: "super" },
        { indent: "-1" },
        { indent: "+1" },
        { direction: "rtl" },
        { size: ["small", false, "large", "huge"] },
        { header: [1, 2, 3, 4, 5, 6] },
        { color: ["red", "blue", "green", "aliceblue"] },
        { background: [] },
        { font: [] },
        { align: [] },
        "clean",
    ];

    return toolbarOptions;
}

function newEditor(editorArea) {
    let Font = Quill.import("formats/font");
    Font.whitelist = ["inconsolata", "roboto", "mirza", "arial"];
    Quill.register(Font, true);

    var editor = new Quill(editorArea.value, {
        modules: {
            toolbar: {
                container: ".editorToolbar",
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
    });

    return editor;
}

function setContent(editor, content) {
    editor.setContents(content);
    console.log("Setted Content: ", content);
}

function getContent(editor) {
    let content = editor.getContents();
    console.log("Getted Content: ", content);
    return content;
}

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

function parseString(input) {
    // İlk '<' karakterinin indeksini bul
    const startIndex = input.indexOf("<");

    // İlk '>' karakterinin indeksini bul
    const endIndex = input.indexOf(">");

    // Eğer her iki karakter de bulunmuyorsa null dönelim (her ne kadar her durumda bu karakterlerin olacağını söylemiş olsanız da)
    if (startIndex === -1 || endIndex === -1) {
        return null;
    }

    // İki karakter arasını al ve boşlukla parçalara ayır
    const parts = input.slice(startIndex + 1, endIndex).split(" ");

    // İlk parçayı dön
    return parts[0];
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

function addComment(editor, commentsData) {
    var prompt = window.prompt("Please enter Comment", "");
    if (prompt == null || prompt == "") {
        console.log("User cancelled the prompt.");
    } else {
        var range = editor.getSelection();
        if (range) {
            if (range.length == 0) {
                alert("Please select text", range.index);
            } else {
                commentsData.value.push({ range: range, comment: prompt });
                editor.formatText(range.index, range.length, {
                    background: "#fff72b",
                });
            }
        } else {
            alert("User cursor is not in editor");
        }
    }
    return commentsData;
}

function commentLink(index, editor, commentsData) {
    var data = commentsData[index];
    editor.setSelection(data.range.index, data.range.length);
}

export { splitHTMLIntoArray, compareContent, newEditor, setContent, getContent, addComment, commentLink };
