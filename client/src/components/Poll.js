import React, { Component } from 'react'
import { gql, graphql, compose } from 'react-apollo'
import {BarChart, Bar, XAxis, YAxis, Legend, Tooltip, Pie, PieChart, Cell } from 'recharts'
import { Button, Header, Message, Icon, Image, Popup, Modal, Input } from 'semantic-ui-react'

class Poll extends Component {
  constructor(props) {
    super(props)
    this.state = {
      buttonDisabled: false,
      messageHidden: true,
      barChart: true,
      label: true,
      icon: true,
      optionText: '',
      modalOpen: false
    }
  }
  
  componentDidMount = () => {
    this.addedVoteSubscription()
    this.addedOptionSubscription()
  }
  
  addedVoteSubscription = () => {
    this.props.data.subscribeToMore({
      document: voteAdded,
      variables: {
        id: this.props.match.params.pollId
      },
      /*updateQuery: (prev, { subscriptionData }) => {
        if(!subscriptionData.data){
          return prev
        }
        const newPoll = subscriptionData.data.voteAdded
        return newPoll
      },*/
      onError: (err) => console.error(err)
    })
  }
  
  handleVote = (e,d) => {
    this.props.addVoteMutation({
      variables: {
        input: {
          pollId: this.props.match.params.pollId,
          optionId: d.name
        }
      }
    }).then(({data}) => {
      this.setState({ buttonDisabled: true, messageHidden: false })
    }).catch((error) => {
      console.log(error)
    })
  }
  
  addedOptionSubscription = () => {
    this.props.data.subscribeToMore({
      document: optionAdded,
      variables: {
        id: this.props.match.params.pollId
      },
      updateQuery: (prev, { subscriptionData }) => {
        if(!subscriptionData.data){
          return prev
        }
        const result = {
          ...prev,
          pollById: subscriptionData.data.optionAdded
        }
        return result
      },
      onError: (err) => console.error(err)
    })
  }
  
  handleOption = () => {
    this.props.addOptionMutation({
      variables: {
        input: {
          pollId: this.props.match.params.pollId,
          newOption: this.state.optionText
        }
      }
    }).then(({data}) => {
      this.setState({ modalOpen: false, optionText: '' })
    }).catch((error) => {
      console.log(error)
    })
  }
  
  handleChart = () => {
    this.setState({
      barChart: !this.state.barChart,
      label: !this.state.label,
      icon: !this.state.icon
    })
  }
  
  render(){
    if(this.props.data.loading){return(<div className='component-wrapper'>LOADING...</div>)}
    if(this.props.data.error){return(<div className='component-wrapper'>ERROR</div>)}
    if(this.props.data.pollById){
      const data = this.props.data.pollById.options
      const title = this.props.data.pollById.title
      const imageUrl = this.props.data.pollById.imageUrl
      const username = this.props.data.pollById.username
      const COLORS = ['#00c7fe', '#00fca4', '#fc9f00', '#fc0000', '#a800fc', '#1000f9']
      return(
      <div className='component-wrapper'>
        
        <Header as='h1' textAlign='center'>{title}</Header>
        
        <div className='chart-wrapper'>
        
        {this.state.barChart ?
          
          <BarChart width={600} height={300} data={data}
              margin={{top: 20, right: 30, left: 20, bottom: 5}}>
            <Tooltip/>
            <XAxis dataKey='option' tickLine={false}/>
            <YAxis allowDecimals={false}/>
            <Bar dataKey='votes'>
              {data.map( (d,index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)}
            </Bar>
          </BarChart>
          : 
          <PieChart width={600} height={300}>
            <Tooltip/>
            <Pie data={data} dataKey='votes' nameKey='option' label={true} labelLine={false}>
              {data.map( (d,index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)}
            </Pie>
            <Legend/>
          </PieChart>
        }
        </div>
        
        <div className='button-wrapper'>
          {data.map((d, index) => {
            return(
              <Button onClick={this.handleVote}
                  style={{ color: '#FFF', backgroundColor: COLORS[index % COLORS.length] }}
                  key={index}
                  disabled={this.state.buttonDisabled}
                  name={d.id}>
                  {d.option}
              </Button>
                  )
            })}
        </div>
        
        <div className='poll-message'>
          <Message hidden={this.state.messageHidden}
                 icon='thumbs up'
                 header='Thanks for Voting with myVote!'
                 content='Share this Link, or Signup to Create a Poll of your own.'/>
        </div>
        
        <div className='poll-controls'>
          
          <Button onClick={this.handleChart}>
            {this.state.label ? 'Pie Chart' : 'Bar Chart'} &nbsp;
            <Icon name={this.state.icon ? 'pie chart' : 'bar chart'} />
          </Button>
          
          <Button disabled={!this.props.user || this.state.buttonDisabled}
                  onClick={ () => this.setState({ modalOpen: true })}>
            Add Option &nbsp;
            <Icon name='plus'/>
            </Button>
          <Modal open={this.state.modalOpen}
                 size='small'
                 closeIcon
                 dimmer={false}>
              
              <Modal.Header>Add Your Own Option</Modal.Header>
              
              <Modal.Content>
                <Input type='text'
                       placeholder='Enter Your Own Option'
                       label={{ color: 'blue', content: 'Option' }}
                       onChange={ (e) => this.setState({ optionText: e.target.value })}/>
              </Modal.Content>
              
              <Modal.Actions>
                <Button color='green'
                        onClick={this.handleOption}>
                  SUBMIT
                </Button>
              </Modal.Actions>
          
          </Modal>
          
          <Popup content={`Created By: ${username}`}
                 trigger={<Image height={40} width={40} src={imageUrl}/>}/>
        
        </div>
        
      </div>
            )
    }
  }
}

const getPoll = gql`
    query pollById($id: ID!){
        pollById(id: $id) {
            owner
            imageUrl
            title
            username
            options {
                id
                editor
                option
                votes
            }
        }
    }
`

const addVote = gql`
  mutation addVote($input: VoteInput!) {
    addVote(input: $input) {
      owner
      imageUrl
      title
      username
      options {
        id
        editor
        option
        votes
      }
    }
  }
`

const addOption = gql`
  mutation addOption($input: OptionInput!) {
    addOption(input: $input) {
      owner
      imageUrl
      title
      username
      options {
        id
        editor
        option
        votes
      }
    }
  }
`

const voteAdded = gql`
  subscription voteAdded($id: ID!) {
    voteAdded(id: $id) {
      owner
      imageUrl
      title
      username
      options {
        id
        editor
        option
        votes
      }
    }
  }
`

const optionAdded = gql`
  subscription optionAdded($id: ID!) {
    optionAdded(id: $id) {
      owner
      imageUrl
      title
      username
      options {
        id
        editor
        option
        votes
      }
    }
  }
`

export default compose(
  graphql(getPoll, { options: (ownProps) => ({
    variables: { id: ownProps.match.params.pollId }})}),
  graphql(addVote, { name: 'addVoteMutation'}),
  graphql(addOption, { name: 'addOptionMutation'})
    )(Poll)
    
