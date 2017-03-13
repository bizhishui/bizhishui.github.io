---
title: Gnuplot Notes
layout: post
guid: urn:uuid:4b18a969-a0cb-4012-b289-a79b98118e47
categories:
  - notes
tags:
  - Gnuplot
  - awk
---

> This blog notes some points encountered in using Gnuplot.


### Plot row with awk
By default, gnuplot plots one or more columns from a file with the corresponding column number. But how can plot some rows of a given data file?
Maybe  the using of *awk* to produce a temporary file for Gnuplot is a choice. For example we have a file with records as below,

```
    #beta - Ca
    #        0.05    0.1     0.2     0.3     0.5
    0.5    1.7997   1.7997  1.7997  1.7997  1.7997 
    0.6    1.6876   1.6876  1.6954  1.706   1.7311 
    0.7    1.5629   1.5712  1.5964  1.6294  1.6966 
    0.8    1.4222   1.4548  1.5311  1.6013  1.7022 
    0.9    1.3039   1.3937  1.5247  1.6099  1.7041 
    1.0    1.2762   1.3944  1.5326  1.6099  1.7029 
    1.1    1.2833   1.4012  1.5311  1.6099  1.7038 
    1.2    1.2856   1.4005  1.5319  1.6096  1.7035 
    1.3    1.2852   1.4002   
    1.4    1.2857   1.4006  1.5316  1.6104  1.7035
```

With `plot 'filename' u 1:2` in the interactive mode of Gnuplot, a curve (show the second column based on first column) is generated. 
But it seems there are not a way for Gnuplot to plot two rows (2 and 6 for example) directly.

For example, we want to plot the second and sixth row (start from the second column), namely
```
    #        0.05    0.1     0.2     0.3     0.5       
    0.8    1.4222   1.4548  1.5311  1.6013  1.7022      #from the second column
```

We can substract these rows and print it in a file by column with the following [awk script](http://www.thegeekstuff.com/sed-awk-101-hacks-ebook/)

```
    #filename: subrow.awk
    #invoke command: gawk -v pL=6 -f subrow.awk filename >> out.data
    BEGIN {}    #not used in this script, just want show a full awk script example

    {
        if (NR==int(pL)) {              #pL is a parameter from command line
            for (i=2;i<=NF;i++) {       #nb of field in current stream (line), see: Sed and awk 101 hacks
                print $i
            }
        }
    }

    END {}
```

We can then edit the output result file with *Vim* in *visual mode* to move the sixth row's result at the right of second row.

### Basic Usages

```
    #set logarithmic axis label, use with set logscale x 10
    set format x "10^{\%L}"        #do not need blakslash \
    #Datted (Gnuplot 5) black (-1) lines
    with lines lt -1 dashtype '...'
    #Greek
    set xlabel '{/Symbol b}'
    #set special x range for a curve
    plot [0.1:2] 1/x**2
    #plot line graphs with different x-range in one-figure
    #suppose we have two columns (x,f(x), where 0<x<20, with the following scripts can manipulate with corrected range
    f(value, left, right) = (value < left || value > right ? 1/0 : value)
    plot 'input.dat' using (f($1, 3, 7)):2, 'input.dat' using (f($1, 5, 9)):2
```

