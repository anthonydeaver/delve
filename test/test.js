/// <reference path="libs/qunit.d.ts" />

QUnit.test('Delve Engine', function () {
    var delve = new Engine({'world': '0001'});
    //equal('0.0.0.1', delve.get('version'));

    raises(function () {
        delve.throwError('fail to succeed');
    }, Error, 'Must fail to succeed');
});
