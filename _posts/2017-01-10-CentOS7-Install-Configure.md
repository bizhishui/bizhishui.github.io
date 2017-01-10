---
title: CentOS7 Install & Configure
layout: post
guid: urn:uuid:a3cb476c-cd15-47f2-86e4-814a299a95fe
categories:
  - notes 
tags:
  - Linux
  - CentOS
---


Reproduced **PzNotes** [CentOS 7安装及配置](https://whu-pzhang.github.io/linux-environment-for-seismology-research.html).

---

本文主要记录CentOS以及一些基本软件的安装。

### 安装CentOS 7
由于个人水平有限，本文安装的是CentOS7的桌面版。

####准备安装盘

1. 下载[CentOS 7 Everything ISO](https://github.com/bizhishui/bizhishui.github.io)，容量约为8G，故应至少准备一个16G U盘。
2. 使用dd命令刻录U盘启动盘，Linux下命令为:
    dd if=full/path/to/CentOS.iso of=/dev/sdb

