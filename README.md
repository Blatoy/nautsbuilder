# About Nautsbuilder V2
Nautsbuilder V2 is a web application to share builds for the game Awesomenauts, the data is kept up to date by the community.
You can find a live version of it on my website here: https://orikaru.net/nautsbuilder

# How is the data updated
Characters, skills, upgrades and configuration are stored in a big spreadsheet that can be pushed to the server using [this link](https://orikaru.net/pages/games/awesomenauts/nautsbuilder-import.php)
Only people with a special privilege can change the live version. If you are interested in updating the data, join https://discord.gg/GsE29w7 and ask Blatoy#1574.
You can find a copy of this spreadsheet with a description on how it works here: https://docs.google.com/spreadsheets/d/1PGVPHVZ0k7nK82-PdeKrbzW4s_DlQDRN_c02_yS0J2o/edit?usp=sharing please note that this isn't the current version of the spreadsheet.

# API format
The API is a "static" API that can be updated using the page linked above. You can check the API format by pressing "Export JSON" in the spreadsheet linked above. It does also have a "dynamic" API used to report problems.
I don't have any plan to release the API for the 3 following reasons:
 - APIs handling characters data just display the exported JSON string from spreadsheet.
 - It uses libraries from Orikaru that I don't want to share.
 - You can use the live API located at https://orikaru.net/resources/logic/php/ajax/awesomenauts.php
 If you are struggling to implement the API PM me and I'll explain you how the APIs does work in more detail.

# What need to be changed when cloning the project to make it work
- config.js => Make sure all paths are correct (ctrl-f "/nautsbuilder/")
- index.html => Make sure all paths are correct (ctrl-f "/nautsbuilder/")
- main.css => Make sure all paths are correct (ctrl-f "/nautsbuilder/")

## Credits
Inspired by the first version of this tool by Leimi: https://github.com/Leimi/nautsbuilder and kept up to date by the community (you can find a list on the live website). This tool was made from scratch by Blatoy using jQuery
Images taken from the game [Awesomenauts](awesomenauts.com)
