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

