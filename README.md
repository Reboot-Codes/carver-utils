# Carver Utils

`carver` is a suite of utilities for reverse engineering software. It's built on Node.js and various packages.

It's quite large when fully installed (`node_modules`), due to having a lot of dependencies. It has (or will have) a [Homebrew](https://brew.sh/) formula to install on macOS (linux not supported due to the `yarn` requirement, which can't be installed using Homebrew on linux).

## Commands

-   `get-page <website> [outpath]`
    -   Gets the specified webpage (as a screenshot and the html).
    -   Also can output to the specified directory (it will be created if necessary)
