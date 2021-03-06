import React, { Component } from 'react'
import classnames from 'classnames'
import styles from './styles.css'

// import Button from ''
import StyleButton from './StyleButton'

class BlockStyleControls extends Component {
    render() {
        const {
            onToggle,
            editorState,
            type
        } = this.props

        const blockTypes = [
            //넣고싶으면 여기다 H1추가
            {label: 'H3', style: 'header-three'},
            {label: 'H4', style: 'header-four'},
            {label: 'H5', style: 'header-five'},
            {label: 'Blockquote', style: 'blockquote'},
            {label: 'Code Block', style: 'code-block'}
        ]

        const selection = editorState.getSelection()
        const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

            

        return (
            <div className={styles.controls}>
                { blockTypes.map((eachType) =>
                    <StyleButton
                      key={eachType.label}
                      onToggle={onToggle}
                      active={eachType.style === blockType}
                      label={eachType.label}
                      style={eachType.style}
                    />
                ) }
            </div>
        )
    }
}

// BlockStyleControls.propTypes = {
//     onToggle: React.PropTypes.func.isRequired,
//     editorState: React.PropTypes.any.isRequired,
//     type: React.PropTypes.oneOf(['newDiscussion', 'newOpinion'])
// }

export default BlockStyleControls