---
title: Git-on-the-Server
layout: post
guid: urn:uuid:af389501-d80e-47d9-8180-9f0fd4aa549a
categories:
  - notes
tags:
  - Git
  - SSH
---


> Reproduced from [Pro Git](https://git-scm.com/book/en/v2).


---

A remote repository is generally a bare repository — a Git repository that has no working directory. Because the repository is only used as a collaboration point, 
there is no reason to have a snapshot checked out on disk; it’s just the Git data. 
In the simplest terms, a bare repository is the contents of your project’s `.git` directory and nothing else.

### The SSH Protocol
To clone a Git repository over SSH, one can use the shorter scp-like syntax for the SSH protocol:

```
    git clone user@server:/full/path/to/project.git
```

### Getting Git on a Server
In order to initially set up any Git server, one has to export an existing repository into *a new bare repository* -  a repository that dosen't 
contain a working directory. By convention, bare repository directories end in `.git`, like so:

```
    git clone --bare my_project my_project.git
```

One should now have a copy of the Git directory data in `my_project.git` directory. It takes the Git repository by itself, without
a working directory, and creates a directory specifically for it alone.
