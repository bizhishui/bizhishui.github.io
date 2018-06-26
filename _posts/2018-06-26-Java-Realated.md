---
title: Java Realated
layout: post
guid: urn:uuid:fbe03ea1-ec73-4433-ba6a-e3070b3895de
summary: Notes on using Java in command line and calling external libs
categories:
  - notes
tags:
  - Linux
  - Java
---

### java.lang.ClassNotFoundException or java.lang.NoClassDefFoundError
This usually means the class which you are trying to run was no found in the *classpath*.
You need to add the class or .jar file which contains this class into the java *classpath**. 
For example, when you are runing a single java class from the command line, you need add the dot (.).
```
    java -cp . YourSingleClass
    #if runing a class from a jar file
    java org.somepackage.SomeClass -cp myJarWithSomeClass.jar
```

#### PATH and CLASSPATH in Java[>](http://www.java67.com/2012/08/what-is-path-and-classpath-in-java-difference.html)
The main difference between *PATH* and *CLASSPATH* is that *PATH* is an environment variable which is used to locate JDK binaries like "java" or "javac" 
command used to run java program and compile java source file. On the other hand, *CLASSPATH*, an environment variable is used by System or 
Application ClassLoader to locate and load compile Java bytecodes stored in the .class file.


### Build and run eclipse java projects from the command line
