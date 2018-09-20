---
title: Unsatisfiedlinkerror
layout: post
guid: urn:uuid:2712624a-7cae-4d84-8671-997ae7b2a584
summary: Setting library path on linux.
categories:
  - unix
tags:
  - Ubuntu
  - Java
  - C++
---

[Java code call C++ compiled shared library](https://bizhishui.github.io/Java-Realated) through *Java Native Interface (JNI)* throw *java.lang.unsatisfiedlinkerror* error.
Setting *LD_LIBRARY_PATH* in *bashrc* is not enough to solve this error, more [configurations](https://stackoverflow.com/questions/13428910/how-to-set-the-environmental-variable-ld-library-path-in-linux)
are need.
