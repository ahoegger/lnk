/**
 * Created by Holger on 17.09.2014.
 */
var halson = require('halson');
describe('it handles hateaos cool', function() {
    it('will create some links', function() {
        var tag = {
            id: 1234,
            name: 'Java'
        };
        var fancy = {
            id: 4343423,
            tiger: 'scott'
        };
        var resource = new halson(tag);
        resource.addLink('self', '/tags/' + tag.id);
        resource.addLink('author',
                          {href: 'dummy',
                           title: 'dummy'}
        );
        var embedresource = new halson(fancy)
            .addLink('self', '/fancy/' + fancy.id);
        resource.addEmbed('fancy', embedresource);
        console.log(resource.name);
        console.log(JSON.stringify(resource));
    })
});