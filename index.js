//deps
$=require('jquery')
fs=require('fs')
scr=require('./scrambler.js')

//read config
cfg=require(require('os').homedir()+'/.propertimerrc')
inspect=cfg.inspect||1
ev=cfg.event||'333'

//start scrambler for current event
scr[ev].initialize(null,Math)

//init vars
state=0
pen=0

//scrambler
scram=x=>(
  x=scr[ev].getRandomScramble().scramble_string,
  ev=='333bf'&&(x+=' '+['','Rw','Rw2','Rw\'','Fw','Fw\''][randomInt.below(6)]+' '+['','Dw','Dw2','Dw\''][randomInt.below(4)]),
  $('#scramble').text(x)
)

//conversions
sec=x=>(x/60|0)+':'+`00${x%60|0}`.slice(-2)+'.'+`000${(x-(x|0))*1e3+.5|0}`.slice(-3)
unsec=x=>(a=x.split`:`,a[1]?a[0]*60+(a[1]*1e3|0)/1e3:(a[0]*1e3|0)/1e3)

//inspection time
insp=_=>(state=2,ins=15,INSP=setInterval(_=>{
  ins>0?
    $('#time').html(ins--)
  :ins>-2?
    ($('#time').html('+2'),ins--,pen=1)
  :(pen=2,$('#time').html('DNF'),clearInterval(INSP),done())
},1e3))

//timing
time=_=>(state=1,$('#time').css({color:'initial'}),state=1,ms=new Date(),TIME=setInterval(_=>{
  $('#time').html(sec((new Date()-ms)/1e3))
}),1)

//post-timing
done=_=>(state=0,fs.appendFile(`times_${ev}.txt`,(pen==2?'d':pen==1?sec(unsec($('#time').text())+2):$('#time').text())+'\n',_=>{}),scram())

//inspect or time using keyup, stop timer using keydown
$(_=>{
  scram()
  $(window).keyup(e=>{
    e.which==32&&(
      state==2?
        (clearInterval(INSP),time())
      :state==1?
        done()
      :(
        pen=0,inspect?
          insp()
        :time()
      )
    )
  })
  $(window).keydown(e=>{
    e.which==32&&(
      state==1?
        clearInterval(TIME)
      :0
    )
  })
})
