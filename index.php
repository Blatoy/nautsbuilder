<?php header('Content-Type: text/html; charset=utf-8'); ?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>NautsBuilder V2</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" type="image/png" href="/nautsbuilder/images/favicon.png"/>
        <link rel="stylesheet" type="text/css" href="/nautsbuilder/styles/main.css">
    </head>
    <body>
        <!-- Nauts presentation, hidden while shop open -->
        <div id="naut-display">
          <div id="naut-name"></div>
          <img id="naut-art"/>
        </div>
        <div id="naut-list" class="naut-list-center">
        </div>
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
        <div id="build-order" style="display: none;">
          <div style="margin: 5px;"><span id="buy-order-text">Buy order <span class='small-text'>(Drag to reorder)</span></span><span style="float: right;" class="small-text"><a onclick="Setting.toggleBuyOrder()" id="buy-order-status" href="#">Disable</a></span></div>
          <div id="build-order-content"></div>
        </div>

        <!-- Build summary -->
        <!--<div class="black-box build-info" id="build-info-1"></div>
        <div class="black-box build-info" id="build-info-2"></div>
        <div class="black-box build-info" id="build-info-3"></div>
        <div class="black-box build-info" id="build-info-4"></div>
        <div class="black-box build-info" id="build-summary"></div>-->

        <!-- About -->
        <!--<div class="black-box" id="about">
          Assets taken from <a href="http://store.steampowered.com/app/204300/Awesomenauts/">Awesomenauts</a>, data gathered by the community!<br>
          Join <a href="https://discord.gg/GsE29w7">this Discord</a> if you want to report anything wrong with the upgrades.
          If you have any feedback check the <a href="http://github.com/Blatoy/nautsbuilder/issues">github page</a>.<br>
          Made with love by <a href="http://steamcommunity.com/id/blatoy/">Blatoy</a>, inspired by <a href="http://nautsbuilder.com">Nautsbuilder</a>.<br>
          If you want to help me, you can buy me a <a href="/donate">coffee</a>!
        </div>-->

        <!-- Export image div -->
        <div id="export-div"></div>

        <!-- These 2 scripts can't be included automatically -->
        <script src="/nautsbuilder/config/config.js"></script>
        <script src="/nautsbuilder/scripts/main.js"></script>
        <div id="loading">
          <img src="/nautsbuilder/images/loading.png"/><br>
          <span>Loading Nautsbuilder...</span>
        </div>

        <!-- Used to count visitors -->
        <!--<iframe style="display:none;" src="https://orikaru.net/resources/logic/php/ajax/account.php"></iframe>-->
        <!-- Google Analytics  -->
        <script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

          ga('create', 'UA-62317289-1', 'auto');
          ga('send', 'pageview');
        </script>
        <!--- TODO Remove this as it's used for debug purpose only -->
        <script src="http://localhost:35729/livereload.js"></script>
    </body>
</html>
