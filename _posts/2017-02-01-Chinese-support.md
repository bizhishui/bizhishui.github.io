---
title: 中文支持
layout: post
guid: urn:uuid:827eea18-5fd1-4e34-8d6d-de4ac8cc5b85
categories:
  - notes
tags:
  - Chinese
---


> 本博文记录诸如Linux系统中文输入法、Latex等的中文支持。


---

### Ubuntu 16.04 Sougou 中文输入法
Ubuntu默认的输入引擎是iBus，但是其对中文特别不友好。这里给出在Ubuntu下使用基于Fcitx的Sougou拼音输入法。

1. 首先在打开Language Support并安装中文；
2. 在Keybord input method system的下拉菜单中选择fcitx，然后logout/login以使更改生效（可能需要多次）；
3. 从[Sougou拼音官网](http://pinyin.sogou.com/linux/?r=pinyin)下载最新的软件包；
4. 使用`sudo dpkg -i ~/Downloads/sogoupinyin*.deb; sudo apt -f install`安装，重启生效；
5. 这样之后可能会因为软件包的冲突致使`apt update`命令[报错](http://ubuntuhandbook.org/index.php/2016/07/2-best-chinese-pinyin-im-ubuntu-16-04/)，
可以使用`sudo apt-key adv –keyserver keyserver.ubuntu.com –recv-keys 8D5A09DC9B929006`解决或者从`Software & Updates -> Other Software`中删除
对应的Kylin软件源包（但这样Sougou输入法将不能自动更新）。


### Latex中文支持
该节主要针对Linux下安装完整的texlive后如何编写中文文档（原生Latex不支持中文）。不同于[通常](https://th0.me/1681.html)的从Windows下拷贝中文字体或者下载Adobe中文字体,
这里将介绍一种直接使用[ctex文档类](https://www.kancloud.cn/thinkphp/latex/41810)的方法。事实上只需将`\documentclass[options]{article}`文档类改为`\documentclass[UTF8]{ctexart}`，
然后使用`xelatex`编译即可。
