---
title: Compile Netlib Libraries
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


* TOC
{:toc}

---

### Compile BLAS Library
Downloading the Blas library from [netlib-blas](http://www.netlib.org/blas/), and unpack it to *BLAS_DIR*.

```
    cd $BLAS_DIR
    #compile to shared library: -fPIC (Position Independant Code), -shared (shared library)
    gfortran -shared -O2 *.f -o libblas.so -fPIC     #compile to shared library libblas.so
    #compile to static library
    gfortran -O2 -c *.f -fPIC 
    ar cr libblas.a *.o              #combine the .o files into a static library

    sudo cp libblas.* /usr/local/lib
```

### Compile LAPACK Library
Same to BLAS, source files can be downloaded from [netlib-lapack](http://www.netlib.org/lapack/), and it was unpacked to *$LAPACK_DIR*.
For the moment I writing this post, the latest available is the VERSION 3.7.0 (released at December 2016).

As indicated in the file *$LAPACK_DIR/lapack.pc.in*, Lapack need BLAS routines. User can either use the BLAS comes with the Lapack, 
or original BLAS as done in the previous section. Lapack suggest the latter way for efficiency consideration.

#### Compile into Staic Library
{:.no_toc}

```
    cd $LAPACK_DIR
    cp make.inc.example make.inc
    #set the correct BLASLIB
    BLASLIB = $BLAS_DIR/libblas.a   #if use original BLAS
    make blaslib                    #if use BLAS comes with Lapack
    make lapacklib

    sudo cp liblapack.a /usr/local/lib
```

#### Compile into Shared Library
{:.no_toc}
To compile it to shared library, we need make more changements[^](http://stackoverflow.com/questions/23463240/how-to-compile-lapack-so-that-it-can-be-used-correctly-during-installation-of-oc).
For user who use original BLAS, they are

```
    cd $LAPACK_DIR
    cp make.inc.example make.inc
    Adding -fPIC to OPTS and NOOPT in make.inc
    Set BLASLIB = $BLAS_DIR/libblas.so in make.inc 
    Set LAPACK_DIR = liblapack.soin make.inc

    #in the file ./SRC/Makefile, the following three lines
    ../$(LAPACKLIB): $(ALLOBJ) $(ALLXOBJ) $(DEPRECATED)
        $(ARCH) $(ARCHFLAGS) $@ $(ALLOBJ) $(ALLXOBJ) $(DEPRECATED)
        $(RANLIB) $@
    #should be changed to
    ../$(LAPACKLIB): $(ALLOBJ) $(ALLXOBJ) $(DEPRECATED)
        $(LOADER) $(LOADOPTS) -shared -Wl,-soname,liblapack.so -o $@ $(ALLOBJ) $(BLASLIB) $(ALLXOBJ) $(DEPRECATED)

    make lapacklib

    sudo cp liblapack.so /usr/local/lib
```

For the version I downloaded, after running the above commands, errors occured as below

```
    ztplqt.o: In function `ztplqt_':
    ztplqt.f:(.text+0x0): multiple definition of `ztplqt_'
    ztplqt.o:ztplqt.f:(.text+0x0): first defined here
    ztplqt2.o: In function `ztplqt2_':
    ztplqt2.f:(.text+0x0): multiple definition of `ztplqt2_'
    ztplqt2.o:ztplqt2.f:(.text+0x0): first defined here
    ztpmlqt.o: In function `ztpmlqt_':
    ztpmlqt.f:(.text+0x0): multiple definition of `ztpmlqt_'
    ztpmlqt.o:ztpmlqt.f:(.text+0x0): first defined here
    collect2: error: ld returned 1 exit status
    Makefile:511: recipe for target '../liblapack.so' failed
    make[1]: *** [../liblapack.so] Error 1
    make[1]: Leaving directory '/home/jinming/soft/lapack-3.7.0/SRC'
    Makefile:27: recipe for target 'lapacklib' failed
    make: *** [lapacklib] Error 2
```

Using grep command 

```
    grep -n 'ztpmlqt' . -R *

    SRC/ztpmlqt.f:10:*> <a href="http://www.netlib.org/cgi-bin/netlibfiles.tgz?format=tgz&filename=/lapack/lapack_routine/ztpmlqt.f">
    SRC/ztpmlqt.f:12:*> <a href="http://www.netlib.org/cgi-bin/netlibfiles.zip?format=zip&filename=/lapack/lapack_routine/ztpmlqt.f">
    SRC/ztpmlqt.f:14:*> <a href="http://www.netlib.org/cgi-bin/netlibfiles.txt?format=txt&filename=/lapack/lapack_routine/ztpmlqt.f">
    SRC/Makefile:463:   ztplqt.o ztplqt2.o ztpmlqt.o \
    SRC/Makefile:467:   ztplqt.o ztplqt2.o ztpmlqt.o \
    SRC/CMakeLists.txt:453:   ztplqt.f ztplqt2.f ztpmlqt.f
    SRC/CMakeLists.txt:457:   ztplqt.f ztplqt2.f ztpmlqt.f
```

we can found there are two duplicated lines in *SRC/Makefile* and *SRC/CMakeLists.txt* as already reported on Github, [issue 105](https://github.com/Reference-LAPACK/lapack/issues/105).
Delete the duplicated lines, re-run *make lapacklib* will generate our shared library *liblapack.so*.  
If we use BLAS comes with Lapack, some other changements  need to make for compiling BLAS. They are

```
    Set BLASLIB = ../../libblas.so in make.inc

    #in the file ./BLAS/SRC/Makefile, the following three lines
    $(BLASLIB): $(ALLOBJ)
        $(ARCH) $(ARCHFLAGS) $@ $(ALLOBJ)
        $(RANLIB) $@
    #should be changed to
    $(LAPACKLIB): $(ALLOBJ)
        $(LOADER) $(LOADOPTS) -z muldefs -shared -Wl,-soname,libblas.so -o $@ $(ALLOBJ)

    make blaslib    #before make lapacklib
```


### Compile LAPACKE Library
LAPACKE is a C interface to LAPACK. By default, LAPACKE is already inside the LAPACK package, i.e., *$LAPACKE_DIR=$LAPACK_DIR/LAPACKE*.

```
    cd $LAPACKE_DIR

    #compile static library
    set BLASLIB and LAPACKLIB with appropriate static libraries in ../make.inc
    make lapacke       #build static library: liblapacke.a


    #compile shared library
    Adding -fPIC to CFLAGS in ../make.inc
    Set LAPACKELIB = liblapacke.so

    #in the file ./src/Makefile, the following three lines
    ../../$(LAPACKELIB): $(ALLOBJ) $(ALLXOBJ) $(DEPRECATED)
       $(ARCH) $(ARCHFLAGS) $@ $(ALLOBJ) $(ALLXOBJ) $(DEPRECATED)
       $(RANLIB) $@
    #should be changed to
    ../../$(LAPACKELIB): $(ALLOBJ) $(ALLXOBJ) $(DEPRECATED)
        $(CC) $(CFLAGS) -shared -Wl,-soname,liblapacke.so -o $@ $(ALLOBJ) $(ALLXOBJ) $(DEPRECATED)

    #in the file ./utils/Makefile, the following three lines
    lib: $(OBJ)
       $(ARCH) $(ARCHFLAGS) ../../$(LAPACKELIB) $(OBJ)
       $(RANLIB) ../../$(LAPACKELIB)
    #should be changed to
    lib: $(OBJ)
        $(CC) $(CFLAGS) -shared -Wl,-soname,liblapacke.so -o ../../$(LAPACKELIB) $(OBJ)


    sudo cp ../liblapacke.* /usr/local/lib
    cp lapacke.h lapacke_config.h lapacke_mangling.h lapacke_utils.h to /usr/local/include
```
