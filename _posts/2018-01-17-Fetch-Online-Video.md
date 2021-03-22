---
title: Fetch online video
layout: post
guid: urn:uuid:fc2af222-3816-42ec-b7a2-43062d79b747
summary: Youtube-dl is a command-line opensource tool for downloading videos from youtube.com or other video sites.
update_date: 2019-04-30
categories:
  - notes
tags:
  - Linux
  - Youtube
  - Ffmpeg
---

### Youtube-dl

Youtube-dl is a command-line opensource tool for downloading videos from youtube.com or other video sites. The presentation
and installation guides can be founded on github [rg3/youtube-dl](https://github.com/rg3/youtube-dl/blob/master/README.md#readme).
Here, some useful commands are summarised.

```
    #list all avaiable options
    youtube-dl -h

    #list all avaiable formats of a video
    youtube-dl -F https://www.youtube.com/watch?v=-IMNuTB61m8
    #Here is the list of all avaiable formats
    [youtube] -IMNuTB61m8: Downloading webpage
    [youtube] -IMNuTB61m8: Downloading video info webpage
    [youtube] -IMNuTB61m8: Extracting video information
    [info] Available formats for -IMNuTB61m8:
    format code  extension  resolution note
    249          webm       audio only DASH audio   52k , opus @ 50k, 19.88MiB
    250          webm       audio only DASH audio   63k , opus @ 70k, 23.71MiB
    171          webm       audio only DASH audio   91k , vorbis@128k, 35.51MiB
    251          webm       audio only DASH audio  111k , opus @160k, 42.48MiB
    140          m4a        audio only DASH audio  130k , m4a_dash container, mp4a.40.2@128k, 52.59MiB
    278          webm       256x142    144p  102k , webm container, vp9, 15fps, video only, 32.63MiB
    160          mp4        256x142    144p  109k , avc1.4d400b, 15fps, video only, 15.61MiB
    133          mp4        426x234    240p  205k , avc1.4d4015, 15fps, video only, 27.93MiB
    242          webm       426x234    240p  206k , vp9, 15fps, video only, 49.74MiB
    243          webm       640x352    360p  394k , vp9, 15fps, video only, 88.68MiB
    134          mp4        640x352    360p  533k , avc1.4d4016, 15fps, video only, 64.15MiB
    244          webm       854x470    480p  705k , vp9, 15fps, video only, 150.31MiB
    135          mp4        854x470    480p 1071k , avc1.4d401e, 15fps, video only, 122.35MiB
    17           3gp        176x144    small , mp4v.20.3, mp4a.40.2@ 24k
    36           3gp        320x176    small , mp4v.20.3, mp4a.40.2
    18           mp4        640x352    medium , avc1.42001E, mp4a.40.2@ 96k
    43           webm       640x360    medium , vp8.0, vorbis@128k (best)

    #download the video with a specified format
    youtube-dl -f 18 https://www.youtube.com/watch?v=-IMNuTB61m8
    #an output example
    [youtube] -IMNuTB61m8: Downloading webpage
    [youtube] -IMNuTB61m8: Downloading video info webpage
    [youtube] -IMNuTB61m8: Extracting video information
    [download] Destination: 股轩金钱爆20180116--IMNuTB61m8.mp4
    [download] 100% of 159.22MiB in 00:14

    #download a video in mp3 audio format (need ffmpeg)
    youtube-dl https://www.youtube.com/watch?v=-IMNuTB61m8 -x --audio-format mp3
    #one can also convert mp4 to mp3 directly with ffmpeg (with Constant Bitrate Encoding)
    ffmpeg -i video.mp4 -vn -acodec libmp3lame -ac 2 -ab 160k -ar 48000 audio.mp3

    #download all videos of specific channel (appending the channel's URL)
    youtube-dl -citw https://www.youtube.com/channel/UC_d42su5rbQyrqvd0VPoQqw

    #download all videos from a watch list, be care the proper URL of playlist
    youtube-dl -cit https://www.youtube.com/playlist?list=PL5FDCD8CE05AD78DC

    #if your network is behind the proxy
    youtube-dl --proxy http://proxy-ip:port -f 18 https://www.youtube.com/watch?v=-IMNuTB61m8

    #download a collection of videos (write all videos' URL in a file called youtube_list.txt)
    #--no-playlist: Download only the video, if the URL refers to a video and a playlist.
    #-a: File containing URLs to download ('-' for stdin)
    #-f best: choose best resolution
    youtube-dl --no-playlist -f best -a youtube_list.txt
    #download and embed subtitles
    youtube-dl --no-playlist -f best --write-sub --embed-subs -a youtube_list.txt 
    #download only mp3 audio
    youtube-dl --no-playlist -x --audio-format mp3 -a youtube_list.txt
```

### blob url video
Some HTML5 videos whose URL is not a simple mp4 file, but its URL is [blob type](https://stackoverflow.com/questions/42901942/how-do-we-download-a-blob-url-video) for example

```
    <video class="dplayer-video dplayer-video-current" webkit-playsinline="" playsinline="" preload="metadata" 
    src="blob:https://example.com/90fe7f52-fe94-4953-8dce-ccaf4a775c6a">
    </video>
```

Here are the basic steps to get the video from such an HTML5 page,

1. Open the browser Dev Tools (*Ctrl-Shift-I* for Chromium) on the page with the video you are interested in;
2. Go to *Network* tab and reload the page (F5)
3. Search through the names of requests and find the request with *.m3u8* extension. There may be many of them, but most likely the first you find is the one you are looking for. It may have any name, e.g. *index.m3u8*.
4. Open the request and under *Headers* subsection you will see request's full URL in *Request URL* field. Copy it. 
5. Download with youtube-dl or directly with [ffmpeg](https://superuser.com/questions/1260846/downloading-m3u8-videos), such as *ffmpeg -protocol_whitelist file,http,https,tcp,tls,crypto -i "https://example.com/20190331/804_834b755f/1000k/hls/index.m3u8" -c copy ./example.mp4*

