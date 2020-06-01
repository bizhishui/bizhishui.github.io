---
title: Shared Libraries
layout: post
guid: urn:uuid:2c7d3e82-9d52-47a0-9258-09d22e4080a0
categories:
  - unix
tags:
  - Linux
  - ldconfig
  - ld.so
---


* TOC
{:toc}


----------------------------------------------
----------------------------------------------


### [Program libraries on Linux](http://tldp.org/HOWTO/Program-Library-HOWTO/introduction.html)

A *program library* is simply a file containing compiled code (and data) that is to be incorporated later into a program; program libraries allow programs to be more modular, 
faster to recompile, and easier to update. Program libraries can be roughly divided into two types: static libraries and shared libraries.

Static libraries are simply a collection of ordinary object files, and they are installed into a program executable before the program can be run; while shared libraries are loaded at program start-up and shared between programs.


### [Shared Libraries](http://tldp.org/HOWTO/Program-Library-HOWTO/shared-libraries.html)

#### Shared Library Names
{:.no_toc}

Take the example of blas libraries
```
    update-alternatives --display libblas.so
    # link currently points to /usr/lib/x86_64-linux-gnu/blas/libblas.so.3.7.1

    ll /etc/alternatives/libblas.so
    # /etc/alternatives/libblas.so -> /usr/lib/x86_64-linux-gnu/blas/libblas.so.3.7.1
    ll /usr/lib/x86_64-linux-gnu/blas
    # libblas.so -> libblas.so.3.7.1
    # libblas.so.3 -> libblas.so.3.7.1
    # libblas.so.3.7.1
    ll /usr/lib/libblas.so
    # /usr/lib/libblas.so -> /etc/alternatives/libblas.so 
    # libblas.so is installed in /usr/lib
```

- The *soname* has the prefix _lib_, the name of the library, the phrase _.so_, followed by a period and a version number. A fully-qualified soname includes as a prefix the directory it's in, */usr/lib/x86_64-linux-gnu/blas/libblas.so.3* in this case.
- The *real name* contains the actual library code, it adds to the soname a period, a minor number, another period, and the release number (optional). */usr/lib/x86_64-linux-gnu/blas/libblas.so.3.7.1* in this case.
- The *linker name* is the name that the compiler uses when requesting a library, */usr/lib/libblas.so* in this case.

#### Filesystem Placement
{:.no_toc}

The GNU standards recommend installing by default all libraries in */usr/local/lib* when distributing source code (and all commands should go into */usr/local/bin*).
According to the FHS, most libraries should be installed in */usr/lib*, but libraries required for startup should be in */lib* and libraries that are not part of the system should be in */usr/local/lib*.

There isn't really a conflict between these two documents; the GNU standards recommend the default for developers of source code, while the FHS recommends the default for distributors (who selectively override the source code defaults, usually via the system's package management system).

### [How Libraries are Used](https://www.cnblogs.com/sddai/p/10397510.html)

