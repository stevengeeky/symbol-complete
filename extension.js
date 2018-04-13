/**
 * @name Symbol Complete
 * @author Steven O'Riley
 * @desc Automatically replaces patterns at the cursor with specified symbols
 */
const vscode = require('vscode');

let just_replaced = [];
let replacements;

function activate(context) {
    var config = vscode.workspace.getConfiguration("symbol-complete");
    replacements = config.get("replacements");
    
    // let disposable = vscode.commands.registerCommand('extension.symbolComplete', function () {
    //     vscode.window.onDidChangeTextEditorSelection(() => update(replacements), this);
    // });

    vscode.window.onDidChangeTextEditorSelection(update);
    vscode.workspace.onDidChangeConfiguration(() => {
        var config = vscode.workspace.getConfiguration("symbol-complete");
        replacements = config.get("replacements");
    });
    // context.subscriptions.push(disposable);
}

function update() {
    let editor = vscode.window.activeTextEditor;
    let document = editor.document;
    let changes = [];
    let selections = editor.selections;
    
    while (just_replaced.length > selections.length) just_replaced.pop();
    
    let lines = [];
    
    for (let index in selections) {
        let selection = selections[index];
        let line = document.lineAt(selection.start).text;
        let line_to_cursor = line.substring(0, selection.start.character);
        lines.push(line_to_cursor);
        
        if (selection.isEmpty) {
            for (let k in replacements) {
                let pattern = k;
                if (!pattern.endsWith('$')) pattern += '$';
                let reg = new RegExp(pattern);
                if (reg.test(line_to_cursor)) {
                    let value = line_to_cursor.substring(line_to_cursor.match(reg).index);
                    if (value.length > 0) {
                        changes.push([index, value, selection.end.line, selection.end.character, replacements[k]]);
                        num_changes++;
                    }
                }
            }
        }
        
        if (lines.length == editor.selections.length) {
            if (changes.length > 0) {
                changes.sort(function(b, a) {
                    return a[2] < b[2] || (a[2] == b[2] && a[3] < b[3]);
                });
                
                editor.edit(function(edit) {
                    let i = 0;
                    changes.forEach(change => {
                        let jr = just_replaced[+change[0]];
                        console.log(JSON.stringify(jr), JSON.stringify([change[2], change[3]]));
                        
                        just_replaced[+change[0]] = [change[2], change[3]];
                        if (jr && jr[0] == change[2] && jr[1] == change[3]) return (just_replaced[+change[0]] = undefined);
                        
                        let replacement = change[4];
                        let range = new vscode.Selection(change[2], change[3] - change[1].length, change[2], change[3]);
                        edit.replace(range, "");
                        
                        let beginning = editor.selections[change[0]].end;
                        edit.insert(beginning, replacement);
                    });
                });
            }
        }
    }
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;