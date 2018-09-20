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


Here is an involved example, update *LD_LIBRARY_PATH* as follow,
```
    # setting LD_LIBRARY_PATH in .bashrc
    export LD_LIBRARY_PATH=/opt/intel/compilers_and_libraries_2019.0.117/linux/compiler/lib/intel64:/opt/intel/compilers_and_libraries_2019.0.117/linux/mkl/lib/intel64:$LD_LIBRARY_PATH
```

Add a custom *.conf* file to */etc/ld.so.conf.d*, for example, *intel-mpi-2019.0.117.conf*.
```
    # add library path to conf file
    /opt/intel/compilers_and_libraries_2019.0.117/linux/mkl/lib/intel64
    /opt/intel/compilers_and_libraries_2019.0.117/linux/compiler/lib/intel64
```

Update system
```
    sudo ldconfig
```
