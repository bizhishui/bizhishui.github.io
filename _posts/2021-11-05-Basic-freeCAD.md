---
title: Basic of freeCAD
layout: post
guid: urn:uuid:0f2bedba-df05-4232-b301-91d474609070
categories:
  - tutorial
tags:
  - freeCAD
---


> 前段时间由于需要画一个相对复杂的网格，很难如前用Gmsh从点、线到面一步一步生成，使用CAD软件生成导出模型后作为网格软件的输入自然成为了我的选择。 此前唯一接触的CAD软件是大约十年前本科课上用的CATIA(需license)，Google一番后发现freeCAD可作为不错的开源替代产品。


&nbsp;

作为freeCAD的新手和模糊又浅显的CATIA知识，freeCAD给我的总体感觉是：具有CATIA所有的基本功能！但freeCAD却完全支持Python，用户在GUI界面的所有操作都对应着一条条Python命令，此外freeCAD还支持宏(macro)录制。
freeCAD是一个功能非常强大的软件，当前版本(0.19)有十来个工作台，我目前仅了解Draft，Sketcher，Part和Part Design四个。
Draft主要用于2D图形绘制，该工作台的界面及使用和Inkscape非常相似，因此如果仅是需要2D图片，Draft并不是好的选择，但是其输出却可以轻松的用于其他工作台的输入。
Sketcher和Part的结合使用完全如之前课上学习CATIA的示例。

&nbsp;

### Sketcher使用要点

Sketcher(草图)工作台用于创建用于 PartDesign(零件设计)工作台、Arch (建筑)工作台和其他工作台的*二维几何图形*。 通常，二维绘图被视为大多数CAD模型的起点，因为二维草图可以“拉伸”以创建三维形状；
进一步的二维草图可以用于在先前构建的三维形状的基础上创建其他特征，如开槽“Pocket”、隆起“ridges”或拉伸"extruded"。 草图绘制器与在(Part)零件工作台中定义的布尔操作一起构成了构建实体的构造实体几何方法的基础。

#### Sketching Workflow
A Sketch is always 2D. To create a solid, a 2D Sketch of **a single enclosed area** is created and then either Padded or Revolved to add the 3rd dimension, creating a 3D solid from the 2D Sketch.

If a Sketch has segments that cross one another, or places where a Point is not directly on a segment, or places where there are gaps between endpoints of adjacent segments, Pad or Revolve won't create a solid. 
Sometimes a Sketch which contains lines which cross one another will work for a simple operation such as Pad, but later operations such as Linear Pattern will fail. **It is best to avoid crossing lines**. 
The exception to this rule is that it doesn't apply to Construction (blue) Geometry (Construction mode下生成的Construction Geometry只会用于辅助草图制作，并不会包含在最终草图内).

Inside the enclosed area we can have smaller non-overlapping areas. These will become voids when the 3D solid is created.

Once a Sketch is fully constrained, the Sketch features will turn green; Construction Geometry will remain blue. It is usually "finished" at this point and suitable for use in creating a 3D solid. 
However, *once the Sketch dialog is closed it may be worthwhile going to Part Workbench and running Check geometry* to ensure there are no features in the Sketch which may cause later problems.

[简单而言通常为](https://wiki.freecad.org/Basic_Sketcher_Tutorial):
1. Creating construction geometry (optional), 在construction mode下作辅助设计草图，完成后需退出此模式
2. Creating real geometry, 用于后续3D画图的草图几何必须是封闭的2D图形。
3. Applying geometric constraints, 如垂直、平行、等长、相切约束等
4. Applying datum constraints, 如长度，角度、半径等约束
5. Obtaining a closed profile, 此时自由度为0，草图变为绿色

&nbsp;

### Work with Python script

First see this python script (modified from online source)

```
    #!/usr/bin/env python
    # coding=utf-8
    
    # Script to draw a periodic sine sketch in FreeCAD
    import FreeCAD
    import Draft
    import math
    
    # 2 * pi * rad = 360°   ->  math.sin(rad)
    
    def sinus(x, a,p,ph):
    	'''
    	Returns the sinus with:
    	a = amplitude in mm
    	p = period in mm
    	ph = phase in mm
    	'''
    
    	return  a*math.sin(1/p * 2*math.pi* x + ph* 2*math.pi)
    
    # Draw the periodic sine function approximated as a B-spline in x-direction (can be turned and converted to sketch later)
    a =0.2  # in mm
    p =math.pi # in mm
    ph = 0  # in mm
    
    l = 4*math.pi # in mm
    x0 = -0.5*l  # start position in mm
    height = 1.5
    
    pts = 1001
    
    v = []  # list to store the vectors
    v2 = []  # list to store the vectors
    
    for vec in range(pts):
    	x = x0 + vec * l /(pts-1)
    	v.append(FreeCAD.Base.Vector(x, height+sinus(x, a,p,ph), 0))
    	v2.append(FreeCAD.Base.Vector(x, height+sinus(x, a,p,ph)-0.01, 0))
    
    lp1 = App.Vector(v[0])
    lp2 = App.Vector(v2[0])
    lp3 = App.Vector(v[pts-1])
    lp4 = App.Vector(v2[pts-1])
    
    doc = App.newDocument()
    
    sincurv = Draft.makeBSpline(v)
    doc.recompute(None,True,True)
    sincurv2 = Draft.makeBSpline(v2)
    doc.recompute(None,True,True)
    
    line1 = Draft.make_line(lp1, lp2)
    line2 = Draft.make_line(lp3, lp4)
    doc.recompute()
    
    sketch_from_draft = Draft.make_sketch([sincurv, line1, sincurv2, line2], autoconstraints=False, delete=False, radiusPrecision=-1, tol=1e-3)
    doc.recompute()
```

In freeCAD, first open the aboved script, and then press *Execute the macro in the editor*, next switch to the *Part Design*工作台.
选择此前生成的Sketch, 然后点击*Create a new body*并选择相应的Base plane, 如此Sketch位于新生成的Body下。再次选择Sketch,点击*Revolve a selected sketch*即可生成3D旋转体，此处生成的是三维曲面。
经过后续加工，最终图片为

[![deformedTube](/media/files/2021/11/05/deformedTube.jpg)](https://github.com/bizhishui/bizhishui.github.io/blob/master/ "deformedTube")
