---
title: Numerical Notes
layout: post
guid: urn:uuid:caf8c5cf-2336-4181-b218-27a1e5776d58
summary: This post will be appended by basic numerical simulation knowledges from artiles or internet.
update_date: 2018-02-09
categories:
  - mecaFluid
tags:
  - Numerical
---

{% include lib/mathjax.html %}

* TOC
{:toc}

### 01. Euler Based Numerical Simulation Methods
This section has major refered article [Yen Liu et al](http://www.sciencedirect.com.lama.univ-amu.fr/science/article/pii/S0021999106000106)
and book [Hesthaven and Warburton](http://www.springer.com/fr/book/9780387720654).

#### a. FD (Finite-difference) methods
{:.no_toc}
FD employing a body-fitted curvilinear coordinate system, with the equations written in strong conservation law form. The spatial differencing is essentially one-dimensional, 
and carried out along coordinate directions. Thus a large number of data points are ignored in high-order stencils. Near boundaries, the stencil has to be modified with one-sided formulas. 
Since numerical grid generators are mostly only second-order accurate, the numerical differencing of grid point coordinates in evaluating metric terms can severely degrade the accuracy of the 
solution if the grid is not sufficiently smooth. The unknowns are solution values at grid points. Therefore the true integral conservation laws can only be satisfied to second-order accuracy. 

To ensure geometric flexibility one needs to abandon the simple one-dimensional approximation in favor of something more general. The most natural approach is to introduce an element-based discretization.

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
efficiency of the method (high-order reconstruction must span multiple elements as the numerical approximation is represented by cell averages only). 
Furthermore, since each unknown employs a different stencil, one must repeat the least-squares inversion for every cell at each time step, or must store the inversion coefficients. 
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

The first disadvantage of FS is the globally defined basis functions and the requirement that the residual be orthogonal to the
same set of globally defined test functions implies that the semidiscrete scheme becomes implicit and the mass matrix $$\mathcal{M}$$ must be inverted.
An additional subtle issue that relates to the structure of the basis, the basis functions are symmetric in space. For many types of problems (e.g., a heat equation),
this is a natural choice. However, for problems such as wave problems and conservation laws, in which information flows in specific directions, this is
less natural and can causes stability problems if left unchanged.In FD and FV methods, this problem is addressed by the use of upwinding, either through the stencil choice or through
the design of the reconstruction approach.

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
DG method achieves local (the strictly local statement is a direct consequence of $$\mathcal{V}_h$$, the space of test functions, being a broken space and the fact that we have duplicated
solutions at all interface nodes) conservation for the FE or SE methods. Nodes on element boundaries are allowed to have multiple values, so that the local reconstruction in each element is in general discontinuous 
with that of its neighbors. The Galerkin MWR method is now applied locally to each element, using the local shape functions. As in the unstructured FV method, a Riemann solver is employed at element boundaries 
to compute the numerical fluxes. The integral conservation law is now satisfied for each element. While we must still solve a large set of coupled equations, each set involves only the unknowns in a few neighboring elements. 
Some of the integrals in the matrix entries involve quadratic terms. For non-linear flux functions, the required quadrature formulas must have twice the degree of precision as the precision of the reconstruction. 
In order to obtain stable and spectral convergence, unknowns for the DG method are normally placed at points where the reconstruction matrix is optimized. One choice involves the Fekete points where the determinant 
of the reconstruction matrix is maximized. Other choices include points where the maximum Lebesgue constant of the reconstruction matrix is minimized or multivariate point sets through the electrostatic analogy. 
In general, these points may not provide the necessary precisions of quadrature approximations for the surface and volume integrals, and one must therefore obtain solutions at other quadrature points through interpolations.

Efficient DG schemes storing data at nodal points known as *nodal DG* methods. 

#### g. SV (Spectral Volume) methods
{:.no_toc}
The universal local reconstruction concept inherent in the FE method can be utilized to overcome the computational inefficiencies of the more direct unstructured FV method. In the SV method, each triangular or 
tetrahedral cell, here called a spectral volume (SV), is partitioned into structured subcells called control volumes (CV). These are polygons in 2D, and polyhedra in 3D. The latter can have non-planar faces, 
which must be subdivided into planar facets in order to perform flux integrations. The unknowns are now cell averages over the CV’s. If the SV’s are partitioned in a geometrically similar manner, a single, 
universal reconstruction results. Thus only a few coefficients need to be stored in advance to evaluate all flux integrals. For high orders of accuracy in 3D, the partitioning requires the introduction of a 
large number of parameters, whose optimization to achieve spectral convergence becomes increasingly more difficult. The growth in the number of interior facets and the increase in the number of quadrature 
points for each facet, raises the computational cost greatly. The computational cost of the SV method, and the difficulties in determining the parameters for spectral convergence, can both be significantly 
reduced if one were to apply the universal local reconstruction concept to the simpler unstructured FD method using nodal unknowns.

#### h. SD (Spectral Difference) methods
{:.no_toc}
SD is introduced for conservation laws on unstructured grids. The method combines the best features of structured and unstructured grid methods to obtain computational efficiency and geometric flexibility. 
It utilizes the concept of discontinuous and high-order local representations to achieve conservation and high accuracy in a manner similar to the DG and SV methods, but the new method is based on the 
finite-difference formulation to attain a simpler form and higher efficiency. Specifically, the differential form of the conservation laws is satisfied at nodal unknown points, 
with flux derivatives expressed in terms of values at flux points. The SD method is a type of finite-difference method or nodal spectral method for unstructured grids, in which inside each cell or element 
we have structured nodal unknown and flux distributions, in such a way that the local integral conservation is satisfied.

#### i. [CPR](http://www.sciencedirect.com.lama.univ-amu.fr/science/article/pii/S0021999113007857) (Correction Procedure via Reconstruction) methods
{:.no_toc}

### 02. Galerkin *vs* Collocation Approach

- Galerkin method: the test functions are the same as the basis functions. It can use either modal or nodal formulation. However, since the test functions and the trial functions are in general orthogonal to each other only in the modal space, the modal formulation will result in an uncoupled system, but not in the nodal formulation.
- Collocation method: the test functions are the translated Dirac delta functions centered at so-called collocation points. For the collocation method, the nodal formulation is the more natural choice, and it always results in an uncoupled system since the delta functions are used as the test functions. 

### 03. Modal *vs* Nodal Formulation

- Modal formulation: the unknowns are the expansion coefficients.
- Nodal formulation: the unknowns are the nodal values of the unknown variables at the *collocation points*.

### 04. Grid, Nodal and Collocation Points

- Grid points: as it is name suggests, just the verteices of the mesh
- Nodal points: the points at which the approximate function coincides with the approximated function (so same as collocation points, see [Gouri Dhatt et al](http://onlinelibrary.wiley.com/book/10.1002/9781118569764))
- Collocation points: at the collocation points, the reconstruced function's value equals to the real value, i.e., the residual is forced to zero at those collocation points. In other words, *at each collocation point the trial (basis) functions are required to satisfy the differential equation exactly*.

### 05. Autonomous and Non-autonomous System[>](https://en.wikipedia.org/wiki/Autonomous_system_(mathematics))

An autonomous system is a system of ordinary differential equations of the form $$\frac{d}{dt}\mathbf{X}(t)=\mathbf{F}(\mathbf{X}(t))$$ where $$\mathbf{X}$$ takes values
in n-dimensional Euclidean space and $$t$$ is usually time. It is autonomous since $$t$$ not appear explicitly at the right side.

It is distinguished from systems of differential equations of the form $$\frac{d}{dt}\mathbf{X}(t)=\mathbf{G}(\mathbf{X}(t),t)$$ in which the law governing the rate of the motion 
of a particle depends not only on the particle's motion, but also on time; such systems are non autonomous.

### 06. Conservation *vs* Non-conservation Forms of Conservation Equations

The [reason](https://physics.stackexchange.com/questions/70496/conservation-vs-non-conservation-forms-of-conservation-equations/70540#70540) they are conservative or non-conservative has to do with 
the splitting of the derivatives. Consider the conservative derivative:

$$\frac{\partial\rho u}{\partial x}$$.

When we discretize this using finite difference, we get:

$$\frac{\partial\rho u}{\partial x}\approx\frac{(\rho u)_i-(\rho u)_{i-1}}{\Delta x}$$.

Now, in non-conservative form, the derivative is split apart as:

$$\rho\frac{\partial u}{\partial x}+u\frac{\partial\rho}{\partial x}$$.

Using the same numerical approximation, we get:

$$\rho\frac{\partial u}{\partial x}+u\frac{\partial\rho}{\partial x}\approx\rho_i\frac{u_i-u_{i-1}}{\Delta x}+u_i\frac{\rho_i-\rho_{i-1}}{\Delta x}$$.

We can see that while the original derivative is mathematically the same, the discrete form is not the same. Of particular difficultly is the choice of the terms multiplying the derivative.

The difference can be seen from the derivation of governing equations in fluid mechanics by considering a finite control volume (ref [Mazhar Lqbal](https://www.researchgate.net/post/What_is_basic_difference_between_conservation_and_non-conservation_equations)). 
This control volume may be fixed in space with the fluid moving through it or the control volume may be moving with the fluid in a sense that same fluid particles are always remain inside the control volume. 
If the first case is taken then the governing equations will be in conservation form else these will be in nonconservation form.

#### How to choose which to use?
{:.no_toc}
If your solution is expected to be smooth, then non-conservative may work. For fluids, this is shock-free flows.
If you have shocks, or chemical reactions, or any other sharp interfaces, then you want to use the conservative form.

There are other considerations. Many real world, engineering situations actually like non-conservative schemes when solving problems with shocks. The classic example is 
the [Murman-Cole](http://aero-comlab.stanford.edu/Papers/transonic_flo.pdf) scheme for the transonic potential equations. It contains a switch between a central and upwind scheme, but it turns out to be non-conservative.
Some results turn out the non-conservation introduced an artificial viscosity, making the equations behave more like the Navier-Stokes equations at a tiny fraction of the cost.
Needless to say, engineers loved this. "Better" results for significantly less cost!

#### Conservation laws as fundamental laws of nature[>](https://en.wikipedia.org/wiki/Conservation_law)
{:.no_toc}
Conservation laws are fundamental to our understanding of the physical world, in that they describe which processes can or cannot occur in nature. For example, the conservation law of energy states that 
the total quantity of energy in an isolated system does not change, though it may change form. In general, the total quantity of the property governed by that law remains unchanged during physical processes. 
With respect to classical physics, conservation laws include conservation of energy, mass (or matter), linear momentum, angular momentum, and electric charge. With respect to particle physics, particles cannot be created or destroyed 
except in pairs, where one is ordinary and the other is an antiparticle. With respect to symmetries and invariance principles, three special conservation laws have been described, associated with inversion or reversal of space, time, and charge.

One particularly important result concerning conservation laws is [Noether's theorem](https://en.wikipedia.org/wiki/Noether%27s_theorem) (each conservation law is associated with a symmetry in the underlying physics), 
which states that there is a one-to-one correspondence between a conservation law and a differentiable symmetry of nature. For example, the conservation of energy follows from the time-invariance of physical systems, 
and the conservation of angular momentum arises from the fact that physical systems behave the same regardless of how they are oriented in space.

### 07. Hyperbolic, Parabolic and Elliptic PDEs[>](https://matheducators.stackexchange.com/questions/1691/what-is-the-motivation-for-characterizing-second-order-linear-pdes-as-hyperbolic)

1. The *hyperbolic* case is a very good model for wave propagation, and also to some extent dispersive phenomenon; this was noted by d'Alembert who gave a physical derivation of the wave equation.
2. The *parabolic* case is a very good model for diffusive phenomenon; this was already noted by Fourier who gave a physical derivation of his heat equation.
3. The *elliptic* case is important physically as elliptic equations arise naturally when one considers solutions to parabolic/hyperbolic equations which are stationary in time.

- For both hyperbolic and elliptic types, but notably not for parabolic type equations (let us assume constant coefficients), we can write down solutions to the Cauchy problem in the case of real analytic initial data 
  using the theorem of [Cauchy-Kowalevski](https://en.wikipedia.org/wiki/Cauchy%E2%80%93Kowalevski_theorem). For *hyperbolic* types, this solution to the initial data problem turns out to be "stable", in the sense that for 
  initial data that has finite regularity we can also find solutions of finite regularity. For the elliptic case this stability is lost. For *elliptic* equations, the more natural question to ask is not an initial value problem, 
  but a boundary value problem on a bounded domain $$\Omega$$. Note that whereas for the initial value problem we usually prescribe both the value of the function and its transversal derivative at the initial time, 
  for the boundary value only one out of the two is prescribed. 
- For both the elliptic and parabolic types, but notably not for the hyperbolic type equations, we have the notion of [maximum principle](https://en.wikipedia.org/wiki/Maximum_principle) for solutions.
  Roughly speaking, it says that the maximum of a function in a domain is to be found on the boundary of that domain. Specifically, the strong maximum principle says that if a function achieves its maximum in 
  the interior of the domain, the function is uniformly a constant.
- Solutions to the elliptic and parabolic type equations enjoy smoothing properties, while solutions to the hyperbolic type equations have propagation of singularities. 
  In other words, solutions to elliptic and parabolic problems are often smoother than their boundary/initial values. For hyperbolic equations, singularities in the initial value are propagated into the future, 
  along characteristic curves of the equation.
- Concerning the initial value problem, the parabolic type equations only have existence forward in time, while the hyperbolic type equations have existence both forward and backward in time.
- Somewhat more technically: with elliptic problems it is often very convenient to work in spaces of functions which are Holder continuous, with occasional call to use Lebesgue/Sobolev spaces of various Lebesgue exponents. 
  Similarly for parabolic problems. For hyperbolic equations in spatial dimension $$>1$$, pretty much the only good tool is via $$L^2$$-based Sobolev spaces.
- Hyperbolic, and not elliptic or parabolic (at least in the linear case, for nonlinear equations there are some exceptions) enjoy the property of "finite speed of propagation". 
  (In the case of the linear wave equation $$\partial^2_t u=c^2\Delta u$$ this says, in particular, that if the initial data is zero outside of a ball of radius $$R$$, the solution at time $$T$$ is zero outside the 
  ball of radius $$R+c|T|$$.) This is noticeably false for the initial value problem for the heat equation.
- Lastly, note that if your equation has constant coefficients, then through a linear change of coordinates you can bring your equation into the form of a wave/heat/Laplace equation if it 
  is classified as hyperbolic/parabolic/elliptic. So you can also motivate the general definition thus as saying that a hyperbolic equation looks, in a small neighbourhood, like the wave equation plus some small perturbations etc. 
  This has the advantage of leading to a discussion of the method of freezing coefficients for elliptic estimates, say.

### 08. Isoparametric Element ([FEM](http://onlinelibrary.wiley.com/book/10.1002/9781118569764))
An element is said to be *isoparametric* if the geometrically transformation functions (transfer the real element to its reference element) $$\overline{N}(\xi)$$ are identical to the 
interpolation functions (shape functions) $$N(\xi)$$. This implies that the geometrical nodes are the same as the interpolation nodes.
We say that an element is *pseudo-isoparametric* if functions $$\overline{N}(\xi)$$ and $$N(\xi)$$ are different polynomials using the same monomials.

If the order of the polynomials used in $$\overline{N}(\xi)$$ is lower than that of the polynomials in $$N(\xi)$$, the element is *subparametric*. It is said to be *superparametric* 
in the opposite case. Superparametric elements are usually not recommended.
