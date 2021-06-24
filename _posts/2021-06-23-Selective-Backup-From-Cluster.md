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
Here is the Python script to save all _.ser_ files you want to backup to a text file.
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

The only argument is an int value _n_ for on which frequency you want to save your .ser files, 
i.e., you want save one file every _n_ files, the default value is 10.

Run this script on _/scratch/jlv/test_, here is some of them I get 
```
    /scratch/jlv/test/RBC/CG/muS5d3/RBCVesPCG_20180609-235417_kappa_1.0_Shear_gamma_0.0_pN_40.0/013.9000000.ser
    /scratch/jlv/test/RBC/CG/muS5d3/RBCVesPCG_20180609-235417_kappa_1.0_Shear_gamma_0.0_pN_40.0/000.0000000.ser
    /scratch/jlv/test/RBC/CG/muS5d3/RBCVesPCG_20180609-235417_kappa_1.0_Shear_gamma_0.0_pN_40.0/000.5200000.ser
    /scratch/jlv/test/RBC/CG/muS5d3/RBCVesPCG_20180609-235417_kappa_1.0_Shear_gamma_0.0_pN_40.0/001.0200000.ser
    /scratch/jlv/test/RBC/CG/muS5d3/RBCVesPCG_20180609-235417_kappa_1.0_Shear_gamma_0.0_pN_40.0/001.5200000.ser
    /scratch/jlv/test/RBC/CG/muS5d3/RBCVesPCG_20180609-235417_kappa_1.0_Shear_gamma_0.0_pN_40.0/002.0300000.ser
    /scratch/jlv/test/RBC/CG/muS5d3/RBCVesPCG_20180609-235417_kappa_1.0_Shear_gamma_0.0_pN_40.0/002.6300000.ser
    /scratch/jlv/test/RBC/CG/muS5d3/RBCVesPCG_20180609-235417_kappa_1.0_Shear_gamma_0.0_pN_40.0/003.2300000.ser
    /scratch/jlv/test/RBC/CG/muS5d3/RBCVesPCG_20180609-235417_kappa_1.0_Shear_gamma_0.0_pN_40.0/003.8300000.ser
    /scratch/jlv/test/RBC/CG/muS5d3/RBCVesPCG_20180609-235417_kappa_1.0_Shear_gamma_0.0_pN_40.0/004.4300000.ser
```


### Copy to a temporary directory
Suppose the destination directory is _/scratch/jlv/tmp_for_bkup_serfiles_, before copying, 
the leading string _/scratch/jlv/test/_ must be trimmed. This can be easily done with vim.
The local copy can then de done by
```
    rsync -uvhR `cat bkupSerList_20210623-152003.txt` /scratch/jlv/tmp_for_bkup_serfiles/
```


### Backup to your own disk
Suppose the local directory where you want to save your data is _/media/jlv/WD1/meso_Marseille/scratch/test_,
the backup can be simply realized via another rsync command, run under the destination directory
```
    rsync -ravh -e ssh jlv@login.mesocentre.univ-amu.fr:/scratch/jlv/tmp_for_bkup_serfiles/ .
```

And finally, don't forget to delete the data on _/scratch/jlv/tmp_for_bkup_serfiles_.

### Notes
When copying data with _rsync_ to an external driver formatted as _exFAT_, for example, one need to add 
the option _--modify-window=1_ to avoid copying all files every time.
```
    # https://unix.stackexchange.com/questions/552349/rsync-over-ssh-copies-all-files-every-time
    rsync --modify-window=1 -ravh -e ssh jlv@login.mesocentre.univ-amu.fr:/scratch/jlv/tmp_for_bkup_serfiles/ .
```

