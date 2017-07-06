//deps
fs=require('fs')
$=require('jquery')

//read config to get event
cfg=require(require('os').homedir()+'/.propertimerrc')
ev=cfg.event||'333'

//helpers
sec=x=>(x/60|0)+':'+`00${x%60|0}`.slice(-2)+'.'+`000${(x-(x|0))*1e3+.5|0}`.slice(-3)

//create times txt file for event if it doesn't exist
fs.open(`times_${ev}.txt`,'wx',_=>{})

//read the times txt file and extract info
read=_=>fs.readFile(`times_${ev}.txt`,(_,x)=>{
  x=(x+'').split`\n`.filter(a=>a)
  y=x.map(a=>(b=a.split`:`,b[0]*60+(b[1]*1e3|0)/1e3))
  $('#t').text(x)
  sum=y.reduce((a,b)=>a- -b,0)
  $('#s').text(
    'Session Mean: '+(y.length<1?'DNF':sum/y.length)+'\n'+
    'Session Avg: '+(y.length<3?'DNF':(sum-Math.max(y)-Math.min(y))/(y.length-2))
  )
})

//watch file and contenteditable text
$(_=>{
  read()
  fs.watch(`times_${ev}.txt`,read)
  $('#t').on('input',x=>{
    fs.writeFile(`times_${ev}.txt`,$('#t').text(),_=>{})
  })
})
