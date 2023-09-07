var usersRouter = require('./users');
var rolesRouter = require('./roles');
var roundingsRouter = require('./roundings');
var paymentsRouter = require('./payments');

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
    },
    {
        prefix: '/payments',
        router: paymentsRouter
    }
];