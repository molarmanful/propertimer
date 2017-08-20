E=require('electron')
fs=require('fs')
app=E.app

fs.writeFile(require('os').homedir()+'/.propertimerrc','module.exports={}',{flag:'wx'},_=>{})

let timer,times
app.on('ready',_=>{
  timer=new E.BrowserWindow({frame:false})
  times=new E.BrowserWindow({frame:false})
  timer.loadURL(`file://${__dirname}/index.html`)
  times.loadURL(`file://${__dirname}/times.html`)
})
