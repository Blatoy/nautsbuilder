<?php header('Content-Type: text/html; charset=utf-8'); ?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>NautsBuilder V2</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="/standalone/nautsbuilder/styles/style.css">
        <link rel="icon" type="image/png" href="/resources/ui/media/images/favicon.png"/>
    </head>
    <body>
        <!-- Used to count visitors -->
        <iframe style="display:none;" src="https://orikaru.net/resources/logic/php/ajax/account.php"></iframe>
        <div id="naut-splash-art"></div>
        <div id="naut-list" class="naut-list-center"></div>
        <div class="black-box" id="naut-description"></div>
        <div class="black-box" id="skill-description"></div>

        <div id="naut-shop">
          <div class="shop-row" id="shop-row-1"></div>
          <div class="shop-row" id="shop-row-2"></div>
          <div class="shop-row" id="shop-row-3"></div>
          <div class="shop-row" id="shop-row-4"></div>
        </div>
        <div id="build-order">
          <div style="margin: 5px;">Buy order</div>
          <div id="build-order-content"></div>
        </div>

        <div class="black-box build-info" id="build-info-1"></div>
        <div class="black-box build-info" id="build-info-2"></div>
        <div class="black-box build-info" id="build-info-3"></div>
        <div class="black-box build-info" id="build-info-4"></div>
        <div class="black-box build-info" id="build-summary"></div>
        <div class="black-box" id="about">
          Assets taken from <a href="http://store.steampowered.com/app/204300/Awesomenauts/">Awesomenauts</a>, data gathered by the community!<br>
          Made with love by Blatoy, inspired by <a href="http://nautsbuilder.com">Nautsbuilder</a>.<br>
          If you have anything to report or want to be able to update the data join <a href="">this Discord</a>!<br>
        </div>

        <div id="tooltip"></div>

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
