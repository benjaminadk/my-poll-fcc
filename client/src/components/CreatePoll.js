import React, { Component } from 'react'
import { gql, graphql } from 'react-apollo'
import { Input, Button, Header, Icon } from 'semantic-ui-react'

class CreatePoll extends Component {
  constructor(props){
    super(props)
    this.state = {
      title: '',
      options: [
        { option: '', placeholder: 'Conor McGregor'},
        { option: '', placeholder: 'Jon Jones'}
        ]
    }
  }
  
  handleChange = (e, { name, value }) => this.setState({ [name]: value })
  
  handleOption = (e,d) => {
    let allOptions = this.state.options
    let index = d.name
    let value = d.value
    allOptions[index] = value
    this.setState({options: allOptions})
  }
    
  addOption = () => {
    let allOptions = this.state.options
    let newOption = { option: '', placeholder: 'Demetrious Johnson' }
    allOptions.push(newOption)
    this.setState({ options: allOptions })
  }
  
  createNewPoll = () => {
    let title = this.state.title
    let options = this.state.options
    this.props.mutate({
      variables: {
        input: {
          title: title,
          options: options
        }
      }
    }).then(({data}) => {
      let id = data.createPoll.id
      this.props.history.push(`/poll/${id}`)
    }).catch((error) => {
      console.log(error)
    }) 
  }
    
  render(){
    return(
      <div className='component-wrapper flex-column'>
            
        <Header as='h1' 
                id='create-poll-header'
                icon>
                <Icon name='edit'/>
                Create A New Poll
        </Header>    
            
        <Input type='text'
               className='poll-input-title'
               placeholder='Who is the Best UFC Fighter Ever?'
               label={{ color: 'blue', content: 'Poll Title' }}
               name='title'
               value={this.state.title}
               onChange={this.handleChange}/>
        
        { this.state.options.map( (op, index) => {
          return(
            <Input key={index}
                   type='text'
                   className='poll-input'
                   label={{ color: 'blue', content: 'Option' }}
                   name={index}
                   value={op.option}
                   placeholder={op.placeholder || 'Enter Option'}
                   onChange={this.handleOption}/>
          )
        })}
        
        <Button className='poll-input'
                color='blue'
                onClick={this.addOption}>
          ADD OPTION
        </Button><br/>
        
        <Button className='poll-input'
                color='green'
                onClick={this.createNewPoll}>
          CREATE NEW POLL
        </Button>
            
      </div>
          )
    }
}

const createPoll = gql`
    mutation createPoll($input: PollInput!){
        createPoll(input: $input){
          id
        }
    }
`

export default graphql(createPoll)(CreatePoll)

