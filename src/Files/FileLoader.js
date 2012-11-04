/**
 * @file Contains all ShipGL.FileLoader code.
 * @author Jason Shipman
 *
 * Copyright (C) 2012 Jason Shipman
 * This software is provided 'as-is', without any express or implied warranty.
 * In no event will the authors be held liable for any damages arising from the
 * use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 *
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 *
 * 3. This notice may not be removed or altered from any source distribution.
 */

/**
 * ShipGL.FileLoader can synchronously load both local and HTTP files.
 * Function documentation is provided through an example since JSDoc doesn't
 * have great support for documenting singleton-like objects.

 * @example
 * // Load a local text file named "war_and_peace.txt". Store string.
 * var localText = ShipGL.FileLoader.loadLocal("war_and_peace.txt");
 *
 * // Load a text file from a server named "war_and_peace.txt". Store string.
 * var serverText = ShipGL.FileLoader.loadHttp("war_and_peace.txt");
 *
 * // Load a local JSON model file. Note that JSON's MIME type is passed as
 * // well in order to prevent annoying warnings/errors in Firefox.
 * var model = ShipGL.FileLoader.loadLocal("godzilla.json", "application/json");
 *
 * // Try loading a file from a server. If it fails, try loading the file
 * // locally.  This is useful if you work on your WebGL code locally and then
 * // don't want to make file-related modifications for it to work on a server.
 * var data = ShipGL.FileLoader.loadHttp("data.txt") ||
 *            ShipGL.FileLoader.loadLocal("data.txt");
 */
ShipGL.FileLoader = (function()
{
    function makeSynchronousLoader(statusCode)
    {
        return function(url, mimeType)
        {
            var req = new XMLHttpRequest();
            req.open("GET", url, false);

            if (mimeType)
            {
                req.overrideMimeType(mimeType);
            }

            req.send(null);
            return (req.status == statusCode) ? req.responseText : null;
        };
    };

    return { loadLocal: makeSynchronousLoader(0),
             loadHttp: makeSynchronousLoader(200)
    };
})();
