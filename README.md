Tree view example
===================

Example of a tree view component using [React.js](https://facebook.github.io/react/).

Details about it can be found in [this article](http://rmemoria.blogspot.com.br/2015/12/creating-tree-view-using-reactjs.html).

## Dependencies

TreeView component has the following dependencies:

**Deployment**

* Font awesome - Displaying of the collapse/expanded/leaf icons;
* React - Obviously, depends on react.js;

**Development**

* [Webpack](https://webpack.github.io/)
* [Babel 2015](https://babeljs.io/docs/learn-es2015/) - TreeView is developed using ES6;

## Directory structure

* `app` - TreeView source code and example page;
* `build` - Example HTML page to display the tree view examples;
* `server` - Simple HTML server to develop and run the tree view;

## Running the example application

To run the example application, it is necessary to generate the final java script source and execute it under a web server. It can be done issuing the following command:

    npm run dev

If no error occurs, open the following URL in a web browser:

http://localhost:4000/index.html

It uses webpack dev server, so any change in the source code will be automatically updated in the browser window.

You may also use

    npm run build

To build the final source code inside the `build` folder.

## Release history

version 0.0.1 - First release in dec 2015;
