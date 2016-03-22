var urlUtils = hammerhead.get('./utils/url');

var nativeMethods = hammerhead.nativeMethods;

test('window.onerror setter/getter', function () {
    strictEqual(getProperty(window, 'onerror'), null);

    setProperty(window, 'onerror', 123);
    strictEqual(getProperty(window, 'onerror'), null);

    var handler = function () {
    };

    setProperty(window, 'onerror', handler);
    strictEqual(getProperty(window, 'onerror'), handler);
});

asyncTest('FontFace', function () {
    var nativeFontFace = nativeMethods.FontFace;
    var url            = 'https://fonts.com/fs_albert.woff2';
    var desc           = {};

    nativeMethods.FontFace = function (family, source, descriptors) {
        strictEqual(family, 'family');
        strictEqual(source, 'url("' + urlUtils.getProxyUrl(url) + '")');
        ok(descriptors, desc);

        nativeMethods.FontFace = nativeFontFace;
        start();
    };

    return new FontFace('family', 'url("' + url + '")', desc);
});

module('regression');

// NOTE: https://connect.microsoft.com/IE/feedback/details/801810/web-workers-from-blob-urls-in-ie-10-and-11
var isWorkerFromBlobSupported = (function () {
    try {
        return !!new Worker(URL.createObjectURL(new Blob(['var a = 42;'])));
    }
    catch (e) {
        return false;
    }
})();

if (isWorkerFromBlobSupported) {
    asyncTest('blob should try to process data as a script even if the content type is not passed (GH-231)', function () {
        var script  = 'var obj = {}, prop = "prop"; obj[prop] = true; postMessage(true);';
        var blobURL = URL.createObjectURL(new Blob([script]));

        new Worker(blobURL).onmessage = function (e) {
            ok(e.data);
            start();
        };
    });
}

test('window.onerror must be overriden (B238830)', function () {
    var error     = false;
    var windowObj = window.Window;

    window.onerror = function () {
        error = true;
    };

    window.Window = function () {
    };

    window.addEventListener('click', function () {
    });

    window.Window = windowObj;

    ok(!error);
});

