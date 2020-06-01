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

在Linux下面，共享库的寻找和加载是由*/lib/ld.so* (Ubuntu下*/lib/x86_64-linux-gnu/ld-2.27.so*, Redhat下*/lib64/ld-2.17.so*)实现的。 *ld.so*在标准路经(*/lib*, */usr/lib*)中寻找应用程序用到的共享库。
但是，如果需要用到的共享库在非标准路经，*ld.so*怎么找到它呢？目前，Linux通用的做法是将非标准路经加入*/etc/ld.so.conf*，然后运行*ldconfig* 生成*/etc/ld.so.cache*。*ld.so*加载共享库的时候，会从*ld.so.cache*查找。
传统上，Linux的先辈Unix还有一个环境变量：LD\_LIBRARY\_PATH来处理非标准路经的共享库。*ld.so*加载共享库的时候，也会查找这个变量所设置的路经。但是，有不少声音主张要避免使用LD\_LIBRARY\_PATH变量，尤其是作为全局变量.

#### 动态库的搜索路径搜索的先后顺序
{:.no_toc}

```
    # 没有当前路径
    1. 编译目标代码时指定的动态库搜索路径; # -LDIRNAME
    2. 环境变量LD_LIBRARY_PATH指定的动态库搜索路径;
    3. 配置文件/etc/ld.so.conf中指定的动态库搜索路径;
    # 只需在在该文件中追加一行库所在的完整路径如"/root/test/conf/lib"即可,然后ldconfig是修改生效。(实际上是根据缓存文件/etc/ld.so.cache来确定路径)
    4. 默认的动态库搜索路径/lib; (64位机器为/lib64)
    5. 默认的动态库搜索路径/usr/lib。(64位机器为/usr/lib64)
    # /lib 和/usr/lib 都没放到/etc/ld.so.conf 文件中，但是在/etc/ld.so.cache 的缓存中有它们。它们是默认的共享库的搜索路径，其路径下的共享库的变动即时生效，不用执行ldconfig。就算缓存ldconfig -p 中没有，新加入的动态库也可以执行。
```
