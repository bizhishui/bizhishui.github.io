---
title: Albany with GCC 11.1
layout: post
guid: urn:uuid:b211c501-9aab-4d5c-aa7f-f6fddbb0a602
categories:
  - notes
tags:
  - GCC 11.1
  - Trilinos
  - Albany
---

> This post notes the installation of the Albany package with GCC 11.1, which follows directly this [instruction](https://github.com/sandialabs/Albany/wiki/Debian-GCC-7.1).

&nbsp;

The installation is done on my office computer
```
    cat /proc/cpuinfo
    Linux version 4.15.0-159-generic (buildd@lgw01-amd64-055) (gcc version 7.5.0 (Ubuntu 7.5.0-3ubuntu1~18.04)) #167-Ubuntu SMP Tue Sep 21 08:55:05 UTC 2021
```
The current version of gcc is 7.5.0, here, the more updated version, 11.1.0, will be used.

&nbsp;

### Building GCC 11.1.0
```
    // https://stackoverflow.com/questions/33734143/gcc-unable-to-find-shared-library-libisl-so
    // Specifically, don't install ISL manually in some non-standard path, because
    // GCC needs to find its shared libraries at run-time. The simplest solution 
    // is to use the ./contrib/download_prerequisites script to add the GMP, 
    // MPFR, MPC, and ISL source code to the GCC source tree
    // refer: https://gcc.gnu.org/wiki/InstallingGCC
    cd gcc-11.1.0
    ./contrib/download_prerequisites
    mkdir build & cd  build 
    ../configure --prefix=/data/code/myLibs/gcc11  --disable-multilib --enable-languages=c,c++,fortran  2>&1 | tee config_log
    export GCC11_PATH=/data/code/myLibs/gcc11
    export GCC11_LIB=$GCC11_PATH/lib64
    export LD_LIBRARY_PATH=$GCC11_LIB:$LD_LIBRARY_PATH
    export LD_RUN_PATH=$GCC11_LIB
```

&nbsp;

### Building OpenMPI 4.1.1
```
    wget https://download.open-mpi.org/release/open-mpi/v4.1/openmpi-4.1.1.tar.bz2
    tar -xvf openmpi-4.1.1.tar.bz2
    ./configure --prefix=/data/code/myLibs/ompi_gcc CC=$GCC11_PATH/bin/gcc CXX=$GCC11_PATH/bin/g++ FC=$GCC11_PATH/bin/gfortran
    make -j 28 & make -j 28 install
```

&nbsp;

### Build supporting packages
Trilinos requires a set of "third party libraries" (TPLs) to support Albany. The actual libraries needed depends on the final Albany configuration desired. 
These instructions build a superset, all the libraries needed to support any Albany configuration.

Notes: In this example
- The TPLs are installed in */data/code/myLibs/TPLs_Trilinos*

&nbsp;

#### Building ZLib
```
    cd zlib-1.2.11
    cmake -DCMAKE_C_COMPILER=/data/code/myLibs/ompi_gcc/bin/mpicc  -DCMAKE_INSTALL_PREFIX=/data/code/myLibs/TPLs_Trilinos ..
```

&nbsp;

#### Building HDF5
```
    cd hdf5-1.12.1
    ./configure --prefix=/data/code/myLibs/TPLs_Trilinos CC=/data/code/myLibs/ompi_gcc/bin/mpicc CXX=/data/code/myLibs/ompi_gcc/bin/mpicxx FC=/data/code/myLibs/ompi_gcc/bin/mpif90 \
    CXXFLAGS="-fPIC -O3 -march=native" CFLAGS="-fPIC -O3 -march=native" FFLAGS="-fPIC -O3 -march=native" --enable-parallel --enable-shared --with-zlib=/data/code/myLibs/TPLs_Trilinos
```

&nbsp;

#### Building parallel-netcdf
```
    cd pnetcdf-1.12.2
    ./configure --prefix=/data/code/myLibs/TPLs_Trilinos CC=/data/code/myLibs/ompi_gcc/bin/mpicc CXX=/data/code/myLibs/ompi_gcc/bin/mpicxx FC=/data/code/myLibs/ompi_gcc/bin/mpif90 \
    CXXFLAGS="-fPIC -O3 -march=native" CFLAGS="-fPIC -O3 -march=native" FFLAGS="-fPIC -O3 -march=native"
```

&nbsp;

#### Building Netcdf
```
    cd netcdf-c-4.8.1

    // Edit the file include/netcdf.h 
    #define NC_MAX_DIMS    65536    /* max dimensions per file */
    #define NC_MAX_ATTRS    8192
    #define NC_MAX_VARS   524288    /* max variables per file */
    #define NC_MAX_NAME   256
    #define NC_MAX_VAR_DIMS      8     /* max per variable dimensions */

    LD_LIBRARY_PATH=/data/code/myLibs/TPLs_Trilinos/lib:$LD_LIBRARY_PATH
    ./configure --prefix=/data/code/myLibs/TPLs_Trilinos CC=/data/code/myLibs/ompi_gcc/bin/mpicc CXX=/data/code/myLibs/ompi_gcc/bin/mpicxx FC=/data/code/myLibs/ompi_gcc/bin/mpif90 \
    CXXFLAGS="-I/data/code/myLibs/TPLs_Trilinos/include -O3 -march=native -fPIC" CFLAGS="-I/data/code/myLibs/TPLs_Trilinos/include -O3 -march=native -fPIC" LDFLAGS="-L/data/code/myLibs/TPLs_Trilinos/lib -O3 -march=native -fPIC" \
    --disable-fsync --enable-shared --disable-doxygen --enable-netcdf-4 --enable-pnetcdf
```

&nbsp;

#### Building boost
```
    // https://stackoverflow.com/questions/25346443/how-to-install-boost-with-specified-compiler-say-gcc 
    // https://newbedev.com/building-boost-with-different-gcc-version
    tar -xvf boost_1_77_0.tar.gz
    cd boost_1_77_0
    export CC=/data/code/myLibs/gcc11/bin/gcc 
    export CXX=/data/code/myLibs/gcc11/bin/g++
    export PATH=/data/code/myLibs/gcc11/bin:$PATH
    ./bootstrap.sh --with-libraries=all --prefix=/data/code/myLibs/TPLs_Trilinos
    ./b2 -j 28 --toolset=gcc stage threading=multi link=shared
    ./b2 -j 28 install
```

&nbsp;

#### Building ParMetis
```
    wget http://glaros.dtc.umn.edu/gkhome/fetch/sw/parmetis/parmetis-4.0.3.tar.gz
    tar -xvf parmetis-4.0.3.tar.gz
    cd parmetis-4.0.3

    // // Edit metis.h to use an IDXTYPEWIDTH of 64
    cd metis/include
    vi metis.h 
    #define IDXTYPEWIDTH 64

    mkdir build2 & cd build2
    export metis=/data/code/TPLs/parmetis-4.0.3/metis
    cmake -DCMAKE_INSTALL_PREFIX=/data/code/myLibs/TPLs_Trilinos -DMETIS_PATH=$metis -DGKLIB_PATH=$metis/GKlib \
    -DCMAKE_C_COMPILER=/data/code/myLibs/ompi_gcc/bin/mpicc -DCMAKE_CXX_COMPILER=/data/code/myLibs/ompi_gcc/bin/mpicxx ..
    make -j 28 & make -j 28 install

    cp libmetis/libmetis.a /data/code/myLibs/TPLs_Trilinos/lib/
    cp $metis/include/metis.h /data/code/myLibs/TPLs_Trilinos/include/
```

&nbsp;

#### Building SuperLU
```
    // only SuperLU version < 5.0 currently supported
    mkdir /data/code/myLibs/TPLs_Trilinos/SuperLU_4.3
    mkdir /data/code/myLibs/TPLs_Trilinos/SuperLU_4.3/include
    mkdir /data/code/myLibs/TPLs_Trilinos/SuperLU_4.3/lib

    // Edit make.inc for your machine and environment
    PLAT = _linux
    SuperLUroot	= /data/code/myLibs/TPLs_Trilinos/SuperLU_4.3
    SUPERLULIB   	= $(SuperLUroot)/lib/libsuperlu_4.3.a
    TMGLIB       	= libtmglib.a
    BLASDEF 	= -DUSE_VENDOR_BLAS
    BLASLIB		= -L/data/code/myLibs/lapack/lib -lblas
    LIBS		= $(SUPERLULIB) $(BLASLIB)
    ARCH         = ar
    ARCHFLAGS    = cr
    RANLIB       = ranlib
    CC           = /data/code/myLibs/ompi_gcc/bin/mpicc -fPIC -O3 -march=native
    CFLAGS       = -DPRNTlevel=0
    NOOPTS       =
    FORTRAN	     = /data/code/myLibs/ompi_gcc/bin/mpif90
    FFLAGS       = -O3 fPIC -march=native
    LOADER       = $(CC)
    LOADOPTS     = -fopenmp
    CDEFS        = -DAdd_

    make -j 24 & make -j 24 install
    cd ./SRC 
    cp *.h /data/code/myLibs/TPLs_Trilinos/SuperLU_4.3/include
```

&nbsp;

#### Building HWLOC
HWLOC is an optional package that can be used for thread pinning by Kokkos. If you are not building Kokkos, or if you don't care about thread pinning, please skip.
```
    wget https://download.open-mpi.org/release/hwloc/v2.5/hwloc-2.5.0.tar.gz
    ./configure CC=/data/code/myLibs/ompi_gcc/bin/mpicc CXX=/data/code/myLibs/ompi_gcc/bin/mpicxx --prefix=/data/code/myLibs/TPLs_Trilinos
    make -j 24 & make -j 24 install
```

&nbsp;

#### Building Yaml
```
    git clone git@github.com:jbeder/yaml-cpp.git 
    GCC_MPI_DIR=/data/code/myLibs/ompi_gcc
    cmake -DCMAKE_CXX_COMPILER:STRING=$GCC_MPI_DIR/bin/mpicxx -DCMAKE_CXX_FLAGS:STRING='-march=native -O3 -DNDEBUG' -DCMAKE_C_COMPILER:STRING=$GCC_MPI_DIR/bin/mpicc -DCMAKE_C_FLAGS:STRING='-march=native -O3 -DNDEBUG' \
    -DCMAKE_INSTALL_PREFIX:PATH=/data/code/myLibs/TPLs_Trilinos -DCMAKE_BUILD_TYPE:STRING=Release -DBUILD_SHARED_LIBS:BOOL=ON -DYAML_CPP_BUILD_TOOLS:BOOL=OFF ..
    make -j 24 & make -j 24 install
```

&nbsp;

### Building Trilinos
```
    git clone git@github.com:trilinos/Trilinos.git 
    cd Trilinos 
    mkdir build & cd build

    cp /path/2/Albany/doc/do-cmake-trilinos-instructional do-configure
    // do some changes according to the above installed packages
    // and switch off Tpetra_INST_INT_INT:BOOL=OFF 
    chmod +x ./do-configure
    ./do-configure
    make -j 24 & make -j 24 install

    // full info for my do-configure
    # Modify these paths for your system.
    TRILINSTALLDIR=/data/code/myLibs/Trilinos
    BOOSTDIR=/data/code/myLibs/TPLs_Trilinos
    NETCDFDIR=/data/code/myLibs/TPLs_Trilinos
    HDF5DIR=/data/code/myLibs/TPLs_Trilinos
    SUPERLUDIR=/data/code/myLibs/TPLs_Trilinos/SuperLU_4.3
    
    # Remove the CMake cache. For an extra clean start in an already-used build
    # directory, rm -rf CMake* to get rid of all CMake-generated files.
    rm -f CMakeCache.txt;
    
    # The CMake command. I divide it up into blocks using \.
    #   Block 1 is basic build info.
    #   Block 2 has all the packages for the old Epetra-only Albany.
    #   Block 3 has the packages (STKIo and STKMesh) and TPL (Boost) needed for the
    # new STK. STKClassic cannot simultaneously be built, as it conflicts with the
    # new STK.
    #   Block 4 has I/O util packages and TPLs.
    #   Blocks 1-4 are for the basic old Epetra-only Albany build. If you already
    # have a Trilinos configuration script for that build, you can use it instead of
    # blocks 1-4.
    #   Block 5 has the packages required by the Tpetra-enabled Albany.
    #   Blocks 6-7 are new for the Kokkos-enabled Albany, though the flags have some
    # overlap with the old ones.
    #   Block 6 provides the types and the explicit template instantiation we need.
    #   Block 7 handles Kokkos flags to set up the Serial node, which matches
    # pre-Kokkos behavior.
    cmake \
     -D Trilinos_DISABLE_ENABLED_FORWARD_DEP_PACKAGES=ON \
     -D CMAKE_INSTALL_PREFIX:PATH=${TRILINSTALLDIR} \
     -D CMAKE_BUILD_TYPE:STRING=RELEASE \
     -D BUILD_SHARED_LIBS:BOOL=ON \
     -D TPL_ENABLE_MPI:BOOL=ON \
     -D CMAKE_VERBOSE_MAKEFILE:BOOL=OFF \
     -D Trilinos_ENABLE_ALL_PACKAGES:BOOL=OFF \
     -D Trilinos_WARNINGS_AS_ERRORS_FLAGS:STRING="" \
     -D Teuchos_ENABLE_LONG_LONG_INT:BOOL=ON \
    \
     -D Trilinos_ENABLE_Teuchos:BOOL=ON \
     -D Trilinos_ENABLE_Shards:BOOL=ON \
     -D Trilinos_ENABLE_Sacado:BOOL=ON \
     -D Trilinos_ENABLE_Epetra:BOOL=ON \
     -D Trilinos_ENABLE_EpetraExt:BOOL=ON \
     -D Trilinos_ENABLE_Ifpack:BOOL=ON \
     -D Trilinos_ENABLE_AztecOO:BOOL=ON \
     -D Trilinos_ENABLE_Amesos:BOOL=ON \
     -D Trilinos_ENABLE_Anasazi:BOOL=ON \
     -D Trilinos_ENABLE_Belos:BOOL=ON \
     -D Trilinos_ENABLE_ML:BOOL=ON \
     -D Trilinos_ENABLE_Phalanx:BOOL=ON \
     -D Trilinos_ENABLE_Intrepid:BOOL=ON \
     -D Trilinos_ENABLE_Intrepid2:BOOL=ON \
     -D Trilinos_ENABLE_NOX:BOOL=ON \
     -D Trilinos_ENABLE_Stratimikos:BOOL=ON \
     -D Trilinos_ENABLE_Thyra:BOOL=ON \
     -D Trilinos_ENABLE_Rythmos:BOOL=ON \
     -D Trilinos_ENABLE_MOOCHO:BOOL=ON \
     -D Trilinos_ENABLE_Stokhos:BOOL=ON \
     -D Trilinos_ENABLE_Piro:BOOL=ON \
     -D Trilinos_ENABLE_Teko:BOOL=ON \
     -D Trilinos_ENABLE_PanzerDofMgr:BOOL=ON \
    \
     -D Trilinos_ENABLE_STKIO:BOOL=ON \
     -D Trilinos_ENABLE_STKMesh:BOOL=ON \
     -D TPL_ENABLE_Boost:BOOL=ON \
     -D Boost_INCLUDE_DIRS:FILEPATH="$BOOSTDIR/include" \
     -D Boost_LIBRARY_DIRS:FILEPATH="$BOOSTDIR/lib" \
     -D TPL_ENABLE_BoostLib:BOOL=ON \
     -D BoostLib_INCLUDE_DIRS:FILEPATH="$BOOSTDIR/include" \
     -D BoostLib_LIBRARY_DIRS:FILEPATH="$BOOSTDIR/lib" \
    \
     -D Trilinos_ENABLE_SEACASIoss:BOOL=ON \
     -D Trilinos_ENABLE_SEACASExodus:BOOL=ON \
     -D TPL_ENABLE_Netcdf:BOOL=ON \
     -D Netcdf_INCLUDE_DIRS:PATH="$NETCDFDIR/include" \
     -D Netcdf_LIBRARY_DIRS:PATH="$NETCDFDIR/lib" \
     -D TPL_ENABLE_HDF5:BOOL=ON \
     -D HDF5_INCLUDE_DIRS:PATH="$HDF5DIR/include" \
     -D HDF5_LIBRARY_DIRS:PATH="$HDF5DIR/lib" \
    \
     -D Trilinos_ENABLE_Tpetra:BOOL=ON \
     -D Trilinos_ENABLE_Kokkos:BOOL=ON \
     -D Trilinos_ENABLE_Ifpack2:BOOL=ON \
     -D Trilinos_ENABLE_Amesos2:BOOL=ON \
     -D Trilinos_ENABLE_Zoltan2:BOOL=ON \
     -D Trilinos_ENABLE_MueLu:BOOL=ON \
     -D Amesos2_ENABLE_KLU2:BOOL=ON \
    \
     -D Trilinos_ENABLE_EXPLICIT_INSTANTIATION:BOOL=ON \
     -D Tpetra_INST_INT_LONG_LONG:BOOL=ON \
     -D Tpetra_INST_INT_INT:BOOL=OFF \
     -D Tpetra_INST_DOUBLE:BOOL=ON \
     -D Tpetra_INST_FLOAT:BOOL=OFF \
     -D Tpetra_INST_COMPLEX_FLOAT:BOOL=OFF \
     -D Tpetra_INST_COMPLEX_DOUBLE:BOOL=OFF \
     -D Tpetra_INST_INT_LONG:BOOL=OFF \
     -D Tpetra_INST_INT_UNSIGNED:BOOL=OFF \
    \
     -D Trilinos_ENABLE_Kokkos:BOOL=ON \
     -D Trilinos_ENABLE_KokkosCore:BOOL=ON \
     -D Phalanx_KOKKOS_DEVICE_TYPE:STRING="SERIAL" \
     -D Phalanx_INDEX_SIZE_TYPE:STRING="INT" \
     -D Phalanx_SHOW_DEPRECATED_WARNINGS:BOOL=OFF \
     -D Kokkos_ENABLE_Serial:BOOL=ON \
     -D Kokkos_ENABLE_OpenMP:BOOL=OFF \
     -D Kokkos_ENABLE_Pthread:BOOL=OFF \
    \
     -D TPL_ENABLE_SuperLU:STRING=ON \
     -D SuperLU_INCLUDE_DIRS:STRING="${SUPERLUDIR}/include" \
     -D SuperLU_LIBRARY_DIRS:STRING="${SUPERLUDIR}/lib" \
    \
     ../
    
```

&nbsp;

### Building Albany
```
    git clone git@github.com:sandialabs/Albany.git 
    mkdir build 
    cd doc/mac 
    cp do-cmake-albany-mac-sierra-mpi ../../build/do-configure
    cd ../../build 
    export PATH=/data/code/myLibs/gcc11/bin:$PATH 
    // edit do-configure as appropriate 
    ./do-configure 
    make -j 28
```
