# Beaux dés 

Control a part of Bodet from api or gnome extensions

## Install

### Server

``` docker build -t bodet-server . ```

``` docker run -e "EMAIL=<email>" -e "PASSWORD=<password>" -p 6578:6578 --name=bodet -d --restart always bodet-server```


## Gnome Extension

Type :

``` ln -s /home/<your-home>/.local/share/gnome-shell/extensions/beauxdes@corentinlabroche.fr ./gnome-extension ```

Then :

``` gnome-extensions enable  beauxdes@corentinlabroche.fr```

To restart extenstion:

``` Alt+f2 ``` -  ``` r ``` -  ``` Enter ```