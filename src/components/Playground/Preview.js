import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import {transform} from 'babel-standalone';

function generateContextTypes(contextType) {
  return `{ ${Object.keys(contextType)
    .map((val) => `${val}: PropTypes.any.isRequired`)
    .join(', ')} }`;
}
class Preview extends Component {
  static defaultProps = {
    previewComponent: 'div',
  };

  static propTypes = {
    code: PropTypes.string.isRequired,
    scope: PropTypes.object.isRequired,
    previewComponent: PropTypes.node,
    noRender: PropTypes.bool,
    context: PropTypes.object,
  };

  state = {
    error: null,
  };

  componentDidMount = () => {
    this._executeCode();
  };

  componentDidUpdate = (prevProps) => {
    if (this.props.code !== prevProps.code) {
      this._executeCode();
    }
  };

  _compileCode = () => {
    const {code, context = {}, scope} = this.props;

    const scopeWithProps = {...scope, PropTypes};

    const classPattern = /class (\w+) extends React.Component/g;
    const classMatch = classPattern.exec(code);

    const noRender = !classMatch;

    if (noRender) {
      return transform(
        `
        ((${Object.keys(scopeWithProps).join(', ')}, mountNode) => {
          class Comp extends React.Component {

            getChildContext() {
              return ${JSON.stringify(context)};
            }

            render() {
              return (
                ${code}
              );
            }
          }

          Comp.childContextTypes = ${generateContextTypes(context)};

          return Comp;
        });
      `,
        {presets: ['es2015', 'react', 'stage-1']},
      ).code;
    } else {
      const className = classMatch[1];
      const transformedCode = transform(
        `
          ((${Object.keys(scopeWithProps).join(', ')}, mountNode) => {
            ${code}
            return ${className};
          });
        `,
        {presets: ['es2015', 'react', 'stage-1']},
      ).code;
      return transformedCode;
    }
  };

  _executeCode = () => {
    const mountNode = this.mount;
    const {scope, noRender, previewComponent} = this.props;

    const scopeWithProps = {...scope, PropTypes};
    const tempScope = [];

    try {
      Object.keys(scopeWithProps).forEach((scopeProp) => {
        tempScope.push(scopeWithProps[scopeProp]);
      });
      tempScope.push(mountNode);
      const compiledCode = this._compileCode();

      if (noRender) {
        /* eslint-disable no-eval, max-len */
        const Comp = React.createElement(eval(compiledCode)(...tempScope));
        ReactDOMServer.renderToString(
          React.createElement(previewComponent, {}, Comp),
        );
        render(React.createElement(previewComponent, {}, Comp), mountNode);
      } else {
        const Comp = React.createElement(eval(compiledCode)(...tempScope));
        ReactDOMServer.renderToString(
          React.createElement(previewComponent, {}, Comp),
        );
        render(React.createElement(previewComponent, {}, Comp), mountNode);
      }
      /* eslint-enable no-eval, max-len */
      clearTimeout(this.timeoutID);
      this.setState({error: null});
    } catch (err) {
      const error = err.toString();
      clearTimeout(this.timeoutID); // eslint-disable-line no-undef
      this.timeoutID = setTimeout(() => {
        this.setState({error});
      }, 500);
    }
  };

  _setMount = (element) => {
    this.mount = element;
  };

  render() {
    const {error} = this.state;
    const errorMarkup = error ? (
      <div className="playgroundError">{error}</div>
    ) : null;

    return (
      <div>
        {errorMarkup}
        <div ref={this._setMount} className="previewArea" />
      </div>
    );
  }
}

export default Preview;
