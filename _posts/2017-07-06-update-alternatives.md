---
title: update-alternatives
layout: post
guid: urn:uuid:7dc824c0-8286-4a1d-85ec-f8f3bfffb012
categories:
  - linux 
tags:
  - Linux
---

update-alternatives是linux系统中专门维护系统命令链接符的工具，通过它可以很方便的设置系统默认使用哪个命令、哪个软件版本.
比如，我们在系统中同时安装了open jdk和oracle jdk两个版本，而我们又希望系统默认使用的是oracle jdk，那怎么办呢？
通过update-alternatives就可以很方便的实现了。

It updates the links in `/etc/alternatives` to point to the program for this purpose. There's lots of examples, like `x-www-browser`, `editor`, 
etc. that will link to the browser or editor of your preference.

### Python 示例
下面已python为例说明。查看已有Python版本，
```
    python -V
    # Python 2.7.12
    python3 -V
    # Python 3.5.2
```

因为Python 2.7被很多系统命令调用，保险起见，我们测试python3。为此我们先安装python 3.6:
```
    sudo add-apt-repository ppa:jonathonf/python-3.6
    sudo apt-get update
    sudo apt-get install python3.6
```
