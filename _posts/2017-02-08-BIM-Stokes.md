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

### (定常)Stokes流动
定常Stokes流动由Stokes方程

$$\nabla\cdotp\sigma=0,$$

其中Cauchy应力张量 (*stress tensor*) $$\sigma=2\mu\mathbf{d}-p^{mod}\mathbf{I}$$，修正压力 (*modified pressure*) $$p^{mod}=p-\rho\mathbf{g}\cdotp\mathbf{x}$$，
$$\mathbf{d}=\frac{1}{2}\left(\nabla\mathbf{u}+(\nabla\mathbf{u})^T\right)$$是变形率张量 (*rate of deformation tensor*)，$$\mathbf{g}$$为重力加速度；以及
不可压方程

$$\nabla\cdotp\mathbf{u}=0$$

控制。它描述雷诺数极小和随时间变化极缓慢(流动特征时间极大)的流动(creeping flow)，可直接由NS方程简化而来。


### Lorentz Reciprocal Relation
假设$$\mathbf{u}$$和$$\mathbf{u}^{'}$$是满足Stokes方程的两个解，$$\mathbf{\sigma}$$和$$\mathbf{\sigma}^{'}$$是对应的应力张量，对$$\mathbf{u}^{'}\cdotp\nabla\cdotp\mathbf{\sigma}$$分部积分可得

$$u^{'}_i\frac{\partial\sigma_{ij}}{\partial x_j}-u_i\frac{\partial\sigma^{'}_{ij}}{\partial x_j}=\frac{\partial}{\partial x_j}\left(u^{'}_i\sigma_{ij}-u_i\sigma^{'}_{ij}\right).$$

若$$\mathbf{u}$$和$$\mathbf{u}^{'}$$都是正则的(即不含奇异点)，上式左边为零，即得reciprocal等式

$$\nabla\cdotp\left(\mathbf{u}^{'}\cdotp\mathbf{\sigma}-\mathbf{u}\cdotp\mathbf{\sigma}^{'}\right)=0.$$
