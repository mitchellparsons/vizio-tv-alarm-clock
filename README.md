# vizio-tv-alarm-clock

# Setup on Raspberry PI
### Install Docker
curl -sSL https://get.docker.com | sh
### Set the display to not sleep
In the [SeatDefaults] section of file "/etc/lightdm/lightdm.conf"
Add
> # don't sleep the screen
> xserver-command=X -s 0 dpms

### Install chromium browser
sudo apt-get install chromium-browser
DISPLAY=:0 chromium-browser

### run using
docker run -d -p 3000:3000 mitchellparsons/arm-vizio-tv-alarm
DISPLAY=:0 chromium-browser -kiosk "127.0.0.1:3000/tv.html" &
