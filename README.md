<h1 class="code-line" data-line-start=0 data-line-end=1 ><a id="multipartvideoplayerjavascript_0"></a>multi-part-video-player-javascript</h1>
<p class="has-line-data" data-line-start="2" data-line-end="3">Play Video using multiple TCP connections to increase speed in a high latency environment.</p>
<p class="has-line-data" data-line-start="4" data-line-end="5">This script creates multiple TCP connections and loads the file in small segments from start like:</p>
<p class="has-line-data" data-line-start="6" data-line-end="12">Segment-1 =&gt; 0 - 500kb<br>
Segment-2 =&gt; 501kb - 1000kb<br>
Segment-3 =&gt; 1001kb - 1500kb<br>
.<br>
.<br>
.</p>
<p class="has-line-data" data-line-start="13" data-line-end="15">Once enough segment (equal to parallel_segments) are downloaded, they will be joined and played using the player.<br>
When all segments are downloaded the whole file will be downloaded to users computer. (ofcourse you can edit the code to change this behaviour)</p>
<h1 class="code-line" data-line-start=16 data-line-end=17 ><a id="Usage_16"></a>Usage</h1>
<pre><code class="has-line-data" data-line-start="18" data-line-end="24" class="language-js"><span class="hljs-keyword">const</span> playerEl = <span class="hljs-built_in">document</span>.querySelector(<span class="hljs-string">"#video-player"</span>);
<span class="hljs-keyword">const</span> parallel_segments = <span class="hljs-number">10</span>;
<span class="hljs-keyword">const</span> url = <span class="hljs-string">"https://example.com/play.mp4"</span>;
<span class="hljs-keyword">const</span> dl = <span class="hljs-keyword">new</span> Downloader(url, playerEl, parallel_segments);
<span class="hljs-keyword">const</span> dl.startDownload();
</code></pre>
