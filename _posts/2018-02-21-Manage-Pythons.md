---
title: Manage Multiple Python Versions with pyenv on Ubuntu and Mac
layout: post
guid: urn:uuid:2758ad2f-ac7b-4702-bc50-224d8c93a2c1
summary: Use pyenv to install, manage and switch between multiple python versions on Ubuntu and Mac.
update_date: 2018-02-22
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
    export PATH="$PYENV_ROOT/shims:$PATH"    #PYENV_ROOT="$HOME/.pyenv" the root directory of pyenv
```
Through a process called *rehashing*, *pyenv* maintains *shims* in that directory to match every Python command across every installed version of Python: *python*, *pip*, and so on.
That is to say, when you run a Python command, it will first searches in the *shims* directory. The next question is which version will be run?

#### Choosing the Python Version
{:.no_toc}
When you execute a *shim*, *pyenv* determines which Python version to use by reading it from the following sources, in this order:

1. The *PYENV_VERSION* environment variable (if specified). You can use the *pyenv shell* command to set this environment variable in your __current shell session__.
2. The application-specific *.python-version* file in the current directory (if present). You can modify the __current directory's__ *.python-version* file with the *pyenv local* command.
3. The first *.python-version* file found (if any) by searching each parent directory, until reaching the root of your filesystem.
4. The global *$PYENV_ROOT/version* file. You can modify this file using the *pyenv global* command. If the __global version__ file is not present, *pyenv* assumes you want to use the *"system"* Python.

Once pyenv has determined which version of Python your application has specified, it passes the command along to the corresponding Python installation.
Each Python version is installed into its own directory under *$PYENV_ROOT/versions*.

### Installation
#### Ubuntu
{:.no_toc}
```
    #Check out pyenv where you want it installed (PYENV_ROOT=$HOME/.pyenv)
    git clone https://github.com/pyenv/pyenv.git ~/.pyenv

    #Define environment variable PYENV_ROOT to point to the path where pyenv repo is cloned 
    #and add $PYENV_ROOT/bin to your $PATH for access to the pyenv command-line utility
    echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
    echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc

    # Add pyenv init to your shell to enable shims and autocompletion
    # Make sure eval "$(pyenv init -)" is placed toward the end of the shell configuration file
    # since it manipulates PATH during the initialization.
    echo -e 'if command -v pyenv 1>/dev/null 2>&1; then\n  eval "$(pyenv init -)"\nfi' >> ~/.bashrc

    #Restart your shell so the path changes take effect
    exec "$SHELL"

    #Install Python versions
    pyenv install --list       #list all available Python
    pyenv install 3.5.5        #install python3.5.5
    pyenv versions             #list all installed versions
    which python               #find the current location of the python interpreter
    pyenv which python         #show the actual location of the python interpreter it’s using
    #Uninstall
    pyenv uninstall 3.5.5
```

##### Upgrading
{:.no_toc}
```
    cd $(PYENV_ROOT)
    git pull
```

#### Mac
{:.no_toc}
```
    # Install pyenv
    brew update
    brew install pyenv

    # View more information
    brew info pyenv
    
    # Add to the end of .bash_profile
    echo -e 'if which pyenv 1>/dev/null 2>&1; then\n  eval "$(pyenv init -)"\nfi' >> ~/.bash_profile

    # Restart your shell
    exec $SHELL

    # List all available versions
    pyenv install -l
    # Install Python
    pyenv install version_number
    # Uninstall
    pyenv uninstall version_number

    # List all versions installed
    pyenv versions
    # List current python
    pyenv which python
```

### Switching Versions
```
    #Displays the full path of the executable which will be invoked when a command is run
    pyenv which pip
    #Lists all Python versions that have the given command installed
    pyenv whence pip
```
#### Switching Globally
{:.no_toc}
```
    pyenv global               #List the current global python version
    pyenv versions             #List all installed versions
    pyenv global 3.5.5         #switch to version 3.5.5
    python --version           #check

    # Load python versions IN THIS ORDER
    pyenv global system 2.7.12 3.5.4
```
The global python version setting is stored in the file *$(PYENV_ROOT)/version*.

#### Switching Locally
{:.no_toc}
One can also switch the python version you want to use locally (per project) by using a *.python-version* file at the root of your project.
When you enter this directory, *pyenv* will load the python version’s specified in your *.python-version*.
```
    cd /path/to/your/project
    # Show the current version
    pyenv which python
    # Show current python version
    python --version

    #set local python version
    pyenv local 3.5.5
    #unset local version (delete .python-version file from the current directory)
    pyenv local --unset
```

#### Switching for Current Shell
{:.no_toc}
```
    #set current shell session with python 3.4.3
    pyenv shell 3.4.3
    #unset
    pyenv shell --unset
```

### Uninstalling pyenv
To **disable** *pyenv* managing your Python versions, simply remove the *pyenv init* line from your shell startup configuration. This will remove *pyenv shims* directory from *PATH*, 
and future invocations like python will execute the *system* Python version, as before *pyenv*.

To completely **uninstall** *pyenv*, perform step above and then remove its root directory (*rm -rf $(PYENV_ROOT)*). This will delete all Python versions that were installed under *$(PYENV_ROOT)/versions/* directory.
Or use *brew uninstall pyenv* on Mac.

### Problems
#### Installing Python Modules
{:.no_toc}
On Mac, when a specified version has choosen (pyenv global), one can install packages directly with pip
```
    pyenv versions
    pyenv version
    python -V
    pip -V
    pip install numpy scipy
```

But on Ubuntu, it will not work, one need
```
    python -m pip install numpy scipy
```

#### Module ImportError
{:.no_toc}
When *ImportError* or *ModuleNotFoundError* occurs, it usually means the corresponding module has not been (properly) installed. While with *pyenv* manage your
pythons, one need make sure the **module (libray) is installed before your python**.

Given as an example, with python 3.6.4 installed and set to global with *pyenv* on Ubuntu 16.04, 
```
    $python
    Python 3.6.4 (default, Apr 12 2018, 16:07:53) 
    [GCC 6.4.0] on linux
    Type "help", "copyright", "credits" or "license" for more information.
    >>> import matplotlib.pyplot as plt
    ......
    import _tkinter # If this fails your Python may not be configured for Tk
    ModuleNotFoundError: No module named '_tkinter'
```

Unlike other normal cases, one can install *tk_dev* to solve this error with the following command
```
    sudo apt-get install tk-dev
```

To [fix](http://gangmax.me/blog/2017/04/13/fix-no-module-named-tkinter-issue/) this problem, we need first install *tk-dev* and then re-install your python
```
    sudo apt-get install tk-dev
    pip freeze > requirements.txt
    pyenv uninstall 3.6.4
    pyenv install 3.6.4
    pyenv global 3.6.4
    pip install -r requirements.txt
```
