---
title: Bash Command Collection
layout: post
guid: urn:uuid:3d34f473-8323-448e-8cf1-2defa535c67d
summary: This post is used to note some efficient linux commands in my work.
categories:
  - unix
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
    sed 's/[Nn]ick/John/g' report.txt
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
    sed '1~3d' file.txt                                 # delete every third line, starting with the first
    sed -n '2~5p' file.txt                              # print every 5th line starting with the second
    sed 's/^[^,]*,/9999,/' file.csv                     # change first field to 9999 in a CSV file
    sed -r "s/\<(reg|exp)[a-z]+/\U&/g"                  # convert any word starting with reg or exp to uppercase
    sed '1,20 s/Johnson/White/g' file.txt               # do replacement on lines between 1 and 20
    sed '1,20 !s/Johnson/White/g' file.txt              # the reverse of above
    #Replace a string in multiple files 
    sed -i 's/foo/bar/g' *.dat  #subsititue all the occurence of foo with bar in all the lines of all files with postfix .dat
    #Recursive, regular files in this and all subdirectories
    find . -type f -name "*baz*" -exec sed -i 's/foo/bar/g' {} +
```
- Working with Gnuplot, used to plot every n column
```
    # plot the tenth column with the first as x-axis, from the 0 row and
    # plot it every n rows
    plot 'filNname' u 1:10
    plot "<(sed -n '0~np' fileName)" u 1:10
```
- Working with Gnuplot, to automatically add new data for multiple plots
```
    #!/bin/bash
    
    # filename: sed4Gnuplot.sh
    # find $2 in $1, if found
    # duplicate it, and replace $2 with $3 in the new line
    
    #sed -i '/Bihar/p 
    #    s/^Bihar/Beihai/' $1
    
    if [ $# != 3 ]; then 
      echo "You should give me three parameters"
      echo "#1 the file to be processed"
      echo "#2 the original word to be replaced"
      echo "#3 the new word"
      exit 1
    fi
    
    sed -i "/$2/p 
    s/$2/$3/" $1
```

### awk
*awk* ia an abbreviation of Aho, Weinberger and Kernighan (Brian Kernighan), the authors of the language.

*awk* is a utility/language designed for data extraction. Just as sed, awk reads one line at a time, performs some action depending on the condition you 
give it and outputs the result. One of the most simple and popular uses of awk is selecting a column from a text file or other command's output. 

```
    dpkg -l | awk ' {print $2} ' > installed            # get all installed software
    dpkg -l | awk ' /'vim'/ {print $2} '                # all installed software related to vim
```
The action to be performed by *awk* is enclosed in braces, and the whole command is quoted. But the syntax is $$awk ' condition { action }'  } '$$.

- Basic Usages[>](https://linuxconfig.org/learning-linux-commands-awk)
```
    awk ' {print $1,$3} '                               # print only first and thrid columns
    awk ' /'pattern'/ {print $2} '                      # print only elements from column 2 that match pattern using stdin
    awk -f script.awk inputfile                         # uses -f to get its' instructions from a file
    awk ' program ' inputfile                           # execute program using data from inputfile
    awk "BEGIN { print \"Hello, world!!\" }"            # classic "Hello, world" in awk
    awk -F "" 'program' files                           # define the FS (field separator) as null, as opposed to white space, the default
    awk -F "regex" 'program' files                      # FS can also be a regular expression
    awk -F: '{ print $1 }' /etc/passwd | sort           # print sorted list of login names
    awk 'END { print NR }' inputfile                    # print number of lines in a file, as NR stands for Number of Rows
    ls -l | awk '$6 == "Nov" { sum += $5 }              # prints the total number of bytes of files that were last modified in November
    END { print sum }'
```
- Working with Gnuplot, used to plot lines satisfied prescribed conditions
```
    # multiple filter conditions can be insert into the if condition
    # and put the target columns after the print
    plot 'Geometricparameters.txt' u ($1/10.0):10
    plot "< awk '{if ($1>2.0 && $10>0.153) print ($1/10.0), $10 }' ./GeometricParameters.txt "
```


### find
```
    #Recursive, regular files in this and all subdirectories
    find . -type f -name "*baz*" -exec sed -i 's/foo/bar/g' {} +
    #chmod recursively all the directories or files
    find /path/to/base/dir -type d -exec chmod 755 {} \;    #To recursively give directories read&execute privileges
    find /path/to/base/dir -type f -exec chmod 644 {} \;    #To recursively give files read privileges
    find . -name 'RUN.*.err' -type f -exec grep -H 'skylake' {} \;  # look skylake in all files RUN.*.err
    #delete recursively
    find . -name "*.ser" -type f              # find file end with .ser
    find . -name "*.ser" -type f -delete      # delete recursively files end with .ser
    find . -name "wall" -type d -exec rm -r "{}" \;    # delete recursively folders with name wall
```


### rsync
```
    #copy files except certain extentions
    rsync -urav --include='*.vtk' --exclude='*.ser' sourceDir targetDir       #local copy, -r recursive, -a archive (mostly all files), -v verbose, -u update (only new file)
    rsync -urav --delete --include='*.vtk' --exclude='*.ser' sourceDir targetDir       #--delete, clear extra files in targetDir
    rsync -uravh -e ssh --include='*.vtk' --include='*.txt' --exclude='*.ser' server:/Full/Sourcedir targetdir   #remote copy with ssh, -e specify ssh, -h human readable unit
```
