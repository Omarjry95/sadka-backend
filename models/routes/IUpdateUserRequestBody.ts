import { intersection, partial, string, type, undefined as optional, union, keyof } from "io-ts";

export const IUpdateUserRequestBody = intersection([
    type({
        role: keyof({
            "0": null,
            "1": null,
            "2": null
        })
    }),
    partial({
        lastName: union([string, optional]),
        firstName: union([string, optional]),
        charityName: union([string, optional]),
        defaultAssociation: union([string, optional]),
        isPhotoChanged: union([keyof({ "1": null }), optional])
    })
]);