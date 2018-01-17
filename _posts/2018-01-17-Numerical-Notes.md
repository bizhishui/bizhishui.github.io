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

### 1. Euler Based Numerical Simulation Methods
This section has major refered articles [Yen Liu et al](http://www.sciencedirect.com.lama.univ-amu.fr/science/article/pii/S0021999106000106).

#### a. FD (Finite-difference) methods
{:.no_toc}
FD employing a body-fitted curvilinear coordinate system, with the equations written in strong conservation law form. The spatial differencing is essentially one-dimensional, 
and carried out along coordinate directions. Thus a large number of data points are ignored in high-order stencils. Near boundaries, the stencil has to be modified with one-sided formulas. 
Since numerical grid generators are mostly only second-order accurate, the numerical differencing of grid point coordinates in evaluating metric terms can severely degrade the accuracy of the 
solution if the grid is not sufficiently smooth. The unknowns are solution values at grid points. Therefore the true integral conservation laws can only be satisfied to second-order accuracy. 

#### b. FV (Finite-volume) methods
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

#### c. FE (Finite-element) methods
{:.no_toc}
FE methods have long been used for unstructured grids because of their geometric flexibility. *A major difference between the FE and FV or FD methods is that in the former we employ reconstruction data 
from within the element, while in the latter the reconstruction data comes from outside the cell*. In the FE formulation, the unknowns are *nodal values* at *nodes* which are placed at geometrically 
similar points in each element. As a result, the local reconstructions become universal for all elements in terms of the same set of cardinal basis functions or *shape functions*. 
Usually the Galerkin approach is used, in which the test functions are the same as the basis functions. This results in a set of *coupled equations* of all unknowns. Their solution involves a 
very large, sparse matrix, whose entries depend on the element geometries. For non-linear equations, quadrature approximations are necessary to evaluate the matrix entries. 
While the integral conservation law is satisfied for the global domain, it is not satisfied for each element.

#### d. Spectral methods
{:.no_toc}
Spectral methods have the properties of very high accuracy and spectral (or exponential) convergence. In traditional spectral methods, the unknown variable is expressed as a truncated series expansion 
in terms of some *basis functions* (*trial functions*) and solved using the MWR (method weighted of residuals). The trial functions are infinitely differentiable global functions, 
and the most frequently used ones are trigonometric functions or Chebyshev and Legendre polynomials.

#### e. SE (Spectral-element) methods
{:.no_toc}
SE method (based on Galerkin approach) *can be viewed as a high-order FE method with the nodal points placed at proper locations so that the spectral convergence can be obtained*.

#### f. DG (Discontinuous Galerkin) methods
{:.no_toc}
DG method achieves local conservation for the FE or SE methods. Nodes on element boundaries are allowed to have multiple values, so that the local reconstruction in each element is in general discontinuous 
with that of its neighbors. The Galerkin MWR method is now applied locally to each element, using the local shape functions. As in the unstructured FV method, a Riemann solver is employed at element boundaries 
to compute the numerical fluxes. The integral conservation law is now satisfied for each element. While we must still solve a large set of coupled equations, each set involves only the unknowns in a few neighboring elements. 
Some of the integrals in the matrix entries involve quadratic terms. For non-linear flux functions, the required quadrature formulas must have twice the degree of precision as the precision of the reconstruction. 
In order to obtain stable and spectral convergence, unknowns for the DG method are normally placed at points where the reconstruction matrix is optimized. One choice involves the Fekete points where the determinant 
of the reconstruction matrix is maximized. Other choices include points where the maximum Lebesgue constant of the reconstruction matrix is minimized or multivariate point sets through the electrostatic analogy. 
In general, these points may not provide the necessary precisions of quadrature approximations for the surface and volume integrals, and one must therefore obtain solutions at other quadrature points through interpolations.

#### g. SV (Spectral Volume) methods
{:.no_toc}
The universal local reconstruction concept inherent in the FE method can be utilized to overcome the computational inefficiencies of the more direct unstructured FV method. In the SV method, each triangular or 
tetrahedral cell, here called a spectral volume (SV), is partitioned into structured subcells called control volumes (CV). These are polygons in 2D, and polyhedra in 3D. The latter can have non-planar faces, 
which must be subdivided into planar facets in order to perform flux integrations. The unknowns are now cell averages over the CV’s. If the SV’s are partitioned in a geometrically similar manner, a single, 
universal reconstruction results. Thus only a few coefficients need to be stored in advance to evaluate all flux integrals. For high orders of accuracy in 3D, the partitioning requires the introduction of a 
large number of parameters, whose optimization to achieve spectral convergence becomes increasingly more difficult. The growth in the number of interior facets and the increase in the number of quadrature 
points for each facet, raises the computational cost greatly. The computational cost of the SV method, and the difficulties in determining the parameters for spectral convergence, can both be significantly 
reduced if one were to apply the universal local reconstruction concept to the simpler unstructured FD method using nodal unknowns.

### 2. Galerkin *vs* Collocation Approach

- Galerkin method: the test functions are the same as the basis functions. It can use either modal or nodal formulation. However, since the test functions and the trial functions are in general orthogonal to each other only in the modal space, the modal formulation will result in an uncoupled system, but not in the nodal formulation.
- Collocation method: the test functions are the translated Dirac delta functions centered at so-called collocation points. For the collocation method, the nodal formulation is the more natural choice, and it always results in an uncoupled system since the delta functions are used as the test functions. 

### 3. Modal *vs* Nodal Formulation

- Modal formulation: the unknowns are the expansion coefficients.
- Nodal formulation: the unknowns are the nodal values of the unknown variables at the *collocation points*.
