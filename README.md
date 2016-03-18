Get Trade Web Service
=====================

> A Web Service API to get last trade values from Yahoo Finacial API

This is just enough info to get you up and running.
Most of your interactions with installation will be through the command line.

Run commands in the Terminal app if you’re on Mac, your shell in Linux,
or [Cygwin](http://www.cygwin.com/) if you are on Windows.


Install prerequisites
---------------------
Before installing WebService, you will need the following:
* NodeJS v4.1.x+
* NPM (which comes bundled with Node) v3.3.7+
* Git v1.8.x+

### Install NodeJS & NPM
You can check if you have Node and npm installed by typing:
```
$ node --version && npm --version
```

If you need to upgrade or install Node, the easiest way is to use an installer for your platform.

Download the .msi for Windows or .pkg for Mac from the [NodeJS](http://nodejs.org/download/) website.

For any Linux distributions, you may installing Node.js via 
[package manager](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)


### Install Git
You can check if you have Git installed by typing:
```
$ git --version
```

#### Git via Git
If you already have Git installed, you can get the latest development version via Git itself:
```
$ git clone https://github.com/git/git
```

Make sure you have the right version of Git installed.
If you don't have Git, grab the installers from the [Git](http://git-scm.com/) website.

Or you may install Git via command line
```
$ sudo apt-get install -y git-core
```

### Install Nodemon
Nodemon is a command line utility to restart node web server when the watch files have updated.
You can check if you have nodemon installed by typing:
```
$ nodemon --version
```

If you don't have Nodemon, install it with npm by typing:
```
$ sudo npm install -g nodemon
```

---------------------------------------

Installations
-------------
It's highly recommended that you install WebService as a package (including all the correct dependencies).

This is best done with [NPM](https://www.npmjs.org)
- [NPM](https://www.npmjs.org), a package manager for Node.js libraries and applications.

### Install Node Package Manager (NPM)
Root folder containing a program described by a
[package.json](https://github.com/waynecheah/manulife/blob/master/package.json) file.

Install the packages with npm install. NPM installs packages to /node_modules/.
```
$ npm install
```

This command installs all required packages, and any packages that it depends on.
If the package has a shrinkwrap file, the installation of dependencies will be driven by that.
See [npm-shrinkwrap](https://www.npmjs.org/doc/cli/npm-shrinkwrap.html).

---------------------------------------

Getting Started
---------------
Gulp.js is the streaming build system.
Its use of streams and code-over-configuration makes for a simpler and more intuitive build.

For more about get started guide, API docs, recipes, making a plugin, etc.
see gulp.js [documentation](https://github.com/gulpjs/gulp/blob/master/docs/README.md) page!

Run `gulp` for development streaming build and live preview
```
$ gulp
```

Run `gulp babel` for building a distribution assests for production
```
$ gulp babel
```

---------------------------------------

Support
-------
Need help, bugs report or have an issue and question?
- [Issue trackers](https://github.com/waynecheah/manulife/issues)


Browser Support
---------------
Chrome, Firefox, Safari, Opera, IE 8+ (requires [ES5-shim](https://github.com/kriskowal/es5-shim)).


License
-------
[ISC](http://www.openbsd.org/cgi-bin/cvsweb/src/share/misc/license.template?rev=1.2)
license Copyright (c) 2016 [Wayne Cheah](http://kokweng.io)