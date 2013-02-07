var editor = ace.edit("editor");
editor.setTheme("ace/theme/vibrant_ink");
editor.getSession().setMode("ace/mode/markdown");
editor.setFontSize("14px");
var consoleEl = document.getElementsByClassName("c")[0];
var converter = new Showdown.converter;

function showResult(content) {
    consoleEl.innerHTML = content;
}

editor.commands.addCommand({ name: "markdown",
                             bindKey: {
                                 win: "Ctrl-M",
                                 mac: "Command-M"
                             },
                             exec: function (t) {
                                 showResult(converter.makeHtml(t.getValue()));
                             },
                             readOnly: true });

editor.commands.addCommand({ name: "save",
                             bindKey: {
                                 win: "Ctrl-S",
                                 mac: "Command-S"
                             },
                             exec: function (t) {
                                 saveFile();
                             },
                             readOnly: true });

editor.commands.addCommand({ name: "open",
                             bindKey: {
                                 win: "Ctrl-L",
                                 mac: "Command-L"
                             },
                             exec: function (t) {
                                 openFile()
                             },
                             readOnly: true });

editor.commands.addCommand({ name: "reset",
                             bindKey: {
                                 win: "Ctrl-Q",
                                 mac: "Ctrl-Q"
                             },
                             exec: function (t) {
                                 createNew();
                             },
                             readOnly: true });

editor.getSession().on('change', function(t) {
    showResult(converter.makeHtml(editor.getSession().getValue()));
});

// initial readme;

var readme = "# MD-editor\n\
> A markdown editor with real-time preview.  \n\
\n\
---\n\
\n\
## Useage:\n\
\n\
> * Open the md-editor.html file\n\
* For Mac\n\
  - Command-L: load file\n\
  - Command-S: save/save-as file\n\
* For Windows\n\
  - Ctrl-L: load file\n\
  - Ctrl-S: save/save-as file\n\
* Tricks that help you edit\n\
  - C-p: move to the previous line\n\
  - C-n: move to the next line\n\
  - C-f: move forward a character\n\
  - C-b: move backward a character\n\
  - C-a: move to the beginning of the line\n\
  - C-e: move to the end of the line\n\
  - C-d: delete forward\n\
  - C-h: delete backward\n\
  - C-k: delete the rest of the line\n\
  - __C-q__: reset content;\n\
* And others\n\
\n\
\n\
## TODO:\n\
- Connnect to google driver?";

createNew();
editor.getSession().setValue(readme, 0);

var fileEntry;
var gotWritable = false;
var modeDescription = '';

function updatePathTo(aPath) {
   document.getElementById('file-info').innerHTML = aPath;
}

function updatePath() {
  if (fileEntry) {
    chrome.fileSystem.getDisplayPath(fileEntry, updatePathTo);
  } else {
    updatePathTo('[new file]');
  }
}
function updateModeForBaseName(aBaseName) {
    return;
}

function showError(anError) {
    return;

}

function clearError() {
    return;
}

function replaceDocContentsFromString(string) {
    editor.getSession().setValue(string);
}

function replaceDocContentsFromFile(file) {
    if (window.FileReader) {
        var reader = new FileReader();
        reader.onload = function() {
            replaceDocContentsFromString(reader.result);
        };
        reader.readAsText(file);
    }
}

function replaceDocContentsFromFileEntry() {
    fileEntry.file(replaceDocContentsFromFile);
}

function saveToEntry() {
    fileEntry.createWriter(function(fileWriter) {
        fileWriter.onwriteend = function(e) {
            if (this.error)
                gStatusEl.innerHTML = 'Error during write: ' + this.error.toString();
            else
                clearError();
        };

        var blob = new Blob([editor.getSession().getValue()], {type: 'text/plain'});
        fileWriter.write(blob);
    });
}

function setEntry(anEntry, isWritable, name) {
    fileEntry = anEntry;
    gotWritable = isWritable;
    if (fileEntry) {
        updateModeForBaseName(fileEntry.name);
    } else if (name) {
        updateModeForBaseName(name);
    }
    updatePath();
}

// Create a new document. This just wipes the old document.
function createNew() {
    replaceDocContentsFromString();
    setEntry(null, false);
}

function openFile() {
    chrome.fileSystem.chooseEntry(function (entry) {
        if (chrome.runtime.lastError) {
            showError(chrome.runtime.lastError.message);
            return;
        }
        clearError();
        setEntry(entry, false);
        replaceDocContentsFromFileEntry();
    });
}

function saveFile() {
    if (gotWritable) {
        saveToEntry();
    } else if (fileEntry) {
        chrome.fileSystem.getWritableEntry(fileEntry, function(entry) {
            if (chrome.runtime.lastError) {
                showError(chrome.runtime.lastError.message);
                return;
            }
            clearError();
            setEntry(entry, true);
            saveToEntry();
        });
    } else {
        saveAs();
    }
}

function saveAs() {
    chrome.fileSystem.chooseEntry({type: 'saveFile'}, function(entry) {
        if (chrome.runtime.lastError) {
            showError(chrome.runtime.lastError.message);
            return;
        }
        clearError();
        setEntry(entry, true);
        saveToEntry();
    });
}
