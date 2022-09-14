# multi-part-video-player-javascript

Play Videos using multiple parallel TCP connections to increase speed in a high latency environment.<br><br>

This script creates multiple TCP connections in parallel and loads the file in small segments from start like:

Segment-1 => 0 - 500kb<br>
Segment-2 => 501kb - 1000kb<br>
Segment-3 => 1001kb - 1500kb<br>
.
.
.

Once enough segment (equal to parallel_segments) are downloaded, they will be merged and played using the player provided.
When all segments are downloaded the whole file will be downloaded to users computer. (ofcourse you can edit the code to change this behaviour)

# Usage
```
const playerEl = document.querySelector("#video-player");
const parallel_segments = 10;
const url = "https://example.com/play.mp4";
const dl = new Downloader(url, playerEl, parallel_segments);
const dl.startDownload();
```

# Important

This script is Useless on http/2 and http/3, as they use a single tcp connection for all requests, so it won't make any difference on speed to fetch multiple parts concurrently with a single tcp connection.<br>

Disable H2 and H3 in your browser and then you can use this script to boost the speed. or try using it to play a video from a server which only supports http/1.1
