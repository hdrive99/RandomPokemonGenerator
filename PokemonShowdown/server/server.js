const jsonServer = require('json-server');
const middleware = jsonServer.defaults();
const server = jsonServer.create();

server.use(middleware);
server.use(jsonServer.bodyParser);

const {Teams} = require('pokemon-showdown');

// Returns JSON object containing imported sets that are mapped to PokemonSet properties
server.post('/api/importSets', (req, res, next) => {
  res.status(200).send(
    Teams.import(req.body['model'])
  );
});

server.listen(3000, () => {
  console.log('JSON server listening on port 3000');
});
