<?php header('Content-Type: text/html; charset=utf-8'); ?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>NautsBuilder V2</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="/standalone/nautsbuilder/styles/main.css">
        <link rel="stylesheet" type="text/css" href="/standalone/nautsbuilder/styles/shop.css">
        <link rel="stylesheet" type="text/css" href="/standalone/nautsbuilder/styles/naut-info.css">
        <link rel="stylesheet" type="text/css" href="/standalone/nautsbuilder/styles/tooltip.css">
        <link rel="stylesheet" type="text/css" href="/standalone/nautsbuilder/styles/upgrade.css">
        <link rel="icon" type="image/png" href="/standalone/nautsbuilder/images/favicon.png"/>
    </head>
    <body>
        <!-- Used to count visitors -->
        <iframe style="display:none;" src="https://orikaru.net/resources/logic/php/ajax/account.php"></iframe>
        <!-- Nauts presentation, hidden while shop open -->
        <div id="naut-splash-art"></div>
        <div id="naut-list" class="naut-list-center"></div>
        <div class="black-box" id="naut-description"></div>
        <div class="black-box" id="skill-description"></div>

        <!-- Shop -->
        <div id="naut-shop">
          <div class="shop-row" id="shop-row-1"></div>
          <div class="shop-row" id="shop-row-2"></div>
          <div class="shop-row" id="shop-row-3"></div>
          <div class="shop-row" id="shop-row-4"></div>
        </div>

        <!-- Buy order -->
        <div id="build-order">
          <div style="margin: 5px;">Buy order <span class="small-text">(Click 2 items to swap)</span></div>
          <div id="build-order-content"></div>
        </div>

        <!-- Build summary -->
        <div class="black-box build-info" id="build-info-1"></div>
        <div class="black-box build-info" id="build-info-2"></div>
        <div class="black-box build-info" id="build-info-3"></div>
        <div class="black-box build-info" id="build-info-4"></div>
        <div class="black-box build-info" id="build-summary"></div>
        <div class="black-box" id="about">
          Assets taken from <a href="http://store.steampowered.com/app/204300/Awesomenauts/">Awesomenauts</a>, data gathered by the community!<br>
          Made with love by <a href="http://steamcommunity.com/id/blatoy/">Blatoy</a>, inspired by <a href="http://nautsbuilder.com">Nautsbuilder</a>.<br>
          If you have anything to report or want to be able to update the data join <a href="https://discord.gg/GsE29w7">this Discord</a>!<br>
          If you want to help me, you can pay me a <a href="/donate">coffee</a>!
        </div>

        <!--<div onclick="$(this).remove();" style="cursor: pointer; text-align: center; z-index: 1100; position: fixed; top: 0; left: 0; width: 100%; height: 30px; line-height: 30px; background-color: orange; color:white;">
          I'm updating the tool in live and it may not work properly.
        </div>-->

        <div id="tooltip"></div>
        <div id="export-div"></div>

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
        <script src="/standalone/nautsbuilder/scripts/globalUpgrades.js"></script>
        <script src="/standalone/nautsbuilder/scripts/utils.js"></script>
        <script src="/standalone/nautsbuilder/scripts/event-manager.js"></script>
        <script src="/standalone/nautsbuilder/scripts/tooltip.js"></script>
        <script src="/standalone/nautsbuilder/scripts/skill-parser.js"></script>
        <script src="/standalone/nautsbuilder/scripts/ui-manager.js"></script>
        <script src="/standalone/nautsbuilder/scripts/nautsbuilder.js"></script>
        <script src="/standalone/nautsbuilder/scripts/main.js"></script>
    </body>
</html>
