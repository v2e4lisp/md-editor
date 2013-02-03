function readFile (evt) {
    var files = evt.target.files; // FileList object
    var reader = new FileReader();
    reader.readAsText(files[0]);
    reader.onload = function (fileEvent) {
        e.setValue(fileEvent.target.result, 0);
    };
}

document.getElementById('file').addEventListener('change', readFile, false);

function showResult(e) {
    consoleEl.innerHTML = e;
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
                            var n = e.getSession().getMode().$id;
                            if (n == "ace/mode/markdown") {
                                showResult(converter.makeHtml(t.getValue()));
                            }
                        },
                        readOnly: true });

e.commands.addCommand({ name: "save",
                        bindKey: {
                            win: "Ctrl-S",
                            mac: "Command-S"
                        },
                        exec: function (t) {
                            window.location = "data:application/octet-stream," + t.getValue();
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
