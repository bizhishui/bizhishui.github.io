---
title: Understanding the GUN Build System
layout: post
guid: urn:uuid:55ba0361-accd-4b8c-8a46-a33d0211261b
categories:
  - linux
tags:
  - Linux
  - Make
---

> This post adapted mainly from [George Brocklehurst](https://robots.thoughtbot.com/the-magic-behind-configure-make-make-install).


To build an open source on your own computer, the general procedure is simply like:
```
    ./configure
    make
    make install
```

### What dose all this do
There are three distinct steps in this process:

#### 1. Configure the software
The primary job of the configure script is to detect information about your system and “configure” the source code to work with it. Usually it will do a fine job at this. The secondary job of the configure script is to allow you, the system administrator, to customize the software a bit. Running *./configure --help* should give you a list of command line arguments you can pass to the configure script. Usually these extra arguments are for enabling or disabling optional features of the software, and it is often safe to ignore them and just type *./configure* to take the default configuration.
