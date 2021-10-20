---
title: Trilinos Kokkos Tutorial
layout: post
guid: urn:uuid:0a970e6d-2ebf-49e9-82fc-b9ea0247a78e
categories:
  - tutorial
tags:
  - Trilinos
  - Kokkos
  - Cmake
---

> This post shows some simple examples of building against an installed Trilinos with CMake, mainly refer this [wiki](https://github.com/trilinos/Trilinos/blob/master/demos/simpleBuildAgainstTrilinos/README.md).

### Building a simple example
This post starts from a simple example, a project with only one single source file.
```
    export PATH=/data/code/myLibs/gcc11/bin:/data/code/myLibs/ompi_gcc/bin:$PATH
    cd /to/your/source/dir
    mkdir build & cd build
    # my Trilinos was installed in /data/code/myLibs/Trilinos
    cmake -D CMAKE_PREFIX_PATH=/data/code/myLibs/Trilinos ..
    make -j 8 
    
    // here is an example from ${Trillons_SOURCE_DIR}/demos/simpleBuildAgainstTrilinos
    cmake_minimum_required(VERSION 3.17.1)
    project(MyApp NONE)
    
    # Disable Kokkos warning about not supporting C++ extensions
    set(CMAKE_CXX_EXTENSIONS OFF)
    
    # Get Trilinos as one entity but require the packages being used
    find_package(Trilinos REQUIRED COMPONENTS Teuchos Tpetra)
    
    # Echo trilinos build info just for fun
    MESSAGE("\nFound Trilinos!  Here are the details: ")
    MESSAGE("   Trilinos_DIR = ${Trilinos_DIR}")
    MESSAGE("   Trilinos_VERSION = ${Trilinos_VERSION}")
    MESSAGE("   Trilinos_PACKAGE_LIST = ${Trilinos_PACKAGE_LIST}")
    MESSAGE("   Trilinos_LIBRARIES = ${Trilinos_LIBRARIES}")
    MESSAGE("   Trilinos_INCLUDE_DIRS = ${Trilinos_INCLUDE_DIRS}")
    MESSAGE("   Trilinos_LIBRARY_DIRS = ${Trilinos_LIBRARY_DIRS}")
    MESSAGE("   Trilinos_TPL_LIST = ${Trilinos_TPL_LIST}")
    MESSAGE("   Trilinos_TPL_INCLUDE_DIRS = ${Trilinos_TPL_INCLUDE_DIRS}")
    MESSAGE("   Trilinos_TPL_LIBRARIES = ${Trilinos_TPL_LIBRARIES}")
    MESSAGE("   Trilinos_TPL_LIBRARY_DIRS = ${Trilinos_TPL_LIBRARY_DIRS}")
    MESSAGE("   Trilinos_BUILD_SHARED_LIBS = ${Trilinos_BUILD_SHARED_LIBS}")
    MESSAGE("End of Trilinos details\n")
    
    # Make sure to use same compilers and flags as Trilinos
    set(CMAKE_CXX_COMPILER ${Trilinos_CXX_COMPILER} )
    set(CMAKE_C_COMPILER ${Trilinos_C_COMPILER} )
    set(CMAKE_Fortran_COMPILER ${Trilinos_Fortran_COMPILER} )
    
    set(CMAKE_CXX_FLAGS  "${Trilinos_CXX_COMPILER_FLAGS} ${CMAKE_CXX_FLAGS}")
    set(CMAKE_C_FLAGS  "${Trilinos_C_COMPILER_FLAGS} ${CMAKE_C_FLAGS}")
    set(CMAKE_Fortran_FLAGS  "${Trilinos_Fortran_COMPILER_FLAGS} ${CMAKE_Fortran_FLAGS}")
    
    # End of setup and error checking.
    
    # Now enable the compilers now that we have gotten them from Trilinos
    enable_language(C)
    enable_language(CXX)
    if (CMAKE_Fortran_COMPILER)
      enable_language(Fortran)
    endif()
    
    # Build the APP and link to Trilinos
    add_executable(${PROJECT_NAME} ${CMAKE_CURRENT_SOURCE_DIR}/tutorial_01a.cpp)
    target_include_directories(${PROJECT_NAME} PRIVATE
      ${CMAKE_CURRENT_SOURCE_DIR} ${Trilinos_INCLUDE_DIRS} ${Trilinos_TPL_INCLUDE_DIRS})
    target_link_libraries(${PROJECT_NAME} ${Trilinos_LIBRARIES} ${Trilinos_TPL_LIBRARIES}) 
```
