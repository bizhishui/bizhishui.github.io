---
title: Create & Edit Figure with TikZ
layout: post
guid: urn:uuid:9fd1f6d0-d5d1-4ec4-bb96-4924886a82d6
categories:
  - note
tags:
  - Latex
  - TikZ
  - figure
---


> This blog note how to create a figure and edit on a figure with TikZ.


---

### Create a Figure with TikZ


### Edit a Figure with TIKZ
Suppose we have a figure as show below:

[![Initial figure](/media/files/2017/01/12/ExpComp.png)](https://github.com/bizhishui/bizhishui.github.io/blob/master/ "Initial figure")

<img src="https://github.com/bizhishui/bizhishui.github.io/blob/master/media/files/2017/01/12/ExpComp.png" alt="Initial figure" width="200" height="200" />

we want add some text, for example, on it. One common option is use photoshop like software, here is the post-result with *inkscape*

[![Figure with inkscape](/media/files/2017/01/12/ExpComp4.jpg)](https://github.com/bizhishui/bizhishui.github.io/blob/master/ "figure with inkscape")

But if one use *latex*, a more direct way is use *Tikz*. For example, with the following latex class, 

```
    \documentclass{standalone}
    \usepackage{tikz}
    % filename: TiKZforExternalFig.tex
    % To generate TiKZforExternalFig.pdf : pdflatex TiKZforExternalFig.tex
    \begin{document}
    \begin{tikzpicture}
      \node[anchor=south west,inner sep=0] at (0,0) {\includegraphics[width=\textwidth]{./fig/ExpComp.eps}};
        \draw[->,line width=0.55mm,line cap=round] (9.1,3.6) -- (6.5,4.9);
        \draw[red] (8.3,4.4) node [fill=yellow!80!black]{R};
        \draw[->,thick,violet] (8.7,4.2) -- (8.6,4.6);
        \draw[->, line width=0.55mm,line cap=round,black!50!red] (3.5,4.0) -- (3.7,6.0);
        \draw[line width=0.5mm, dashed] (2.4,3.1) rectangle (4.55,3.8);
        \draw[violet] (3.5,3.5) node {\huge mode 1};
        \draw[->,line width=0.5mm,line cap=round, red, dash dot] (7.3,2.1) -- (6.3,4.5);
        \draw[->,line width=0.5mm,line cap=round, red, dashed] (7.3,2.1) -- (7.4,4.0);
        \draw[->,line width=0.5mm,line cap=round, black, dotted] (7.3,2.1) -- (8.9,3.4);
        \draw[violet] (7.3,1.7) node [fill=blue!10!orange] {\Large mode 2};
    \end{tikzpicture}
    \end{document}
```

the initial figure becomes

[![Figure with TikZ](/media/files/2017/01/12/TiKZforExternalFig.png)](https://github.com/bizhishui/bizhishui.github.io/blob/master/ "figure with TikZ")

