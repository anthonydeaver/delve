/// <reference path="lib/qunit.d.ts" />
QUnit.test("deepEqual test", function () {
    var obj = { foo: "bar" };

    QUnit.deepEqual(obj, { foo: "bar" }, "Two objects can be the same in value");
});
