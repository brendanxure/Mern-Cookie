import React from 'react'
import { Button, Card, Container } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const Home = () => {
  return (
    <div>
        <div className='py-5'>
          <Container className='d-flex justify-content-center'>
            <Card className='p-5 d-flex flex-column align-items-center bg-light w-75 hero-card'>
              <h1 className='text-center mb-4'>MERN Authentication</h1>
              <p className='text-center mb-4'>
                This is a boilerplate for MERN authentication that stores a JWT in an HTTP-Only cookie. It also uses Redux ToolKit and the React bootstrap library
              </p>
              <div className='d-flex'>
                <LinkContainer to='/login'>
                <Button variant='primary' className='me-3'>
                  Sign In
                </Button>
                </LinkContainer>
                <LinkContainer to='/register'>
                <Button variant='secondary'>
                  Register
                </Button>
                </LinkContainer>
              </div>
            </Card>
          </Container>
        </div>
    </div>
  )
}

export default Home