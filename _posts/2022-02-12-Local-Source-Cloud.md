---
title: 使用本地源
layout: post
guid: urn:uuid:20c60e21-056a-4905-9761-7b64e4271620
categories:
  - notes
tags:
  - Ubuntu
  - pip
---

> 回到国内发现Ubuntu系统下软件下载安装速度很慢，需要更改使用本地源。


### Ubuntu
[阿里云官方](https://developer.aliyun.com/mirror/)上有[Ubuntu镜像配置方法](https://developer.aliyun.com/mirror/ubuntu?spm=a2c6h.13651102.0.0.3e221b11wRYlzW)，
选择对应的版本即可，如对于20.04，只需将如下语句加入到*/etc/apt/sources.list*文件中
```
    deb http://mirrors.aliyun.com/ubuntu/ focal main restricted universe multiverse
    deb-src http://mirrors.aliyun.com/ubuntu/ focal main restricted universe multiverse
    
    deb http://mirrors.aliyun.com/ubuntu/ focal-security main restricted universe multiverse
    deb-src http://mirrors.aliyun.com/ubuntu/ focal-security main restricted universe multiverse
    
    deb http://mirrors.aliyun.com/ubuntu/ focal-updates main restricted universe multiverse
    deb-src http://mirrors.aliyun.com/ubuntu/ focal-updates main restricted universe multiverse
    
    deb http://mirrors.aliyun.com/ubuntu/ focal-proposed main restricted universe multiverse
    deb-src http://mirrors.aliyun.com/ubuntu/ focal-proposed main restricted universe multiverse
    
    deb http://mirrors.aliyun.com/ubuntu/ focal-backports main restricted universe multiverse
    deb-src http://mirrors.aliyun.com/ubuntu/ focal-backports main restricted universe multiverse
```

### Pip

因为使用pyenv管理多个版本，目前仅使用临时加速方法，如需安装*numpy*，只需

```
    pip install -i [local source] numpy
    # 如清华镜像源
    pip install -i https://pypi.tuna.tsinghua.edu.cn/simple numpy
```

可选的本地镜像有
```
    清华：https://pypi.tuna.tsinghua.edu.cn/simple
    阿里云：http://mirrors.aliyun.com/pypi/simple/
    中国科技大学 https://pypi.mirrors.ustc.edu.cn/simple/
    华中理工大学：http://pypi.hustunique.com/
    山东理工大学：http://pypi.sdutlinux.org/ 
    豆瓣：http://pypi.douban.com/simple/
```
