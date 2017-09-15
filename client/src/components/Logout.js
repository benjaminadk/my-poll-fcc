import React, { Component } from 'react'

export default class Logout extends Component {
    componentDidMount(){
        this.props.logout()
        window.localStorage.removeItem('AUTH_TOKEN')
        window.localStorage.removeItem('IMAGE_URL')
    }
    render(){
        return(<div className='component-wrapper'>YOU ARE LOGGED OUT</div>)
    }
}