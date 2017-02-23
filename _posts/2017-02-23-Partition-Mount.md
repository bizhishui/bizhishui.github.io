---
title: 磁盘分区及硬盘挂载
layout: post
guid: urn:uuid:ab464ace-a924-40e7-8ec1-82c4a94c763f
categories:
  - linux
tags:
  - Linux
  - Partition
  - Mount
---


---

> 主要记录Linux下，系统安装时磁盘分区及存储硬盘的挂载。

---

在Linux下，各种组件或者装置都被视为*一个文件*，这里首先介绍Linux下常见文档名。

### [各硬件装置在Linux中的档名](http://cn.linux.vbird.org/linux_basic/0130designlinux.php#hardware_no)
在Linux系统中，每个装置都被当成一个文件来对待，并且几乎所有的硬件装置文件都在`/dev`这个目录内。
举例来说，IDE介面的硬盘的文件名称即为`/dev/hd[a-d]`，其中，括号内的字母为`a-d`当中的任意一个，亦即有`/dev/hda`, `/dev/hdb`, `/dev/hdc`, 及`/dev/hdd`这四个文件的意思。

下图给出了几个常见的装置与其在Linux当中的档名：

[![linux file system](/media/files/2017/02/23/LinuxDevs.png)](https://github.com/bizhishui/bizhishui.github.io/blob/master/ "linux file system")


### [磁盘分区](http://cn.linux.vbird.org/linux_basic/0130designlinux.php#partition)
