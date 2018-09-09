---
title: Terminal Prompt Customization
layout: post
guid: urn:uuid:7c94f7a4-7129-4915-83dd-b6e56c42f2c0
categories:
  - unix
tags:
  - Linux
  - Bash
---


> Reproduced from [**Gabriel Cánepa**](http://www.tecmint.com/author/gacanepa/) [How to Customize Bash Colors and Content in Linux Terminal Prompt](http://www.tecmint.com/customize-bash-colors-terminal-prompt-linux/)


---

Today, Bash is the default shell in most (if not all) modern Linux distributions. This blog will note how to customize it.

### The PS1 Bash Environment Variable
The command prompt and terminal appearance are governed by an environment variable called `PS1`. According to the Bash man page, 
`PS1` represents the primary prompt string which is displayed when the shell is ready to read a command. Use `echo $PS1` can display 
the current content.

#### Customizing the PS1 Format
According to the PROMPTING section in the man page, this is the meaning of each special character:

- `\u`: the **username** of the current user
- `\h`: the **hostname** of up to the first dot (.) in the Fully-Qualified Domain Name (`\H`)
- `\W`: the **basename** of the *current working directory*
- `\$`: If the current user is root, display #, \$ otherwise.

For example, set `PS1="\u@\h-\W\$:"` give `jinming@Precision-_posts$:` on my current terminal.

#### Color scheme
There are three (*background* [30-39], *format* [0,1,4] and *foreground* [40-49]) values which are separated by *commas* (default is assumed
if no value is given). Also, since the value ranges (ref original post) are different, it dose not matter which one is specified 
first.

We use the `\e` special character at the beginning and an `m` at the end to indicate that what follows is a color sequence. For example, 
the following `PS1` will cause the prompt to appear in *yellow underlined text* with *red background*:

```
    PS1="\e[41;4;33m[\u@\h \W]$ "
```

Remark: above settings are only for current terminal session, to make these changes permanent, one need to add it in `~/.bashrc`.

A full `.bashrc` file from ubuntu 16.04

```
    # ~/.bashrc: executed by bash(1) for non-login shells.
    # see /usr/share/doc/bash/examples/startup-files (in the package bash-doc)
    # for examples
    
    # If not running interactively, don't do anything
    case $- in
        *i*) ;;
          *) return;;
    esac
    
    # don't put duplicate lines or lines starting with space in the history.
    # See bash(1) for more options
    HISTCONTROL=ignoreboth
    
    # append to the history file, don't overwrite it
    shopt -s histappend
    
    # for setting history length see HISTSIZE and HISTFILESIZE in bash(1)
    HISTSIZE=1000
    HISTFILESIZE=2000
    
    # check the window size after each command and, if necessary,
    # update the values of LINES and COLUMNS.
    shopt -s checkwinsize
    
    # If set, the pattern "**" used in a pathname expansion context will
    # match all files and zero or more directories and subdirectories.
    #shopt -s globstar
    
    # make less more friendly for non-text input files, see lesspipe(1)
    [ -x /usr/bin/lesspipe ] && eval "$(SHELL=/bin/sh lesspipe)"
    
    # set variable identifying the chroot you work in (used in the prompt below)
    if [ -z "${debian_chroot:-}" ] && [ -r /etc/debian_chroot ]; then
        debian_chroot=$(cat /etc/debian_chroot)
    fi
    
    # set a fancy prompt (non-color, unless we know we "want" color)
    case "$TERM" in
        xterm-color|*-256color) color_prompt=yes;;
    esac
    
    # uncomment for a colored prompt, if the terminal has the capability; turned
    # off by default to not distract the user: the focus in a terminal window
    # should be on the output of commands, not on the prompt
    #force_color_prompt=yes
    
    if [ -n "$force_color_prompt" ]; then
        if [ -x /usr/bin/tput ] && tput setaf 1 >&/dev/null; then
    	# We have color support; assume it's compliant with Ecma-48
    	# (ISO/IEC-6429). (Lack of such support is extremely rare, and such
    	# a case would tend to support setf rather than setaf.)
    	color_prompt=yes
        else
    	color_prompt=
        fi
    fi
    
    if [ "$color_prompt" = yes ]; then
        PS1='${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '
    else
        PS1='${debian_chroot:+($debian_chroot)}\u@\h:\w\$ '
    fi
    unset color_prompt force_color_prompt
    
    # If this is an xterm set the title to user@host:dir
    case "$TERM" in
    xterm*|rxvt*)
        PS1="\[\e]0;${debian_chroot:+($debian_chroot)}\u@\h: \w\a\]$PS1"
        ;;
    *)
        ;;
    esac
    
    # enable color support of ls and also add handy aliases
    if [ -x /usr/bin/dircolors ]; then
        test -r ~/.dircolors && eval "$(dircolors -b ~/.dircolors)" || eval "$(dircolors -b)"
        alias ls='ls --color=auto'
        #alias dir='dir --color=auto'
        #alias vdir='vdir --color=auto'
    
        alias grep='grep --color=auto'
        alias fgrep='fgrep --color=auto'
        alias egrep='egrep --color=auto'
    fi
    
    # colored GCC warnings and errors
    #export GCC_COLORS='error=01;31:warning=01;35:note=01;36:caret=01;32:locus=01:quote=01'
    
    # some more ls aliases
    alias ll='ls -alF'
    alias lh='ls -alFh'
    alias la='ls -A'
    alias l='ls -CF'
    alias vi='vim'
    
    # Add an "alert" alias for long running commands.  Use like so:
    #   sleep 10; alert
    alias alert='notify-send --urgency=low -i "$([ $? = 0 ] && echo terminal || echo error)" "$(history|tail -n1|sed -e '\''s/^\s*[0-9]\+\s*//;s/[;&|]\s*alert$//'\'')"'
    
    # Alias definitions.
    # You may want to put all your additions into a separate file like
    # ~/.bash_aliases, instead of adding them here directly.
    # See /usr/share/doc/bash-doc/examples in the bash-doc package.
    
    if [ -f ~/.bash_aliases ]; then
        . ~/.bash_aliases
    fi
    
    # enable programmable completion features (you don't need to enable
    # this, if it's already enabled in /etc/bash.bashrc and /etc/profile
    # sources /etc/bash.bashrc).
    if ! shopt -oq posix; then
      if [ -f /usr/share/bash-completion/bash_completion ]; then
        . /usr/share/bash-completion/bash_completion
      elif [ -f /etc/bash_completion ]; then
        . /etc/bash_completion
      fi
    fi
    
    unset PATH
    unset LD_LIBRARY_PATH
    export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
    export PATH=/home/username/soft/eclipse:$PATH
    export PATH=/home/username/bin:$PATH
    export PATH=${JAVA_HOME}/bin:${JAVA_HOME}/jre/bin:$PATH
    
    #export LD_LIBRARY_PATH=/home/username/simuCodes/libs/soft_lib:$LD_LIBRARY_PATH
    
    unset MANPATH
    export MANPATH=/home/username/man/lapack/man3:$MANPATH
```

