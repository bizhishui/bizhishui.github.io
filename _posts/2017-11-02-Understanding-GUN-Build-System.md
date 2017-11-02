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

> This post daptes mainly from [George Brocklehurst](https://robots.thoughtbot.com/the-magic-behind-configure-make-make-install).


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

There is one common argument to *configure* that you should be aware of. The *--prefix* argument defines where you want the software installed. In most source packages this will default to */usr/local/* and that is usually what you want. But sometimes you may not have root access to the system, and you would like to install the software into your home directory. You can do this with the last command in the example, *./configure --prefix=${HOME}*.

#### 2. Build the software
Once *configure* has done its job, we can invoke *make* to build the software. This runs a series of tasks defined in a *Makefile* to build the finished program from its source code.

The tarball you download usually doesn’t include a finished *Makefile*. Instead it comes with a template called *Makefile.in* and the *configure* script produces a customised Makefile specific to your system.

#### 3. Install the software
Now that the software is built and ready to run, the files can be copied to their final destinations. The *make install* command will copy the built program, and its libraries and documentation, to the correct locations.

This usually means that the program’s binary will be copied to a directory on your *PATH*, the program’s manual page will be copied to a directory on your *MANPATH*, and any other files it depends on will be safely stored in the appropriate place.

Since the install step is also defined in the *Makefile*, where the software is installed can change based on options passed to the *configure* script, or things the *configure* script discovered about your system.
