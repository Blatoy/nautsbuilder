# Nautsbuilder V2

Nautsbuilder V2 is a web app to share builds for the game Awesomenauts, the live version can be found at https://orikaru.net/nautsbuilder

## Where is the shop data stored?

Characters, skills and upgrades are stored in a big Google Spreadsheet which is updated manually by a few members of the community. If you are interested in updating the data, join https://discord.gg/GsE29w7 and ping @Blatoy.
You can find an outdated copy of this spreadsheet here: https://docs.google.com/spreadsheets/d/1PGVPHVZ0k7nK82-PdeKrbzW4s_DlQDRN_c02_yS0J2o/edit?usp=sharing

## How can I access the latest shop data?

The spreadsheet is converted to JSON and is served by a "static" API, which can be updated by a few members of the community. The page to update the API and the API itself is not open source. (If you want to replace that, you only need to serve the JSON files yourself)

The live data is accessible at https://orikaru.net/resources/logic/php/ajax/awesomenauts.php and can be requested like this:

```js
// NOTE: CORS is probably not configured to allow you access it from another page
const response = await fetch("https://orikaru.net/resources/logic/php/ajax/awesomenauts.php", {
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    "body": "action=nautsbuilder-get-characters", // Valid actions: nautsbuilder-get-contributors, nautsbuilder-get-characters, nautsbuilder-get-upgrades, nautsbuilder-get-skills, nautsbuilder-get-config, nautsbuilder-get-version
    "method": "POST"
});

await response.json();
```

## How to run

The app structure mirrors what is on Orikaru. All you need to do to run the app is to serve the `www` folder and then open your browser at `<localhost>/standalone/nautsbuilder/index.html`

## Contributing

Currently, I want to rewrite Nautsbuilder with more modern tools (this code still uses `var` in some places 🥲), but feel free to poke around. I am mostly looking for people to actually update the shop data.

## Credits

Inspired by the first version of this tool by Leimi (https://github.com/Leimi/nautsbuilder) and kept up to date by the community (you can find a list of contributor on the live website).

Made by young Blatoy, using jQuery.

Images taken from the game [Awesomenauts](awesomenauts.com)
