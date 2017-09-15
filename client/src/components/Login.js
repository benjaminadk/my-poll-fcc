import React, { Component } from 'react'
import { gql, graphql } from 'react-apollo'
import { Button, Icon, Input, Checkbox, Header, Message, Divider } from 'semantic-ui-react'

class Login extends Component {
  constructor(props){
    super(props)
    this.state = {
      username: '',
      password: '',
      checked: false,
      passwordVisible: 'password',
      error: true,
      errorMessage: ''
    }
  }
  
  handleSubmit = () => {
    let { username, password } = this.state
    this.props.loginUserMutation({
      variables: {
        input: {
          username: username,
          password: password
        }
      }
    }).then( ({data}) => {
      const userId = data.loginUser.id
      this.props.history.push(`/auth/${userId}`)
    }).catch((error) => {
      this.setState({ error: false, errorMessage: error.message })
    })
    this.setState({ username: '', password: ''})
  }
  
  handleChange = (e, { name, value }) => this.setState({ [name]: value }) 
  
  togglePasswordVisibility = () => {
    let passwordVisible = this.state.passwordVisible === 'password' ? 'text' : 'password'
    this.setState({
      passwordVisible: passwordVisible,
      checked: !this.state.checked
    })
  }
  render(){
    return(
      <div className='component-wrapper flex-column'>
        
        <Header as='h1'>Login To Your Account</Header>
        
        <Input type='text'
               className='login-input'
               name='username'
               label={{ color: 'blue', content: 'Username' }}
               placeholder='Enter Your Username'
               value={this.state.username}
               onChange={this.handleChange}/>
        
        <Input type={this.state.passwordVisible}
               className='login-input'
               name='password'
               label={{ color: 'blue', content: 'Password' }}
               placeholder='Enter Your Password'
               value={this.state.password}
               onChange={this.handleChange}/>
          
        <Checkbox toggle
               checked={this.state.checked}
               onClick={this.togglePasswordVisibility}
               className='login-input'
               label='Toggle Password Visibility'/>
                      
        <Button onClick={this.handleSubmit}
                color='green'
                className='login-input'>
                SUBMIT
        </Button>
        
        <Message negative
                 onDismiss={ () => this.setState({error: true})}
                 hidden={this.state.error}>
          <Message.Header>ERROR</Message.Header>
          <Message.Content>{this.state.errorMessage}</Message.Content>
        </Message>
        
        <Divider horizontal>OR</Divider>
        
        <a href='https://oauth-passport-graphql-benjaminadk.c9users.io:8081/auth/facebook'>
          <Button className='oauth-button' color='facebook'>Login With Facebook &nbsp; <Icon name='facebook'/></Button>
        </a>
        <br/>
        <a href='https://oauth-passport-graphql-benjaminadk.c9users.io:8081/auth/github'>
          <Button className='oauth-button' color='grey'>Login With Github &nbsp; <Icon name='github'/></Button>
        </a>
        <br/>
        <a href='https://oauth-passport-graphql-benjaminadk.c9users.io:8081/auth/google'>
          <Button className='oauth-button' color='google plus'>Login With Google &nbsp; <Icon name='google plus square'/></Button>
        </a>
        <br/>
        <a href='https://oauth-passport-graphql-benjaminadk.c9users.io:8081/auth/twitter'>
          <Button className='oauth-button' color='twitter'>Login With Twitter &nbsp; <Icon name='twitter'/></Button>
        </a>
      </div>
      )
  }
}

const loginUser = gql`
  mutation loginUser($input: LoginInput!){
    loginUser(input: $input){
      id
    }
  }
`

export default graphql(loginUser, { name: 'loginUserMutation' })(Login)