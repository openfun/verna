# Verna 🏗
[![CircleCI](https://circleci.com/gh/openfun/verna/tree/main.svg?style=svg)](https://circleci.com/gh/openfun/verna/tree/main)

An extensible form builder based on [React JSON Schema Form](https://github.com/rjsf-team/react-jsonschema-form).

## Demos
To demonstrate verna capabilities, we developed several use case examples.
- Basic form playground:[👀 Live demo](https://openfun.github.io/verna/playground), [🧑‍💻 Source code](https://github.com/openfun/verna/tree/main/examples/playground)

## Overview

Verna is a React component to build forms that generates a [JSON Schema](http://json-schema.org/)
description of the form as output. The form can then be rendered with the [React JSON Schema Form](https://github.com/rjsf-team/react-jsonschema-form)
library, which makes it fully extensible to fit your needs.

## Quick preview
 
You can check examples available within the `examples` folder. Take a loot at the
`README.md` file in each example then follow instructions to run it.

### Instructions

🚧 **`@openfun/verna` is not yet available on NPM. Stay tuned !**
Soon instructions to install `@openfun/verna` within your project.

To run the project, you have to run :
1. `yarn install` 
2. `yarn dev`

You should now be able to access the playground example from http://localhost:3000

### Project structure (Yarn workspaces)

This repository is a monorepo based on Yarn workspace to organize code.
Workspaces are located in two directories `lib` and `examples`. You can get info on all existing
workspace through `yarn workspaces info` command.
In `lib`, there is the `@openfun/verna` workspace that is the project itself which will be published
on npm then the `examples` directory aims to contain all the examples to demonstrate feature of
Verna.

#### Scripts

Through Yarn workspace, you are able to launch main commands from the root of this repository.
Here are the available commands:

- `yarn build`: Build the `@openfun/verna` library for production.
- `yarn dev`: Build and watch `@openfun/verna` library then start development server from the
  example workspace define through the environment variable `VERNA_EXAMPLE` (by default it uses
  `verna-examples-playground`, take a look at `examples` directory to see all examples available)
- `yarn lint`: Lint the code of all workspaces.
- `yarn test`: Run test suites from `@openfun/verna` workspace.


## Contributing

This project is intended to be community-driven, so please, do not hesitate to
get in touch if you have any question related to our implementation or design
decisions.

We try to raise our code quality standards and expect contributors to follow
the recommandations from our
[handbook](https://openfun.gitbooks.io/handbook/content).

### License

This work is released under the MIT License (see [LICENSE](./LICENSE)).
