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
