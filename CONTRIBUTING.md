# Contributing

This project has a build process to transpile es2015 code down to es5 prior to release.
Feel free to use as much as2015 (and object spread) in your source as you'd like.

## Publishing
Once you're ready to publish, simply run `make publish`. Make will transpile your source and put the
output in `dist/index.js`. Then, it'll publish your changes to npm.

If you'd like to make a build but not publish, run `make build`. Also, `make clean` is a thing too.
