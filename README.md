# Clock with pill reminder


For the moment, it features a clock, a weather service. No Reminders yet, but working on it.
I use it on an old Nexus 4 smartphone.

It's in the living room, as a 'smartclock' :-)


![alt text](project/IMG_20161217_153528.jpg	 "My living room smartclock")

![alt text](project/IMG_20161217_153426.jpg	 "My living room smartclock")


Later on, I will add a warning system to remember taking daily pills.

##Raspberry PI
Used as a server to run the clock and handle the reminders

##Node.js
Used as the web server and soket server

##PM2
Runs tasks on the PI and keep the alive, even after reboot of the PI.
Used to keep the node.js server alive.

##Socket.io
This is used to
- send messages over socket from the server (nodejs) to all the clients: to update the reminders.
- send messages over socket to all clients to resume active reminder popups.

##Wunderlist API
Wunderlist is used to maintain the reminders.
Any reminder with a due date will pop up on the clock and can be resumed from any client by tapping the reminder.
STILL TO DO.


##set up globally accessible domain
- at https://my.noip.com, make an account for a dynDNS. This will link a domain to the router
- on the TP-link router:
  * Forwarding > DMZ : add local ip address of the PI
  * Dynamic DNS: fill in account credentials for www.no-ip.com
- on the telenet router (mijn.telenet.be):
  * Wireless modem > Geavanceerde instellingen > IPv4 Firewall & Port forwarding > DMZ adres: add address of TP-link router: 192.168.0.171
  * PORT FORWARDING: 171 for begin and end port 3000

