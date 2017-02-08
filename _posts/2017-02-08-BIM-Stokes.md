---
title: 边界积分方法求解Stokes流动
layout: post
guid: urn:uuid:672ad6da-1db6-4e26-bede-d47d956b0657
categories:
  - thèse
tags:
  - BIM
  - Stokes
  - mathjax
---

{% include lib/mathjax.html %}

> 第一篇相对专业的博客，内容是Stokes流动的边界积分方法，主要参考[C Pozrikidis](http://dehesa.freeshell.org/)92和02年的两本书。
> 此外这也是第一次在Markdown中写数学公式，主要参考[Math on GitHub Pages](http://g14n.info/2014/09/math-on-github-pages/)。

#### (定常)Stokes流动
定常Stokes流动由Stokes方程

$$\nabla\cdotp\sigma=0,$$

其中Cauchy应力张量(stress tensor)$$\sigma=2\mu\mathbf{d}-p^{mod}\mathbf{I}$$，修正压力(modified pressure)$$p^{mod}=p-\rho\mathbf{g}\cdotp\mathbf{x}$$；以及
不可压方程

$$\nabla\cdotp\mathbf{u}=0$$控制。
