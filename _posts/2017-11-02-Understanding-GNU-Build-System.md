---
title: Understanding the GNU Build System
layout: post
guid: urn:uuid:55ba0361-accd-4b8c-8a46-a33d0211261b
categories:
  - linux
tags:
  - Linux
  - Make
---

> This post udaptes mainly from [The magic behind configure, make, make install](https://robots.thoughtbot.com/the-magic-behind-configure-make-make-install) by George Brocklehurst and [Understanding the GNU Build System](https://www.softprayog.in/tutorials/understanding-gnu-build-system).


To build an open source on your own computer, the general procedure is simply like:
```shell
    {% highlight bash %}
    ./configure
    make
    make install
    {% endhighlight %}
```


### BUILDING A GNU PACKAGE
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
[![buildGNUPackage](/media/files/2017/11/02/buildGNUPackage.png)](https://github.com/bizhishui/bizhishui.github.io/blob/master/ "Building a GNU software package")

#### Errors
Most errors you will bump into while compiling have to do with missing libraries that the software depends on. Every case is unique, but watch for “not found” or “unable to locate” phrases. Typically you just need to install the “development” versions of the libraries it needs. These are usually available from your operating system vendor packages. Search for packages with names ending in *-devel*.


#### Where do these scripts come from
All of this works because a *configure* script examines your system, and uses the information it finds to convert a *Makefile.in* template into a *Makefile*, but where do the *configure* script and the *Makefile.in* template come from?

Programs that are built in this way have usually been packaged using a suite of programs collectively referred to as [autotools](https://www.gnu.org/software/automake/manual/html_node/Autotools-Introduction.html#Autotools-Introduction). This suite includes *autoconf*, *automake*, and many other programs, all of which work together to make the life of a software maintainer significantly easier. The end user doesn’t see these tools, but they take the pain out of setting up an install process that will run consistently on many different flavours of Unix.

### THE GNU BUILD SYSTEM
In the above paragraphs, two problems are quite clear. First, a given GNU package has to be built in different hardware and software environments. Second, there are a number of targets that the makefiles should be capable of building. Then, there is a third problem that the software sources may be organized in different directories. These problems appear to be formidable. But, there is nothing to worry as the GNU Build System comprising of programs, Autoconf, Automake and Libtool have abstracted the complexity out of this work. Using Autotools, it becomes quite simple for the package developer to provide the required infrastructure for the end-user to build and install the software. 
[![GNUBuildSystem](/media/files/2017/11/02/GNUBuildSystem.png)](https://github.com/bizhishui/bizhishui.github.io/blob/master/ "The GNU Build System")


### OVERVIEW
Now we know where this incantation comes from and how it works!

On the maintainer’s system:
```shell
    aclocal                 # Set up an m4 environment
    autoconf                # Generate configure from configure.ac
    automake --add-missing  # Generate Makefile.in from Makefile.am
    ./configure             # Generate Makefile from Makefile.in
    make distcheck          # Use Makefile to build and test a tarball to distribute
```

On the end-user’s system:
```shell
    ./configure   # Generate Makefile from Makefile.in
    make -j n     # Use Makefile to build the program with n threads
    make install  # Use Makefile to install the program
```
