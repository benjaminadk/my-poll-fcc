import React, { Component } from 'react'
import { gql, graphql } from 'react-apollo'
import { Button, Icon, Input, Checkbox, Header, Divider } from 'semantic-ui-react'

class Signup extends Component {
  constructor(props){
    super(props)
    this.state = {
      username: '',
      email: '',
      password: '',
      checked: false,
      passwordVisible: 'password'
    }
  }
  
  handleSubmit = () => {
    let { username, email, password } = this.state
    this.props.createUserMutation({
      variables: {
        input: {
          username: username,
          email: email,
          password: password
        }
      }
    }).then( ({data}) => {
      console.log(data)
      this.props.history.push('/login')
    }).catch((error) => {
      console.log(error)
    })
    this.setState({ username: '', email: '', password: ''})
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
        
        <Header as='h1'>Create A New Account</Header>
        
        <Input type='text'
               className='login-input'
               name='username'
               label={{ color: 'blue', content: 'Username' }}
               placeholder='Enter Your Username'
               value={this.state.username}
               onChange={this.handleChange}/>
        
        <Input type='email'
               className='login-input'
               name='email'
               label={{ color: 'blue', content: 'Email' }}
               placeholder='Enter Your Email'
               value={this.state.email}
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
          
        <Divider horizontal>OR</Divider>
        
        <a href='https://oauth-passport-graphql-benjaminadk.c9users.io:8081/auth/facebook'>
          <Button className='oauth-button' color='facebook'>Signup With Facebook &nbsp; <Icon name='facebook'/></Button>
        </a>
        <br/>
        <a href='https://oauth-passport-graphql-benjaminadk.c9users.io:8081/auth/github'>
          <Button className='oauth-button' color='grey'>Signup With Github &nbsp; <Icon name='github'/></Button>
        </a>
        <br/>
        <a href='https://oauth-passport-graphql-benjaminadk.c9users.io:8081/auth/google'>
          <Button className='oauth-button' color='google plus'>Signup With Google &nbsp; <Icon name='google plus square'/></Button>
        </a>
        <br/>
        <a href='https://oauth-passport-graphql-benjaminadk.c9users.io:8081/auth/twitter'>
          <Button className='oauth-button' color='twitter'>Signup With Twitter &nbsp; <Icon name='twitter'/></Button>
        </a>
      </div>
          )
    }
}

const createUser = gql`
  mutation createUser($input: UserInput!) {
    createUser(input: $input) {
      id
    }
  }
`

export default graphql(createUser, {name: 'createUserMutation'})(Signup)