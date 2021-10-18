---
title: 磁盘分区及硬盘挂载
layout: post
guid: urn:uuid:ab464ace-a924-40e7-8ec1-82c4a94c763f
categories:
  - unix
tags:
  - Linux
  - Partition
  - Mount
---


---

> 主要记录Linux下，系统安装时磁盘分区及存储硬盘的挂载。主要参考资料为[鸟哥的Linux私房菜](http://cn.linux.vbird.org/)。

---

在Linux下，各种组件或者装置都被视为*一个文件*，这里首先介绍Linux下常见文档名。

### [各硬件装置在Linux中的档名](http://cn.linux.vbird.org/linux_basic/0130designlinux.php#hardware_no)
在Linux系统中，每个装置都被当成一个文件来对待，并且几乎所有的硬件装置文件都在*/dev*这个目录内。
举例来说，IDE介面的硬盘的文件名称即为*/dev/hd[a-d]*，其中，括号内的字母为*a-d*当中的任意一个，亦即有*/dev/hda*, */dev/hdb*, */dev/hdc*, 及*/dev/hdd*这四个文件的意思。   
下图给出了几个常见的装置与其在Linux当中的档名：

[![linux file system](/media/files/2017/02/23/LinuxDevs.png)](https://github.com/bizhishui/bizhishui.github.io/blob/master/ "linux file system")


### [磁盘分区](http://cn.linux.vbird.org/linux_basic/0130designlinux.php#partition)
当前大多数硬盘的接口都是SATA，因此这些接口的硬盘装置文件名都是/dev/sd[a-p]的格式，具体名称由Linux核心侦测到磁碟的顺序决定。

#### 硬盘结构
硬盘的物理结构一般由磁头与碟片、电动机、主控芯片与排线等部件组成；当主电动机带动碟片旋转时，副电动机带动一组（磁头）到相对应的碟片上并确定读取正面还是反面的碟面，
磁头悬浮在碟面上画出一个与碟片同心的圆形轨道（磁轨或称柱面），这时由磁头的磁感线圈感应碟面上的磁性与使用硬盘厂商指定的读取时间或数据间隔定位扇区，
从而得到该扇区的数据内容。每个磁道（track）被等分为若干个弧段，这些弧段便是硬盘的扇区（Sector）。硬盘的第一个扇区，叫做引导扇区。
该引导扇区主要记录主要启动记录区(Master Boot Record, MBR，可以安装启动管理程序的地方，有446 bytes)和硬盘分割表(partition table，记录整颗硬盘分割的状态，有64 bytes)。

MBR是很重要的，因为当系统在启动的时候会主动去读取这个区块的内容，这样系统才会知道你的程序放在哪里且该如何进行启动。 
如果你要安装多重启动的系统，MBR这个区块的管理就非常的重要了！


#### 磁盘分区表(partition table)
假设有一硬盘的文档名为*/dev/sda*，将其分为四块，那么这四个分割槽在Linux系统中的装置档名分别
为*/dev/sda1*,*/dev/sda2*,*/dev/sda3*和*/dev/sda4*。由于分区表就只有64 bytes而已，最多只能容纳四笔分区的记录， 
这四个分区的记录被称为主分区(primary partition)或扩展分区(extended partition)。
事实上所谓的"分区"只是针对那个64 bytes的分割表进行配置（每个分区的起始和截止磁柱号码）而已！

硬盘的分区不仅有利于数据的安全性（如将系统*/dev/sda1*和数据*/dev/sda2*分开，系统破坏还可以从*/dev/sda2*恢复数据；同样若数据读写出错也不会引起系统崩溃），
还可提高系统运行效率（如需要往*/dev/sda2*写数据，只需从开始*/dev/sda2*，还不需从整个硬盘的起点开始）。
虽然分区表仅可记录四笔分区信息，但并不是一块硬盘只能分为四块。 扩展分区的目的是使用额外的磁区来记录分割资讯，扩展分区本身并不能被拿来格式化。 
所以可以使用扩展分区所指向的那个区块继续作分区的记录。由扩展分区分出来的分区被称为逻辑分区（logical partition），并且其文档号从*/dev/sda5*开始。

- 主分区和扩展分区最多可以有四笔(硬盘的限制)
- 扩展分区最多只能有一个(操作系统的限制)
- 逻辑分区是由扩展分区持续切割出来的分区
- 能够被格式化后，作为数据存取的分区为主分区与逻辑分区。扩展分区无法格式化
- 逻辑分区的数量依操作系统而不同，在Linux系统中，IDE硬盘最多有59个逻辑分割(5号到63号)， SATA硬盘则有11个逻辑分割(5号到15号)

#### 启动流程与主要启动记录区(MBR)
CMOS是记录各项硬件参数且嵌入在主板上面的储存器，BIOS则是一个写入到主板上的一个韧体(韧体就是写入到硬件上的一个软件程序)。这个BIOS就是在启动的时候，计算机系统会主动运行的第一个程序了！
接下来BIOS会去分析计算机里面有哪些储存设备，我们以硬盘为例，BIOS会依据使用者的配置去取得能够启动的硬盘， 并且到该硬盘里面去读取第一个磁区的MBR位置。 
MBR这个仅有446 bytes的硬盘容量里面会放置最基本的启动管理程序， 此时BIOS就功成圆满，而接下来就是MBR内的启动管理程序的工作了。
这个启动管理程序的目的是在加载(load)核心文件， 由於启动管理程序是操作系统在安装的时候所提供的，所以他会认识硬盘内的文件系统格式，因此就能够读取核心文件， 
然后接下来就是核心文件的工作，启动管理程序也功成圆满，之后就是大家所知道的操作系统的任务啦！
简单的说，整个启动流程到操作系统之前的动作应该是这样的：

1. BIOS：启动主动运行的韧体，会认识第一个可启动的装置；
2. MBR：第一个可启动装置的第一个磁区内的主要启动记录区块，内含启动管理程序；
3. 启动管理程序(boot loader)：一支可读取核心文件来运行的软件；
4. 核心文件：开始操作系统的功能...

由上面的说明我们会知道，BIOS与MBR都是硬件本身会支持的功能，至於Boot loader则是操作系统安装在MBR上面的一套软件。由於MBR仅有446 bytes而已，因此这个启动管理程序是非常小而美的。 这个boot loader的主要任务有底下这些项目：

- 提供菜单：使用者可以选择不同的启动项目，这也是多重启动的重要功能！
- 加载核心文件：直接指向可启动的程序区段来开始操作系统；
- 转交其他loader：将启动管理功能转交给其他loader负责。

第三点表示你的计算机系统里面可能具有两个以上的启动管理程序！因为启动管理程序除了可以安装在MBR之外， 还可以安装在每个分割槽的启动磁区(boot sector)，这一特色才能造就"多重启动"的功能。

#### 主机硬盘的主要规划
分区前首先需要考虑该主机的主要用途，然后根据用途去分析需要较大容量的目录，以及读写较为频繁的目录，将这些重要的目录分别独立出来而不与根目录放在一起，那当这些读写较频繁的磁盘分区槽有问题时，
至少不会影响到根目录的系统数据，那挽救方面就比较容易！ 在默认的CentOS环境中，比较符合容量大且(或)读写频繁的目录有*/*,*/boot*,*/usr*,*/home*,*/var*,*swap*。

关于实际硬盘的分区，对于Desktop用户，可以给*/*分配15G左右，*swap*大约内存的大小，*/boot*约200M，*/home*剩余全部空间；而对于服务器主机
*/,/boot,swap*与桌面型一致，*/var*1G以上空间，剩余空间由*/usr*和*/home*均分。



### [硬盘自动挂载配置](http://bruce007.blog.51cto.com/7748327/1322236)
##### 显示硬盘及所属分区情况
在终端窗口中输入如下命令：

```
    sudo fdisk -lu
```

##### 对硬盘进行分区
在终端窗口中输入如下命令：

```
    sudo fdisk /dev/sdb        #假设要挂在的硬盘文档号位 sdb, 硬盘不能大于2T
    Command (m for help): m    #查看帮助
    Command (m for help): n    #创建新分区
    Command (m for help): e    #指定分区为扩展分区（extended）
    Command (m for help): w    #保存
    sudo fdisk -lu             #查看系统已经识别了硬盘 /dev/sdb 的分区
```

##### 硬盘格式化

```
    sudo mkfs -t ext4 /dev/sdb   -t ext4     #表示将分区格式化成ext4文件系统类型
    sudo mkfs -t ext4 /dev/sdb2  -t ext4     #如硬盘有多块分区
```

##### 磁盘检验
**通常只有身为root且你的文件系统有问题的时候才使用fsck这个命令，否则在正常状况下使用此一命令，可能会造成对系统的危害！
通常使用这个命令的场合都是在系统出现极大的问题，导致你在 Linux 启动的时候得进入单人单机模式下进行维护的行为时，才必须使用此一命令！**
在 ext2/ext3 文件系统的最顶层(就是挂载点那个目录底下)会存在一个"lost+found"的目录！ 该目录就是在当你使用fsck检查文件系统后，若出现问题时，有问题的数据会被放置到这个目录中！ 
所以理论上这个目录不应该会有任何数据，若系统自动产生数据在里面，那你就得特别注意你的文件系统了！

```
    sudo fsck -C -f -t ext4 /dev/sdb2        #filesystem check
    sudo badblocks -sv /dev/sdb2             #检查硬盘或软盘扇区有没有坏轨
```

##### 挂载硬盘分区

```
    sudo df -lh                #查看分区情况
    sudo mkdir data            #建立挂载文件目录, /data
    sudo mount -t ext4 /dev/sdb /data   #挂载分区
    sudo df -lh                #检查
    umount /dev/sdb            #卸除挂载
```

##### [设置开机自动挂载](http://cn.linux.vbird.org/linux_basic/0230filesystem.php#bootup)
在*/etc/fstable* (filesystem table)有如下字段：

- 磁盘装置文件名或该装置的Label，可使用dumpe2fs 获得Label或者使用UUID
- 挂载点 (mount point)：空目录
- 磁盘分区的文件系统，如ext4
- 文件系统参数，可使用defaults默认设置
- 能否被 dump 备份命令作用。dump 是一个用来做为备份的命令，可以透过 fstab 指定哪个文件系统必须要进行 dump 备份！ 0 代表不要做 dump 备份， 1 代表要每天进行 dump 的动作。 2 也代表其他不定日期的 dump 备份动作， 通常这个数值不是 0 就是 1。
- 是否以 fsck 检验扇区。启动的过程中，系统默认会以 fsck 检验我们的 filesystem 是否完整 (clean)。 不过，某些 filesystem 是不需要检验的，例如内存置换空间 (swap) ，或者是特殊文件系统例如 /proc 与 /sys 等等。所以，在这个字段中，我们可以配置是否要以 fsck 检验该 filesystem 。 0 是不要检验， 1 表示最早检验(一般只有根目录会配置为 1)， 2 也是要检验，不过 1 会比较早被检验！ 一般来说，根目录配置为 1 ，其他的要检验的 filesystem 都配置为 2 就好了。

```
    ls -l /dev/disk/by-uuid/    #查看硬盘对应的uuid
    sudo vim /etc/fstab         #添加以下内容, UUID, mount point=/data, type=ext4, option dump=0 (not backup), pass=3 (used for fsck, 0 not check, bigger, check later)
    UUID=0f648388-edae-4d54-b5ac-7afe9ce16b72 /data      ext4  defaults    0     3
```

### [用GNU的parted进行分割](http://cn.linux.vbird.org/linux_basic/0230filesystem.php#parted)
虽然你可以使用fdisk很快速的将你的硬盘切割妥当，不过fdisk却无法支持到高于2TB 以上的硬盘！ 此时就得需要*parted*来处理了。
**不同于fdisk，parted的命令都是下达即执行，因此要特别小心。**

```
    parted /dev/hdc print        #列出当前hdc硬盘的分区表
    parted /dev/hdc mkpart logical ext3 19.2GB 19.7GB       #创建一个约为512MB容量的逻辑分割槽,19.2G是由上一指令得到的该硬盘最后分区的截止磁柱位置
    parted /dev/hdc rm 8         #删除8号分区，假设刚才新建分区编号(Number)为8
```

### Mount a SSD disk
```
    // find the disk name
    sudo lsblk
    // format the new disk
    sudo mkfs.ext4 /dev/nvme1n1
    // mount the disk
    sudo mkdir /data
    sudo mount /dev/nvme1n1 /data
    // add mount to fstab
    // add followling line to /etc/fstab
    UUID=XXXX-XXXX-XXXX-XXXX-XXXX     /archive ext4 errors=remount-ro 0 1
    // use *sudo blkid* to find the UUID
```
