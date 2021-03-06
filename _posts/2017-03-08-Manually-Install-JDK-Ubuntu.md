---
title: Manually Install JDK on Ubuntu
layout: post
guid: urn:uuid:e885116f-02ba-489b-a5ac-1aa103b065d7
categories:
  - notes
tags:
  - Java
  - JDK
  - Ubuntu
---
> This blog adapted from [DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-manually-install-oracle-java-on-a-debian-or-ubuntu-vps), aims to 
> insatll manually Oracle Java Development Kit on Ubuntu.

### JRE or JDK
**JRE**: Java Runtime Environment. It is basically the Java Virtual Machine where your Java programs run on. It also includes browser plugins for Applet execution.  
**JDK**: It's the full featured Software Development Kit for Java, including JRE, and the compilers and tools (like JavaDoc, and Java Debugger) to create and compile programs.  

Usually, when you only care about running Java programs on your browser or computer you will only install JRE. It's all you need. On the other hand, if you are planning to do some Java programming, you will also need JDK.  
Sometimes, even though you are not planning to do any Java Development on a computer, you still need the JDK installed. For example, if you are deploying a WebApp with JSP, 
you are technically just running Java Programs inside the application server. Why would you need JDK then? Because application server will convert JSP into Servlets and use JDK to compile the servlets.

### Installing Oracle JDK
Assuming the Ubuntu 16.04 is installed on 64bit machine. The latest version can be found at [Oracle Java SE (Standard Edition) website](http://www.oracle.com/technetwork/java/javase/downloads/index.html).

The /opt directory is reserved for all the software and add-on packages that are not part of the default installation. Create a directory for your JDK installation:

```
    sudo mkdir /opt/jdk
```

and extract java into the /opt/jdk directory:

```
    sudo tar -zxvf jdk-8u121-linux-x64.tar.gz -C /opt/jdk
```

### Setting Oracle JDK as the default JVM
In our case, the java executable is located under */opt/jdk/jdk1.8.0_121/bin*. To set it as the default JVM in your machine run:

```
    sudo update-alternatives --install /usr/bin/java java /opt/jdk/jdk1.8.0_05/bin/java 100
    #add the following line to PATH in ~/.bashrc
    export PATH=/opt/jdk/jdk1.8.0_121/bin:$PATH
```

To verify your installation:

```
    update-alternatives --display java
    java -version
```

### Updating Java
To update Java, simply download an updated version from Oracle's website and extract it under the */opt/jdk* directory, then set it up as the default JVM with a higher priority number (in this case 110):

```
    update-alternatives --install /usr/bin/java java /opt/jdk/jdk.new.version/bin/java 110

    update-alternatives --remove java /opt/jdk/jdk.old.version/bin/java      #delete the old version if you want
    rm -rf /opt/jdk/jdk.old.version
```
