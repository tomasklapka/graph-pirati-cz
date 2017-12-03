"use strict";

const debug = require('debug')('views/view');

const context = {
    'vcard': "http://www.w3.org/2006/vcard/ns#",
    'pirg': "https://ns.pirati.info/graph#",
    'pirbb': "https://ns.pirati.info/phpBB#",
};
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

function renameAndAddProperties(target, obj) {
    for (const property in obj) {
        if (obj.hasOwnProperty(property)) {
            target[propertyMapping[property] || property] = obj[property];
        }
    }
    return target;
}

function convertToJsonLd (base, sameAsBase, url, data, collection, method) {
    const isArray = Array.isArray(data);
    if (!isArray) {
        data = [data];
    }

    const members = [];
    data = data.map(function (sourceObj) {
        const username = encodeURIComponent(sourceObj['username']);
        const obj = {};

        obj['@id'] = base;

        function setId(url, type) {
            url += '#this';
            obj['@id'] += url;
            if (sameAsBase) {
                obj['owl:sameAs'] = sameAsBase + url;
            }
            obj['@type'] = type;
        }

        switch (method) {
            case 'getById':
            case 'getByName':
                setId(url, (collection === 'group') ? 'vcard:Group' : 'vcard:Individual');
                break;
            case 'list':
                setId('/' + collection + '/' + username, (collection === 'group') ? 'vcard:Group' : 'vcard:User');
                break;
            case 'getGroups':
                setId('/group/' + username, 'vcard:Group');
                obj['vcard:hasMember'] = base + url.replace('/groups', '#this');
                break;
            case 'getMembers':
                setId('/user/' + username, 'vcard:Individual');
                members.push(base + '/user/' + username + '#this');
                break;
        };

        return renameAndAddProperties(obj, sourceObj);
    });
    if (members.length > 0) {
        const groupUrl = url.replace('/members', '#this');
        const groupObject = {
            '@id': base + groupUrl,
        };
        if (sameAsBase) {
            groupObject['owl:sameAs'] = sameAsBase + groupUrl;
        }
        groupObject['@type'] = 'vcard:Group';
        groupObject['vcard:hasMember'] = members;
        data.unshift(groupObject)
    }
    const ldjson = {
        "@context": context,
        "@graph": data
    };
    if (sameAsBase) {
        ldjson['@context']['owl'] = "http://www.w3.org/2002/07/owl#";
    }
    return ldjson;
}

function convert(data, targetMime, base, callback) {

    const $rdf = require('rdflib');
    const kb = new $rdf.IndexedFormula();

    $rdf.parse(data, kb, 'users', 'application/ld+json', function (err, kb) {
        if (err) {
            debug(err);
            callback(err);
        }
        $rdf.serialize(undefined, kb, base, targetMime, callback);
    });
}

module.exports = function (collection, method, req, res, data) {
    var accepted = req.query.accept || req.accepts('application/json', 'application/ld+json');
    accepted = accepted.replace(' ', '+'); // allows using + in query parameter instead of %2B
    if (accepted !== 'application/json') {
        const base = req.app.get('base') || req.protocol + '://' + req.get('host');
        data = convertToJsonLd(base, req.app.get('sameAsBase'), req.originalUrl, data, collection, method);
        if (accepted === 'application/ld+json') {
            debug('Returning "application/ld+json"');
            res.header('Content-type', accepted);
            res.send(data);
            return;
        }
        debug('Converting to and returning "%s"', accepted);
        data = JSON.stringify(data);
        convert(data, accepted, base, function (err, data) {
            if (err) {
                debug(err);
                res.status(500).send(err);
                return;
            }
            res.header('Content-type', accepted);
            res.send(data);
        });
        return;
    }
    debug('Returning "application/json", Accepted "%s"', accepted);
    res.json(data);
};
