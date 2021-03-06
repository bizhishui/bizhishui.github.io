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

Static libraries (.a) are simply a collection of ordinary object files, and they are installed into a program executable before the program can be run; while shared libraries (*.so) are loaded at program start-up and shared between programs.
为了在同一系统中使用不同版本的库，可以在动态库文件名后加上版本号为后缀，但由于程序连接默认以.so为文件后缀名。所以为了使用这些库，通常使用建立符号连接的方式。

静态链接库：当要使用时，连接器会找出程序所需的函数，然后将它们拷贝到执行文件，由于这种拷贝是完整的，所以一旦连接成功，静态程序库也就不再需要了。
动态库而言：某个程序在运行中要调用某个动态链接库函数的时候，操作系统首先会查看所有正在运行的程序，看在内存里是否已有此库函数的拷贝了。如果有，则让其共享那一个拷贝;只有没有才链接载入。
在程序运行的时候，被调用的动态链接库函数被安置在内存的某个地方，所有调用它的程序将指向这个代码段。因此，这些代码必须使用相对地址，而不是绝对地址。在编译的时候，我们需要告诉编译器，这些对象文件是用来做动态链接库的，
所以要用地址不无关代码(Position Independent Code (PIC))。注意：linux下进行连接的默认操作是首先连接动态库，也就是说，如果同时存在静态和动态库，不特别指定的话，将与动态库相连接。

编译时默认搜索库文件的路径是: 
就a.exe而言，以-lfoo 参数来连结，会驱使ld去寻找libfoo.so (shared stubs)；如果没有成功，就会换成寻找libfoo.a (static)。
就ELF而言，先找libfoo.so ， 然后是libfoo.a。libfoo.so通常是一个连结符号，连结至libfoo.so.x 。
ld可能不会自动加载libfoo.so.x，需要使用libfoo.so的链接来指定。

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

#### [动态链接相关性](http://fqyyang.blog.163.com/blog/static/485429642010976293433/) ldd
{:.no_toc}

要查看ln(/bin/ln)依赖的所有共享库的列表，可以使用ldd (List Dynamic Dependencies)命令

```
    ldd /bin/ln
    # linux-vdso.so.1 (0x00007ffde5bb8000)
    # libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x000015382c52f000)
    # /lib64/ld-linux-x86-64.so.2 (0x000015382cb31000)
```

通常，动态链接的程序比其静态链接的等价程序小得多。不过，静态链接的程序可以在某些低级维护任务中发挥作用。例如，sln是修改位于/lib中的不同库符号链接的极佳工具。但通常几乎所有Linux系统上的可执行程序都是某种动态链接的变体。

Beware: do not run ldd on a program you don't trust. As is clearly stated in the ldd(1) manual, ldd works by (in certain cases) by setting a special environment variable (for ELF objects, 
LD_TRACE_LOADED_OBJECTS) and then executing the program. It may be possible for an untrusted program to force the ldd user to run arbitrary code (instead of simply showing the ldd information). 
So, for safety's sake, don't use ldd on programs you don't trust to execute.
One can use **nm** or **readelf** to list symbols from object files.

### [How Libraries are Used](https://www.cnblogs.com/sddai/p/10397510.html)

在Linux下面，共享库的寻找和加载是由*/lib/ld.so* (Ubuntu下*/lib/x86_64-linux-gnu/ld-2.27.so*, Redhat下*/lib64/ld-2.17.so*)实现的。 *ld.so*在标准路经(*/lib*, */usr/lib*)中寻找应用程序用到的共享库。
但是，如果需要用到的共享库在非标准路经，*ld.so*怎么找到它呢？目前，Linux通用的做法是将非标准路经加入*/etc/ld.so.conf*，然后运行*ldconfig* 生成*/etc/ld.so.cache*。*ld.so*加载共享库的时候，会从*ld.so.cache*查找。
传统上，Linux的先辈Unix还有一个环境变量：LD\_LIBRARY\_PATH来处理非标准路经的共享库。*ld.so*加载共享库的时候，也会查找这个变量所设置的路经。但是，有不少声音主张要避免使用LD\_LIBRARY\_PATH变量，尤其是作为全局变量.

#### [动态库的搜索路径搜索的先后顺序](http://fqyyang.blog.163.com/blog/static/485429642010976293433/)
{:.no_toc}

```
    # 没有当前路径
    1. 编译目标代码时指定的动态库搜索路径; # -LdirName or -Wl,-rpath='$ORIGIN/'
    2. 环境变量LD_LIBRARY_PATH指定的动态库搜索路径;
    3. 配置文件/etc/ld.so.conf中指定的动态库搜索路径;
    # 只需在在该文件中追加一行库所在的完整路径如"/root/test/conf/lib"即可,然后ldconfig是修改生效。(实际上是根据缓存文件/etc/ld.so.cache来确定路径)
    4. 默认的动态库搜索路径/lib; (64位机器为/lib64)
    5. 默认的动态库搜索路径/usr/lib。(64位机器为/usr/lib64)
    # /lib 和/usr/lib 都没放到/etc/ld.so.conf 文件中，但是在/etc/ld.so.cache 的缓存中有它们。它们是默认的共享库的搜索路径，其路径下的共享库的变动即时生效，不用执行ldconfig。就算缓存ldconfig -p 中没有，新加入的动态库也可以执行。
```

### [关于ldconfig](http://kevin.9511.net/archives/177.html)

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
    # ldconfig -n /path/to/your/shared/libraries      # install your shared library
    3. -N: ldconfig不重建缓存文件(/etc/ld.so.cache).若未用-X选项,ldconfig照常更新文件的连接
    4. -X: ldconfig不更新文件的连接.若未用-N选项,则缓存文件正常更新
    5. -f CONF: 指定动态链接库的配置文件为CONF,系统默认为/etc/ld.so.conf
    6. -C CACHE: 指定生成的缓存文件为CACHE,系统默认的是/etc/ld.so.cache,此文件存放已排好序的可共享的动态链接库的列表
    7. -p或--print-cache: 指示ldconfig打印出当前缓存文件所保存的所有共享库的名字
```

### [关于](https://prefetch.net/articles/linkers.badldlibrary.html)[LD_LIBRARY_PATH](http://xahlee.info/UnixResource_dir/_/ldpath.html) and rpath

There were a couple good reasons why it was invented:

- To test out new library routines against an already compiled binary (for either backward compatibility or for new feature testing)
- To have a short term way out in case you wanted to move a set of shared libraries to another location

#### [The bad old days before separate run-time vs link-time paths](http://xahlee.info/UnixResource_dir/_/ldpath.html)
{:.no_toc}

Nowadays you specify the *run-time path* for an executable at link stage with the **-R** (or sometimes **-rpath**) flag to *ld*. There's also **LD_RUN_PATH** which is an environment variable which acts to *ld* just like specifying **-R**.
Before all this you had only **-L**, which applied not only during compile-time, but during run time as well. There was no way to say “use this directory during compile time” but “use this other directory at run time”.

#### [More on rpath](https://en.wikipedia.org/wiki/Rpath)
{:.no_toc}

**rpath** designates the run-time search path hard-coded in an executable file or library.
Specifically, it encodes a path to shared libraries into the header of an executable (or another shared library). This RPATH header value may either override or supplement the system default dynamic linking search paths.
The *rpath* of an executable or shared library is an optional entry in the *.dynamic* section of the ELF executable or shared libraries, with the type DT_RPATH, called the DT_RPATH attribute.

#### [Example using rpath](http://shibing.github.io/2016/08/20/%E5%8A%A8%E6%80%81%E9%93%BE%E6%8E%A5%E4%B8%8Erpath/)
{:.no_toc}

假设我们有一个共享库libarith.so，提供了常见的算术运算，它由arith.h与arith.c两个文件编译生成。内容如下：

```
    # file arith.h
    #pragma once
    int add(int a, int b);

    # file arith.c
    #include "arith.h"
    int add(int a, int b)
    {
      return a + b;
    }
```

生成so文件

```
    gcc -fPIC -shared arith.c -o libarith.so
```

测试文件main.c需要调用前面生成的共享库，内容如下

```
    # file main.c
    #include "arith.h"
    #include <stdio.h>
    int main()
    {
      printf("Sum = %d.\n", add(1,2));
    }
```

若不指定rpath直接编译main.c

```
    gcc -L. -larith main.c -o main
    # /tmp/ccVQtyfI.o: In function `main':
    # main.c:(.text+0xf): undefined reference to `add'
    # collect2: error: ld returned 1 exit status
    # gcc options error, see https://blog.csdn.net/aiwoziji13/article/details/7330333 for details

    gcc -o main main.c -L. -larith
    ./main
    ./main: error while loading shared libraries: libarith.so: cannot open shared object file: No such file or directory
    ldd main 
    libarith.so => not found
```

报错提示找不到libarith.so文件。该文件在我们当前目录下，但是当前目录并不在运行时链接器的搜索路径中。一种解决办法是将当前路径添加到LD_LIBRARY_PATH中，但是该方法是一种全局配置，总是显得不那么干净。
第二种方法是在链接的时候直接将搜索路径写到RPATH中，按如下方式重新编译：

```
    gcc  main.c -Wl,-rpath='.' -o main -L. -larith
    ./main
    Sum = 3.
    ldd main 
    libarith.so => ./libarith.so (0x000015387f0d6000)
```

-rpath是链接器选项，并不是gcc的编译选项，所以上面通过-Wl,告知编译器将此选项传给下一阶段的链接器。重新编译后，采用readelf命令查看main文件的dynamic节，发现多了一个RPATH字段，且值就是我们前面设置的路径。

```
    readelf -d main| grep PATH
    0x000000000000001d (RUNPATH)            Library runpath: [.]
```

上面的解决办法还有一些小问题，**RPATH指定的路径是相当于当前目录的，而不是相对于可执行文件所在的目录**，那么当换一个目录再执行上面的程序，就会又报找不到共享库。解决这个问题的办法就是使用\$ORIGIN变量，
在运行的时候，链接器会将该变量的值用可执行文件或动态库所在的目录来替换，这样我们就又能相对于可执行文件来指定RPATH了。

```
    # '$ORIGIN/' allows you to install the binary anywhere, so long as you move the binary and the libraries together
    gcc  main.c -Wl,-rpath='$ORIGIN/' -o main -L. -larith
```

很多时候我们拿到的是编译好的二进制文件，这样我们就不能用前面的办法来指定RPATH了。幸好有patchelf这个小工具，它可以用来修改elf文件，用它修改main的RPATH的方法如下：

```
    pathelf  main --set-rpath='$ORIGIN/'
```


#### 相关环境变量
{:.no_toc}

- LD_LIBRARY_PATH 这个环境变量是大家最为熟悉的，它告诉loader：在哪些目录中可以找到共享库。可以设置多个搜索目录，这些目录之间用冒号分隔开。在linux下，还提供了另外一种方式来完成同样的功能，你可以把这些目录加到/etc/ld.so.conf中，或则在/etc/ld.so.conf.d里创建一个文件，把目录加到这个文件里。当然，这是系统范围内全局有效的，而环境变量只对当前shell有效。按照惯例，除非你用上述方式指明，loader是不会在当前目录下去找共享库的，正如shell不会在当前目前找可执行文件一样。
- LD_PRELOAD 这个环境变量对于程序员来说，也是特别有用的。它告诉loader：在解析函数地址时，优先使用LD_PRELOAD里指定的共享库中的函数。这为调试提供了方便，比如，对于C/C++程序来说，内存错误最难解决了。常见的做法就是重载malloc系列函数，但那样做要求重新编译程序，比较麻烦。使用LD_PRELOAD机制，就不用重新编译了，把包装函数库编译成共享库，并在LD_PRELOAD加入该共享库的名称，这些包装函数就会自动被调用了。在linux下，还提供了另外一种方式来完成同样的功能，你可以把要优先加载的共享库的文件名写在/etc/ld.so.preload里。当然，这是系统范围内全局有效的，而环境变量只对当前shell有效
- LD_ DEBUG 这个环境变量比较好玩，有时使用它，可以帮助你查找出一些共享库的疑难杂症（比如同名函数引起的问题）。同时，利用它，你也可以学到一些共享库加载过程的知识


### [Creating, Installing](http://www.yolinux.com/TUTORIALS/LibraryArchives-StaticAndDynamic.html) [and Using a Shared Library](http://tldp.org/HOWTO/Program-Library-HOWTO/shared-libraries.html#AEN115)

#### Creating a shared library
{:.no_toc}

Generate a shared object is a two step process:

1. Create object code
2. Create library
3. Optional: create default version using a symbolic link

Here is a library creation example

```
    # create object code
    gcc -Wall -fPIC -c *.c

    # create library libctest.so.1.0
    # gcc -shared -Wl,-soname,your_soname -o library_name file_list library_list
    gcc -shared -Wl,-soname,libctest.so.1 -o libctest.so.1.0   *.o -lc

    # create default version using a symbolic link
    mv libctest.so.1.0 /usr/local/lib
    ln -sf /usr/local/lib/libctest.so.1.0 /usr/local/lib/libctest.so.1
    ln -sf /usr/local/lib/libctest.so.1.0 /usr/local/lib/libctest.so
    # or with cascading link
    ln -sf /usr/local/lib/libctest.so.1.0 /usr/local/lib/libctest.so.1
    ln -sf /usr/local/lib/libctest.so.1   /usr/local/lib/libctest.so
```

Compiler options:

```
    -c: generates object files
    -o: output of operation
    -g: includes debugging information
    -Wall: generate warnings
    -fPIC: enable position independent code generation
    -shared: produce a shared object
    -Wl,options: Pass options to linker, the name passed with the "-o" option is passed to gcc
    # In the above example the options to be passed on to the linker are: "-soname libctest.so.1"
```

During development, there's the potential problem of modifying a library that's also used by many other programs -- and you don't want the other programs to use the *developmental* library, only a particular application that 
you're testing against it. One link option you might use is ld's *rpath* option, which specifies the runtime library search path of that particular program being compiled. From gcc, you can invoke the rpath option by specifying it this way:

```
    -Wl,-rpath,$(DEFAULT_LIB_INSTALL_PATH)
```
If you use this option when building the library client program, you don't need to bother with LD_LIBRARY_PATH other than to ensure it's not conflicting, or using other techniques to hide the library.

#### [Installing a shared library](http://tldp.org/HOWTO/Program-Library-HOWTO/shared-libraries.html#AEN115)
{:.no_toc}

##### In standard directories
{:.no_toc}

Once you've created a shared library, you'll want to install it. The simple approach is simply to copy the library into one of the **standard directories** (e.g., */usr/local/lib*) and run *ldconfig*.

```
    # ldconfig -n directory_with_shared_libraries
    ldconfig -n /usr/local/lib
```

And finally, you can use the shared libraries with -l and -L options.

##### Not in standard directories
{:.no_toc}

If you **can't or don't want to install a library in a standard place** (e.g., you don't have the right to modify /usr/local/lib), then you'll need to change your approach. 
In that case, you'll need to install it somewhere, and then give your program enough information so the program can find the library.
There are several ways to do that:

- Use gcc's -L flag in simple cases
- Use the *rpath* approach, particularly if you only have a specific program to use the library being placed in a *non-standard* place
- Use environment variables to control things, in particular, you can set LD_LIBRARY_PATH

If you want to override just a few selected functions, you can do this by creating an *overriding object* file and setting LD_PRELOAD; the functions in this object file will override just those functions (leaving others as they were).


##### Multiple versions case
{:.no_toc}

Usually you can update libraries without concern; if there was an API change, the library creator is supposed to change the soname. That way, multiple libraries can be on a single system, 
and the right one is selected for each program. However, if a program breaks on an update to a library that kept the same soname, you can force it to use the older library version by copying the old library back somewhere, 
renaming the program (say to the old name plus ".orig"), and then create a small "wrapper" script that resets the library to use and calls the real (renamed) program. You could place the old library in its own special area, 
if you like, though the numbering conventions do permit multiple versions to live in the same directory. The wrapper script could look something like this

```
    #!/bin/sh
    export LD_LIBRARY_PATH=/usr/local/my_lib:$LD_LIBRARY_PATH
    exec /usr/bin/my_program.orig $*
```

Please don't depend on this when you write your own programs; try to make sure that your libraries are either backwards-compatible or that you've incremented the version number in the soname every time you make an incompatible change. 
This is just an "emergency" approach to deal with worst-case problems.

[An special example](https://stackoverflow.com/questions/847179/multiple-glibc-libraries-on-a-single-host/851229#851229): it is very possible to have multiple versions of glibc on the same system.
However, glibc consists of many pieces (200+ shared libraries) which all must match. One of the pieces is ld-linux.so.2, and it must match libc.so.6. Thus, the absolute path to ld-linux.so.2 can 
be hard-coded into the executable at link time, and can not be easily changed after the link is done.

```
    g++ main.o -o myapp -Wl,--rpath=/path/to/newglibc -Wl,--dynamic-linker=/path/to/newglibc/ld-linux.so.2
```

The *--rpath* linker option will make the runtime loader search for libraries in /path/to/newglibc (so you wouldn't have to set LD_LIBRARY_PATH before running it), 
and the *--dynamic-linker* option will "bake" path to correct ld-linux.so.2 into the application.
Refer [Multiple glibc libraries on a single host](https://stackoverflow.com/questions/847179/multiple-glibc-libraries-on-a-single-host/851229#851229) for more details.

#### [Using a shared library](http://www.yolinux.com/TUTORIALS/LibraryArchives-StaticAndDynamic.html)
{:.no_toc}

The link to /usr/local/lib/libctest.so allows the naming convention for the compile flag -lctest to work, while the link to /usr/local/lib/libctest.so.1 allows the run time binding to work.

Compile main program and link with shared object library:

```
    # gcc -Wall -I/path/to/include-files -L/path/to/libraries prog.c -lctest -o prog
    gcc -Wall -L/opt/lib prog.c -lctest -o prog
```

Where the name of the library is libctest.so. (This is why you must create the symbolic links or you will get the error "ld: cannot find -lctest".)
The libraries will NOT be included in the executable but will be dynamically linked during run-time execution.
