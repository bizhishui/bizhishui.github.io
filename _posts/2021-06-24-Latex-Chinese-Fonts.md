---
title: Install and Use Chinese in Latex
layout: post
guid: urn:uuid:00f6f622-0d9a-427a-89c3-4d30bfe5e76b
categories:
  - notes
tags:
  - Latex
  - Fonts
  - Chinese
---

> The purpose of this post is to note the methods of installing Chinese fonts on the Unix system and their use in Latex.
> This post has mainly referred [xiaoquinNUDT's blog](https://blog.csdn.net/xiaoqu001/article/details/80981338) and [Overleaf's online document](https://www.overleaf.com/learn/latex/Chinese).

### Install Chinese Fonts
First you can check what fonts are available in your system with
```
    fc-list
    fc-list :lang=zh
```
Linux user can simply open LibreOffice, all available fonts are listed in the font option drop down menu.
Use 
```
    fc-match -v "AR PL UKai CN"
```
can furter view details info of this font.

#### Basic steps
```
    # copy fonts to ~/.fonts or /usr/share/fonts on linux
    export DEST=~/.fonts
    cd $DEST
    cp /path/to/fonts/*.tt[c,f] .
    # generate fonts.scale
    mkfontscale
    # generate fonts.dir
    mkfontdir
    # set up fonts cache
    fc-cache -fsv

    # to delete fonts, just rm the ttf or ttc files, and then re-run
    fc-cache -fsv
```

### Using Chinese Fonts with xeCJK
We can first create a _sty_ file to save all fonts related setting, here is an example
```
    # file myCJKfonts.sty
    \setCJKmainfont[ItalicFont={AR PL UKai CN}]{AR PL UMing CN}  %设置中文默认字体
    %\setCJKmainfont{Noto Serif CJK SC Light}
    \setCJKsansfont{AR PL UKai CN}                               %设置中文无衬线字体
    %\setCJKsansfont{Ma Shan Zheng} 
    \setCJKmonofont{Noto Sans Mono CJK SC}                       %设置中文打字机(等宽)字体
    %\setCJKmonofont{Noto Sans Mono CJK SC} 

    \setCJKfamilyfont{Ma Shan Zheng}{Ma Shan Zheng}
    \newcommand*{\makai}{\CJKfamily{Ma Shan Zheng}}
    
    % correct line break for chinese
    \XeTeXlinebreaklocale "zh"
    \XeTeXlinebreakskip = 0pt plus 1pt
    \endinput
```

Place this file locally in your current tex folder, and it can be used simply as
```
    \documentclass[a4paper,skipsamekey,11pt,british]{curve}
    
    \usepackage{settings_cn}
    
    \usepackage[utf8]{inputenc}
    \usepackage{ebgaramond} % the 16th century fonts
    \usepackage[type1]{cabin} % A humanist Sans Serif font
    \usepackage{csquotes} % provides advanced facilities for inline and display quotations
    
    \usepackage{fontspec}
    \usepackage[slantfont, boldfont]{xeCJK}
    \usepackage{myCJKfonts}
    
    \title{Curriculum Vitae}
    \begin{document}
    \makeheaders[c]
    
    \makerubric{employment_cn}
    \makerubric{education_cn}

    正常中文字体！
    {\makai 测试马楷！}
    
    \end{document}
```
