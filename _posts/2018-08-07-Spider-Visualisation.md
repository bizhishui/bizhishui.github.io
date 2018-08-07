---
title: Web-Scraping and Data Visualisation
layout: post
guid: urn:uuid:e0d99fdb-263c-490a-868c-761678090c93
summary: Scraper web using looter and data visualisation.
categories:
  - python
tags:
  - looter
  - scraper
  - pyecharts
  - wordcloud
---

There are plenty of articles in [zhihu](https://www.zhihu.com/search?type=content&q=%E7%88%AC%E8%99%AB), wechat official accounts and github on 
how to scraper from web. [Scrapy](https://scrapy.org/), one of the most powerful open source python package , is almost
capable for all web-scraping job. Here, I note the basic steps in scraping with [looter](https://looter.readthedocs.io/en/latest/) and the data visualisation
on crawled data with [pyecharts](http://pyecharts.org/#/).


### Scraping with looter
The basic steps in scraping are: first send a request, and followed by parsing the response and ended by data storage.

#### Make a Requests
One can send a request in using the package *requests*
```
    >>> import requests
    >>> r = requests.get('https://api.github.com/events')     # return a Response object r
    >>> r.text  # return the content of the response
    >>> r.status_code    # check the response status
```

While with *looter* one can
```
    looter shell <your url>
    >>> import looter as lt
    # in looter, has from lxml import etree
    # lxml is used for processing XML and HTML, Elements are list and carry attributes as a dict
    >>> tree = lt.fetch(url)  # return etree.HTML(r.text), the ElementTree of the response
```

#### Parse a Response
