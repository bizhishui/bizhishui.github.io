---
title: Linux Basics
layout: post
update_date: 2018-02-06
guid: urn:uuid:293c4c6d-38bd-4aca-b0a7-8a6091f04c63
categories:
  - unix
tags:
  - Linux
---


---

> This post notes some basic but very useful points for Linux. Adapted partially from [鸟哥的Linux私房菜](http://cn.linux.vbird.org/).

---

* TOC
{:toc}

### Linux 系统基本命令
```
    uname -r               #可以察看实际的核心版本
    lsb_release -a         #LSB and distribution 的版本
    nl                     #显示的时候(与cat相比)，顺道输出行号
    od                     #以二进位的方式读取文件内容
    file                   #查看文件类型
    which                  #在PATH中的路径下查找命令的具体位置，-a参数显示所有
    whereis                #在Linux数据库文件中查找文件具体位置，-b参数搜寻可执行文件，-m参数可以找到文件对应man page
    locate 文件的部分名称    #在数据库(非硬盘)中查找含有部分文件名的所以文件
    find                   #在整个硬盘上查找，功能强大但速度慢
    dumpe2fs -h /devsdb1   #列出/dev/sdb1的superblock(记录该分区文件系统的各种权限属性、inode和block的总体及使用情况)信息

    #Replace a string in multiple files in linux command line
    sed -i 's/foo/bar/g' *.dat  #subsititue all the occurence of foo with bar in all the lines of all files with postfix .dat
    #Recursive, regular files in this and all subdirectories
    find . -type f -name "*baz*" -exec sed -i 's/foo/bar/g' {} +

    #chmod recursively only all the directories or files
    find /path/to/base/dir -type d -exec chmod 755 {} \;    #To recursively give directories read&execute privileges
    find /path/to/base/dir -type f -exec chmod 644 {} \;    #To recursively give files read privileges
    #To set directories to 755 but files to 644 WITHOUT find 
    chmod -R u+rwX,go+rX,go-w /path  #The important thing to note here is that uppercase X acts differently to lowercase x.

    #exfat supports most OS and has no 4G restriction per file
    sudo mkfs.exfat -n LABEL /dev/sdXn  # formating an external driver /dev/sdXn to exFAT with label name LABEL

    #copy files except certain extentions
    rsync -urav --include='*.vtk' --exclude='*.ser' sourceDir targetDir       #local copy, -r recursive, -a archive (mostly all files), -v verbose, -u update (only new file)
    rsync -urav --delete --include='*.vtk' --exclude='*.ser' sourceDir targetDir       #--delete, clear extra files in targetDir
    rsync -rav -e ssh --include='*.vtk' --include='*.txt' --exclude='*.ser' server:/Full/Sourcedir targetdir   #remote copy with ssh, -e specify ssh

    #delete recursively
    find . -name "*.ser" -type f              # find file end with .ser
    find . -name "*.ser" -type f -delete      # delete recursively files end with .ser
    find . -name "wall" -type d -exec rm -r "{}" \;    # delete recursively folders with name wall

    # parallel: takes a list as input on stdin and then creates a number of processes with a supplied command
    list | parallel command
    # list can be created by any of the usual bash commands e.g. cat, grep, find. The results of these commands are piped from their stdout to the stdin of parallel
    find . -type f -name "*.log" | parallel
    # Just like using -exec with find, parallel substitutes each member in the input list as {}. Here, parallel will gzip every file that find outputs
    find . -type f -name "*.log" -exec gzip {} ';'      # gzip: compress a single file
    find . -type f -name "*.log" | parallel gzip {}
    # jpg image compression (cjpeg) without and with parallel
    find . -type f -name "*.jpg" -exec cjpeg -outfile LoRes/{} {} ';'    #find all .jpg files in current dir and compress them with cjpeg 
    find . -type f -name "*.jpg" | parallel cjpeg -outfile LoRes/{} {}   # use parallel
    
    scrot -s   #screen shot

    #pdfgrep, grep like command for searching in pdf file
    pdfgrep -i -R 'PARTERN' .      #search PARTERN (case insensitive) in all the pdf file recursively

    #Download all files (no html) from a website using wget
    wget --content-disposition --restrict-file-names=nocontrol -e robots=off -A.java,.c,.h -r URL  #-A specify files to be downloaded

    #To see what functions are inside the dynamic library
    nm libfoo.so | grep ' T '

    #combine the pdf files
    pdftk f1.pdf f2.pdf [...] cat output merged.pdf
    #take pages from different files and combine them
    pdftk A=one.pdf B=two.pdf cat A1-7 B1-5 A8 output combined.pdf
    #extract some pages
    pdftk full-pdf.pdf cat 12-15 18 output outfile_p12-15_18.pdf

    #Encrypt a PDF using 128-bit strength (the default), withhold all permissions (the default)
    pdftk 1.pdf output 1.128.pdf owner_pw foopass
    #Same as above, except password baz must also be used to open output PDF
    pdftk 1.pdf output 1.128.pdf owner_pw foo user_pw baz
    #Same as above, except printing is allowed (once the PDF is open)
    pdftk 1.pdf output 1.128.pdf owner_pw foo user_pw baz allow printing

    # https://askubuntu.com/questions/952673/how-do-i-copy-a-file-larger-than-4gb-to-a-usb-flash-drive
    # copy file larger than 4GB to a FAT32 driver without reformatting
    # first split to smaller ones
    split -b4294967295 /path/to/input.file /path/to/pen/drive/output.file.
    # then merge them before accessing again
    cat output.file.* > input.file
```

##### The meaning of {} + in find's -exec command
{:.no_toc}
Using *;* (semicolon) or *+* (plus sign) is mandatory in order to terminate the shell commands invoked by *-exec/execdir*.
The difference between *;* (semicolon) or *+* (plus sign) is how the arguments are passed into find's *-exec/-execdir* parameter. For example:
- using *;* will execute multiple commands (separately for each argument)

```
    find /etc/rc* -exec echo Arg: {} \;
    Arg: /etc/rc.common
    Arg: /etc/rc.common~previous
    Arg: /etc/rc.local
    Arg: /etc/rc.netboot
```
> All following arguments to find are taken to be arguments to the command.
> The string {} is replaced by the current file name being processed.

- using *+* will **execute the least possible commands** (as the arguments are combined together). It's very similar to how *xargs* command works, so it will use as many 
  arguments per command as possible to avoid exceeding the maximum limit of arguments per line.

```
    find /etc/rc* -exec echo Arg: {} \+
    Arg: /etc/rc.common /etc/rc.common~previous /etc/rc.local /etc/rc.netboot
```
> The command line is built by appending each selected file name at the end.
> Only one instance of {} is allowed within the command.

### 常用软件

1. 图片编辑: Gimp, TikZ (Latex), [ImageMagick](https://www.imagemagick.org/script/index.php)
2. 简图制作: Inkscape, Latex Tikz
3. 音乐播放: cmus
4. 视频播放: totem, mplayer, [mpv](https://mpv.io/), VCL, SMplayer
5. 截图: scrot [-s]
6. 屏幕视频录制: SimpleScreenRecorder
7. 启动盘制作: etcher
8. 图片中提取数据：WebPlotDigitizer
9. 思维导图软件：FreeMind
10. 所见即所得的网页编辑器：BlueGriffon
11. 绘画软件：Krita
12. 3D动画设计：blender
13. 视频编辑：Shotcut，支持多种视频格式，可裁剪合并视频，添加音乐和字幕，做简单特效等
14. 音频编辑：Audacity，可以剪切拼接，并且可以把人声制作成类似机器人或者类似小铃铛等声音
15. 作曲编曲：LMMS
16. 文本编辑：vim, gedit, AkelPad、notepad++
17. PDF,eBook阅读：Sumatra, 也支持XPS, DjVu, CHM, Comic Book (CBZ and CBR)


### Linux系统的在线求助man page与info page[>](http://cn.linux.vbird.org/linux_basic/0160startlinux.php#manual)
#### man page
{:.no_toc}
使用*man command*便可能(新安装程序可能需要手动设置*MANPATH*)获得该命令*command*的详尽信息，如输入*man date*。
首先需要注意的是在帮助页面中的首行命令后会接数字，如*DATE(1)*。该数字意义如下图所示

[![man page number](/media/files/2017/02/22/manNumber.png)](https://github.com/bizhishui/bizhishui.github.io/blob/master/ "man page number")

其次需要了解man page的主要结构，如图所示。


[![man page content](/media/files/2017/02/22/manContent.png)](https://github.com/bizhishui/bizhishui.github.io/blob/master/ "man page content")

既然有*man page*，自然就是因为有一些文件数据，所以才能够以*man page*读出来，通常这些数据放在*/usr/share/man*这个目录里。

##### 其他用法
{:.no_toc}

```
    man -f man          #查看系统中有那些跟*man*有关的*说明文件*, 相当于*whatis man*命令
    man 1 man           #*man(1)*的文件数据
    man 7 man           #*man(7)*的文件数据
    man -k man          #找出系统的说明文件中，只要有*man*这个关键词就将该说明列出来, 相当于*apropos man*命令
```


#### info page
{:.no_toc}
基本上，*info*与*man*的用途其实差不多，都是用来查询命令的用法或者是文件的格式。但是与*man page*一口气输出一堆信息不同的是，
*info page*则是将文件数据拆成一个一个的段落，每个段落用自己的页面来撰写， 并且在各个页面中还有类似网页的"超链接"来跳到各不同的页面中，
每个独立的页面也被称为一个节点(node)。 所以，你可以将*info page*想成是文本模式的网页显示数据。

不过你要查询的目标数据的说明文件必须要以info的格式来写成才能够使用info的特殊功能(例如超链接)，否则显示的是*man page*的结果。 
而这个支持info命令的文件默认是放置在*/usr/share/info/*这个目录当中的。光标移至带有超链接的文本(node)出，按Enter即可打开相关内容，使用Tab可在node间移动。


**此外在`/usr/share/doc`下也有非常多的帮助文档。**



### 正确的关机方法[>](http://cn.linux.vbird.org/linux_basic/0160startlinux.php#shutdown_pc)
- 观察系统的使用状态

```
    who         #查看当前在线用户
    netstat -a  #查看网络联机状态
    ps -aux     #查看背景运行程序
```

- 通知在线使用者关机的时刻
- 将数据同步写入硬盘中的命令： *sync*
- 正确的关机命令使用：如 *shutdown* 与 *reboot*


### 文件系统错误问题[>](http://cn.linux.vbird.org/linux_basic/0160startlinux.php#shoot)
在启动的过程中最容易遇到的问题就是硬盘可能有坏轨或文件系统发生错误(数据损毁)的情况， 这种情况虽然不容易发生在稳定的Linux系统下，
不过由于不当的开关机行为， 还是可能会造成的，常见的发生原因可能有：

- 最可能发生的原因是因为断电或不正常关机所导致的文件系统发生错误，将导致硬盘内的文件系统错误。文件系统错误并非硬件错误，而是软件数据的问题。
- 硬盘使用率过高或主机所在环境不良也是一个可能的原因。

解决的方法其实很简单，不过因为出错扇区所挂载的目录不同，处理的流程困难度就有差异了。 举例来说，
如果你的根目录`/`并没有损毁，那就很容易解决，如果根目录已经损毁了，那就比较麻烦！

#### 如果根目录没有损毁
{:.no_toc}
假设你发生错误的partition是在*/dev/sda7*这一块，那么在启动的时候，屏幕应该会告诉你：press root password or ctrl+D : 这时候请输入root的密码登陆系统，然后进行如下动作：

- 在光标处输入root密码登陆系统，进行单人单机的维护工作；
- 输入* fsck /dev/sda7 *(*fsck* 为文件系统检查的命令，*/dev/sda7*为错误的partition，请依你的情况下达参数)， 这时屏幕会显示开始修理硬盘的信息，
如果有发现任何的错误时，屏幕会显示： clear [Y/N]？ 的询问信息，就直接输入 Y 吧！
- 修理完成之后，以 reboot 重新启动。


#### 如果根目录损毁了
{:.no_toc}
一般初学者喜欢将自己的硬盘只划分为一个大partition，亦即只有根目录， 那文件系统错误一定是根目录的问题。这时你可以将硬盘拔掉，
接到另一台Linux系统的计算机上， 并且不要挂载(mount)该硬盘，然后以root的身份运行*fsck /dev/sdb1*(*/dev/sdb1* 指的是你的硬盘装置文件名，你要依你的实际状况来配置)

另外，也可以使用近年来很热门的Live CD，也就是利用光盘启动就能够进入Linux操作系统的特性，然后使用*fsck*去修复原本的根目录， 例如：*fsck /dev/sda1* ，就能够救回来了！

#### 如果硬盘整个坏掉
{:.no_toc}
如果硬盘实在坏的离谱时，那就先将旧硬盘内的数据，能救出来的救出来，然后换一颗硬盘来重新安装Linux。预防保护建议为：

- 妥善保养硬盘(例如：主机通电之后不要搬动，避免移动或震动硬盘；尽量降低硬盘的温度，可以加装风扇来冷却硬盘； 或者可以换装 SCSI 硬盘)。
- 划分不同的partition(因为Linux每个目录被读写的频率不同，妥善的块分配将会让我们的Linux更安全！，如*/, /boot, /usr, /home, /var*等)。


### 忘记root密码[>](http://cn.linux.vbird.org/linux_basic/0160startlinux.php#shoot)
先将系统重新启动，在读秒的时候按下任意键就会出现相关提示。一般按`e`就进入*grub*编辑模式。将光标移至kernel那一行，再按一次`e`进入kernel该行的编辑画面中，
然后在出现的画面当中，*最后方输入 single*。 再按下*Enter*确定之后，按下`b`键就可以启动进入单人维护模式了！ 在这个模式底下，你会在*tty1*
的地方不需要输入密码即可取得终端机的控制权(而且是使用root的身份！)。 之后就能够用命令*passwd*修改root的密码了！


### User-Group[>](http://cn.linux.vbird.org/linux_basic/0210filepermission.php#UserandGroup)
在Linux系统当中，默认的情况下，所有的系统上的账号与一般身份使用者，还有那个root的相关信息， 都是记录在*/etc/passwd*这个文件内的。至于个人的密码则是记录在*/etc/shadow*这个文件下。 此外，Linux所有的组名都纪录在*/etc/group*内！


### 目录与文件之权限意义[>](http://cn.linux.vbird.org/linux_basic/0210filepermission.php#filepermission_dir)
##### 权限对文件的重要性
{:.no_toc}
文件是实际含有数据的地方，包括一般文本文件、数据库内容文件、二进制可执行文件(binary program)等等。 因此，权限对于文件来说，它的意义是：

- *r(read)*：可读取此一文件的实际内容，如读取文本文件的文字内容等；
- *w(write)*：可以编辑、新增或者是修改该文件的内容(但不含删除该文件)；
- *x(execute)*：该文件具有可以被系统执行的权限。

##### 权限对目录的重要性
{:.no_toc}
目录主要的内容在记录文件名列表，文件名与目录有强烈的关连！

- *r(read contents in directory)*: 表示具有读取目录结构列表的权限，所以当你具有读取(r)一个目录的权限时，表示你可以查询该目录下的文件名数据。 所以你就可以利用 ls 这个指令将该目录的内容列表显示出来！
- *w(modify contents of directory)*: 表示具有异动该目录结构列表的权限，如建立新的文件与目录、删除已经存在的文件与目录(不论该文件的权限为何！)、将已存在的文件或目录进行更名、搬移该目录内的文件和目录位置。
- *x(access directory)* : 目录的x代表的是用户能否进入该目录。



### Linux目录配置[>](http://cn.linux.vbird.org/linux_basic/0210filepermission.php#dir)
#### Linux目录配置的依据--FHS
{:.no_toc}
FHS(Filesystem Hierarchy Standard)将目录定义成为四种交互作用的形态，如图所示

[![Linux directories](/media/files/2017/02/22/linuxDirs.png)](https://github.com/bizhishui/bizhishui.github.io/blob/master/ "linux directories")

- *可分享的*：可以分享给其他系统挂载使用的目录，所以包括执行文件与用户的邮件等数据， 是能够分享给网络上其他主机挂载用的目录
- *不可分享的*：自己机器上面运作的装置文件或者是与程序有关的socket文件等， 仅与自身机器有关
- *不变的*：有些数据是不会经常变动的，跟随着distribution而不变动。 例如函式库、文件说明文件、系统管理员所管理的主机服务配置文件等
- *可变动的*：经常改变的数据，例如登录文件、一般用户可自行收受的新闻组等

事实上，FHS针对目录树架构仅定义出三层目录底下应该放置什么数据而已，分别是底下这三个目录的定义：

- / (root, 根目录)：与开机系统有关
- /usr (unix software resource)：与软件安装/执行有关
- /var (variable)：与系统运行过程有关

#### 根目录 (/) 的意义与内容
{:.no_toc}
根目录是整个系统最重要的一个目录，因为不但所有的目录都是由根目录衍生出来的， 同时根目录也与开机/还原/系统修复等动作有关。 
由于系统开机时需要特定的开机软件、核心文件、开机所需程序、 函式库等等文件数据，若系统出现错误时，根目录也必须要包含有能够修复文件系统的程序才行。 
因为根目录是这么的重要，所以在FHS的要求方面，他希望根目录不要放在非常大的分割槽内， 因为越大的分割槽妳会放入越多的数据，如此一来根目录所在分割槽就可能会有较多发生错误的机会。

**因此FHS标准建议：根目录(/)所在分割槽应该越小越好， 且应用程序所安装的软件最好不要与根目录放在同一个分割槽内，保持根目录越小越好。 如此不但效能较佳，根目录所在的文件系统也较不容易发生问题。**
有鉴于上述的说明，因此FHS定义出根目录(/)底下应该要有底下这些次目录的存在才好：

[![root directory](/media/files/2017/02/22/rootDir.png)](https://github.com/bizhishui/bizhishui.github.io/blob/master/ "root directory")

事实上FHS针对根目录所定义的标准就仅有上面的，不过我们的Linux底下还有许多目录你也需要了解一下的。 底下是几个在Linux当中也是非常重要的目录：

[![root directory extended](/media/files/2017/02/22/rootDirExtended.png)](https://github.com/bizhishui/bizhishui.github.io/blob/master/ "root directory extended")

*根目录与开机有关，开机过程中仅有根目录会被挂载， 其他分区则是在开机完成之后才会持续的进行挂载的行为。就是因为如此，因此根目录下与开机过程有关的目录，就不能够与根目录放到不同的分区去！*
具体有如下目录：

- /etc：配置文件
- /bin：重要执行档
- /dev：所需要的装置文件
- /lib：执行档所需的函式库与核心所需的模块
- /sbin：重要的系统执行文件

这五个目录千万不可与根目录分开在不同的分区！

#### /usr 的意义与内容
{:.no_toc}
依据FHS的基本定义，/usr里面放置的数据属于可分享的与不可变动的(shareable, static)。usr是Unix Software Resource的缩写， 也就是"Unix操作系统软件资源"所放置的目录，而不是用户的数据！ 
FHS建议所有软件开发者，应该将他们的数据合理的分别放置到这个目录下的次目录，而不要自行建立该软件自己独立的目录。
因为所有系统默认的软件(distribution发布者提供的软件)都会放置到/usr底下，因此这个目录有点类似Windows 系统的"C:\Windows\ + C:\Program files\"这两个目录的综合体，
系统刚安装完毕时，这个目录会占用最多的硬盘容量。 一般来说，/usr的次目录建议有底下这些：

[![usr directory](/media/files/2017/02/22/usrDir.png)](https://github.com/bizhishui/bizhishui.github.io/blob/master/ "usr directory")


#### /var 的意义与内容
{:.no_toc}
如果/usr是安装时会占用较大硬盘容量的目录，那么/var就是在系统运作后才会渐渐占用硬盘容量的目录。 因为/var目录主要针对常态性变动的文件，包括缓存(cache)、登录文件(log file)以及某些软件运作所产生的文件， 
包括程序文件(lock file, run file)，或者例如MySQL数据库的文件等。常见的次目录有：

[![var directory](/media/files/2017/02/22/varDir.png)](https://github.com/bizhishui/bizhishui.github.io/blob/master/ "var directory")


### 文件的三种时间及其修改
Linux下每一个文件都有以下三种主要时间：

- *modification time(mtime)*: 当该文件的"内容数据"变更时，就会升级这个时间！内容数据指的是文件的内容，而不是文件的属性或权限！
- *status time(ctime)*: 当该文件的"状态 (status)"改变时，就会升级这个时间，举例来说，像是权限与属性被更改了，都会升级这个时间。 
- *access time(atime)*: 当"该文件的内容被取用"时，就会升级这个读取时间(access)。举例来说，我们使用 cat 去读取 */etc/man.config* ， 就会升级该文件的 atime 了。

通常使用*ls*命令给出的是文件的修改时间*mtime*，使用*ls --time=atime*可以获得文件的访问时间*atime*，余者类推。对于已有的文件，使用*touch*命令可以修改上述时间。

### 文件与目录的默认权限与隐藏权限[>](http://cn.linux.vbird.org/linux_basic/0220filemanager.php#fileperm)
#### 文件默认权限：umask
{:.no_toc}
*umask*用来指定“目前使用者在创建文件或目录时候的权限默认值”。查阅的方式有两种，一种可以直接输入*umask* ，就可以看到数字型态的权限配置分数， 
一种则是加入 *-S* (Symbolic) 这个选项，就会以符号类型的方式来显示出权限了。

在默认权限的属性上，目录与文件是不一样的。对于文件，默认没有执行(x)权限，默认最大值为666(-rw-rw-rw-)；对于目录，x与目录的访问有关，默认是给定的，即最大值为777(drwxrwxrwx)。
而单纯*umask*给出的是四位数字，后三位代表创建文件或者目录需要分别给user,group和others需要减去的权限，如0022表示新建文件或者目录时，group member和others都没有写(w=2)的权限。

在*umask*后解三位数字可以更改*umask*的默认值，如*umask 002*，这样创建新的文件时，user和group member权限一样，只是others没有写权限。

#### 文件隐藏属性
{:.no_toc}
使用*chattr*命令可以配置文件属性，*lsattr*显示文件的隐藏属性。如*chattr +i fileA*可以使fileA不能被删除、改名、配置连结也无法写入或新增数据！对于系统的安全性很有好处。


### Linux的EXT文件系统[>](http://cn.linux.vbird.org/linux_basic/0230filesystem.php#harddisk-inode)
Linux的EXT文件系统包含superblock,inode和block三个重要要素。每个文件都有一个inode，它记录该文件的存取模式(read/write/excute)，该文件的拥有者与群组(owner/group)，
该文件的容量，该文件创建或状态改变的时间(ctime)，最近一次的读取时间(atime)，最近修改的时间(mtime)，定义文件特性的旗标(flag)，如 SetUID...，
该文件真正内容的指向 (pointer)等内容，同时记录此文件的数据所在的block号码。而一个文件根据实际大小可以占据多个block，一个block大小可以是1k,2k和4k。而超级区块（superblock）则记录该分区相关信息的地方，
没有superblock，也就没有该分区了。它记录的信息包括block 与 inode 的总量，未使用与已使用的 inode / block 数量，
block 与 inode 的大小 (block 为 1, 2, 4K，inode 为 128 bytes)，filesystem 的挂载时间、最近一次写入数据的时间、最近一次检验磁盘 (fsck) 的时间等文件系统的相关信息，
一个 valid bit 数值，若此文件系统已被挂载，则 valid bit 为 0 ，若未被挂载，则 valid bit 为 1 等信息。

对文件或者目录使用ls命令时，加上*-i*属性可以获得对应文件或者目录的inode号。而读写属性（rwx）后的数字则代表使用该inode的文件数目，
如对一个文件创建hard link (ln)，hard link文件共用原文件的inode号。所以删除原始文件不会影响硬链接文件，而如果是用*ln -s*创建的soft link，
则新文件和原始文件的inode号是不一致的，新文件只是原始文件的快捷方式，删除原始文件后，软链接文件将无法访问。



### 内存交换空间swap[>](http://cn.linux.vbird.org/linux_basic/0230filesystem.php#swap)
swap 的功能就是在应付物理内存不足的情况下所造成的内存延伸记录的功能。
一般来说，如果硬件的配备足够的话，那么 swap 应该不会被我们的系统所使用到，swap会被利用到的时刻通常就是物理内存不足的情况了。
我们知道CPU所读取的数据都来自于内存，那当内存不足的时候，为了让后续的程序可以顺利的运行，因此在内存中暂不使用的程序与数据就会被挪到swap中了。
此时内存就会空出来给需要运行的程序加载。由于swap是用硬盘来暂时放置内存中的信息，所以用到swap时，你的主机硬盘灯就会开始闪个不停！
另外，有某些程序在运行时，本来就会利用swap的特性来存放一些数据段，所以，swap来是需要创建的！只是不需要太大！

#### 使用实体分区创建swap
{:.no_toc}
- 使用fdisk对含有未分配完的磁盘分割新分区，如对/dev/sdb

```
    fdisk /dev/hdb
    Command (m for help): n       #新建分区
    Command (m for help): p       #打印分区列表
    Command (m for help): t       #修改系统 ID, 改成swap的ID: 82
    Command (m for help): p       #打印查看分区列表
    Command (m for help): w       #保存修改
    partprobe                     #让核心升级 partition table
```

- 创建swap格式

```
    mkswap /dev/hdb7              #假设先前新建分区设备号为hdb7
```

- 观察与加载swap

```
    free                          #查看物理内存和swap使用情况
    swapon /dev/hdb7              #enable swap 
    swapon -s                     #列出使用的swap分区
```

#### 使用文件创建swap
{:.no_toc}
如果是在实体分割槽无法支持的环境下，可以用 dd 去建置一个大文件，然后再设为swap格式。

```
    dd if=/dev/zero of=/tmp/swap bs=1M count=128   #使用dd新增一个128MB的文件在 /tmp 底下
    mkswap /tmp/swap                               #使用mkswap将/tmp/swap这个文件格式化为swap的文件格式
    swapon /tmp/swap                               #使用swapon启动/tmp/swap
    swapoff /tmp/swap                              #使用swapoff关掉/tmp/swap
```


### 文件与文件系统的压缩与打包[>](http://cn.linux.vbird.org/linux_basic/0240tarcompress.php)
#### Linux 系统常见的压缩命令
{:.no_toc}
Linux 支持的压缩命令非常多，且不同的命令所用的压缩技术并不相同，当然彼此之间可能就无法互通压缩/解压缩文件。

- *.Z         compress 程序压缩的文件,已经退流行了
- *.gz        gzip 程序压缩的文件
- *.bz2       bzip2 程序压缩的文件
- *.tar       tar 程序打包的数据，并没有压缩过
- *.tar.gz    tar 程序打包的文件，其中并且经过 gzip 的压缩
- *.tar.bz2   tar 程序打包的文件，其中并且经过 bzip2 的压缩，压缩比相对最好

#### 压缩解压命令:tar
{:.no_toc}
tar可以将多个目录或文件打包成一个大文件，同时还可以透过gzip/bzip2的支持，将该文件同时进行压缩！
通过man page可以查看tar的用法，下面给出了常见参数列表：

```
    -f    # 后面要立刻接要被处理的档名！建议 -f 单独写一个选项

    -v    #verbose, 在压缩/解压缩的过程中，将正在处理的档名显示出来
    -c    #创建打包文件，可搭配 -v 来察看过程中被打包的档名(filename)
    -t    #查看打包文件的内容含有哪些文件
    -x    #解打包或解压缩的功能，可以搭配 -C 在特定目录解开(tar -xv -f /root/etc.tar -C /tmp)
    -C    #后接目录，即解压缩文件的存储位置

    -j    #透过 bzip2 的支持进行压缩/解压缩：此时档名最好为 *.tar.bz2
    -z    #透过 gzip  的支持进行压缩/解压缩：此时档名最好为 *.tar.gz

    -p    #保留备份数据的原本权限与属性，常用于备份(-c)重要的配置参数
    -P    #保留绝对路径，亦即允许备份数据中含有根目录存在之意 (Path),保留根目录，解压时可能不安全
    --exclude=FILE   #在压缩的过程中，不要将 FILE 打包
```

完整命令模式如下(以*tar.bz2为例，若为*tar.gz，用z替换j；若为*.tar文件则直接舍去j)：

```
    tar -jcv -f filename.tar.bz2 要被压缩的文件或目录名称                          #压　缩
    tar -jtv -f filename.tar.bz2                                              #查　询
    tar -jxv -f filename.tar.bz2 -C 欲解压缩的目录                               #解压缩
    tar -jxv -f filename.tar.bz2 欲解压文件完整名称                              #解压缩,-t先查看
    #如若需仅打包/etc下比/etc/passwd更新的文件，可以使用 ll /et/passwd，查看其最后修改时间，然后使用如下命令
    tar -jcv -f /root/etc.newer.then.passwd.tar.bz2 --newer-mtime="2016/12/07" /etc/*   #仅将/etc下在指定时间后有改动的文件打包
```


### 完整备份工具:dump[>](http://cn.linux.vbird.org/linux_basic/0240tarcompress.php#dump_restore)
