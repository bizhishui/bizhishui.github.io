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


### Steps

#### Use Paraview to get a time-series images for all vtk files
In paraview, choose *Save Animation* and 'png' (for example) as the exported *Files of type*,
paraview will automatically generate a series of images files.

#### Make first video with ffmpeg
Suppose the images obatined from last step are saved with name like *figure_#####.png*, then you can make a video with these images as 
```
    ffmpeg -framerate $1 -i ./figure_%05d.png -c:v libx264 -profile:v high444 -refs 16 -crf 0 ./video_name.mp4
```
