import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Controlled as CodeMirror} from 'react-codemirror2';

if (typeof window !== 'undefined') {
  require('codemirror/mode/jsx/jsx');
}

class Editor extends Component {
  static propTypes = {
    className: PropTypes.string,
    codeText: PropTypes.string,
    external: PropTypes.bool,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
    selectedLines: PropTypes.array,
    style: PropTypes.object,
    theme: PropTypes.string,
  };

  componentDidMount = () => {
    const editor = this.editor.editor;
    this.highlightSelectedLines(editor, this.props.selectedLines);
  };

  highlightSelectedLines = (editor, selectedLines) => {
    if (Array.isArray(selectedLines)) {
      selectedLines.forEach((lineNumber) =>
        editor.addLineClass(
          lineNumber,
          'wrap',
          'CodeMirror-activeline-background',
        ));
    }
  };

  updateCode = (editor, meta, code) => {
    if (!this.props.readOnly && this.props.onChange) {
      this.props.onChange(code);
    }
  };

  render() {
    const {className, external, style, codeText, theme, readOnly} = this.props;

    const options = {
      mode: 'jsx',
      lineNumbers: false,
      lineWrapping: true,
      smartIndent: false,
      matchBrackets: true,
      theme,
      readOnly,
    };

    return (
      <CodeMirror
        ref={(c) => {
          this.editor = c;
        }}
        className={className}
        external={external}
        options={options}
        style={style}
        value={codeText}
        onBeforeChange={this.updateCode}
        mode="jsx"
      />
    );
  }
}

export default Editor;
