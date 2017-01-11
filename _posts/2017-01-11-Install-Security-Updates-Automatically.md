---
title: Install Security Updates Automatically
layout: post
guid: urn:uuid:d5af165d-3445-4a80-9dd5-23305dfe77cf
categories:
  - notes
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

![Inspect Image](https://github.com/bizhishui/bizhishui.github.io/blob/master/media/files/2017/01/11/ubuntuAutoUpdate.png "inspect notifications")

In this section, how to make sure one's system is updated regularly with the latest security patches is introduced. Additionally, 
one learned how to set up notifications in order to keep informed when patches are applied.


### RHEL/CentOS
