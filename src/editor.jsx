import React from 'react'
import ReactDom from 'react-dom'
import {stateToMarkdown} from 'draft-js-export-markdown'
import draft,{Editor, convertToRaw, EditorState, RichUtils, getDefaultKeyBinding, KeyBindingUtil, Modifier, CompositeDecorator} from 'draft-js'
import ToolBar from './components/tool-bar.jsx'
import { Link, findLinkEntities } from './components/link.jsx'
import {colorStyleMap} from './components/color.jsx'
import './assets/style/app.less'



window.React = React
window.ReactDom = ReactDom
class EditorContainer extends React.Component {
    constructor() {
        super();
        const decorator = new CompositeDecorator([
            {
              strategy: findLinkEntities,
              component: Link,
            },
        ]);
        let selection = window.getSelection()
        this.state = {
            editorState: EditorState.createEmpty(decorator),
            selection
        }
        this.onChange = this.onChange.bind(this)
        this.handleKeyCommand = this.handleKeyCommand.bind(this)
        this.toggleStyle = this.toggleStyle.bind(this)
        this.toggleLinkStyle = this.toggleLinkStyle.bind(this)
    }
    render() {
        return (<div>
            <h3 text-align='center'>draft.js 实现编辑器</h3>
            <ToolBar execCommand={this.toggleStyle} selection={this.state.selection}/>
            <Editor 
            customStyleMap={colorStyleMap}
            onChange={this.onChange} 
            handleKeyCommand={this.handleKeyCommand}
            keyBindingFn={this.myKeyBindingFn}
            placeholder='type your content'
            editorState={this.state.editorState} />
        </div>)
    }
    /**
     * 数据变化监控
     * @param {*} editorState 
     */
    onChange(editorState) {
        this.setState({editorState});
        // console.log(editorState.getCurrentInlineStyle(),convertToRaw(editorState.getCurrentContent()))
    }
    /**
     * 执行富文本命令方法
     * @param {*} command 
     */
    handleKeyCommand(command) {
        const newState = RichUtils.handleKeyCommand(this.state.editorState, command)
        if (newState) {
            this.onChange(newState)
            return 'handled'
        }
        return 'no-handled'
    }
    /**
     * 绑定默认按键检测
     * @param {*} e 
     */
    myKeyBindingFn(e) {
        return getDefaultKeyBinding(e)
    }
    /**
     * 切换样式
     */
    toggleStyle(data) {
        let command = data.draftCommand.toUpperCase();
        let inlineStyle = ['BOLD', 'ITALIC', 'LINK', 'COLOR']
        if (inlineStyle.indexOf(command) >= 0) {
            if (command === 'LINK') {
                this.toggleLinkStyle(data.params)
            } else if (command === 'COLOR') {
                this.toggleColorStyle(data.params.name)
            } else {
                this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, command, data.params))
            }
        } else {
            this.onChange(RichUtils.toggleBlockType(this.state.editorState, command.toLowerCase()))
        }
    }
    /**
     *  添加链接状态
     * @param {*} url 
     */
    toggleLinkStyle(url) {
        const contentState = this.state.editorState.getCurrentContent();
        const contentStateWidthEntity = contentState.createEntity('LINK', 'MUTABLE', {
            url
        })
        const entityKey = contentStateWidthEntity.getLastCreatedEntityKey();
        const editorState = EditorState.set(this.state.editorState, {
            currentContent: contentStateWidthEntity
        })

        this.setState({
            editorState: RichUtils.toggleLink(
                editorState,
                editorState.getSelection(),
                entityKey
            )
        })

    }
    /**
     * 切换颜色
     * @param {*} color 
     */
    toggleColorStyle(toggledColor) {
            const {editorState} = this.state;
            const selection = editorState.getSelection();

            // Let's just allow one color at a time. Turn off all active colors.
            const nextContentState = Object.keys(colorStyleMap)
            .reduce((contentState, color) => {
                return Modifier.removeInlineStyle(contentState, selection, color)
            }, editorState.getCurrentContent());

            let nextEditorState = EditorState.push(
                editorState,
                nextContentState,
                'change-inline-style'
            );

            const currentStyle = editorState.getCurrentInlineStyle();

            // Unset style override for current color.
            if (selection.isCollapsed()) {
                nextEditorState = currentStyle.reduce((state, color) => {
                    return RichUtils.toggleInlineStyle(state, color);
                }, nextEditorState);
            }

            // If the color is being toggled on, apply it.
            if (!currentStyle.has(toggledColor)) {
                nextEditorState = RichUtils.toggleInlineStyle(
                    nextEditorState,
                    toggledColor
                );
            }

            this.onChange(nextEditorState);
    }
    componentDidMount() {
        console.log(draft)
    }
}

ReactDom.render(
    <EditorContainer/>,
    document.querySelector('#container')
)