---
title: Mac Use Note
layout: post
guid: urn:uuid:32d75c37-a7bf-4d2e-b5d6-01cff554e7c8
categories:
  - notes
tags:
  - Mac
---


> This post notes points since Mac 10.12.2


---

- problem like `Permission denied - /usr/local/lib/perl5` and with `not symlinked into /usr/local`.
 
As we can not use `sudo brew`, `/usr/local` is only readable for normal use. Thus we can not build soft link.
First we need:

```
    sudo chown -R $USER:admin /usr/local
```

to change the write permission, and then build the link

```
    brew link --overwrite git
```

- Add Color to the Terminal

In '~/.bashrc' (*in my mac, I've soft linked `~/.bashrc` to  `~/.bash_profile`*), add the following scripts

```
    export PS1="\[\033[36m\]\u\[\033[m\]@\[\033[32m\]\h:\[\033[33;1m\]\w\[\033[m\]\$ "
    export CLICOLOR=1
    export LSCOLORS=GxFxCxDxBxegedabagaced
    alias ls='ls -GFh'
```

for *Dark* terminal themes, and the following alalternative for *Light* terminal theme,

```
    export PS1="\[\033[36m\]\u\[\033[m\]@\[\033[32m\]\h:\[\033[33;1m\]\w\[\033[m\]\$ "
    export CLICOLOR=1
    export LSCOLORS=ExFxBxDxCxegedabagacad
    alias ls='ls -GFh'
```

And add color for **grep** command:

```
    export GREP_OPTIONS='--color=auto'
    alias grep='grep -n'        #print line number of matched lines
```

- Install Gnuplot on Mac 

```
    brew uninstall gnuplot; brew install gnuplot --with-qt5   ##OR
    brew reinstall gnuplot --with-qt5
```

- Mac自带截屏快捷键
  1. Command + Shift + 3：截取整个屏幕，保存图片在桌面
  2. Command + Shift + 4：选取部分屏幕区域，保存图片在桌面
  3. 先 Command + Shift + 4  再空格，可以对指定的窗口或者菜单截屏
