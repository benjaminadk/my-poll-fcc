import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import { PropsRoute, PrivateRoute, userAuth } from '../utils'
import { Button, Menu, Image } from 'semantic-ui-react'
import Home from './Home'
import Signup from './Signup'
import Login from './Login'
import Logout from './Logout'
import Auth from './Auth'
import CreatePoll from './CreatePoll'
import Poll from './Poll'
import MyPolls from './MyPolls'
import Search from './Search'
import jwt_decode from 'jwt-decode'

const LoggedOutButtons = (props) => (
          <Menu.Menu position='right'>
            
            <Menu.Item>
              <Link to='/login'><Button>LOGIN</Button></Link>
            </Menu.Item>
            
            <Menu.Item>
              <Link to='/signup'><Button>SIGNUP</Button></Link>
            </Menu.Item>
          
          </Menu.Menu>
  )

const LoggedInButtons = (props) => {
  const token = window.localStorage.getItem('AUTH_TOKEN')
  const decoded = jwt_decode(token)
  const src = window.localStorage.getItem('IMAGE_URL')
  const imageUrl = !src ? 'http://via.placeholder.com/150x150' : src 
      return(
          <Menu.Menu position='right'>
            
            <Menu.Item>
              <Link to='/my-polls'><Button>MY POLLS</Button></Link>
            </Menu.Item>
            
            <Menu.Item>
              <Link to='/create-poll'><Button>CREATE POLL</Button></Link>
            </Menu.Item>
            
            <Menu.Item>
              <Link to={`/auth/${decoded.id}`}>
                <Image shape='rounded' 
                      width={50} 
                      height={50}
                      src={imageUrl} />
              </Link>
            </Menu.Item>
            
            <Menu.Item>
              <Link to='/logout'><Button>LOGOUT</Button></Link>
            </Menu.Item>
          
          </Menu.Menu>
  )}

export default class Routes extends Component {
    constructor(props){
        super(props)
        this.state = {
            isLoggedIn: false
        }
    }
    
    userLogin = () => {
      userAuth.authenticate( () => {
        this.setState({ userLoggedIn: true });
      })
    }
    
    userLogout = () => {
      userAuth.signout(() => {
        this.setState({userLoggedIn: false})
        this.props.resetStore()
      })
    }
    
    render(){
        return(
            <Router>
              <div id='App'>
                
                <Menu fixed='top'>
                
                <Menu.Item>
                  <Link to='/'>
                    <Image width={50} 
                           height={50} 
                           src='https://s3-us-west-1.amazonaws.com/fccmyvote/mypoll2-50x50.png' />
                  </Link>
                </Menu.Item>
                
                <Menu.Item>
                  <Link to='/search'><Button>SEARCH</Button></Link>
                </Menu.Item>
                
                  {userAuth.isAuthenticated === false ? <LoggedOutButtons/> : <LoggedInButtons/>}
                
                </Menu>
              
                <Switch>
                  <Route exact path='/' component={Home}/>
                  <Route path='/login' component={Login}/>
                  <Route path='/signup' component={Signup}/>
                  <Route path='/search' component={Search}/>
                  <PropsRoute path='/poll/:pollId' component={Poll} user={userAuth.isAuthenticated}/>
                  <PropsRoute path='/logout' component={Logout} logout={this.userLogout}/>
                  <PropsRoute path='/auth/:userId' component={Auth} login={this.userLogin}/>
                  <PrivateRoute path='/my-polls' component={MyPolls} redirectTo='/login'/>
                  <PrivateRoute path='/create-poll' component={CreatePoll} redirectTo='/login'/>
                </Switch>
              
              </div>
            </Router>
            )
    }
}
