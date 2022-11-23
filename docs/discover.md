---
id: discover
title: Discover Verna
sidebar_label: Discover Verna
---

`Verna` is a **library** that provides an easy way to create, modify, fill and display forms.

It's based on the standard React JSON Schema Form (RJSF).

Verna features malleable functionalities such as:
- multi-lingual by default
- customization of the fields
- customization of the parameters available to parameter a field
- form split in sections while managing the validation of the whole form
- native drag and drop of the fields for creation
- role management for editing or filling
- fully customizable renders

## Quick preview

If you are looking for a demo of what Verna can do, you can test the two demo available.

The code is in the repository of the library [repository Github](https://github.com/openfun/verna).
The demos are:
- Previewing the most complex use case with split form [demo site playground](https://openfun.github.io/verna/playground/).
- Previewing a use case to create a poll builder using a React component library [demo site poll manager](https://openfun.github.io/verna/poll/).

## Quick introduction

The Verna library can help you to create different types of forms.

> Tips: the forms will be built around sections and widgets.
> A section is a group of fields and a field is called a widget in the context of Verna

It can help you build one level form such as:
```
- the main section
    \-> field 1
    \-> field 2
    \-> ...
```

Or it can help you build more complex forms such as:
```
- the main section
    \-> section 1
        \-> widget 1.1
        \-> widget 2.2
        \-> ...
    \-> section 2
        \-> widget 2.1
        \-> widget 2.2
        \-> ...
```

## Start using it

If you want to try it, you can follow the [starter guide](./starter.md)
