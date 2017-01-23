---
title: Git-on-the-Server
layout: post
guid: urn:uuid:af389501-d80e-47d9-8180-9f0fd4aa549a
categories:
  - notes
tags:
  - Github
  - SSH
---


> Reproduced from [Pro Git](https://git-scm.com/book/en/v2).


---

A remote repository is generally a bare repository — a Git repository that has no working directory. Because the repository is only used as a collaboration point, 
there is no reason to have a snapshot checked out on disk; it’s just the Git data. 
In the simplest terms, a bare repository is the contents of your project’s .git directory and nothing else.
