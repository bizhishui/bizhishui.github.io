---
title: Numerical Notes
layout: post
guid: urn:uuid:caf8c5cf-2336-4181-b218-27a1e5776d58
summary: This post will be appended by basic numerical simulation knowledges from artiles or internet.
categories:
  - notes
tags:
  - Numerical
---

* TOC
{:toc}

### Numerical Methods
This section has major refered articles [Yen Liu et al](http://www.sciencedirect.com.lama.univ-amu.fr/science/article/pii/S0021999106000106).

#### FD (Finite-difference) methods
{:.no_toc}
FD employing a body-fitted curvilinear coordinate system, with the equations written in strong conservation law form. The spatial differencing is essentially one-dimensional, 
and carried out along coordinate directions. Thus a large number of data points are ignored in high-order stencils. Near boundaries, the stencil has to be modified with one-sided formulas. 
Since numerical grid generators are mostly only second-order accurate, the numerical differencing of grid point coordinates in evaluating metric terms can severely degrade the accuracy of the 
solution if the grid is not sufficiently smooth. The unknowns are solution values at grid points. Therefore the true integral conservation laws can only be satisfied to second-order accuracy. 

#### FV (Finite-volume) methods
{:.no_toc}
The unknowns are now cell averages over quadrilaterals (2D) or hexahedra (3D). A high order reconstruction in terms of neighboring unknowns is used to calculate flux integrals 
over cell boundaries, using Riemann solvers and appropriate limiters. In practice, the conventional FV method for structured grids does not overcome the limitations of the FD method. 
The reconstruction is still one-dimensional along coordinate directions. While geometric quantities such as surface area vectors or cell volumes can be precisely calculated, 
flux integrals and volume integrals are usually evaluated by one-point quadratures, and are only second-order accurate. Both methods suffer significant loss of accuracy for very unsmooth, highly curved grids.

The conservative unstructured finite-volume (UFV) method applies to the integral form of the conservation law with cell averages of the conservative variables as the unknowns. 
A polynomial reconstruction of any desired order of accuracy for each cell is obtained in terms of unknowns at neighboring cells. The flux integral for each face is evaluated using 
the reconstructed solutions from the two cells sharing the face and an approximate Riemann solver. A quadrature approximation is employed for non-linear flux functions. Thus, conservation 
is satisfied locally for each cell. However, due to the unstructured nature of the grid, it is difficult to obtain a non-singular stencil. This necessitates a least-squares inversion in general. 
For very high order of accuracy, the number of cells, and thus the number of operations to carry out the numerical procedure, can become very large in three dimensions. This would hamper the 
efficiency of the method. Furthermore, since each unknown employs a different stencil, one must repeat the least-squares inversion for every cell at each time step, or must store the inversion coefficients. 
In a high-order, three-dimensional computation, the former would involve impractically large CPU times, while for the latter the memory requirement becomes prohibitive. 
In addition, the data from neighboring cells required for the computation can be far apart in memory. This further degrades the efficiency of the method due to data gathering and scattering. 
As a result of these deficiencies, the UFV method is limited to second-order accuracy in most applications.

#### FE (Finite-element) methods
{:.no_toc}
FE methods have long been used for unstructured grids because of their geometric flexibility. *A major difference between the FE and FV or FD methods is that in the former we employ reconstruction data 
from within the element, while in the latter the reconstruction data comes from outside the cell*. In the FE formulation, the unknowns are *nodal values* at *nodes* which are placed at geometrically 
similar points in each element. As a result, the local reconstructions become universal for all elements in terms of the same set of cardinal basis functions or *shape functions*. 
