const jsonServer = require('json-server');
const middleware = jsonServer.defaults();
const server = jsonServer.create();

server.use(middleware);
server.use(jsonServer.bodyParser);

const {Teams} = require('pokemon-showdown');

server.get('/api/teams', (req, res, next) => {
  res.status(200).send(
    Teams.generate('gen8ou')
  );
});

server.listen(3000, () => {
  console.log('JSON server listening on port 3000');
});
