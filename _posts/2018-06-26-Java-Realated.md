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
A elispse project has a structure as follows:
[![codeTree](/media/files/2018/06/26/codeTree.png)](https://github.com/bizhishui/bizhishui.github.io/blob/master/ "code tree")

the java codes are locate in src which contains many sub-directories. Here are some commands to building and runing an application on command line
```
    #clean all old class
    find ./bin/ -name "*.class" -type f -delete
    #compile a .java file and put it in bin 
    javac -d bin -cp "./src/:/the/path/to/your/external/jars/*" src/test/A.java
    #on some plateforme, you may need to specify the encoding
    javac -encoding UTF-8 -d bin -cp "./src/:/the/path/to/your/external/jars/*" src/test/A.java
    #runing A on cluster
    java -Xss512m -Xms1G -Xmx16G -Djava.library.path="/full/path/to/jars/" -cp "./bin/:/full/path/to/jars/*" test.A -r ../inputFile.txt
    #or run outside the source directory
    java -Xss512m -Xms1G -Xmx16G -Djava.library.path="/full/path/to/jars/" -cp "./full/path/to/project/root/directory/bin/:/home/jlv/Soft/CellInTube/SoftJohn_lib/*" test.A -r ./inputFile.txt
```

### Use [Intel® MKL](https://software.intel.com/en-us/articles/using-intel-mkl-in-math-intensive-java-applications-on-intel-xeon-phi) with Java
The intel post gives a detail description on how to use *Intel MKL* with Java. Here, the steps are restated with my project,

#### 1. Create a java file with lapack dgetrf description (LAPACK.java)
Compile the LAPACK.java (locates in *./src/externalLibraries/*) using the java compiler as below:
```
    #at the root directory of the project (same with the following commands, unless otherwise stated)
    javac -encoding UTF-8 -d bin src/externalLibraries/LAPACK.java
```

#### 2. Generate headers files from the java class file
The header should be used in C file in the next step
```
    javah -d ./src/externalLibraries/ -cp ./bin/ externalLibraries.LAPACK
```
This will produce *externalLibraries_LAPACK.h* under the directory *./src/externalLibraries/* .

#### 3. Create the C file LAPACK.c
Use definition of *Java_externalLibraries_LAPACK_dgetrf* in header *externalLibraries_LAPACK.h* that was generated in step 2 to write file *LAPACK.c*, and
put it in the same directory as the header file.
**Mkae sure the function name in LAPACK.c is the same as that in the header file externalLibraries_LAPACK.h** .

#### 4. Compiler the C file to generate a dynamic library
```
    #this command should run at the directory locates the C and header file
    icc -shared -fPIC -o ./liblapack.so LAPACK.c -I./ -I$JAVA_HOME/include/ -I$JAVA_HOME/include/linux/ -I$MKLROOT/include/ -lmkl_intel_lp64 -lmkl_core -lmkl_intel_thread -liomp5 -lmkl_def -lc -ldl -qopenmp -lpthread
```
*JAVA_HOME* is the directory where you *JDK* is installed, this command will need *jni.h* and *jni_md.h*. *MKLROOT* is the install directory of intel's MKL.
A dynamic library *liblapck.so* is produeced, and can be linded by the Java code.
