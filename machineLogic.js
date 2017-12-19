'use strict'

var Packingct = null,
    Packingresults = null,
    CntInPacking = null,
    CntOutPacking = null,
    Packingactual = 0,
    Packingtime = 0,
    Packingsec = 0,
    PackingflagStopped = false,
    Packingstate = 0,
    Packingspeed = 0,
    PackingspeedTemp = 0,
    PackingflagPrint = 0,
    PackingsecStop = 0,
    PackingONS = false,
    PackingtimeStop = 60, //NOTE: Timestop en segundos
    PackingWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    PackingflagRunning = false
        //------------------------------------------Packing----------------------------------------------
              Packingct = CntOutPacking // NOTE: igualar al contador de salida
              if (!PackingONS && Packingct) {
                PackingspeedTemp = Packingct
                Packingsec = Date.now()
                PackingONS = true
                Packingtime = Date.now()
              }
              if(Packingct > Packingactual){
                if(PackingflagStopped){
                  Packingspeed = Packingct - PackingspeedTemp
                  PackingspeedTemp = Packingct
                  Packingsec = Date.now()
                  Packingtime = Date.now()
                }
                PackingsecStop = 0
                Packingstate = 1
                PackingflagStopped = false
                PackingflagRunning = true
              } else if( Packingct == Packingactual ){
                if(PackingsecStop == 0){
                  Packingtime = Date.now()
                  PackingsecStop = Date.now()
                }
                if( ( Date.now() - ( PackingtimeStop * 1000 ) ) >= PackingsecStop ){
                  Packingspeed = 0
                  Packingstate = 2
                  PackingspeedTemp = Packingct
                  PackingflagStopped = true
                  PackingflagRunning = false
                  PackingflagPrint = 1
                }
              }
              Packingactual = Packingct
              if(Date.now() - 60000 * PackingWorktime >= Packingsec && PackingsecStop == 0){
                if(PackingflagRunning && Packingct){
                  PackingflagPrint = 1
                  PackingsecStop = 0
                  Packingspeed = Packingct - PackingspeedTemp
                  PackingspeedTemp = Packingct
                  Packingsec = Date.now()
                }
              }
              Packingresults = {
                ST: Packingstate,
                CPQI: CntInPacking,
                CPQO: CntOutPacking,
                SP: Packingspeed
              }
              if (PackingflagPrint == 1) {
                for (var key in Packingresults) {
                  if( Packingresults[key] != null && ! isNaN(Packingresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/Pulse/AERO9_LOGS/arg_tor_Packing_AERO9.log', 'tt=' + Packingtime + ',var=' + key + ',val=' + Packingresults[key] + '\n')
                }
                PackingflagPrint = 0
                PackingsecStop = 0
                Packingtime = Date.now()
              }
        //------------------------------------------Packing----------------------------------------------
