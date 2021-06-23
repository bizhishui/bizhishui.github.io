---
title: Selective backup from cluster
layout: post
guid: urn:uuid:98675523-dfe1-4fe3-a0a2-d191e19425ad
categories:
  - notes
tags:
  - Rsync
  - Backup
---

### Background
Suppose you have a large amount of data (from your numerical simulation) on a remote cluster, says about 10T. 
In most cases, you may not need these data any more, but it will be good to just save some of these which can be used to restart computation (_.ser_  in my current case).
This note shows a way to realize this purpose.

### Generate a list to be backed up
Here is the Python script to 
```
    #!/usr/bin/env python
    import os,sys 
    from datetime import datetime
    
    saveFreq=10
    if len(sys.argv) < 2:
        print("Need one argument: the ser saved frequency")
        print("The dafault value 10 is used")
    else:
        saveFreq = int(sys.argv[1])
    
    now = datetime.now()
    date_time = now.strftime("%Y%m%d-%H%M%S")
    of = open('bkupSerList_'+date_time+'.txt', 'a')
    for root,dirs,files in os.walk(os.getcwd()): 
        for unin in ['in', 'wall', 'out']:
            if unin in dirs:
                dirs.remove(unin)
        fl = []
        for f in files: 
            if f.endswith(".ser"):
                fl.append(f)
        
        if len(fl) > 1:
            fl.sort()
            print(os.path.join(root,fl[-1]), file=of)
            for idx in range(0, len(fl), saveFreq):
                print(os.path.join(root,fl[idx]), file=of)
    
            of.flush()
    
    of.close()
```
