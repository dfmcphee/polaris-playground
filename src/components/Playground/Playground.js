import 'babel-polyfill';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Editor from './Editor';
import Preview from './Preview';
import EsPreview from './EsPreview';
import Doc from './Doc';

import './Playground.css';

class ReactPlayground extends Component {
  static defaultProps = {
    theme: 'default',
    noRender: true,
    context: {},
    initiallyExpanded: false,
  };

  static propTypes = {
    codeText: PropTypes.string.isRequired,
    scope: PropTypes.object.isRequired,
    collapsableCode: PropTypes.bool,
    docClass: PropTypes.func,
    onChange: PropTypes.func,
    propDescriptionMap: PropTypes.object,
    theme: PropTypes.string,
    selectedLines: PropTypes.array,
    noRender: PropTypes.bool,
    es6Console: PropTypes.bool,
    context: PropTypes.object,
    initiallyExpanded: PropTypes.bool,
    previewComponent: PropTypes.node,
  };

  state = {
    code: this.props.codeText,
    expandedCode: this.props.initiallyExpanded,
    external: true,
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      code: nextProps.codeText,
      external: true,
    });
  };

  _handleCodeChange = (code) => {
    if (this.props.onChange) {
      this.props.onChange(code);
    }
    this.setState({
      code,
      external: false,
    });
  };

  _toggleCode = () => {
    this.setState({
      expandedCode: !this.state.expandedCode,
    });
  };

  render() {
    const {code, external, expandedCode} = this.state;
    const {
      collapsableCode,
      context,
      docClass,
      es6Console,
      noRender,
      previewComponent,
      propDescriptionMap,
      scope,
      selectedLines,
      theme,
    } = this.props;

    return (
      <div className={`playground${collapsableCode ? ' collapsableCode' : ''}`}>
        {docClass ? (
          <Doc
            componentClass={docClass}
            propDescriptionMap={propDescriptionMap}
          />
        ) : null}
        <div className={`playgroundCode${expandedCode ? ' expandedCode' : ''}`}>
          <Editor
            className="playgroundStage"
            codeText={code}
            external={external}
            onChange={this._handleCodeChange}
            selectedLines={selectedLines}
            theme={theme}
          />
        </div>
        {collapsableCode ? (
          <div className="playgroundToggleCodeBar">
            <span
              className="playgroundToggleCodeLink"
              onClick={this._toggleCode}
            >
              {expandedCode ? 'collapse' : 'expand'}
            </span>
          </div>
        ) : null}
        <div className="playgroundPreview">
          {es6Console ? (
            <EsPreview code={code} scope={scope} />
          ) : (
            <Preview
              context={context}
              code={code}
              scope={scope}
              noRender={noRender}
              previewComponent={previewComponent}
            />
          )}
        </div>
      </div>
    );
  }
}

export default ReactPlayground;
