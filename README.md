# Symbol Complete

This is a very simple VSCode extension which converts a given set of (regular expression) patterns into a user-specified list of symbols.

![symbol-complete](https://raw.githubusercontent.com/stevengeeky/symbol-complete/master/symbol-complete.gif)

## Usage

Install this extension by searching 'Symbol Complete' in VSCode extensions.
Open up a new file and type something like `|-->|` and it should convert to `⟶` automatically.

## Extension Settings

```json
{
    "symbol-complete.replacements": {
        "\\|lambda\\|": "λ",
        "\\.\\.\\.": "..."
    }
}
```

Replacements for all Greek symbols are added.\
As of 0.0.9 support for lots of set theory operators are added as well. See `package.json` for the full list of default replacements.

This extension also works with multiple selections.

## Known Issues

Minor undo problems

## Release Notes

### 0.0.9

Support for multiple selections.\
Added more character conversions.

### 0.0.6 — 0.0.8

Minor undo issue fixed

### 0.0.2 — 0.0.5

Minor revisions

### 0.0.1

Initial release
