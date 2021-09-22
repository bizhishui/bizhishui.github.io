---
title: Correct C/C++ code indentation
layout: post
guid: urn:uuid:7f0178d6-bfcc-48dd-90e8-101a393f7414
categories:
  - notes
tags:
  - Vim
  - C/C++
---

> A quick way to correct the indentation of c/c++ code with vim, from [stackoverflow](https://stackoverflow.com/questions/2506776/is-it-possible-to-format-c-code-with-vim/2506955).

First install *astyle*, the ANSI style

```
    apt-get install astyle
```

Then inside vim:

```
    :%!astyle     # astyle default mode is C/C++, this work on whole file
    :%!astyle --mode=c --style=ansi -s2     # ansi C++ style, use two spaces per indent level
    :1,40!astyle --mode=c --style=ansi      # ansi C++ style, filter only lines 1-40
```


