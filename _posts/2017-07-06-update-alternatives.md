---
title: update-alternatives
layout: post
guid: urn:uuid:7dc824c0-8286-4a1d-85ec-f8f3bfffb012
categories:
  - unix 
tags:
  - Linux
---

update-alternatives是linux系统中专门维护系统命令链接符的工具，通过它可以很方便的设置系统默认使用哪个命令、哪个软件版本.
比如，我们在系统中同时安装了open jdk和oracle jdk两个版本，而我们又希望系统默认使用的是oracle jdk，那怎么办呢？
通过update-alternatives就可以很方便的实现了。

It updates the links in `/etc/alternatives` to point to the program for this purpose. There's lots of examples, like `x-www-browser`, `editor`, 
etc. that will link to the browser or editor of your preference.

The links in `/etc/alternatives` are just symbolic links. You can see them using for example
```
    ls -l /etc/alternatives
```

Moreover, the regular `/usr/bin` binaries are also symlinks. E.g.:
```
    ls -l /usr/bin/python3
    # /usr/bin/python3 -> /etc/alternatives/python3
    ls -l /etc/alternatives/python3
    # /etc/alternatives/python3 -> /usr/bin/python3.6
```
So, no `PATH` has to be modified. It just uses symbolic links.

### Python3 示例
下面已python为例说明。查看已有Python版本，
```
    python -V
    # Python 2.7.12
    python3 -V
    # Python 3.5.2
```

因为Python 2.7被很多系统命令调用，保险起见，我们测试python3。为此我们先安装python 3.6:
```
    sudo add-apt-repository ppa:jonathonf/python-3.6       # use J Fernyhough's PPA at https://launchpad.net/~jonathonf/+archive/ubuntu/python-3.6
    sudo apt-get update
    sudo apt-get install python3.6
```

安装检查:
```
    python3 -V
    # Python 3.5.2
    python3.6 -V
    # Python 3.6.1+
```

需要注意旧版本仍在，并且仍然通过python3调用，而新版本需用python3.6调用。如果想默认使用新版本而不是3.5，可以使用update-alternatives命令.


#### update-alternatives –install
install参数用于添加一个命令的link值，相当于添加一个可用值，其中slave非常有用。
```
    sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.5 1
    sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.6 2
```

#### update-alternatives --list
list参数列出所用可用程序。
```
    update-alternatives --list python3
```

#### update-alternatives --display
display参数列出一个命令的所有可选命令并且显示当前选择。
```
    update-alternatives --display python3
```

#### update-alternatives --config
config选项功能为在现有的命令链接选择一个作为系统默认的，相当于在可用值之中进行切.
```
    sudo update-alternatives --config python3
    python3 -V
    # Python 3.6.1+
```

#### update-alternatives –remove
 remove参数用于删除一个命令的link值，其附带的slave也将一起删除。
 ```
    update-alternatives –remove python3 /usr/bin/python3.6
    # update-alternatives --remove name path
 ```


### update-alternatives 部分命名详解
#### Install选项
install选项的功能就是增加一组新的系统命令链接符了，使用语法为：
```
    update-alternatives --install link name path priority [--slave link name path]...
```

其中*link*为系统中功能相同软件的公共链接目录，比如`/usr/bin/java`(需绝对目录); *name*为命令链接符名称,如*java*； *path*为你所要使用新命令、新软件的所在目录； 
*priority*为优先级，当命令链接已存在时，需高于当前值，因为当*alternative*为自动模式时,系统默认启用*priority*高的链接; `--slave`为从*alternative*。

*alternative*有两种模式：*auto*和*manual*，默认都为*auto*模式，因为大多数情况下`update-alternatives`命令都被*postinst* (*configure*) or *prerm* (*install*)调用的，
如果将其更改成手动的话安装脚本将不会更新它了。例如：
```
    sudo update-alternatives --install /usr/bin/java java /usr/local/lib/java/jdk1.7.0_67 17067   
    # /usr/bin/java   java link所在的路径
    # java  创建link的名称
    # /usr/local/lib/java/jdk1.7.0_67  java链接指向的路径
    # 17067  根据版本号设置的优先级（更改的优先级需要大于当前的）版本越高优先级越高
```
