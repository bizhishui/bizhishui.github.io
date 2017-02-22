---
title: Install Security Updates Automatically
layout: post
guid: urn:uuid:d5af165d-3445-4a80-9dd5-23305dfe77cf
categories:
  - linux
tags:
  - Linux
  - soft updates
---


> Reproduced from [**Gabriel Cánepa**](http://www.tecmint.com/author/gacanepa/) [How to Install Security Updates Automatically on Debian and Ubuntu](http://www.tecmint.com/auto-install-security-updates-on-debian-and-ubuntu/)
> and [Install Security Patches or Updates Automatically on CentOS and RHEL](http://www.tecmint.com/auto-install-security-patches-updates-on-centos-rhel/)


---

It has been said before -and I couldn’t agree more- that some of the best system administrators are those who seem (note the use of the word seem here) to be lazy all the time.

One of the critical needs of a Linux system is to be kept up to date with the latest security patches available for the corresponding distribution.

In this note, settings for Ubuntu- and CentOS-like systems are presented.


### Debian/Ubuntu
To begin, install the following packages (use `sudo passwd root` to use `su`):

```
    aptitude update -y && aptitude install unattended-upgrades apt-listchanges -y
```
where *apt-listchanges* will report what has been changed during an upgrade.

Next, open `/etc/apt/apt.conf.d/50unattended-upgrades` with your preferred text editor and add this line inside the `Unattended-Upgrade::Origins-Pattern` block:

```
    Unattended-Upgrade::Mail "root";
```

Finally, use the following command to create and populated the required configuration file (`/etc/apt/apt.conf.d/20auto-upgrades`) to activate the unattended updates:

```
    dpkg-reconfigure -plow unattended-upgrades
```

Choose `Yes` when prompted to install unattended upgrades. Then check that the following two lines have been added to `/etc/apt/apt.conf.d/20auto-upgrades`:

```
    APT::Periodic::Update-Package-Lists "1";
    APT::Periodic::Unattended-Upgrade "1";
```

And add this line to make reports verbose:

```
    APT::Periodic::Verbose "2";
```

Last, inspect `/etc/apt/listchanges.conf` to make sure notifications will be sent to root.

[![Inspect Image](/media/files/2017/01/11/ubuntuAutoUpdate.png)](https://github.com/bizhishui/bizhishui.github.io/blob/master/ "inspect notifications")

In this section, how to make sure one's system is updated regularly with the latest security patches is introduced. Additionally, 
one learned how to set up notifications in order to keep informed when patches are applied.


### RHEL/CentOS
On CentOS/RHEL 7/6, you will need to install the following package:

```
    yum update -y && yum install yum-cron -y
```

#### Enable Automatic Security Updates on CentOS/RHEL 7

Once the installation is complete, open `/etc/yum/yum-cron.conf` and locate these lines – you will have to make sure that the values matches those listed here:

```
    update_cmd = security
    update_messages = yes
    download_updates = yes
    apply_updates = yes
```

The first line indicates that the unattended update command will be:

```
    yum --security upgrade
```

whereas the other lines enable notifications and automatic download and installation of security upgrades.

The following lines are also required to indicate that notifications will be sent via email from *root@localhost* to the same account (again, you may choose another one if you want).

```
    emit_via = email
    email_from = root@localhost
    email_to = root
```

#### Enable Automatic Security Updates on CentOS/RHEL 6
By default, the cron is configured to download and install all updates immediately, but we can change this behavior in `/etc/sysconfig/yum-cron` configuration file by modifying these two parameters to `yes`.

```
    # Don't install, just check (valid: yes|no)
    CHECK_ONLY=yes
    # Don't install, just check and download (valid: yes|no)
    # Implies CHECK_ONLY=yes (gotta check first to see what to download)
    DOWNLOAD_ONLY=yes
```

To enable email notification that about the security package updates, set the **MAILTO** parameter to a valid mail address.

```
    # by default MAILTO is unset, so crond mails the output by itself
    # example:  MAILTO=root
    MAILTO=admin@tecmint.com
```

Finally, start and enable the *yum-cron* service:

```
    ------------- On CentOS/RHEL 7 ------------- 
    systemctl start yum-cron
    systemctl enable yum-cron
    ------------- On CentOS/RHEL 6 -------------  
    # service yum-cron start
    # chkconfig --level 35 yum-cron on
```

