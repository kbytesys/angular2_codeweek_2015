CodeWeek Angular2 Presentazione e Demos
=======================================

Preparazione dell'ambiente
--------------------------

Andare nella directory di questo repository e installate i pacchetti necessari con il comando:

    npm install
    
In futuro per testare e lavorare sul codice dovrete aggiungere il path locale dei moduli di nodejs
installati in locale alterando il vostro $PATH. Potete usare il comando:

    export PATH=$(npm bin):$PATH
    
che potete anche aggiungere come comando nel vostro .bashrc:

    alias nodebin='export PATH=$(npm bin):$PATH'
    
Ora entrate nella directory demos ed eseguite il comando per importare i typings:

    tsd install angular2 angular2/http angular2/router es6-promise rx rx-lite --save
    
Ora l'ambiente è pronto per l'uso.

Debug Live
==========

Per compilare e debuggare live il codice vi conviene eseguire due processi in background (o usare due terminali):

    tsc -p demos -w
    live-server --open=demos .
    
Il primo mette il compilatore typescript in attesa di modifiche sui files del progetto, il secondo lancia
un server web minimale con la capacità di autoricaricare la pagina quando modificherete uno dei files.