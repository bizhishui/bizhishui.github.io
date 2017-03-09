---
title: Java MKL Simple Example
layout: post
guid: urn:uuid:8fa2648e-e659-4efc-9951-b489aa5d4047
categories:
  - notes
tags:
  - java
  - MKL
---

> This post note how to call Intel MKL method from java.


* TOC
{:toc}

---

### Preparations
First we need make sure the Java Developpement Kit (JDK) and Intel MKL are well installed.
Suppose jdk is installed under the path */opt/jdk/jdk1.8.0_121*. As java use JNI (Java Native Interface)
to call c/c++ function, we can create soft links for the corresponding header files with:

```
    ln -s /opt/jdk/jdk1.8.0_121/include/jni.h ~/usr/include     
    ln -s /opt/jdk/jdk1.8.0_121/include/linux/jni_md.h ~/usr/include
```

The Intel MKL libaray is included in Intel Parallel Studio (for linux)  which provides a very friendly GUI for installation.
But make sure to use the following commands to set the PATH related varibales.

```
    source /usr/intel/bin/compilervars.sh intel64   #or 
    source /usr/intel/compilers_and_libraries/linux/mkl/bin/mklvars.sh intel64   #/usr/intel is the installation directory
```

### Simple Example Run on Command-line
This section is mainly adapted from [Intel Developer Zone](https://software.intel.com/en-us/articles/performance-tools-for-software-developers-how-do-i-use-intel-mkl-with-java).
Intel® MKL C functions can be accessed from Java through Java Native Interface (JNI). The following example shows how to call cblas_dgemm from java on Linux.
