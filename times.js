fs=require('fs')
$=require('jquery')

cfg=require(require('os').homedir()+'/.propertimerrc')
ev=cfg.event||'333'

fs.open(`times_${ev}.txt`,'wx',_=>{})
read=_=>fs.readFile(`times_${ev}.txt`,(_,x)=>{
  x=(x+'').split`\n`.filter(a=>a)
  $('#t').text(x)
})

$(_=>{
  read()
  fs.watch(`times_${ev}.txt`,read)
  $('#t').on('input',x=>{
    fs.writeFile(`times_${ev}.txt`,$('#t').text(),_=>{})
  })
})
