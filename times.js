//deps
fs=require('fs')
$=require('jquery')

//read config to get event
cfg=require(require('os').homedir()+'/.propertimerrc')
ev=cfg.event||'333'

//helpers
sec=x=>(x/60|0)+':'+`00${x%60|0}`.slice(-2)+'.'+`000${(x-(x|0))*1e3+.5|0}`.slice(-3)
unsec=x=>(a=x.split`:`,a[1]?a[0]*60+(a[1]*1e3|0)/1e3:(a[0]*1e3|0)/1e3)
sum=i=>i.reduce((a,b)=>a- -b,0)
avg=i=>
  i.filter(a=>a==1/0).length<2?
    (
      v=i.findIndex(a=>a==Math.min(i)),
      w=i.findIndex(a=>a==Math.max(i)),
      mean(i.filter(a=>a!='d').splice(v,1).splice(w,1))
    )
  :'DNF'
mean=i=>i.find(a=>a==1/0)?'DNF':sum(i)/i.length

//create times txt file for event if it doesn't exist
fs.open(`times_${ev}.txt`,'wx',_=>{})

//read the times txt file and extract info
read=_=>fs.readFile(`times_${ev}.txt`,(_,x)=>{
  x=(x+'').split`\n`.filter(a=>a)
  y=x.map(a=>a==1/0?a:unsec(a))

  $('#t').text(x.map(a=>a==1/0?'DNF':a).join`\n`)
  $('#s').text(
    '#\t'+y.length+'\n\n'+

    'mos\t'+sec(mean(y))+'\n'+
    'aos\t'+(y.length<3?'DNF':sec(avg(y)))+'\n\n'+

    'cmo3\t'+(y.length<3?'DNF':sec(mean(y.slice(-3))))+'\n'+
    'cao5\t'+(y.length<5?'DNF':sec(avg(y.slice(-5))))
  )
})

//watch file and contenteditable text
$(_=>{
  read()
  fs.watch(`times_${ev}.txt`,read)
  $('#t').on('keypress',e=>{
    e.which==13&&(e.preventDefault(),fs.writeFile(`times_${ev}.txt`,$('#t').text().split`\n`.filter(a=>a).map(a=>sec(unsec(a))).join`\n`.replace(/DNF/ig,1/0),_=>{}))
  })
})
