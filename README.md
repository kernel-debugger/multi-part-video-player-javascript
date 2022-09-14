# multi-part-video-player-javascript

Play Video using multiple TCP connections to increase speed in a high latency environment.

This script creates multiple TCP connections and loads the file in small segments from start like:

Segment-1 => 0 - 500kb
Segment-2 => 501kb - 1000kb
Segment-3 => 1001kb - 1500kb
.
.
.

Once enough segment (equal to parallel_segments) are downloaded, they will be joined and played using the player.
When all segments are downloaded the whole file will be downloaded to users computer. (ofcourse you can edit the code to change this behaviour)

# Usage

>> const playerEl = document.querySelector("#video-player");
>> const parallel_segments = 10;
>> const url = "https://example.com/play.mp4";
>> const dl = new Downloader(url, playerEl, parallel_segments);
>> const dl.startDownload();
