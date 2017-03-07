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

### Build BLAS Library

```
    1. Downloading the Blas library from [netlib-blas](http://www.netlib.org/blas/)
    2. Untar downloaded package to $BLAS_DIR
    3. `cd $BLAS_DIR`
    #-fPIC (Position Independant Code), -shared (shared library)
    4. Use *gfortran -shared -O2 *.f -o libblas.so -fPIC* to compiler shared library *libblas.so*
    #ar cr (combine the .o files into a static library)
    5. Or use *gfortran -O2 -c *.f -fPIC* and *ar cr libblas.a *.o* to compiler static library
```

