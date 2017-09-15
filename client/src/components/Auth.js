import React, { Component } from 'react'
import { gql, graphql } from 'react-apollo'
import { Header, Image, Divider, Card, Label, Button, Modal, Input } from 'semantic-ui-react'
import HowToStepGroups from './Auth-Comp/Steps'
import { timeDifferenceForDate } from '../utils'

class Auth extends Component {
    constructor(props){
      super(props)
      this.state = {
        modalOpen: false,
        username: '',
        email: '',
        imageUrl: ''
      }
    }
    render(){
      if(this.props.data.loading){ return(<div className='component-wrapper'>LOADING...</div>)}
      if(this.props.data.error){ return(<div className='component-wrapper'>ERROR</div>)}
      if(this.props.data.userById){
        const token = this.props.data.userById.jwt
        const imageUrl = this.props.data.userById.imageUrl
        window.localStorage.setItem('AUTH_TOKEN', token)
        window.localStorage.setItem('IMAGE_URL', imageUrl)
        this.props.login()
        const user = this.props.data.userById
        return(
          <div className='component-wrapper'>
            
            <div id='auth-top'>
            
              <Image src='https://s3-us-west-1.amazonaws.com/fccmyvote/mypoll2-150x150.png'
                   centered/>
                   
              <Header as='h1' textAlign='center'>Hey, {user.username}!<br/> Welcome To myPoll</Header>
            
            </div>
            
            <Divider horizontal>HOW TO USE MYPOLL</Divider>
            
            <HowToStepGroups/>
            
            <Divider horizontal>MYPOLL USER PROFILE</Divider>
            
            <div id='auth-profile'>
            
              <Card id='user-card'>
                <Card.Header><Header as='h2' id='user-card-header'>MYPOLL PROFILE</Header></Card.Header>
                <Card.Content>
                  <Label>PROFILE PIC: </Label><Image src={user.imageUrl} size='tiny' floated='right'/>
                </Card.Content>
                <Card.Content>
                  <Label>USERNAME: </Label> <span className='user-card-item'>{user.username}</span>
                </Card.Content>
                <Card.Content>
                  <Label>EMAIL: </Label> <span className='user-card-item'>{user.email}</span>
                </Card.Content>
                <Card.Content>
                  <Label>JOINED: </Label> 
                    <span className='user-card-item'>
                    {timeDifferenceForDate(user.createdOn)}
                    </span>
                </Card.Content>
              </Card>
              
              <Button onClick={ () => this.setState({ modalOpen: true })}>
                Change Profile Settings
              </Button>
              
              <Modal open={this.state.modalOpen}>
                <Modal.Header>Change Profile Settings</Modal.Header>
                <Modal.Content>
                
                <div className='flex-column'>
                  <Input type='text'
                         className='update-input'
                         value={this.state.username}
                         onChange={ (e) => this.setState({ username: e.target.value })}
                         placeholder='Enter New Username'
                         label={{ color: 'blue', content: 'Username'}}/>
                  <Input type='text'
                         className='update-input'
                         value={this.state.email}
                         onChange={ (e) => this.setState({ email: e.target.value })}
                         placeholder='Enter New Email'
                         label={{ color: 'blue', content: 'Email' }}/>
                  <Input type='text'
                         className='update-input'
                         value={this.state.imageUrl}
                         onChange={ (e) => this.setState({ imageUrl: e.target.value })}
                         placeholder='Enter New URL'
                         label={{ color: 'blue', content: 'Profile Pic' }}/>
                </div>
                
                </Modal.Content>
                <Modal.Actions>
                  <Button onClick={ () => this.setState({ modalOpen: false })} color='red'>CANCEL</Button>
                  <Button onClick={this.handleUpdate} color='green'>UPDATE</Button>
                </Modal.Actions>
              </Modal>
              
            </div>
          
          </div>
          )
      }
    }
}

const getUser = gql`
  query userById($id: ID!){
    userById(id: $id){
      username
      email
      imageUrl
      jwt
      createdOn
    }
  }
`

export default graphql(getUser, { options: (ownProps) => ({ 
  variables: { id: ownProps.match.params.userId }})})(Auth)