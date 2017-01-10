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


> Reproduced from **PzNotes** [CentOS 7 安装及配置](https://whu-pzhang.github.io/linux-environment-for-seismology-research.html).

---

本文主要记录CentOS 7 以及一些基本软件的安装。

### 安装CentOS 7
由于个人水平有限，本文安装的是CentOS 7 的桌面版。

#### 准备安装盘   
1. 下载[CentOS 7 Everything ISO](https://github.com/bizhishui/bizhishui.github.io)，容量约为8G，故应至少准备一个16G U盘。
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
2. 创建root密码以及普通用户
3. 等待安装完成重启即可
