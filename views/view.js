"use strict";

const debug = require('debug')('views/view');

const propertyMapping = {
    'id':       'vcard:hasUID',
    'fullname': 'vcard:fn',
    'username': 'pirg:username',
    'type':     'pirg:type',
    'email':    'pirg:email',
    'rank':     'pirg:rank',
    'user_id':  'pirbb:user_id',
    'language': 'pirbb:user_lang',
    'address':  'pirbb:user_from',
    'about':    'pirbb:group_desc',
    'display':  'pirbb:group_display',
    'colour':   'pirbb:group_colour',
}

function renameProperties(obj) {
    const clone = {};
    for (const property in obj) {
        if (obj.hasOwnProperty(property)) {
            clone[propertyMapping[property] || property] = obj[property];
        }
    }
    return clone;
}

function convertToJsonLd (base, sameAsBase, url, data, collection, method) {
    const isArray = Array.isArray(data);
    if (!isArray) {
        data = [ data ];
    }

    data = data.map(function (sourceObj) {
        const username = encodeURIComponent(sourceObj['username']);
        const obj = renameProperties(sourceObj);

        obj['@id'] = base;
        if (collection === 'group') {
            obj['@type'] = 'vcard:Group';
        } else {
            obj['@type'] = 'vcard:Individual';
        }

        function setId(url) {
            url += '#this';
            obj['@id'] += url;
            if (sameAsBase) {
                obj['owl:sameAs'] = sameAsBase + url;
            }
        }

        switch (method) {
            case 'getById':
            case 'getByName':
                setId(url);
                break;
            case 'list':
                setId('/' + collection + '/' + username);
                break;
            case 'getGroups':
                setId('/group/' + username);
                obj['@type'] = 'vcard:Group';
                break;
            case 'getMembers':
                setId('/user/' + username);
                obj['@type'] = 'vcard:Individual';
                break;
        };
        return obj
    });
    const ldjson = {
        "@context": {
            "vcard": "http://www.w3.org/2006/vcard/ns#",
            "pirg": "https://ns.pirati.info/graph#",
            "pirbb": "https://ns.pirati.info/phpBB#",
        },
        "@graph": data
    };
    if (sameAsBase) {
        ldjson['@context']['owl'] = "http://www.w3.org/2002/07/owl#";
    }
    return ldjson;
}

module.exports = function (collection, method, req, res, data) {
    const accepted = req.accepts('application/json', 'application/ld+json');
    debug(accepted);
    if (accepted !== 'application/json') {
        const base = req.app.get('base') || req.protocol + '://' + req.get('host');
        data = convertToJsonLd(base, req.app.get('sameAsBase'), req.originalUrl, data, collection, method);
        if (accepted === 'application/ld+json') {
            res.header('Content-type', accepted);
            res.send(data);
            return;
        }
        // TODO: res.send(convertToAnotherRdfFormat(data)); return;
        // or fallback to json for now
    }
    // failback to json
    res.json(data);
}