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
To parse a ElementTree, one can use *cssselect* and *xpath*, here I'll use cssselect. 
For the response requested directly by requests.get, we first convert the content of the response explicitly with [lxml.etree](https://lxml.de/tutorial.html),
while for *looter*, a tree object has already been returned by *fetch*.

```
    # with looter, we don't need import it explicitly, as it has already importted within it.
    >>> from lxml import etree
    >>> tree = etree.HTML(r.text)

    # select the interesting part of tree with CSS tag
    >>> items = tree.cssselect('td input')  # select the input class inside table td, td and input are html/css tag
    >>> items = tree.cssselect('.question-summary') #another example for stackoverflow
    # cssselect usually return a list of Element
    >>> items
    [<Element div at 0x1037f89c8>, <Element div at 0x1037f8a08>, ..., <Element div at 0x103954ac8>]

    >>> item = items[0]
    >>> item
    <Element div at 0x1037f89c8>
    # item may contains a dict
    >>> item.attrib  # Elements carry attributes as a dict
    {'class': 'question-summary', 'id': 'question-summary-231767'}
    >>> subitem = item.cssselect('a.question-hyperlink')
    >>> len(subitem)  # a list
    1
    >>> subitem[0].attrib
    {'href': '/questions/231767/what-does-the-yield-keyword-do', 'class': 'question-hyperlink'}
    >>> subitem[0].text
    'What does the “yield” keyword do?'
```

#### Save wanted data
