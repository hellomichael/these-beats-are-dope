<!DOCTYPE html>
<html>
  <head>
    <title>These Beats Are Dope - A Curated Mixtape for Kanye West</title>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />

    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="These Beats Are Dope" />
    <meta property="og:description" name="description" content="A Curated Mixtape for Kanye West." />
    <meta property="og:url" content="http://these.beatsaredope.com" />
    <meta property="og:site_name" content="These Beats Are Dope" />
    <meta property="og:image" content="http://these.beatsaredope.com/img/og-screenshot.jpg" />

    <link rel="stylesheet" type="text/css" href="DropDeadGorgeous.css">

    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-88770808-1', 'auto');
      ga('send', 'pageview');
    </script>

    <link rel="icon" href="favicon.png"/>
    <link rel="stylesheet" href="./dist/App.css"/>
  </head>

  <body>
    <div id="app"></div>
    
    <?php
      $client_id = '6db74688ff0349308c85371275ab285a';
      $client_secret = '0988cd08186746218c146fe49c0d2042';

      $ch = curl_init();
      curl_setopt($ch, CURLOPT_URL,            'https://accounts.spotify.com/api/token' );
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1 );
      curl_setopt($ch, CURLOPT_POST,           1 );
      curl_setopt($ch, CURLOPT_POSTFIELDS,     'grant_type=client_credentials' );
      curl_setopt($ch, CURLOPT_HTTPHEADER,     array('Authorization: Basic '.base64_encode($client_id.':'.$client_secret)));

      $result=curl_exec($ch);
      echo "<script>var spotify = $result</script>";
    ?>

    <script src="js/lib/hammer-time.min.js"></script>
    <script src="js/lib/pixi.min.js"></script>
    <script src="js/lib/pixi-spine.min.js"></script>
    <script src="./dist/App.js"></script>
  </body>
</html>
