![App license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)
![App version](https://img.shields.io/badge/version-1.0.0-blue.svg)

# readme-md-from-template
The readme.md-from-template script creates and updates a `README.md` file from templates such as `README.tpl.md`. Placeholders within the README template are being parsed and replaced with content from the `package.json` as well as custom PLACEHOLDERS  you can define within the script.

# Table of contents
- [Arguments](#script-arguments)
- [Placeholders](#placeholders)
- [Conditional checks](#conditional-checks)
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
# Placeholders
[^TOC](#table-of-contents)

The script supports per default the following placeholders and consumes information from the `package.json` for those. Those placeholder identifiers are uppercase and wrapped in curly brackets (e.g., `{{ APP_VERSION }}`).

| Placeholder | |
|:----------|:------|
| `{{ APP_VERSION }}` | `version` |
| `APP_NAME` | `name` |
| `APP_DESCRIPTION` | `description` |
| `APP_LICENSE` | `license` |
| `PACKAGE_LIST` | List of all first-level Node packages |
| `NODE_VERSION` | `engines.node` |

# Conditional checks
[^TOC](#table-of-contents)

It's possible to include/exclude parts of the README if the placeholder doesn't match a pattern. At the moment, it's limited to its existence. To disable the **Node version badge** if `engines.node` is missing in the `package.json`, you can do this:
```
{{ IF:NODE_VERSION }}![Node version](https://img.shields.io/badge/Node%20version-{{ NODE_VERSION }}-blue){{ END-IF }}
```
Or if you want to disable multiple lines, you can do something like this:
```
{{ IF:PACKAGE_LIST }}
# Packages
| Name | Version | Description | Website |
|:----------|:-------------|:------|:------|
{{ PACKAGE_LIST }}
{{ END-IF }}
```

# References
[^TOC](#table-of-contents)

- https://nodejs.org/api/readline.html
- https://docs.github.com/en/free-pro-team@latest/github/writing-on-github/basic-writing-and-formatting-syntax

# TODO
[^TOC](#table-of-contents)

- [ ] Refactor the way how to match single- and multi-line placeholders.
- [ ] Support more badges.
- [ ] Support more license types.
 
