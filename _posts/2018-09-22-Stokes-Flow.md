---
title: Low-Reynolds-Number Flows
layout: post
guid: urn:uuid:8c8f22d0-1fde-4afe-8c61-418408291f2c
#(summary: Reading notes on a very good review on [Low-Reynolds-Number Flows](http://pubs.rsc.org/en/Content/Chapter/9781782628491-00025/978-1-78262-849-1) from physical view.)
categories:
  - physics
tags:
  - Stokes flow
---

Reading notes on a very good review on [Low-Reynolds-Number Flows](http://pubs.rsc.org/en/Content/Chapter/9781782628491-00025/978-1-78262-849-1) from physical view by H. A. Stone and C. Dupart.


{% include lib/mathjax.html %}

### 1. Typical results for low-reynolds-number flows

(1). A sphere of radius $$a$$ that translates at a speed $$V$$ far from any walls and in a large bath of fluid experiences a drag force of magnitude

$$
\begin{equation}
F_D=6\pi\mu a V.
\end{equation}
$$

This result is known as the Stokes drag, corresponds to the product of the surface area $$4\pi a^2$$ and a typical shear stress $$\mu V/a$$.
Unlike $${\color{blue}{high\ Reynolds\ number\ flow}}$$ limit, where the drag force varies approximately with the square of the particle radius and 
square of the speed.

(2). Because of gravity, a sphere of radius $$a$$ and density $$\rho_s$$ sediments in a viscous fluid of density $$\rho$$ with a net force 
of $$(4\pi/3)a^3(\rho_s-\rho)g$$. The sedimentation speed $$V$$ can be deduced by balancing the drag force

$$
\begin{equation}
V=\frac{2a^2(\rho_s-\rho)g}{9\mu},
\end{equation}
$$

i.e. $${\color{blue}{V\propto a^2}}$$.

(3). Brownian motion refers to mouvements of suspended objects due to thermal bombardment by the molecules of the fluid, with a thermal energy of $$\kappa_B T$$.
As derived by Einstein in 1905<sup>[1](#EinsteinRelation)</sup>, a sphere of radius $$a$$ undergoing Brownian motion is characterized by a diffusion coefficient

$$
\begin{equation}
D\equiv \frac{[L^2]}{[T]}=\frac{k_BT}{6\pi\mu a},
\end{equation}
$$

which is known as Stokes-Einstein equation. One use this result in physical chemistry is to measure the diffusion coefficient of a small particle and 
to identify an effective (or hydrodynamic) radius for the particle.

(4). A circular disk of radius $$a$$ translating at a speed $$V$$ edgewise parallel to a nearby plane, with separation distance $$h\ll a$$, experiences
a drag force that is approximately given by the product of the surface area of the disk $$\pi a^2$$ and the shear stress $$\mu V/h$$, i.e. $$F_d\approx \pi a^2\mu V/h$$.
Clearly, halving the separation distance doubles the drag.

(5). A long slender rod of radius $$a$$  and length $$l$$, with $$l\gg a$$, when translating at speed $$V$$ experiences a drag force $$F$$ is approximately
proportional to its length, and

$$
\begin{equation}
F_\perp \approx\frac{8\pi\mu l V}{\mathrm{ln}(2l/a)} \approx 2F_\parallel .
\end{equation}
$$

### 2. Equations of Motion
#### The Reynolds Number

$$
\begin{equation}
\begin{split}
Re &= \frac{\mathrm{inertial\ terms}}{\mathrm{viscous\ terms}}=\frac{\rho V^2/a}{\mu V/a^2} \\
&= \frac{\mathrm{time\ for\ vorticity\ to\ diffusion\ distance\ }a}{\mathrm{time\ to\ translate\ distance\ }a}=\frac{a^2/\nu}{a/V} \\
&= \frac{\rho V a}{\mu}
\end{split},
\end{equation}
$$

where $$\nu=\mu/\rho$$ is the kinematic viscosity which has the dimension of diffusion coefficient $$D$$.
It is useful in fluid mechanics to think about vorticity, or local rotation of fluid elements, as a flow property that diffuses.
A low-Reynolds-number flow, with $$Re\ll 1$$, then corresponds to a motion where the viscous effects or the vorticity diffuses much faster
than a particle or moving boundary can change its position. The fluid rapidly, or instantaneously in the ideal limit, establishes a velocity
distribution for a given translation speed and geometry of the boundaries.

#### Stokes Equations
In the [Stokes equations limit](https://bizhishui.github.io/BIM-Stokes), there can still be considerable complexity owing to the
presence of (i) suspended particles, whose distribution affects the flow,
which in turn influences the particle distribution, and (ii) elastic boundaries,
whose shape depends on the flow, which in turn influences the boundary shape.

Much is known about the structure of the solutions of Laplace’s equation.
Because the structure of the Stokes equations, the mathematical features related to the Laplace equation
figure prominently when solving low-Reynolds-number flow problems.


### 3. Elementary Flows
#### Channel Flows
In many channel flows, the distance along the flow direction $$l$$ is very
different from the typical distance $$l_\perp$$ transverse to the flow direction, with $$l_\perp\ll l$$.
The Stokes equations indicate a balance between viscous stresses $$\mu v_c/l^2_\perp$$, where $$v_c$$ is a typical speed, and the 
pressure gradient, $$\Delta p/l$$, where $$l$$ is the distance along the flow over which the pressure drop $$\Delta p$$ occurs. Therefore,

$$
\begin{equation}
v_c\approx\frac{l^2_\perp}{\mu}\frac{\Delta p}{l}.
\end{equation}
$$

The corresponding flow rate in the channel is $$Q\approx v_c\times$$ (cross-sectional area). Thus, for a circular pipe of radius $$a=l_\perp$$,
the pressure-drop-versus-flow-rate relation is (where we have introduced a constant $$\pi/8$$ that results from a detailed calculation)

$$
\begin{equation}
Q=\frac{\pi a^4}{8\mu}\frac{\Delta p}{l},
\end{equation}
$$

which is known as the Poiseuille formula.

### 4. Kinematic Reversibility
There is a feature of Stokes flows that surprises many people when it is first encountered. Stokes flows in or around boundaries of fixed shape have the
property that the flow looks the same, i.e. that the streamline pattern is identical, when the driving force is reversed.

#### Mathematical Reasons for Kinematic Reversibility
The stress is related linearly to the velocity and pressure fields, i.e. $$\sigma=-p\mathbf{I}+\mu\left(\nabla\mathbf{u}+(\nabla\mathbf{u})^T\right)$$.
Now, consider causing a flow by applying steady forces at the boundaries; for example, on some surfaces $$S$$ we apply known stresses $$\tau (r)$$, where $$r$$ is the position vector:

$$
\begin{equation}
\mathbf{n}\cdotp\sigma=\tau(\mathbf{r})\quad \mathrm{for}\quad r\in S.
\end{equation}
$$

Next, we consider changing the sign of these surface stresses, i.e. $$\tau\rightarrow -\tau$$. Thus, we change the sign for $$\sigma$$, which for a Newtonian 
fluid means that we reverse the signs of $$\mathbf{u}$$ and $$p$$. These facts imply that the
flow field is exactly reversed when the boundary forcing is reversed, and consequently the streamlines are identical in the two cases: only the flow
direction along the streamlines changes. We refer to this reversal of the flow field as “kinematic reversibility” to respect the thermodynamic fact
that viscous flows always dissipate energy and so are thermodynamically irreversible.

#### Examples of Kinematic Reversibility
1. When a single sphere is subject to a force parallel to a vertical plane wall, the sphere translates parallel to the wall and rotates as if rolling
down the wall: the force and the velocity are collinear and there is no component of velocity perpendicular to the wall, 
and the sphere maintains a constant separation distance from the wall.
Suppose that you thought that there would also be a motion of the sphere perpendicular to, and away from, the wall. If you exactly reversed the
driving force parallel to the wall, the velocity of the sphere would reverse. Hence, you would then have the sphere translating upwards
parallel to the wall but the transverse component would be towards the wall, i.e. the velocities change sign when the applied force changes sign.
2. When two identical spheres, i.e. with the same radius and the same density, sediment in a viscous fluid at a speed such that the Reynolds
number is small, their separation distance does not change. As a consequence of hydrodynamic interactions, the spheres may rotate as they sediment and their
direction of fall may be at an angle to the vertical, but they have no component of relative velocity.
3. In a low-Reynolds-number pressure-driven flow of neutrally buoyant spheres of radius $$a_s$$ in a straight tube of radius $$a\gg a_s$$,
deformation away from a spherical shape can lead to drift in the direction normal to the wall.
It is important to  determine the typical speed $$U_\perp$$ of migration across the streamlines.


Perhaps not surprisingly, many physical features can destroy kinematic reversibility, for example elasticity of the boundaries , viscoelasticity of the fluid, 
surface tension acting at an interface, deformation of suspended particles, and finite inertia (Reynolds number) of the flow.



<a name="EinseinRelation">1</a>: (From class note of [Mélange](https://drive.google.com/open?id=1JnIls8ZauaneTn7DQLovzI6G009zHPiM), E. Villemaux) Einstein view: particles concentration $$c(z)$$ at equilibrium $$c(z)=exp(-\frac{E}{k_BT})$$, where $$E=Fz$$ is the energy of a particle, 
$$F=6\pi\mu a V$$ is the drag force. On the other hand, equilibrium means zero flux $$j=0=-Vc-D\frac{\partial c}{\partial z}$$, thus $$c(z)=exp(-\frac{V}{D}z)$$.
Identification by terms, we have $$D=\frac{k_BT}{6\pi\mu a}$$. Another view, the mean quadratic difference of Brownian motion position  $$<x^2>=2\frac{\epsilon}{1/\tau^2}t=2Dt$$ for $$t\gg\tau$$, 
where $$\tau$$ is the characteristic time of diffusion, $$<f(t_1)f(t_2)>=\epsilon\delta (t_1-t_2)$$, $$f$$ is the stochastic force. Thus $$<v^2>=2D/t$$.
With $$k_BT=\frac{1}{2}m<v^2>$$, $$Ft=mV$$ and $$F=6\pi\mu a V$$, we obtain the same formule.
