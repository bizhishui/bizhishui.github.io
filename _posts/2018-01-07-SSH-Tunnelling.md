---
title: SSH隧道
layout: post
guid: urn:uuid:9a7d982b-bd5e-47a0-8883-5596cf148e86
summary: SSH会自动加密和解密所有SSH客户端与服务端之间的网络数据。其实，SSH还同时提供了一个非常有用的功能，这就是端口转发。它能够将其他TCP端口的网络数据通过SSH链接来转发，并且自动提供了相应的加密及解密服务，这一过程有时也被叫做“隧道”（tunneling）。
update_date: 2018-04-18
categories:
  - unix
tags:
  - SSH
  - Tunneling
---

> 偶然看到利用SSH隧道技术翻墙的博文，相比熟知的VPN，它免费而且容易建立。受限于条件，并未完全实验，只是觉得有意思mark一下。
> 主要参考[pchou](http://www.pchou.info/linux/2015/11/01/ssh-tunnel.html)和[IBM开发者文章](https://www.ibm.com/developerworks/cn/linux/l-cn-sshforward/)。

SSH的两大功能：

1. 加密SSH Client端至SSH Server端之间的通讯数据
2. 突破防火墙的限制完成一些之前无法建立的[TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol)连接

第一点很常用（比如Git），~~本文主要针对第后者~~。

### 端口转发

SSH 会自动加密和解密所有SSH客户端与服务端之间的网络数据。但是，SSH还同时提供了一个非常有用的功能，这就是端口转发。它能够将其他TCP端口的网络数据通过SSH链接来转发，
并且自动提供了相应的加密及解密服务。这一过程有时也被叫做“隧道”（tunneling），这是因为SSH为其他TCP链接提供了一个安全的通道来进行传输而得名。例如，Telnet，SMTP，LDAP 这些 
TCP应用均能够从中得益，避免了用户名，密码以及隐私信息的明文传输。而与此同时，如果您工作环境中的防火墙限制了一些网络端口的使用，但是允许SSH的连接，那么也是能够通过将TCP 
端口转发来使用SSH进行通讯。使用端口转发之后，TCP端口可以不直接通讯，而是分别转发到SSH客服端和服务端来通讯，从而自动实现了数据加密同时*绕过了防火墙的限制*。


### 动态转发

端口转发有本地转发、远程转发和动态转发等常见的几种。动态转发可以实现SOCKS代理从而加密以及突破防火墙对Web浏览的限制。
对于本地端口转发和远程端口转发，都存在两个一一对应的端口，分别位于SSH的客户端和服务端，而动态端口转发则只是绑定了一个本地端口，而目标地址:目标端口则是不固定的。
目标地址:目标端口是由发起的请求决定的，比如，请求地址为192.168.1.100:3000，则通过SSH转发的请求地址也是192.168.1.100:3000。
其命令为：
```
    ssh -D <local IP><local port> <SSH Server>      # 在本地主机A1登陆远程云主机B1，并进行动态端口转发
    ssh -D localhost:7001 username@remote-host      # 7001端口作为本地SOCKS的监听端口，1024~65535空闲端口均可
```


### Web浏览器SOCKS代理设置

只需在浏览器或者其他应用程序上设置SOCKS代理(设置v4的SOCKS就可以了，v5的SOCKS增加了鉴权功能)，代理指向127.0.0.1，端口7001即可，这样免费的翻墙就做好了。

### 通过端口连接访问服务器(补充)[>](http://whoochee.blogspot.fr/2012/07/scp-via-ssh-tunnel.html)
假设我们想从远程机器R拷贝文件bar，但是必须通过gateway machine G访问，此时必须用ssh端口转发拷贝至本地机器。
First we set the forwarding port, you could pick any valid number, instead of 1234 here:
```
    ssh -L 1234:R_address:22  G_username@G_address
    ssh -L 1234:scylla.etu.ec-m.fr:22  jlyu@sas1.ec-m.fr
```
Secondly, check our localhost address to find the local host address:
```
    cat /etc/hosts
    # The output should have something like:
    127.0.0.1       localhosts
```
Lastly, to scp file, we use the above port ON localhost (not the remote machine R) and the user name on remote machine R:
```
    scp -P 1234 R_username@127.0.0.1:/path/bar ./
```

#### Using rsync[>](https://stackoverflow.com/questions/16654751/rsync-through-ssh-tunnel)
```
    #first connect to the remote server TO open a port
    ssh -L 1234:scylla.etu.ec-m.fr:22  jlyu@sas1.ec-m.fr
    #and then sync your files
    rsync -ravh -e "ssh -p 1234" jlyu@127.0.0.1:/remote/path2files /local/path2saveFiles/ 
```
