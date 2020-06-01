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
    1. 编译目标代码时指定的动态库搜索路径; # -LdirName
    2. 环境变量LD_LIBRARY_PATH指定的动态库搜索路径;
    3. 配置文件/etc/ld.so.conf中指定的动态库搜索路径;
    # 只需在在该文件中追加一行库所在的完整路径如"/root/test/conf/lib"即可,然后ldconfig是修改生效。(实际上是根据缓存文件/etc/ld.so.cache来确定路径)
    4. 默认的动态库搜索路径/lib; (64位机器为/lib64)
    5. 默认的动态库搜索路径/usr/lib。(64位机器为/usr/lib64)
    # /lib 和/usr/lib 都没放到/etc/ld.so.conf 文件中，但是在/etc/ld.so.cache 的缓存中有它们。它们是默认的共享库的搜索路径，其路径下的共享库的变动即时生效，不用执行ldconfig。就算缓存ldconfig -p 中没有，新加入的动态库也可以执行。
```

#### [关于ldconfig](http://kevin.9511.net/archives/177.html)
{:.no_toc}

ldconfig是一个动态链接库管理命令。其目的是为了让动态链接库为系统所共享。 ldconfig命令的用途主要是在默认搜寻目录(/lib和/usr/lib)以及动态库配置文件/etc/ld.so.conf内所列的目录下，
搜索出可共享的动态链接库(格式如lib*.so*)，进而创建出动态装入程序(ld.so)所需的连接和缓存文件。 缓存文件默认为/etc/ld.so.cache, 此文件保存已排好序的动态链接库名字列表。 
ldconfig通常在系统启动时运行，而当用户安装了一个新的动态链接库时，就需要手工运行这个命令。

```
    1. 往/lib和/usr/lib里面加东西，是不用修改/etc/ld.so.conf的，但是完了之后要调一下ldconfig，不然这个library会找不到
    2. 想往上面两个目录以外加东西的时候，一定要修改/etc/ld.so.conf，然后再调用ldconfig，不然也会找不到. 比如安装了一个mysql到/usr/local/mysql，mysql有一大堆library在/usr/local/mysql/lib下面，这时就 需要在/etc/ld.so.conf下面加一行/usr/local/mysql/lib，保存过后ldconfig一下，新的library才能在程 序运行时被找到
    3. 如果想在这两个目录以外放lib，但是又不想在/etc/ld.so.conf中加东西（或者是没有权限加东西）。那也可以，就是export一个全局变 量LD_LIBRARY_PATH，然后运行程序的时候就会去这个目录中找library。一般来讲这只是一种临时的解决方案，在没有权限或临时需要的时候使用
    4. ldconfig做的这些东西都与运行程序时有关，跟编译时一点关系都没有。编译的时候还是该加-L就得加，不要混淆了
    5. 总之，就是不管做了什么关于library的变动后，最好都ldconfig一下，不然会出现一些意想不到的结果。不会花太多的时间，但是会省很多的事
```

ldconfig命令行用法如下
```
    ldconfig [-v|--verbose] [-n] [-N] [-X] [-f CONF] [-C CACHE] [-rROOT] [-l] [-p|--print-cache] [-c FORMAT] [--format=FORMAT] [-V] [-?|--help|--usage] path...
    1. -v或--verbose: ldconfig将显示正在扫描的目录及搜索到的动态链接库,还有它所创建的链接的名字
    2. -n: ldconfig仅扫描命令行指定的目录,不扫描默认目录(/lib,/usr/lib),也不扫描配置文件/etc/ld.so.conf所列的目录
    3. -N: ldconfig不重建缓存文件(/etc/ld.so.cache).若未用-X选项,ldconfig照常更新文件的连接
    4. -X: ldconfig不更新文件的连接.若未用-N选项,则缓存文件正常更新
    5. -f CONF: 指定动态链接库的配置文件为CONF,系统默认为/etc/ld.so.conf
    6. -C CACHE: 指定生成的缓存文件为CACHE,系统默认的是/etc/ld.so.cache,此文件存放已排好序的可共享的动态链接库的列表
```

#### 相关环境变量
{:.no_toc}

- LD_LIBRARY_PATH 这个环境变量是大家最为熟悉的，它告诉loader：在哪些目录中可以找到共享库。可以设置多个搜索目录，这些目录之间用冒号分隔开。在linux下，还提供了另外一种方式来完成同样的功能，你可以把这些目录加到/etc/ld.so.conf中，或则在/etc/ld.so.conf.d里创建一个文件，把目录加到这个文件里。当然，这是系统范围内全局有效的，而环境变量只对当前shell有效。按照惯例，除非你用上述方式指明，loader是不会在当前目录下去找共享库的，正如shell不会在当前目前找可执行文件一样。
- LD_PRELOAD 这个环境变量对于程序员来说，也是特别有用的。它告诉loader：在解析函数地址时，优先使用LD_PRELOAD里指定的共享库中的函数。这为调试提供了方便，比如，对于C/C++程序来说，内存错误最难解决了。常见的做法就是重载malloc系列函数，但那样做要求重新编译程序，比较麻烦。使用LD_PRELOAD机制，就不用重新编译了，把包装函数库编译成共享库，并在LD_PRELOAD加入该共享库的名称，这些包装函数就会自动被调用了。在linux下，还提供了另外一种方式来完成同样的功能，你可以把要优先加载的共享库的文件名写在/etc/ld.so.preload里。当然，这是系统范围内全局有效的，而环境变量只对当前shell有效
- LD_ DEBUG 这个环境变量比较好玩，有时使用它，可以帮助你查找出一些共享库的疑难杂症（比如同名函数引起的问题）。同时，利用它，你也可以学到一些共享库加载过程的知识
