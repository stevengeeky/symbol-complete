/**
 * @name Symbol Complete
 * @author Steven O'Riley
 * @desc Automatically replaces patterns at the cursor with specified symbols
 */
const vscode = require('vscode');

function activate(context) {
    var config = vscode.workspace.getConfiguration("symbol-complete");
    var replacements = config.get("replacements");
    
    let disposable = vscode.commands.registerCommand('extension.symbolComplete', function () {
        vscode.window.onDidChangeTextEditorSelection(() => update(replacements), this);
    });

    context.subscriptions.push(disposable);
}

function update(replacements) {
    var editor = vscode.window.activeTextEditor;
    var document = editor.document;
    var selection = editor.selection;
    
    var line = document.lineAt(selection.start).text;
    var line_to_cursor = line.substring(0, selection.start.character);
    
    if (selection.isEmpty) {
        for (var k in replacements) {
            var pattern = k;
            if (!pattern.endsWith('$')) pattern += '$';
            var reg = new RegExp(pattern);
            if (reg.test(line_to_cursor)) {
                var value = line_to_cursor.substring(line_to_cursor.match(reg).index);
                if (value.length > 0) {
                    editor.edit(function(editBuilder) {
                        editBuilder.replace(new vscode.Selection(selection.start.line, selection.start.character - value.length, selection.start.line, selection.start.character), replacements[k]);
                    }).then(function() {
                        if (!editor.selection.isEmpty) {
                            editor.selection = new vscode.Selection(selection.start.line, selection.start.character, selection.start.line, selection.start.character);
                        }
                    });
                    break;
                }
            }
        }
    }
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;