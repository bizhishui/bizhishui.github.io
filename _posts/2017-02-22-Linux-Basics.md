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


### [Linux系统的在线求助man page与info page](http://cn.linux.vbird.org/linux_basic/0160startlinux.php#manual)
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



### [正确的关机方法](http://cn.linux.vbird.org/linux_basic/0160startlinux.php#shutdown_pc)
- 观察系统的使用状态

```
    who         #查看当前在线用户
    netstat -a  #查看网络联机状态
    ps -aux     #查看背景运行程序
```

- 通知在线使用者关机的时刻
- 将数据同步写入硬盘中的命令： `sync`
- 正确的关机命令使用：如 `shutdown` 与 `reboot`


### [文件系统错误问题](http://cn.linux.vbird.org/linux_basic/0160startlinux.php#shoot)
在启动的过程中最容易遇到的问题就是硬盘可能有坏轨或文件系统发生错误(数据损毁)的情况， 这种情况虽然不容易发生在稳定的Linux系统下，
不过由于不当的开关机行为， 还是可能会造成的，常见的发生原因可能有：

- 最可能发生的原因是因为断电或不正常关机所导致的文件系统发生错误，将导致硬盘内的文件系统错误。文件系统错误并非硬件错误，而是软件数据的问题。
- 硬盘使用率过高或主机所在环境不良也是一个可能的原因。

解决的方法其实很简单，不过因为出错扇区所挂载的目录不同，处理的流程困难度就有差异了。 举例来说，
如果你的根目录`/`并没有损毁，那就很容易解决，如果根目录已经损毁了，那就比较麻烦！

#### 如果根目录没有损毁
假设你发生错误的partition是在`/dev/sda7`这一块，那么在启动的时候，屏幕应该会告诉你：press root password or ctrl+D : 这时候请输入root的密码登陆系统，然后进行如下动作：

- 在光标处输入root密码登陆系统，进行单人单机的维护工作；
- 输入` fsck /dev/sda7 `(`fsck` 为文件系统检查的命令，`/dev/sda7`为错误的partition，请依你的情况下达参数)， 这时屏幕会显示开始修理硬盘的信息，
如果有发现任何的错误时，屏幕会显示： clear [Y/N]？ 的询问信息，就直接输入 Y 吧！
- 修理完成之后，以 reboot 重新启动。


#### 如果根目录损毁了
一般初学者喜欢将自己的硬盘只划分为一个大partition，亦即只有根目录， 那文件系统错误一定是根目录的问题。这时你可以将硬盘拔掉，
接到另一台Linux系统的计算机上， 并且不要挂载(mount)该硬盘，然后以root的身份运行`fsck /dev/sdb1`(`/dev/sdb1` 指的是你的硬盘装置文件名，你要依你的实际状况来配置)

另外，也可以使用近年来很热门的Live CD，也就是利用光盘启动就能够进入Linux操作系统的特性，然后使用`fsck`去修复原本的根目录， 例如：`fsck /dev/sda1` ，就能够救回来了！

#### 如果硬盘整个坏掉
如果硬盘实在坏的离谱时，那就先将旧硬盘内的数据，能救出来的救出来，然后换一颗硬盘来重新安装Linux。预防保护建议为：

- 妥善保养硬盘(例如：主机通电之后不要搬动，避免移动或震动硬盘；尽量降低硬盘的温度，可以加装风扇来冷却硬盘； 或者可以换装 SCSI 硬盘)。
- 划分不同的partition(因为Linux每个目录被读写的频率不同，妥善的块分配将会让我们的Linux更安全！，如`/, /boot, /usr, /home, /var`等)。


### [忘记root密码](http://cn.linux.vbird.org/linux_basic/0160startlinux.php#shoot)
先将系统重新启动，在读秒的时候按下任意键就会出现相关提示。一般按`e`就进入*grub*编辑模式。将光标移至kernel那一行，再按一次`e`进入kernel该行的编辑画面中，
然后在出现的画面当中，*最后方输入 single*。 再按下*Enter*确定之后，按下`b`键就可以启动进入单人维护模式了！ 在这个模式底下，你会在*tty1*
的地方不需要输入密码即可取得终端机的控制权(而且是使用root的身份！)。 之后就能够用命令*passwd*修改root的密码了！


### [User-Group](http://cn.linux.vbird.org/linux_basic/0210filepermission.php#UserandGroup)
在Linux系统当中，默认的情况下，所有的系统上的账号与一般身份使用者，还有那个root的相关信息， 都是记录在*/etc/passwd*这个文件内的。至于个人的密码则是记录在*/etc/shadow*这个文件下。 此外，Linux所有的组名都纪录在*/etc/group*内！


### [目录与文件之权限意义](http://cn.linux.vbird.org/linux_basic/0210filepermission.php#filepermission_dir)
##### 权限对文件的重要性
文件是实际含有数据的地方，包括一般文本文件、数据库内容文件、二进制可执行文件(binary program)等等。 因此，权限对于文件来说，它的意义是：

- *r(read)*：可读取此一文件的实际内容，如读取文本文件的文字内容等；
- *w(write)*：可以编辑、新增或者是修改该文件的内容(但不含删除该文件)；
- *x(execute)*：该文件具有可以被系统执行的权限。

##### 权限对目录的重要性
目录主要的内容在记录文件名列表，文件名与目录有强烈的关连！

- *r(read contents in directory)*: 表示具有读取目录结构列表的权限，所以当你具有读取(r)一个目录的权限时，表示你可以查询该目录下的文件名数据。 所以你就可以利用 ls 这个指令将该目录的内容列表显示出来！
- *w(modify contents of directory)*: 表示具有异动该目录结构列表的权限，如建立新的文件与目录、删除已经存在的文件与目录(不论该文件的权限为何！)、将已存在的文件或目录进行更名、搬移该目录内的文件和目录位置。
- *x(access directory)* : 目录的x代表的是用户能否进入该目录。



### [Linux目录配置](http://cn.linux.vbird.org/linux_basic/0210filepermission.php#dir)
