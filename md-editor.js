function readFile (evt) {
    var files = evt.target.files; // FileList object
    var reader = new FileReader();
    reader.readAsText(files[0]);
    reader.onload = function (fileEvent) {
        e.setValue(fileEvent.target.result, 0);
    };
}

document.getElementById('file').addEventListener('change', readFile, false);

function showResult(content) {
    consoleEl.innerHTML = content;
}

var e = ace.edit("editor");
e.setTheme("ace/theme/vibrant_ink");
e.getSession().setMode("ace/mode/markdown");
e.setFontSize("16px");
var consoleEl = document.getElementsByClassName("c")[0];
var converter = new Showdown.converter;

e.commands.addCommand({ name: "markdown",
                        bindKey: {
                            win: "Ctrl-M",
                            mac: "Command-M"
                        },
                        exec: function (t) {
                            /*
                             var n = e.getSession().getMode().$id;
                             if (n == "ace/mode/markdown") {
                             showResult(converter.makeHtml(t.getValue()));
                             }
                             */
                            showResult(converter.makeHtml(t.getValue()));
                        },
                        readOnly: true });

e.commands.addCommand({ name: "save",
                        bindKey: {
                            win: "Ctrl-S",
                            mac: "Command-S"
                        },
                        exec: function (t) {
                            // alert(t.getValue());
                            window.location = "data:application/octet-stream," + escape(t.getValue());
                        },
                        readOnly: true });

e.commands.addCommand({ name: "load",
                        bindKey: {
                            win: "Ctrl-L",
                            mac: "Command-L"
                        },
                        exec: function (t) {
                            document.getElementById("file").click();
                        },
                        readOnly: true });

e.commands.addCommand({ name: "reset",
                        bindKey: {
                            win: "Ctrl-Q",
                            mac: "Ctrl-Q"
                        },
                        exec: function (t) {
                            t.setValue('', 0);
                        },
                        readOnly: true });

e.getSession().on('change', function(t) {
    showResult(converter.makeHtml(e.getValue()));
});

// initial readme;

var readme = "# MD-editor\n\
\n\
> A markdown editor with real-time preview.  \n\
Inspired by this post: [One line browser notepad](https://coderwall.com/p/lhsrcq)  \n\
And many thanks to this [piece of code](http://pastebin.com/raw.php?i=NzbtwjEy)\n\
\n\
---\n\
\n\
## Useage:\n\
\n\
> * Open the md-editor.html file\n\
* For Mac\n\
    - Command-L: load file\n\
    - Command-S: save file\n\
* For Windows\n\
    - Ctrl-L: load file\n\
    - Ctrl-S: save file\n\
* other built-in shorcuts\n\
* C-p: move to the previous line\n\
* C-n: move to the next line\n\
* C-f: move forward a character\n\
* C-b: move backward a character\n\
* C-a: move to the beginning of the line\n\
* C-e: move to the end of the line\n\
* C-d: delete forward\n\
* C-h: delete backward\n\
* C-k: delete the rest of the line\n\
* __C-q__: reset content;\n\
* And others\n\
\n\
\n\
## TODO:\n\
\n\
- make a chrome extension or something?\n\
- Connnect to google driver?";

e.setValue(readme, 0);
