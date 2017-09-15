import React, { Component } from 'react'
import { gql, graphql, compose } from 'react-apollo'
import { List, Button, Header, Icon, Label, Confirm } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

class MyPolls extends Component {
    constructor(props){
        super(props)
        this.state = {
            open: false
        }
    }
    
    componentDidMount(){
        this.props.data.refetch()
    }
    
    openConfirm = () => this.setState({ open: true })
    
    handleCancel = () => this.setState({ open: false })
    
    handleConfirm = (e,d) => {
        this.props.deletePollMutation({
            variables: {
                id: d.name
            },
            updateQueries: {
                myPolls: (prev, { mutationResult }) => {
                    const newPolls =  prev.myPolls.filter(p => p.id !== d.name)
                    return { myPolls: newPolls, Symbol: "ROOT_QUERY" }
                }
            } 
        }).then(() => {
            this.setState({ open: false })
        })
        .catch((error) => {
            console.log(error)
        })
    }
    
    render(){
        if(this.props.data.loading){return(<div className='component-wrapper'>LOADING...</div>)}
        if(this.props.data.error){return(<div className='component-wrapper'>ERROR</div>)}
        if(this.props.data.myPolls){
            const polls = this.props.data.myPolls
            return(
                <div className='component-wrapper flex-column'>
                    
                    <Header as='h1'
                            id='my-polls-header'
                            icon>
                        <Icon name='bar chart'/>
                            My Polls
                    </Header>
                    
                    <List relaxed className='myPolls-list'>
                        {polls.map((poll, index) => {
                            return(
                            <List.Item key={index}>
                                
                                <Link to={`/poll/${poll.id}`}>
                                    <Icon name='bar chart'/>&nbsp;{poll.title}
                                </Link>&nbsp;
                                
                                <Button key={index}
                                        size='mini'
                                        onClick={this.openConfirm}
                                        compact
                                        color='red'
                                        icon='delete'/>
                                
                                <Confirm open={this.state.open}
                                         header='ARE YOU SURE ?'
                                         content='Confirming DELETE will permanently remove this Poll from the myPoll servers.'
                                         confirmButton={<Button id='confirm-delete'>DELETE</Button>}
                                         cancelButton={<Button color='blue'>CANCEL</Button>}
                                         name={poll.id}
                                         onConfirm={this.handleConfirm}
                                         onCancel={this.handleCancel}/>
                                
                                    <List.List>
                                        {poll.options.map((option, ind) => {
                                            return(
                                            <List.Item key={ind}>
                                                {option.option}&nbsp;
                                                <Label size='mini'>
                                                    VOTES
                                                <Label.Detail>
                                                    {option.votes}
                                                </Label.Detail>
                                                </Label>
                                            </List.Item>
                                            )
                                        })}
                                    </List.List>
                                        <hr/>
                            </List.Item>
                            )
                        })}
                    </List>
                </div>
                )
        }
    }
}

const myPolls = gql`
    query myPolls {
        myPolls {
            id
            title
            owner
            username
            options {
                id
                option
                votes
            }
        }
    }
`

const deletePoll = gql`
    mutation deletePoll($id: ID!){
        deletePoll(id: $id){
            id
        }
    }
`

export default compose(
    graphql(myPolls),
    graphql(deletePoll, { name: 'deletePollMutation' })
    )(MyPolls)