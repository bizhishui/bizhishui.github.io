---
title: Manage Multiple Python Versions with pyenv on Ubuntu and Mac
layout: post
guid: urn:uuid:2758ad2f-ac7b-4702-bc50-224d8c93a2c1
summary: Use pyenv to install and manage multiple python versions on Ubuntu and Mac.
categories:
  - notes
tags:
  - Python
  - pyenv
  - Ubuntu
  - Mac
---

People who use Python, on linux or mac, may find it is difficult to manage the different versions of Python.
After comparing several common [tools](http://masnun.com/2016/04/10/python-pyenv-pyvenv-virtualenv-whats-the-difference.html), it seems [*pyenv*](https://github.com/pyenv/pyenv) is the most competent one.

This post aims to record the full step in installing, using pyenv to manage python versions on Ubuntu and Mac.

* TOC
{:toc}

### How It Works[>](https://github.com/pyenv/pyenv)
At a high level, *pyenv* intercepts Python commands using *shim* executables injected into your *PATH*, determines which Python version has been specified by your application, and passes your commands along to the correct Python installation.
*pyenv* works by inserting a directory of shims at the front of your *PATH*:
```
    export PATH="$PYENV_ROOT/bin:$PATH"    #PYENV_ROOT="$HOME/.pyenv" the root directory of pyenv
```
Through a process called *rehashing*, *pyenv* maintains *shims* in that directory to match every Python command across every installed version of Python: *python*, *pip*, and so on.
