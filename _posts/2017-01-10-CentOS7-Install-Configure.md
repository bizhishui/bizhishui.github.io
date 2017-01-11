---
title: CentOS7 Install & Configure
layout: post
guid: urn:uuid:a3cb476c-cd15-47f2-86e4-814a299a95fe
categories:
  - notes
tags:
  - Linux
  - CentOS 7
---


> Reproduced from **PzNotes** [CentOS 7 安装及配置](https://whu-pzhang.github.io/linux-environment-for-seismology-research.html).

---

本文主要记录CentOS 7 以及一些基本软件的安装。

### 安装CentOS 7
由于个人水平有限，本文安装的是CentOS 7 的桌面版。

#### 准备安装盘   
1. 下载[CentOS 7 Everything ISO](https://github.com/bizhishui/bizhishui.github.io)，大小约为8G，故应至少准备一个16G U盘。
2. 使用[dd刻录U盘启动盘](https://wiki.centos.org/HowTos/InstallFromUSBkey)，Linux下命令为:   

```
    dd if=full/path/to/CentOS.iso of=/dev/sdb    
```    

Mac下命令为：  

```
    dd if=full/path/to/CentOS.iso of=/dev/diskabc    
```      

`abc`可由`df -h`命令查看并确定。  
3. 将刻录好的启动盘插入电脑，重启电脑并从U盘启动。

#### CentOS 7 安装   
1. 按照提示一步一步安装，唯一需要特别注意的是安装盘的分区。选择好安装硬盘后，
在“Other Storage Options”处选择“I will configure partioning”，即手动分区       
    - 点击 “Click here to create them automatically”，即让安装程序帮忙分区   
    - 自动分区完成后，再根据自己的需求，手动修改分区细节    
        + `/boot`：CentOS 自动分配，一定不要乱改；   
        + `/`：根目录，合理使用并及时清理的话15G就够了，不过建议30G以上；   
        + `swap`：与物理内存大小一致即可;    
        + `/opt`：个人习惯是将第三方软件都安装在/opt下，硬盘够大可以多分点（70G）；   
        + `/home`：余下的全部空间。   
    - 点击 “Begin to Install” 开始安装
2. 创建root密码以及普通用户(并将其加入到Administrator group中，当然也可最后在`\etc\sudoers`文件中修改)
3. 等待安装完成重启即可

#### CentOS 7 软件源配置   
CentOS 由于很追求稳定性，所以官方源中自带的软件不多，因而需要一些第三方源，比如 EPEL、ATrpms、ELRepo、Nux Dextop、RepoForge 等。根据上面提到的软件安装原则，为了尽 可能保证系统的稳定性，此处大型第三方源只添加 EPEL 源、Nux Dextop 和 ELRepo 源。

##### EPEL
[EPEL](https://fedoraproject.org/wiki/EPEL)即 Extra Packages for Enterprise Linux， 为 CentOS 提供了额外的 10000 多个软件包，而且在不替换系统组件方面下了很多功夫，因而可以放心使用。    

```
    sudo yum install epel-release
```

执行完该命令后，在 `/etc/yum.repos.d` 目录下会多一个 `epel.repo` 文件。      

##### Nux Dextop    
[Nux Dextop](http://li.nux.ro/repos.html)中包含了一些与多媒体相关的软件包，作者尽量 保证不覆盖 base 源。官方说明中说该源与 EPEL 兼容，实际上个别软件包存在冲突，但基本不会造成影响:    

```
    sudo rpm -Uvh http://li.nux.ro/download/nux/dextop/el7/x86_64/nux-dextop-release-0-5.el7.nux.noarch.rpm
```

完成该命令后，在 `/etc/yum.repos.d` 目录下会多一个 `nux-dextop.repo` 文件。    

##### ELRepo
[ELRepo](http://elrepo.org/tiki/tiki-index.php)包含了一些硬件相关的驱动程序，比如显卡、声卡驱动:    

```
    sudo rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org       

    sudo rpm -Uvh http://www.elrepo.org/elrepo-release-7.0-2.el7.elrepo.noarch.rpm
```

完成该命令后，在 `/etc/yum.repos.d` 目录下会多一个 `elrepo.repo` 文件。      

##### 安装 yum-axelget
[yum-axelget](https://github.com/crook/yum-axelget)是 EPEL 提供的一个 yum 插件。使用该插件后用 yum 安装软件时可以并行下载，大大提高了软件的下载速度，减少了下载的等待时间:

```
    sudo yum install yum-axelget
```

安装该插件的同时会安装另一个软件 `axel`。`axel` 是一个并行下载工具，在下载 `http`、`ftp` 等简单协议的文件时非常好用.安装完后再使用`sudo yum install **` 会报错，根据提示需要将`axelget`一文件中的两处[`conduct`改为`conduit`](https://github.com/crook/yum-axelget/pull/8).

##### 第一次全面更新系统

在进一步操作之前，先把已经安装的软件包都升级到最新版:

```
    sudo yum update
```

更新完后应重启系统。

#### 中文输入法
刚安装的系统可能是没有中文输入法的，源中带的中文输入法应该是 ibus，使用效果一般。

```
    sudo yum install "@Chinese Support"

    sudo yum install ibus ibus-libpinyin

    sudo yum install libpinyin
```

然后在区域键盘中选择汉语拼音。

#### 基础开发环境
1. GCC系列    

```
    sudo yum install gcc gcc-c++ gcc-gfortran
```
2. 软件开发辅助工具    

```
    sudo yum install make gdb cmake git tig git-svn
```
3. NTFS 驱动    

```
    sudo yum install ntfs-3g
```
4. Java 环境及Eclipse     

```
    sudo yum install java                 # java 运行环境
```

但若是要编写java项目，可以[安装最新的jre和jdk](https://argcv.com/articles/3155.c)。从[Oracle](http://www.oracle.com/technetwork/java/javase/downloads/index.html)可以下载最新jdk和jre。

```
    sudo yum localinstall jdk[jre]-[version]-linux-x64.rpm -y
```

安装完后可继续安装[Eclipse IDE for Java Developers](http://www.eclipse.org/downloads/eclipse-packages/)。[主要步骤为](https://linux.cn/article-4631-1.html):    
- 下载最新的Eclipse    
- 将其解压到`\opt`目录下    

```
    sudo tar -zxvf eclipse-java-[version]]-x86_64.tar.gz -C /opt     
```    
- 创建命令行启动链接    

```
    ln -s /opt/eclipse/eclipse /usr/bin/eclipse    
```    
- 创建Gnome快捷菜单启动    

```
    sudo vi /usr/share/applications/eclipse.desktop    
```    
添加如下代码：    

```
    [Desktop Entry]     

    Encoding=UTF-8    

    Name=Eclipse [version number]     

    Comment=Eclipse [name]    

    Exec=/usr/bin/eclipse    

    Icon=/opt/eclipse/icon.xpm    

    Categories=Application;Development;Java;IDE    

    Version=1.0    

    Type=Application    

    Terminal=0    
```

- 分别从快捷图标和命令行启动Eclipse，检查安装结果

#### 后处理软件安装
1. Paraview
2. Gnuplot

#### Editors
1. Vim
2. Markdown+[Atom](https://atom.io/)

#### 日常软件
0. Tex Live 2016
1. Gimp
2. Inkscape
3. Okular
4. Google Chrome browser
5. 解压软件
6. Dropbox
