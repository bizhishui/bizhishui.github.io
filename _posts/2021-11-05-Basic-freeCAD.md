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
