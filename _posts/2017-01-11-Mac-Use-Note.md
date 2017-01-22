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
    export CLICOLOR=1
    export LSCOLORS=GxFxCxDxBxegedabagaced
```

for *Dark* terminal themes, and the following alalternative for *Light* terminal theme,

```
    export CLICOLOR=1
    export LSCOLORS=ExFxBxDxCxegedabagacad
```
