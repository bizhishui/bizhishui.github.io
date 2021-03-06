---
title: Make Video From Data
layout: post
guid: urn:uuid:9a37106e-762d-4647-b2d9-9f57271b253b
categories:
  - notes
tags:
  - Video
  - Gnuplot
  - Ffmpeg
---


> In this post, a method to generate movie from numerical simulation data is introduced.


---

### Prepare your data
It's better to name your data in ordered sequence, like *Pos_000000000.dat*, *Pos_000005000.dat*,
*Pos_000010000.dat*,*Pos_000015000.dat* etc.

### Generate figure use Gnuplot
Gnuplot is powerful tool for generating figure with curve from scientific simulation data. Here is an example
for using Gnuplot:

```
    #filename: xyline.gp
    #set terminal postscript eps color enhanced font "Times-Roman" 20
    #set output "filename.eps"
    set terminal png size 2400,1800 enhanced font 'Times-Roman,14'
    set output 'filename.png'
    
    set title 'microorganism locomotion'
    set xlabel 'x'
    set ylabel 'y' rotate by 90
    set xrange[-1.2:1]
    set yrange[-1:1]
    plot filename using 1:2 notitle with points pt 5 axes x1y1
```

On linux, using the following shell can generate a list of figure:

```
    #!/bin/bash
    
    #filename: plotFig.sh
    for s in $@; do
        echo $s
        gnuplot -e "filename='$s'" xyline.gp
        filename2="${s/dat/png}"
        mv filename.png $filename2
    done
```

For example, in the same directory of you data, use

```
    bash plotFig ./POS_*.dat
```

will create a list of figure with the corresponding name of your data.

### Make video from figures
Now we can create our video with [ffmpeg](https://ffmpeg.org/). 

> FFmpeg is a complete, cross-platform solution to record, convert and stream audio and video.

Here we can use the following script to record our video:

```
    #!/bin/bash
    
    #filename: makeVideo.sh
    if [ $# -eq 1 ]; then
        ffmpeg -framerate $1 -pattern_type glob -i '*.png' -c:v libx264 -pix_fmt yuv420p microorganism.mp4
    else
        echo "This script need ONE parameter:"
        echo "    -: the frame rate,"
        exit 1
    fi
```
