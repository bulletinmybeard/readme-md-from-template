{{ IF:APP_LICENSE }}![App license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg){{ END-IF }}
{{ IF:APP_VERSION }}![App version](https://img.shields.io/badge/version-{{ APP_VERSION }}-blue.svg){{ END-IF }}
{{ IF:NODE_VERSION }}![Node version](https://img.shields.io/badge/Node%20version-{{ NODE_VERSION }}-blue){{ END-IF }}

{{ IF:APP_NAME }}# {{ APP_NAME }}{{ END-IF }}
{{ IF:APP_DESCRIPTION }}{{ APP_DESCRIPTION }}{{ END-IF }}

{{ IF:PACKAGE_LIST }}
# Packages
| Name | Version | Description | Website |
|:----------|:-------------|:------|:------|
{{ PACKAGE_LIST }}
{{ END-IF }}

