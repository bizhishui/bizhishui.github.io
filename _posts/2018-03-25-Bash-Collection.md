---
title: Bash Command Collection
layout: post
guid: urn:uuid:3d34f473-8323-448e-8cf1-2defa535c67d
summary: This post is used to note some efficient linux commands in my work.
categories:
  - linux
tags:
  - Linux
  - Bash
---


### sed
*sed* (Stream EDitor) takes the input text, does the specified operations on every line (line by line, unless otherwise specified) and prints the modified text. 
The specified operations can be append, insert, delete or substitute. 

The basic object of *sed* is the *lines*, it takes one single line and process on it ervery time.
- Basic usages[>](https://linuxconfig.org/learning-linux-commands-sed)
```
    # sed use stdout by default, use redirect to make change permanent
    sed 's/Nick/John/g' report.txt > report_new.txt     # replace every occurrence of Nick with John
    sed 's/^/    /' file.txt >file_new.txt              # add 4 spaces to the left of a text for pretty printing
    sed -n 12,18p file.txt                              # show only lines 12 to 18
    sed 12,18d file.txt                                 # show all lines except for lines from 12 to 18
    sed -f script.sed file.txt                          # write all commands in script.sed and execute them
    sed '5!s/ham/cheese/' file.txt                      # replace ham with cheese in file.txt except in the 5th line
    sed '$d' file.txt                                   # delete the last line
    sed '/[0-9]\{3\}/p' file.txt                        # print only lines with three consecutive digits
    sed '/boom/!s/aaa/bb/' file.txt                     # unless boom is found replace aaa with bb
    sed '17,/disk/d' file.txt                           # delete all lines from line 17 to line contains 'disk'
    sed "s/one/unos/I"                                  # replace one to unos insensitive
    sed 's/.$//' file.txt                               # a way to replace dos2unix
    sed 's/^[ ^t]*//' file.txt                          # delete all spaces in front of every line of file.txt
    sed 's/[ ^t]*$//' file.txt                          # delete all spaces at the end of every line of file.txt
    sed 's/^[ ^t]*//;s/[ ^]*$//' file.txt               # delete all spaces in front and at the end of every line
    sed '/baz/s/foo/bar/g' file.txt                     # only if line contains baz, substitute foo with bar
```
- Working with Gnuplot, used to plot every n column
```
    # plot the tenth column with the first as x-axis, from the 0 row and
    # plot it every n rows
    plot 'filNname' u 1:10
    plot "<(sed -n '0~np' fileName)" u 1:10
```

### awk
- Working with Gnuplot, used to plot lines satisfied prescribed conditions
```
    # multiple filter conditions can be insert into the if condition
    # and put the target columns after the print
    plot 'Geometricparameters.txt' u ($1/10.0):10
    plot "< awk '{if ($1>2.0 && $10>0.153) print ($1/10.0), $10 }' ./GeometricParameters.txt "
```
