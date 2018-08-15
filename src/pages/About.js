import React from 'react'
import styled from 'react-emotion'
import BitcardsLogo from '../img/bitcards_wordmark.svg'
import { Link } from 'react-router-dom'
import ChrisPlusReact from '../img/react_netlify.png'
import Footer from '../components/Footer'
import { Helmet } from 'react-helmet'

const Wrapper = styled('main')({
  display: 'flex',
  flexDirection: 'column',
  padding: '2vh',
  fontSize: 20
})

const Section = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '10vw'
})

const Block = styled('div')(
  {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  ({ theme }) => ({
    [theme.media.sm]: {
      flexDirection: 'column'
    }
  }),
  ({ column }) =>
    column
      ? {
          flexDirection: 'column'
        }
      : null
)

const Color = styled('span')(({ theme, color }) => ({
  color: theme.colors[color]
}))

export default class About extends React.Component {
  render() {
    return (
      <Wrapper>
        <Helmet>
          <title>{`About | Bitcards – Beautiful. Simple. Flash Cards.`}</title>
          <meta name="theme-color" content="#ed5555" />
        </Helmet>
        <Section>
          <Block>
            <Logo src={BitcardsLogo} />
          </Block>
          <Block>
            <SectionLabel>
              <Color color="blue">Beautiful.&nbsp;</Color>{' '}
              <Color color="orange">Simple.&nbsp;</Color>{' '}
              <Color color="red">Flash Cards.</Color>
            </SectionLabel>
          </Block>
          <Block column>
            <Paragraph>
              Bitcards allows you to create beautiful, intuitive, and instantly
              shareable flash cards!
              <br />
              <br />
              To start using bitcards just{' '}
              <Link to="/edit">create a new deck</Link>, add some cards, and
              save or share your unique link.
            </Paragraph>
          </Block>
        </Section>
        <Section>
          <Block>
            <SectionLabel>
              <Color color="purple">How does it work?</Color>
            </SectionLabel>
          </Block>
          <Block>
            <Paragraph>
              When using Bitcards, there's no profiles to manage, no passwords
              to remember, just flash cards. <br />
              <br />When you create a deck of bitcards your cards are encoded
              into a compressed format called "Base 64", and stored as a unique
              URL. You can
              <b> instantly</b> share this URL with friends, classmates, or
              students, each of whom receives a <i>copy</i> of your cards and
              can make changes without affecting your copy.
            </Paragraph>
          </Block>
        </Section>
        <Section>
          <Block>
            <SectionLabel>
              <Color color="red">Who made this?</Color>
            </SectionLabel>
          </Block>
          <Block>
            <ChrisImage src={ChrisPlusReact} />
          </Block>
          <Block>
            <Paragraph>
              Bitcards was designed and coded with{' '}
              <span role="img" aria-label="love">
                ❤️
              </span>{' '}
              by me, <a href="https://twitter.com/ChrisJPatty">Chris Patty.</a>
            </Paragraph>
          </Block>
          <Block>
            <Paragraph>
              This entire app was built using Facebook's React framework, and is
              hosted for free by <a href="https://www.netlify.com/">Netlify</a>.{' '}
              (Thanks Netlify!)
              <br />
              <br />
              To stay up to date on other cool things I'm working on you can
              visit <a href="http://www.christopherpatty.com">my website</a>,
              and follow me on{' '}
              <a href="https://github.com/chrisjpatty">Github</a>,{' '}
              <a href="https://twitter.com/ChrisJPatty">Twitter</a>, &{' '}
              <a href="https://dribbble.com/ChrisJPatty">Dribbble</a>.
            </Paragraph>
          </Block>
        </Section>
        <Footer/>
      </Wrapper>
    )
  }
}

const Logo = styled('img')({
  width: 150,
  marginBottom: '5vw'
})

const ChrisImage = styled('img')({
  borderRadius: 20,
  width: '100%',
  maxWidth: 800,
  marginTop: '3vw'
})

const Paragraph = styled('p')(
  {
    fontSize: 22,
    maxWidth: 700,
    whiteSpace: 'pre-wrap',
    textAlign: 'center',
    lineHeight: 1.4,
    '& a': {
      color: 'inherit',
      appearance: 'none',
      textDecoration: 'underline',
      // textDecorationStyle: 'wavy'
    }
  },
  ({ theme }) => ({
    '& a': {
      // color: theme.colors.orange,
      textDecorationColor: theme.colors.orange
    }
  })
)

const SectionLabel = styled('h2')(
  {
    margin: 0,
    textAlign: 'center',
    fontSize: 50,
    fontWeight: 600,
    color: '#4d4d4d',
    textTransform: 'uppercase'
  },
  ({ theme }) => ({
    [theme.media.sm]: {
      fontSize: 40
    }
  })
)
