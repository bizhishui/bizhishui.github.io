---
title: Build Netlib
layout: post
guid: urn:uuid:6dd97e64-8e79-4d04-b3dd-d0e74d27ef5f
categories:
  - notes
tags:
  - Blas
  - Lapack
  - ScaLapack
  - Shared
---

> This post aimes to note the procedures in building some math libraries.

### Compile BLAS Library

```
    1. Downloading the Blas library from [netlib-blas](http://www.netlib.org/blas/)
    2. Untar downloaded package to $BLAS_DIR
    3. `cd $BLAS_DIR`
    #-fPIC (Position Independant Code), -shared (shared library)
    4. Use *gfortran -shared -O2 *.f -o libblas.so -fPIC* to compile shared library *libblas.so*
    #ar cr (combine the .o files into a static library)
    5. Or use *gfortran -O2 -c *.f -fPIC* and *ar cr libblas.a *.o* to compile static library
```

### Compile LAPACK Library
As for BLAS, source files can be downloaded from [netlib-lapack](http://www.netlib.org/lapack/) and store in *$LAPACK_DIR*.
For the moment I writing this post, the latest available is the VERSION 3.7.0 (released at December 2016).

As indicated in the file *$LAPACK_DIR/lapack.pc.in*, Lapack need BLAS routines. User can either use the BLAS comes with the Lapack, 
or original BLAS as done in the previous section. Lapack suggest the latter way for efficiency consideration.

#### Compile into Staic Library

```
    cd $LAPACK_DIR
    cp make.inc.example make.inc
    #set the correct BLASLIB
    BLASLIB = $BLAS_DIR/libblas.a   #if use original BLAS
    make blaslib                    #if use BLAS comes with Lapack
    make lapacklib
```

#### Compile into Shared Library
