# Crosswalk Demo App

Demo of [crosswalk][1], a safe router for Express and TypeScript.

Quickstart:

    yarn
    yarn ts-node src/app.ts

Then visit <http://localhost:4567/docs> to explore the API or try it on the
command line (here using [httpie][]):

    $ http :4567/movies/123/actors/han
    HTTP/1.1 200 OK
    Connection: keep-alive
    Content-Length: 65
    Content-Type: application/json; charset=utf-8
    Date: Thu, 19 Nov 2020 16:44:18 GMT
    ETag: W/"41-27LESK4eOxlXCMeD4wL3U9YXzFk"
    X-Powered-By: Express

    {
        "dateOfBirthISO": "1942-07-13",
        "id": "han",
        "name": "Harrison Ford"
    }

Here's an example of the friendly request validation errors from [ajv][]:

    $ http POST :4567/movies title='Star Wars V'
    HTTP/1.1 400 Bad Request
    Connection: keep-alive
    Content-Length: 889
    Content-Type: application/json; charset=utf-8
    Date: Thu, 19 Nov 2020 16:44:58 GMT
    ETag: W/"379-u6+f/W35+QCSArGJiO652ts109g"
    X-Powered-By: Express

    {
        "error": "data should have required property 'castActorIds',
        data should have required property 'plotSummary',
        data should have required property 'revenueUsd',
        data should have required property 'year'",
        ...
    }

[1]: https://github.com/danvk/crosswalk
[httpie]: https://httpie.io/
[ajv]: https://ajv.js.org/
