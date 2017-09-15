import React, { Component } from 'react'
import { gql, withApollo } from 'react-apollo'
import { Header, Input, Button, List, Label, Icon, Divider } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

class Search extends Component {
    constructor(props){
        super(props)
        this.state = {
            polls: [],
            searchText: ''
        }
    }
  
  handleSearch = async () => {
    const { searchText } = this.state
    const result = await this.props.client.query({
      query: allPollsSearch,
      variables: { searchText }
    })
    const polls = result.data.allPolls
    this.setState({ polls })
  }
    
  render(){
    return(
      <div className='component-wrapper flex-column'>
                
        <Header as='h1'>Search All Polls</Header>
        
        <Input type='text'
               id='search-input'
               placeholder='Enter Keyword or Phrase'
               label={{ color: 'blue', content: 'Search Term'}}
               value={this.state.searchText}
               onChange={(e) => this.setState({ searchText: e.target.value })}/>
        
        <Button onClick={this.handleSearch}
                color='green'
                id='search-button'>
          SEARCH
        </Button>
        
        <Divider horizontal>RESULTS</Divider>
        
        <List relaxed className='search-list'>
          {this.state.polls.map( (poll, index) => {
            return(
            <List.Item key={index}>
              <Link to={`/poll/${poll.id}`}>
                <Icon name='bar chart'/>&nbsp;{poll.title}
              </Link>
              <List.List>
                {poll.options.map( (option, i) => {
                  return(
                    <List.Item key={i}>
                      {option.option}&nbsp;
                      <Label size='mini'>
                        VOTES
                        <Label.Detail>{option.votes}</Label.Detail>
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

const allPollsSearch = gql`
  query allPollsSearch($searchText: String!) {
    allPolls(filter: {
      OR: [{
        title_contains: $searchText
      }, {
        option_contains: $searchText
      }]
    }) {
      id
      title
      owner
      imageUrl
      username
      options {
        option
        votes
      }
    }
  }
`

export default withApollo(Search)