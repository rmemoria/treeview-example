/**
 * Base component to generate tree view in a vertical row. It basically
 * controls nodes and its state (collapsed and expanded), loading nodes in an
 * asynchronous way (using promises) and gives the parent
 * the role of rendering the row.
 */

import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// load css styles
import './tree-view.less';

export default class TreeView extends React.Component {

	constructor(props) {
		super(props);
		this.nodeClick = this.nodeClick.bind(this);
	}

	/**
	 * Load the objects that will be linked to the nodes of the tree
	 * @param  {object} parent The parent node to load items into
	 */
	loadNodes(parent) {
		const func = this.props.onGetNodes;

		if (!func) {
			return null;
		}

		const pitem = parent ? parent.item : undefined;
		let res = func(pitem);

		// is not a promise ?
		if (!res || !res.then) {
			// force node resolution by promises
			res = Promise.resolve(res);
		}

		// create nodes wrapper when nodes are resolved
		const self = this;
		return res.then(items => {
			if (!items) {
				return [];
			}

			const nodes = self.createNodes(items);
			return nodes;
		});
	}

	/**
	 * Create nodes from the list of items to add in the tree
	 * @param  {[type]} items [description]
	 * @return {[type]}       [description]
	 */
	createNodes(items) {
		const funcInfo = this.props.checkLeaf;
		return items.map(item => {
			const leaf = funcInfo ? funcInfo(item) : false;
			return { item: item, state: 'collapsed', children: null, leaf: leaf };
		});
	}

	/**
	 * Create the React components of the nodes to be displayed in the tree
	 * @param  {[type]} nodes [description]
	 * @return {[type]}       [description]
	 */
	createNodesView() {
		const self = this;
		// get the item being expanded (for animation)
		const expitem = this.state.expitem;

		// recursive function to create the expanded tree in a list
		const mountList = function(nlist, level, parentkey) {
			let count = 0;
			const lst = [];

			// is the root being rendered
			if (!parentkey && self.props.title) {
				lst.push(self.props.title);
			}

			nlist.forEach(node => {
				const key = (parentkey ? parentkey + '.' : '') + count;
				const row = self.createNodeRow(node, level, key);

				lst.push(row);
				if (node.state !== 'collapsed' && !node.leaf && node.children) {
					lst.push(mountList(node.children, level + 1, key, expitem === node));
				}
				count++;
			});

			// the children div key
			const divkey = (parentkey ? parentkey : '') + 'ch';

			// children are inside a div, in order to animate collapsing/expanding
			return (
				<ReactCSSTransitionGroup key={divkey + 'trans'} transitionName="node"
					transitionLeaveTimeout={250} transitionEnterTimeout={250} >
					{lst}
				</ReactCSSTransitionGroup>
				);
		};

		return mountList(this.state.root, 0, false);
	}

	resolveIcon(node) {
		const p = this.props;

		let icon;
		if (node.leaf) {
			icon = p.iconLeaf;
		}
		else {
			icon = node.state !== 'collapsed' ? p.iconMinus : p.iconPlus;
		}

		if (typeof icon === 'function') {
			icon = icon(node.item);
		}

		if (typeof icon === 'string') {
			var className = 'fa fa-' + icon + ' fa-fw';
			icon = <i className={className} />;
		}

		return icon;
	}

	/**
	 * Create node row containing the content of the node
	 * @param  {[type]} node  [description]
	 * @param  {[type]} level [description]
	 * @param  {[type]} key   [description]
	 * @return {[type]}       [description]
	 */
	createNodeRow(node, level, key) {
		const p = this.props;

		// get the node content
		const content = p.innerRender ? p.innerRender(node.item) : node.item;

		const icon = this.resolveIcon(node);

		const waitIcon = node.state === 'expanding' ?
			<div className="fa fa-refresh fa-fw fa-spin" /> : null;

		// the content
		const nodeIcon = node.leaf ?
			icon :
			<a className="node-link" onClick={this.nodeClick} data-item={key}>
				{icon}
			</a>;

		const nodeRow = (
			<div key={key} className="node" style={{ marginLeft: (level * p.indent) + 'px' }}>
				{nodeIcon}
				{waitIcon}
				{content}
			</div>
			);

		return p.outerRender ? p.outerRender(nodeRow, node.item) : nodeRow;
	}

	/**
	 * Called when user clicks on the plus/minus icon
	 * @param  {[type]} evt [description]
	 * @return {[type]}     [description]
	 */
	nodeClick(evt) {
		const key = evt.currentTarget.getAttribute('data-item');

		let lst = this.state.root;
		let node = null;

		key.split('.').forEach(index => {
			node = lst[Number(index)];
			lst = node.children;
		});

		if (node.state === 'collapsed') {
			this.expandNode(node);
		}
		else {
			this.collapseNode(node);
		}
	}

	/**
	 * Expand a given node
	 * @param  {[type]} node [description]
	 * @return {[type]}      [description]
	 */
	expandNode(node) {
		// children are not loaded ?
		if (!node.children) {
			node.state = 'expanding';
			this.forceUpdate();

			// load the children
			const self = this;
			this.loadNodes(node)
				.then(res => {
					node.state = 'expanded';
					node.children = res;
					// force tree to show the new expanded node
					self.forceUpdate();
				});
		}
		else {
			node.state = 'expanded';
			// force tree to show the new expanded node
			this.forceUpdate();
		}
	}

	/**
	 * Collapse a given node and refresh the tree
	 * @param  {[type]} node [description]
	 * @return {[type]}      [description]
	 */
	collapseNode(node) {
		node.state = 'collapsed';
		this.forceUpdate();
	}

	/**
	 * Render the tree
	 * @return {[type]} [description]
	 */
	render() {
		const root = this.state ? this.state.root : null;

		if (!root) {
			const self = this;
			this.loadNodes()
				.then(res => self.setState({ root: res }));
			return <i className="fa fa-refresh fa-fw fa-spin" />;
		}

		return <div className="tree-view">{this.createNodesView(root)}</div>;
	}
}

TreeView.propTypes = {
	// array containing the items to be displayed
	root: React.PropTypes.array,
	// called to load the nodes in the format function(item): promise
	onGetNodes: React.PropTypes.func,
	// called to render the content of the node, beside the button
	// it will return the string or component to be displayed
	innerRender: React.PropTypes.func,
	// (optional) called to wrap the whole node inside another component
	outerRender: React.PropTypes.func,
	// optional title to be displayed on the top of the treeview
	title: React.PropTypes.any,
	// opitional. Check if node has children or is a leaf node
	checkLeaf: React.PropTypes.func,
	// name of fontawesome icon or function to return a name
	iconPlus: React.PropTypes.any,
	iconMinus: React.PropTypes.any,
	iconLeaf: React.PropTypes.any,
	iconSize: React.PropTypes.number,
	// the indentation of each node level, in pixels
	indent: React.PropTypes.number
};

TreeView.defaultProps = {
	iconPlus: 'plus-square-o',
	iconMinus: 'minus-square-o',
	iconLeaf: 'circle-thin',
	iconSize: 1,
	indent: 16
};
