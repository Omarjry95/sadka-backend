var usersRouter = require('./users');
var rolesRouter = require('./roles');
var roundingsRouter = require('./roundings');

module.exports = [
    {
        prefix: '/users',
        router: usersRouter
    },
    {
        prefix: '/roles',
        router: rolesRouter
    },
    {
        prefix: '/roundings',
        router: roundingsRouter
    }
];