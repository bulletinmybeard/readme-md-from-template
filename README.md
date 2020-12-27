![App license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)
![App version](https://img.shields.io/badge/version-1.0.0-blue.svg)

# readme-md-from-template
The readme.md-from-template script creates and updates a `README.md` file from templates such as `README.tpl.md`. Placeholders within the README template are being parsed and replaced with content from the `package.json` as well as custom PLACEHOLDERS  you can define within the script.

# Table of contents
- [Arguments](#script-arguments)
- [References](#references)
- [TODO](#todo)

# Script arguments
[^TOC](#table-of-contents)

| Argument | Required | Default |
|:----------|:-------------|:------|
| `--template` |  yes | Path to the README template file (e.g., `README.tpl.md`).  |
| `--output` | yes | Path to the output `README.md`.  |
| `--package` | yes | Path to the `package.json`. |
| `--force` | no | Given `true` (or `false`) will overwrite the output `README.md` if it exists already. |

```
node \
    src/app.js \
    --template=./README.tpl.md \
    --output=../README.md \
    --package=../package.json \
    --force=true
```

# References
[^TOC](#table-of-contents)

- https://nodejs.org/api/readline.html
- https://docs.github.com/en/free-pro-team@latest/github/writing-on-github/basic-writing-and-formatting-syntax

# TODO
[^TOC](#table-of-contents)

- [ ] Refactor regular expressions to match the placeholders.
 
