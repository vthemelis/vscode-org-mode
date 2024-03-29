import * as vscode from 'vscode';
import * as Utils from './utils';

export function insertHeadingRespectContent(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
        const document = textEditor.document;
        const cursorPos = Utils.getCursorPosition();
        const curLine = Utils.getLine(document, cursorPos);
        const endOfLine = curLine.length;
        let insertPos = new vscode.Position(cursorPos.line, endOfLine);

        let sibling;
        const headerPrefix = Utils.getHeaderPrefix(curLine);

        if(headerPrefix) {
            sibling = headerPrefix;
            insertPos = Utils.findEndOfContent(document, cursorPos, sibling);
        } else {
            const parentHeader = Utils.findParentPrefix(document, cursorPos) || "*";
            sibling = parentHeader;
            insertPos = Utils.findEndOfContent(document, cursorPos, Utils.getPrefix(curLine));
        }

        if(sibling) {
            edit.insert(insertPos, "\n" + sibling + " ");
            Utils.moveToEndOfLine(textEditor, new vscode.Position(insertPos.line, 0));
            textEditor.revealRange(new vscode.Range(new vscode.Position(insertPos.line, 0), insertPos));     // jump screen so cursor is in view
        }
}

export function insertChild(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    const cursorPos = Utils.getCursorPosition();
    const curLine = Utils.getLine(textEditor.document, cursorPos);
    const endOfLine = curLine.length;
    const headerPrefix = Utils.getHeaderPrefix(curLine);
    const insertPos = new vscode.Position(cursorPos.line, endOfLine);

    if(headerPrefix) {
        edit.insert(insertPos, "\n" + headerPrefix.trim() + "* ");
        Utils.moveToEndOfLine(textEditor, new vscode.Position(insertPos.line, 0));
        textEditor.revealRange(new vscode.Range(insertPos, insertPos));     // jump screen so cursor is in view
    }
}

export function demoteLine(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    const cursorPos = Utils.getCursorPosition();
    const curLine = Utils.getLine(textEditor.document, cursorPos);
    const headerPrefix = Utils.getHeaderPrefix(curLine);
    const insertPos = new vscode.Position(cursorPos.line, 0);
    if(headerPrefix) {
        edit.insert(insertPos, "*");
    }
}

export function promoteLine(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    const cursorPos = Utils.getCursorPosition();
    const curLine = Utils.getLine(textEditor.document, cursorPos);
    const headerPrefix = Utils.getHeaderPrefix(curLine);
    const insertPos = new vscode.Position(cursorPos.line, 0);

    if(headerPrefix && headerPrefix !== "* ") {
        const deleteRange = new vscode.Range(insertPos, new vscode.Position(insertPos.line, 1));
        edit.delete(deleteRange);
    }
}