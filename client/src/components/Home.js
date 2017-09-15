import React, { Component } from 'react'
import { Grid, Header, Image, Card, Icon, Divider } from 'semantic-ui-react'

export default class Home extends Component {
 
  render(){
    return(
      <div className='component-wrapper'>

        <Grid>
          
          <Grid.Row columns={1} id='home-icon-wrapper'>
            <Image src='https://s3-us-west-1.amazonaws.com/fccmyvote/splash.svg'
                   id='home-icon'
                   centered/>
          </Grid.Row>
          
          <Divider/>
          
          <Grid.Row columns='equal' id='home-cards-wrapper'>
            <Grid.Column>
              <Card raised centered className='home-card'>
                <Card.Header>
                  <Header as='h1' icon>
                    <Icon name='edit'/>
                    Create Polls
                    <Header.Subheader>
                      Design your own Poll with unlimitted answer options
                    </Header.Subheader>
                  </Header>
                </Card.Header>
              </Card>
            </Grid.Column>
          
            <Grid.Column>
              <Card raised centered className='home-card'>
                <Card.Header>
                  <Header as='h1' icon>
                    <Icon name='share alternate'/>
                    Share Polls
                    <Header.Subheader>
                      Share your Poll online via your Poll's unique link
                    </Header.Subheader>
                  </Header>
                </Card.Header>
              </Card>
            </Grid.Column>
          
            <Grid.Column>
              <Card raised centered className='home-card'>
                <Card.Header>
                  <Header as='h1' icon>
                    <Icon name='checkmark box'/>
                    Vote on Polls
                    <Header.Subheader>
                      Anyone can Vote on your Polls. Signup NOT Needed
                    </Header.Subheader>
                  </Header>
                </Card.Header>
              </Card>
            </Grid.Column>
          </Grid.Row>
        
        <Divider/>
        
        </Grid>
      </div>
          )
    }
}