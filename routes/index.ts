import usersRouter from "./users";
import rolesRouter from "./roles";
import roundingsRouter from "./roundings";
import paymentsRouter from "./payments";

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