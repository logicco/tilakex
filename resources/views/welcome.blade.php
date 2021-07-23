<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Tilakex</title>
        <link href="{{ asset("css/app.css") }}" rel="stylesheet">
    </head>
    <body>
        <div id="root"></div>
        <div id="modal"></div>
        <div id="transaction-modal"></div>

        <script src="{{ asset("js/index.js") }}"></script>
    </body>
</html>
