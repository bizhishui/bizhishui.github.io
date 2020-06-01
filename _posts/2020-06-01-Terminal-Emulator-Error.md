---
title: Terminal Emulator Error
layout: post
guid: urn:uuid:b08b91e3-3cfc-4e51-93e3-38b52001038a
categories:
  - unix
tags:
  - Shell
  - Terminal
---


A strange character error recently appeared in my terminal, which was proven due to the terminal emulator.
Normally, my home path in the shell prompt should be

```
    # right one
    user@host:~$
```

while it actually prompts as

```
    # accidental one
    user§host:ì$
```

To solve this error, run

```
    reset
```

Refer [this](https://superuser.com/questions/712493/what-would-cause-strange-characters-to-appear-in-terminal-%C3%89) for more details.

> Your terminal emulator is capable of multiple character sets, and it's often the case when one accidentally dumps a binary to the terminal 
> that somewhere in the binary is the character sequence that switches the terminal between output character sets.
