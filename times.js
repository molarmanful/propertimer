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
      v=i.indexOf(Math.min(...i)),
      w=i.indexOf(Math.max(...i)),
      i=i.filter(a=>a!='d'),
      i.splice(v,1),
      i.splice(w-1,1),
      mean(i)
    )
  :'DNF'
mean=i=>i.find(a=>a==1/0)?'DNF':amean(i)
amean=i=>sum(i)/i.length

//create times txt file for event if it doesn't exist
fs.open(`times_${ev}.txt`,'wx',_=>{})

//read the times txt file and extract info
read=_=>fs.readFile(`times_${ev}.txt`,(_,x)=>{
  x=(x+'').split`\n`.filter(a=>a)
  y=x.map(a=>a==1/0?a:unsec(a))

  $('#t').text(x.map(a=>a==1/0?'DNF':a).join`\n`)
  $('#s').text(
    '#\t'+y.length+'\n\n'+

    'mos\t'+(y.length<1?'DNF':sec(amean(y)))+'\n'+
    'aos\t'+(y.length<3?'DNF':sec(avg(y)))+'\n\n'+

    'c-mo3\t'+(y.length<3?'DNF':sec(mean(y.slice(-3))))+'\n'+
    'c-ao5\t'+(y.length<5?'DNF':sec(avg(y.slice(-5))))+'\n'+
    'c-ao12\t'+(y.length<12?'DNF':sec(avg(y.slice(-12))))+'\n'+
    'c-ao100\t'+(y.length<100?'DNF':sec(avg(y.slice(-100))))
  )
})

//watch file and contenteditable text
$(_=>{
  read()
  fs.watch(`times_${ev}.txt`,read)
  $('#t').focus().on('keypress',e=>{
    e.which==13&&!e.shiftKey&&(
      e.preventDefault(),
      fs.writeFile(
        `times_${ev}.txt`,
        $('#t').text().split`\n`
          .filter(a=>a)
          .map(a=>a.match(/dnf/ig)?1/0:sec(unsec(a)))
          .join`\n`,
        _=>{}
      )
    )
  })
  $('#t').blur(e=>$('#t').focus())
})
