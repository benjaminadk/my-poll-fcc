import React from 'react'
import { Step, Label, Input } from 'semantic-ui-react'

const HowToStepGroups = () => {
    return(
    <div id='auth-steps'>
        <Step.Group id='create-steps'>
              
              <Step icon='info' title='How to Create Polls'/>
              <Step>
                <Step.Title>CLICK: <Label>CREATE POLL</Label></Step.Title>
              </Step>
              <Step>
                <Input readOnly
                       label={{ color: 'blue', content: 'Create' }}
                       placeholder="Enter Poll Information"/>
              </Step>
              <Step>
                <Step.Title>CLICK: <Label color='green'>CREATE NEW POLL</Label></Step.Title>
              </Step>
            </Step.Group>
            
            <Step.Group id='view-mypoll-steps'>
              <Step icon='info' title='View Your Polls List'/>
              <Step>
                <Step.Title>CLICK: &nbsp;<Label>MY POLLS</Label></Step.Title>
              </Step>
              <Step>
                <Step.Title>DELETE POLL: &nbsp;<Label color='red'>X</Label></Step.Title>
              </Step>
              
            </Step.Group>
            
            <Step.Group id='search-polls-steps'>
              <Step icon='info' title='Search All Polls'/>
              <Step>
                <Step.Title>CLICK: &nbsp;<Label>SEARCH</Label></Step.Title>
              </Step>
              <Step>
                <Input readOnly
                       label={{ color: 'blue', content: 'Search' }}
                       placeholder='Enter Search Text'/>
              </Step>
              <Step>
                <Step.Title>CLICK: &nbsp;<Label color='green'>SEARCH</Label></Step.Title>
              </Step>
            </Step.Group>
    </div>
            
        )
}

export default HowToStepGroups