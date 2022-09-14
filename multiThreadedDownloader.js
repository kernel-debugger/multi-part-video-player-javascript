function downloadBlob(b, name="file"){ 
		let alink  = document.createElement("a");
		let bloburl = URL.createObjectURL(b);
		alink.href = bloburl 
		alink.download = name;
		document.body.appendChild(alink);
		alink.click();
		URL.revokeObjectURL(bloburl);
		delete(alink);
}

class Segment{

	constructor(url, start, end, id, dwnldr){
		this.start = start;
		this.end = end;
		this.url = url;
		this.id = id;
		this.dwnldr = dwnldr
		this.req = new XMLHttpRequest();
		this.req.timeout = 60000
		this.req.open("GET", url);
		this.req.setRequestHeader("Range", "bytes="+start+"-"+end);
		this.req.responseType = "blob";
		console.log("fetching segment: "+id);
		this.downloadSegment();
	}
}
Segment.prototype.downloadSegment =  function(){
		this.req.onload = function(){
			if(this.req.readyState==4){
				this.dwnldr.segComplete(this);
			}
		}.bind(this);

		this.req.onerror = function(){
			setTimeout(function(){
				console.log("retrying segment ", this.id)
				new Segment(this.url, this.start, this.end, this.id, this.dwnldr);
			}.bind(this),5000);

		}.bind(this);

		this.req.ontimeout = this.req.onerror

		this.req.send();
}

class Downloader{
	constructor(url,preview=false){
		this.url = url;
		this.enablePreview = preview
		this.fsize = 0;
		this.seg_size = 1024*500
		this.segs_total = 0;
		this.segs_downloaded = [];
		this.parallel_segments = 15;
		this.cursor = {start:0, end:-1};
		this.segs_created=0;
		this.bloby = new Blob();
		this.segs_joined = 0;
		this.segs_previewed = 0;
	}
	getSize(){
		return fetch(this.url,{method:"head"}).then(resp=>{
			let fsize = 0;
			resp.headers.forEach((a,b)=>{
				if(b=="content-length"){
					fsize=a*1
				}
			});
			console.log(fsize);
			return fsize;
		}).catch(ch=>{
			return 0;
		})
	}
	startDownload(){
		this.getSize().then(size=>{
			if(size){
				this.fsize = size;
				this.segs_total = Math.ceil(size/this.seg_size);
				for(let i=0;i<this.parallel_segments;i++){
					this.createSegment();
				}
			}
			else{
				console.log("No content-length found.")
			}
		})
	}
	createSegment(){
		this.cursor.start = this.cursor.end+1;
		this.cursor.end = this.cursor.start + this.seg_size;
		if(this.cursor.end>this.fsize)
			this.cursor.end = this.fsize
		this.segs_created++;
		if(this.segs_created<=this.segs_total)
			new Segment(this.url, this.cursor.start, this.cursor.end, this.segs_created, this)
	}
	segComplete(segment){
		this.segs_downloaded.push(segment);
		this.segs_downloaded = this.segs_downloaded.sort((a,b)=> {return a.id-b.id});
		this.joinSegs();
		console.log("Segment downloaded: ", segment.id);
		if(this.segs_created<this.segs_total)
			this.createSegment()
		else if(this.segs_joined==this.segs_total)
			this.downloadComplete();

	}
	downloadComplete(){ 
		console.log("download finish");
		let spl = this.url.split("/") 
		downloadBlob(this.bloby, spl[spl.length-1].split("?")[0])
	}

	joinSegs(){
		let oj = this.segs_joined;
		this.segs_downloaded.forEach(seg=>{
			if(seg.id - this.segs_joined == 1){
				this.bloby = new Blob([this.bloby, seg.req.response])
				this.segs_joined++;
			}
		});
		if(oj != this.segs_joined && this.enablePreview && (this.segs_joined - this.segs_previewed >= this.parallel_segments)){
			console.log("previewing segs: ", this.segs_joined)
			this.segs_previewed = this.segs_joined;
			this.preview();
		}
	}

	preview(){
		let vd = document.querySelector("video");
		if(vd){
			let curr = vd.currentTime
			if(vd.src.indexOf("blob")){
				URL.revokeObjectURL(vd.src);
			}
			vd.src = URL.createObjectURL(this.bloby);
			vd.currentTime = curr;
			//vd.play();
		}
	}

}

 vd = document.createElement("video");
vd.controls=true;
vd.autoplay=true;
document.body.prepend(vd);


dl = new Downloader("https://vdownload-44.sb-cd.com/1/2/12133213-480p.mp4?secure=yBLBrDgXtfPIm-ysp34YFw,1663054124&m=44&d=1&_tid=12133213", true);
dl.startDownload();