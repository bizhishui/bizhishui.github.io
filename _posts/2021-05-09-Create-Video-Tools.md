---
title: Create Video with FFmpeg
layout: post
guid: urn:uuid:aa3e1498-dd63-4a33-88c5-12260315272d
categories:
  - nodes
tags:
  - video
  - FFmpeg
---


> This blog note show how to create a video from numerical simulation data.


---

### Sources and Tools

#### Sources

The basic sources are numerical simulation data, which include the time-series vtk files (each file represents the whole simulated system at a single fixed time) and 
an time augmentation file (a file where each line summarizes the basic geometric information of the system).

#### Tools

1. Paraview: import vtk files and export images
2. FFmpeg: create video from generated images
3. bash: formated data generation


### Basic steps

#### Use Paraview to get a time-series images for all vtk files
In paraview, choose *Save Animation* and 'png' (for example) as the exported *Files of type*,
paraview will automatically generate a series of images files.

#### Make the first video with ffmpeg
Suppose the images obatined from last step are saved with name like *figure_#####.png*, then you can make a video with these images as 
```
    ffmpeg -framerate 20 -i ./figure_%05d.png -c:v libx264 -profile:v high444 -refs 16 -crf 0 ./video_name.mp4
```

You may check your video size with 
```
    ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of default=nw=1 ./video_name.mp4
```
and you may get some outputs like this
```
    width=2127
    height=1195
```

If they size are not even, you may need crop it, otherwise you'll get error in following step when you want embed one video in another.
For this, you can just do
```
    ffmpeg -i ./video_name.mp4 -filter:v "crop=2126:1194:1:1" ./video_name_cropped.mp4
```

#### Prepare data for second video
Suppose the time augmentation file named *Geo.txt*, in which, each line summarizes some geometric information about the simulated system.
Now, we need to seperate this file to time-series files (like the vtks), where each file contains the information from start to this 
real time step. This can be done as
```
    #!/bin/bash

    # here 2126 is the total number of lines
    for i in {2..2116}; do
      let im1=i-1
      sed -n 2,${i}p Geo.txt  > "$(printf './trace_increment/trace_%05d.txt' "${im1}")"
    done
```

#### Make the second video
First, we will use *gnuplot* to convert each trace_#####.txt to png images, with the following main gnuplot script
```
    # gnuplot script, trace.gp

    set terminal png size 800,600 enhanced font 'Times-Roman,14'
    Xmax = 10000
    unset xtics
    unset ytics
    unset ztics
    unset xlabel
    unset ylabel
    unset zlabel
    set border 0
    set view 100,19
    set xrange [:Xmax*1.05]
    set yrange [-0.05:0.05]
    set zrange [-0.05:0.05]
    
    set parametric
    set iso 2,100
    set samp 1000
    set urange [0:Xmax*1.05]
    set vrange [0:2*pi]
    unset key
    # http://gnuplot.sourceforge.net/demo/pm3dcolors.html
    # https://stackoverflow.com/questions/12325410/gnuplot-line-opacity-transparency
    #set pm3d
    set pal gray negative
    
    set output 'filename.png'
    set label "d" at 1,0.3,-0.0 font ',50'
    set label "X" at 0,0.3,0.05 font ',45'
    splot u,0.0,0.0 notitle w l lt 8 dt 2 lw 3.0 , \
          filename u 2:3:4 notitle '' with l lt 1 dt 1 lc rgb "red" lw 4.0
```

and a bash script to call it
```
    #!/bin/bash
    # bash script, plotFig.sh

    for s in $@; do
        echo $s
        gnuplot -e "filename='$s'" trace.gp
        filename2="${s/txt/png}"
        mv filename.png $filename2
    done
```

And this video can be made by
```
    ./plotfig.sh trace_*.txt
    ffmpeg -framerate 20 -i ./trace_%05d.png -c:v libx264 -profile:v high444 -refs 16 -crf 0 ./trace.mp4
```

#### Embed one video over another
To embed to second video over the first one, you can do just
```
    # https://superuser.com/questions/938458/how-to-put-a-video-in-a-corner-of-another-video
    ffmpeg -i video_name_cropped.mp4 -i trace.mp4 -filter_complex "overlay=700:700"  combined.mp4
```
Now, you finish all steps, and have you final video.
