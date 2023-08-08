var usersRouter = require('./users');
var rolesRouter = require('./roles');

module.exports = [
    {
        prefix: '/users',
        router: usersRouter
    },
    {
        prefix: '/roles',
        router: rolesRouter
    }
];