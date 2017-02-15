---
title: Git on the Server
layout: post
guid: urn:uuid:af389501-d80e-47d9-8180-9f0fd4aa549a
categories:
  - notes
tags:
  - Git
  - SSH
---


> Adapted from [Pro Git](https://git-scm.com/book/en/v2/Git-on-the-Server-The-Protocols) and [git wiki](https://help.github.com/articles/adding-an-existing-project-to-github-using-the-command-line/).


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
contain a working directory. (Make sure its already a git repository, if not, use *git init*, *git add filenames* etc.) By convention, bare repository directories end in `.git`, like so:

```
    git clone --bare my_project my_project.git
```

One should now have a copy of the Git directory data in `my_project.git` directory. It takes the Git repository by itself, without
a working directory, and creates a directory specifically for it alone.

#### Putting the Bare Repository on a Server
Now that you have a bare copy of your repository, all you need to do is put it on a server and set up your protocols. 
Let’s say you’ve set up a server called `git.example.com` that you have SSH access to, and you want to store all your Git repositories 
under the `/srv/git` directory. You can set up your new repository by copying your bare repository over:

```
    scp -r my_project.git user@git.example.com:/srv/git
```

At this point, other users who have SSH access to the same server which has read-access to the `/srv/git` directory can clone your repository
by running

```
    git clone user@git.example.com:/srv/git/my_project.git
```

But, it may still be an empty repository, *commit* and *push* from your local directory *my_project* may needed. Specifically, for the first time, they are

```
    git remote add origin user@git.example.com:/srv/git/my_project.git  #set new remote repository URL
    git remote -v    #verifies the new remote URL
    git push origin master    #pushes the changes in your local repository up to the remote repository you specified as origin 
```

If a user SSHs into a server and has write access to the `/srv/git/my_project.git` directory, they will also automatically have push access.

Git will automatically add groupe write permissions to a repository **properly** if you run the `git init` command with `--shared` option.

```
    ssh user@git.example.com
    cd /srv/git/my_project.git
    git init --bare --shared
```

It’s important to note that this is literally all you need to do to run a useful Git server to which several people have access — just add SSH-able 
accounts on a server, and stick a bare repository somewhere that all those users have **read and write** access to. You’re ready to go — nothing else needed.
