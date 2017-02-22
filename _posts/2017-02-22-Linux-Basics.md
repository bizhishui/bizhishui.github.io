---
title: Linux Basics
layout: post
guid: urn:uuid:293c4c6d-38bd-4aca-b0a7-8a6091f04c63
categories:
  - linux
tags:
  - Linux
---


---

> This post notes some basic but very useful points for Linux.

---


### [Linux系统的在线求助man page与info page](http://cn.linux.vbird.org/linux_basic/0160startlinux.php)
#### man page
使用`man command`便可能(新安装程序可能需要手动设置`MANPATH`)获得该命令`command`的详尽信息，如输入`man date`。
首先需要注意的是在帮助页面中的首行命令后会接数字，如`DATE(1)`。该数字意义如下图所示

[![man page number](/media/files/2017/02/22/manNumber.png)](https://github.com/bizhishui/bizhishui.github.io/blob/master/ "man page number")

其次需要了解man page的主要结构，如图所示。


[![man page content](/media/files/2017/02/22/manContent.png)](https://github.com/bizhishui/bizhishui.github.io/blob/master/ "man page content")

既然有`man page`，自然就是因为有一些文件数据，所以才能够以`man page`读出来，通常这些数据放在`/usr/share/man`这个目录里。

##### 其他用法

```
    man -f man          #查看系统中有那些跟*man*有关的*说明文件*, 相当于*whatis man*命令
    man 1 man           #*man(1)*的文件数据
    man 7 man           #*man(7)*的文件数据
    man -k man          #找出系统的说明文件中，只要有*man*这个关键词就将该说明列出来, 相当于*apropos man*命令
```


#### info page
基本上，`info`与`man`的用途其实差不多，都是用来查询命令的用法或者是文件的格式。但是与`man page`一口气输出一堆信息不同的是，
`info page`则是将文件数据拆成一个一个的段落，每个段落用自己的页面来撰写， 并且在各个页面中还有类似网页的"超链接"来跳到各不同的页面中，
每个独立的页面也被称为一个节点(node)。 所以，你可以将`info page`想成是文本模式的网页显示数据。

不过你要查询的目标数据的说明文件必须要以info的格式来写成才能够使用info的特殊功能(例如超链接)，否则显示的是`man page`的结果。 
而这个支持info命令的文件默认是放置在`/usr/share/info/`这个目录当中的。光标移至带有超链接的文本(node)出，按Enter即可打开相关内容，使用Tab可在node间移动。


**此外在`/usr/share/doc`下也有非常多的帮助文档。**



### [正确的关机方法](http://cn.linux.vbird.org/linux_basic/0160startlinux.php)
- 观察系统的使用状态

```
    who         #查看当前在线用户
    netstat -a  #查看网络联机状态
    ps -aux     #查看背景运行程序
```

- 通知在线使用者关机的时刻
- 将数据同步写入硬盘中的命令： `sync`
- 正确的关机命令使用：如 `shutdown` 与 `reboot`



