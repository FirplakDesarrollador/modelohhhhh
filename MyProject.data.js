
var Module = typeof Module !== 'undefined' ? Module : {};

if (!Module.expectedDataFileDownloads) {
  Module.expectedDataFileDownloads = 0;
  Module.finishedDataFileDownloads = 0;
}
Module.expectedDataFileDownloads++;
(function() {
 var loadPackage = function(metadata) {

    var PACKAGE_PATH;
    if (typeof window === 'object') {
      PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
    } else if (typeof location !== 'undefined') {
      // worker
      PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
    } else {
      throw 'using preloaded data can only be done on a web page or in a web worker';
    }
    var PACKAGE_NAME = 'D:/4.23/MyProject/Binaries/HTML5/MyProject.data';
    var REMOTE_PACKAGE_BASE = 'MyProject.data';
    if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
      Module['locateFile'] = Module['locateFilePackage'];
      err('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
    }
    var REMOTE_PACKAGE_NAME = Module['locateFile'] ? Module['locateFile'](REMOTE_PACKAGE_BASE, '') : REMOTE_PACKAGE_BASE;
  
    var REMOTE_PACKAGE_SIZE = metadata.remote_package_size;
    var PACKAGE_UUID = metadata.package_uuid;
  
    function fetchRemotePackage(packageName, packageSize, callback, errback) {
      var numParts = 6; // We split into 6 parts
      var parts = [];
      var loadedParts = 0;
      var totalLoaded = 0;

      function downloadPart(index) {
        var xhr = new XMLHttpRequest();
        var partName = packageName + '.part' + index;
        xhr.open('GET', partName, true);
        xhr.responseType = 'arraybuffer';
        
        xhr.onprogress = function(event) {
          if (event.loaded) {
            if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
            if (!Module.dataFileDownloads[packageName]) Module.dataFileDownloads[packageName] = { loaded: 0, total: packageSize };
            
            // This is a bit simplified for the UE4 progress bar
            // We just estimate total progress based on all parts
          }
        };

        xhr.onload = function() {
          if (xhr.status == 200 || xhr.status == 0) {
            parts[index] = new Uint8Array(xhr.response);
            loadedParts++;
            if (loadedParts === numParts) {
              // All parts loaded, merge them
              var merged = new Uint8Array(packageSize);
              var offset = 0;
              for (var i = 0; i < numParts; i++) {
                merged.set(parts[i], offset);
                offset += parts[i].length;
              }
              callback(merged.buffer);
            }
          } else {
            errback(new Error("Error loading part " + index));
          }
        };
        xhr.send(null);
      }

      for (var i = 0; i < numParts; i++) {
        downloadPart(i);
      }
    };

    function handleError(error) {
      console.error('package error:', error);
    };
  
      var fetchedCallback = null;
      var fetched = Module['getPreloadedPackage'] ? Module['getPreloadedPackage'](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE) : null;

      if (!fetched) fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
        if (fetchedCallback) {
          fetchedCallback(data);
          fetchedCallback = null;
        } else {
          fetched = data;
        }
      }, handleError);
    
  function runWithFS() {

    function assert(check, msg) {
      if (!check) throw msg + new Error().stack;
    }
Module['FS_createPath']('/', 'MyProject', true, true);
Module['FS_createPath']('/MyProject', 'Content', true, true);
Module['FS_createPath']('/MyProject/Content', 'Paks', true, true);

    function DataRequest(start, end, audio) {
      this.start = start;
      this.end = end;
      this.audio = audio;
    }
    DataRequest.prototype = {
      requests: {},
      open: function(mode, name) {
        this.name = name;
        this.requests[name] = this;
        Module['addRunDependency']('fp ' + this.name);
      },
      send: function() {},
      onload: function() {
        var byteArray = this.byteArray.subarray(this.start, this.end);
        this.finish(byteArray);
      },
      finish: function(byteArray) {
        var that = this;

        Module['FS_createDataFile'](this.name, null, byteArray, true, true, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
        Module['removeRunDependency']('fp ' + that.name);

        this.requests[this.name] = null;
      }
    };

        var files = metadata.files;
        for (var i = 0; i < files.length; ++i) {
          new DataRequest(files[i].start, files[i].end, files[i].audio).open('GET', files[i].filename);
        }

  
    function processPackageData(arrayBuffer) {
      Module.finishedDataFileDownloads++;
      assert(arrayBuffer, 'Loading data file failed.');
      assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
      var byteArray = new Uint8Array(arrayBuffer);
      var curr;
      
        // Reuse the bytearray from the XHR as the source for file reads.
        DataRequest.prototype.byteArray = byteArray;
  
          var files = metadata.files;
          for (var i = 0; i < files.length; ++i) {
            DataRequest.prototype.requests[files[i].filename].onload();
          }
              Module['removeRunDependency']('datafile_D:/4.23/MyProject/Binaries/HTML5/MyProject.data');

    };
    Module['addRunDependency']('datafile_D:/4.23/MyProject/Binaries/HTML5/MyProject.data');
  
    if (!Module.preloadResults) Module.preloadResults = {};
  
      Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
      if (fetched) {
        processPackageData(fetched);
        fetched = null;
      } else {
        fetchedCallback = processPackageData;
      }
    
  }
  if (Module['calledRun']) {
    runWithFS();
  } else {
    if (!Module['preRun']) Module['preRun'] = [];
    Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
  }

 }
 loadPackage({"files": [{"start": 0, "audio": 0, "end": 53, "filename": "/Manifest_NonUFSFiles_HTML5.txt"}, {"start": 53, "audio": 0, "end": 91, "filename": "/UE4CommandLine.txt"}, {"start": 91, "audio": 0, "end": 504434273, "filename": "/MyProject/Content/Paks/MyProject-HTML5.pak"}], "remote_package_size": 504434273, "package_uuid": "487efa0d-04e5-4979-a548-8c6b9a922df4"});

})();
