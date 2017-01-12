---
title: Terminal Prompt customization
layout: post
guid: urn:uuid:7c94f7a4-7129-4915-83dd-b6e56c42f2c0
categories:
  - notes
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
