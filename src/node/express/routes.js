module.exports = function (app, db) {
    /*app.get('/', function(request, response) {
      console.log(request.user);
      response.sendFile('/static/index.html');
    });

    app.get('/getDreams', function (request, response) {
        db.all('SELECT * from Dreams', function (err, rows) {
            response.send(JSON.stringify(rows));
        });
    });*/

    app.get('/api/users/current', function (request, response) {
        console.log('/api/users/current: ' + JSON.stringify(request.user));
        if (request.user) {
            response.send(JSON.stringify({
                'id': request.user.id,
                'name': request.user.displayName,
            }));
        } else {
            response.send(JSON.stringify({
                'id': 'anonymous',
                'name': 'anonymous',
            }));
        }
    });
    console.log('routes loaded.');
}