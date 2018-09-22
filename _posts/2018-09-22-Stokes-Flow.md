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
A low-Reynolds-number flow, with $$Re<ll 1$$, then corresponds to a motion where the viscous effects or the vorticity diffuses much faster
than a particle or moving boundary can change its position. The fluid rapidly, or instantaneously in the ideal limit, establishes a velocity
distribution for a given translation speed and geometry of the boundaries.

#### Stokes Equations
In the [Stokes equations limit](https://bizhishui.github.io/BIM-Stokes), there can still be considerable complexity owing to the
presence of (i) suspended particles, whose distribution affects the flow,
which in turn influences the particle distribution, and (ii) elastic boundaries,
whose shape depends on the flow, which in turn influences the boundary shape.




<a name="EinseinRelation">1</a>: (From class note of Mélange, E. Villemaux) Einstein view: particles concentration $$c(z)$$ at equilibrium $$c(z)=exp(-\frac{E}{k_BT})$$, where $$E=Fz$$ is the energy of a particle, 
$$F=6\pi\mu a V$$ is the drag force. On the other hand, equilibrium means zero flux $$j=0=-Vc-D\frac{\partial c}{\partial z}$$, thus $$c(z)=exp(-\frac{V}{D}z)$$.
Identification by terms, we have $$D=\frac{k_BT}{6\pi\mu a}$$. Another view, the mean quadratic difference of Brownian motion position  $$<x^2>=2\frac{\epsilon}{\tau^2}t=2Dt^3$$ for $$t\gg\tau$$, 
where $$\tau$$ is the characteristic time of diffusion, $$<f(t_1)f(t_2)>=\epsilon\delta (t_1-t_2)$$, $$f$$ is the stochastic force. Thus $$<v^2>=2Dt$$.
With $$k_BT=\frac{1}{2}m<v^2>$$, $$Ft=mV$$ and $$F=6\pi\mu a V$$, we obtain the same formule.
