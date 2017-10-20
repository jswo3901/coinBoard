import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
// 리액스 헬멧
import classnames from 'classnames'
import RichEditor from '../BoardComponent'
import {
    postDiscussion,
    updateDiscussionTitle,
    updateDiscussionContent
} from './_controller'
// 스타일

class NewDiscussion extends Component {
    constructor(props) {
        super(props)

        this.state = {
            forumId: null,
            userId: null,
            fatalError: null
        }
    }

    componentDidMount() {
        const {
            user,
            currentForum,
            forums
        } = this.props
        //이 함수를 호출하면 유저,포럼 id가 state에 전달됨
        this.setUserAndForumID(user, forums, currentForum)
    }

    //컴포넌트가 프롭스를 새로 받았을때 실행된다. props에 따라 state를 업데이트 해야 할 때 유용하다.
    componentWillReceiveProps(nextProps) {
        const {
            user,
            currentForum,
            forums
        } = nextProps

        this.setUserAndForumID(user, forums, currentForum)
    }
    // 함수정의
    setUserAndForumID(user, forums, currentForum) {
        const forumId = _.find(forums, { forum_slug: currentForum })
        if (forumId) {
            const currentForumId = forumId._id
            this.setState({
                forumId: currentForumId,
                userId: user._id
            })
        }
    }

    renderEditor() {
        const {
            authenticated,
            role
        } = this.props.user

        const {
            updateDiscussionTitle,
            updateDiscussionContent,
            postDiscussion,
            currentForum
        } = this.props

        const {
            title,
            content
        } = this.props.newDiscussion

        const {
            forumId,
            userId
        } = this.state
// css classname삭제
        if (1===1) {
            return [
                <input
                    key={'title'}
                    type="text"
                    placeholder={'Discussion title...'}
                    value={title}
                    onChange={(event) => { updateDiscussionTitle(event.target.value)}}
                />,
                <RichEditor
                    key={'content'}
                    type='newDiscussion'
                    value={content}
                    onChange={(value) => { updateDiscussionContent(value)}}
                    onSave={() => { postDiscussion(userId, forumId, currentForum)}}
                />
            ]
        }
        return (
            <div>로그인 해야함.</div>
        )
    }

    render() {
        const { fatalError } = this.state
        if (fatalError) { return (<div>{fatalError}</div>)}

        const { currentForum } = this.props
        const {
            errorMsg,
            postingSuccess,
            postingDiscussion
        } = this.props.newDiscussion
        
        return (
            <div>
                <div>You are creating a new discussion on <span>{currentForum}</span> forum.</div>
                <div>{errorMsg}</div>
                { postingSuccess && <div>게시글 만들어짐</div>}
                { this.renderEditor() }
                { postingDiscussion && <div>게시글 올리는중</div> }
            </div>
        )
    }
}

export default connect(
    (state) => { return {
        user: state.user,
        forums: state.app.forums,
        currentForum: state.app.currentForum,
        newDiscussion: state.newDiscussion
    }},
    (dispatch) => { return { 
        postDiscussion: (userId, forumId, currentForum) => { dispatch(postDiscussion(userId, forumId, currentForum))},
        updateDiscussionTitle: (value) => { dispatch(updateDiscussionTitle(value)); },
        updateDiscussionContent: (value) => { dispatch(updateDiscussionContent(value)); }
    }}
)(NewDiscussion)