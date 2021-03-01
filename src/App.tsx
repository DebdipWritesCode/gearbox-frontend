import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import Layout from './Layout'
import Home from './pages/Home'
import About from './pages/About'
import Guide from './pages/Guide'
import Login from './pages/Login'
import Trials from './pages/Trials'
import MyRoute from './components/MyRoute'

import {
  EligibilityCriterion,
  MatchCondition,
  MatchFormConfig,
  MatchFormValues,
  Study,
} from './model'
import {
  mockLoadEligibilityCriteria,
  mockLoadMatchConditions,
  mockLoadMatchFromConfig,
  mockLoadStudies,
  mockLoadLatestUserInput,
  mockPostLatestUserInput,
} from './mock/utils'
import {
  clearShowIfField,
  getDefaultValues,
  getMatchIds,
  getMatchDetails,
} from './utils'

// useFakeAuth inspired by https://reacttraining.com/react-router/web/example/auth-workflow
const useFakeAuth = (): [
  boolean,
  string,
  (username: string, cb?: () => void) => void,
  (cb?: () => void) => void
] => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const authenticate = (username: string, cb?: () => void) => {
    setIsAuthenticated(true)
    setUsername(username)
    if (cb) setTimeout(cb, 100) // fake async
  }
  const signout = (cb?: () => void) => {
    setIsAuthenticated(false)
    if (cb) setTimeout(cb, 100)
  }
  return [isAuthenticated, username, authenticate, signout]
}

function App() {
  const [isAuthenticated, username, authenticate, signout] = useFakeAuth()

  // load data
  const [criteria, setCriteria] = useState([] as EligibilityCriterion[])
  const [conditions, setConditions] = useState([] as MatchCondition[])
  const [config, setConfig] = useState({} as MatchFormConfig)
  const [values, setValues] = useState({} as MatchFormValues)

  useEffect(() => {
    if (isAuthenticated) {
      // load data at login
      Promise.all([
        mockLoadEligibilityCriteria(),
        mockLoadMatchConditions(),
        mockLoadMatchFromConfig(),
        mockLoadLatestUserInput(),
      ]).then(([criteria, conditions, config, latestUserInput]) => {
        setCriteria(criteria)
        setConditions(conditions)
        setConfig(config)
        setValues({ ...defaultValues, ...latestUserInput })
      })
    } else {
      // clear data at logout
      setCriteria([] as EligibilityCriterion[])
      setConditions([] as MatchCondition[])
      setConfig({} as MatchFormConfig)
      setValues({} as MatchFormValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const [studies, setStudies] = useState([] as Study[])
  useEffect(() => {
    mockLoadStudies().then(setStudies)
  }, [])
  // set values derived from states
  const defaultValues = getDefaultValues(config)
  const matchDetails = getMatchDetails(criteria, conditions, config, values)
  const matchIds = getMatchIds(matchDetails)

  // handle MatchForm update
  const [isChanging, setIsChanging] = useState(false)
  const signalChange = () => setIsChanging(true)
  const handleMatchFormChange = (newFormValues: MatchFormValues) => {
    const newValues = clearShowIfField(config, defaultValues, newFormValues)

    if (JSON.stringify(newValues) !== JSON.stringify(values)) {
      setValues({ ...newValues })
      mockPostLatestUserInput(newValues)
    }

    setIsChanging(false)
  }

  return (
    <Router>
      <Layout headerProps={{ isAuthenticated, username, signout }}>
        <Switch>
          <MyRoute path="/" exact isAuthenticated={isAuthenticated}>
            <Home
              authenticate={authenticate}
              isAuthenticated={isAuthenticated}
              isChanging={isChanging}
              matchFormProps={{
                config,
                defaultValues,
                values,
                onChange: handleMatchFormChange,
                signalChange,
              }}
              matchResultProps={{
                matchDetails,
                matchIds,
                studies,
              }}
            />
          </MyRoute>

          <MyRoute path="/login" isAuthenticated={isAuthenticated}>
            <Login authenticate={authenticate} />
          </MyRoute>

          <Route path="/guide">
            <Guide />
          </Route>

          <Route path="/trials">
            <Trials studies={studies} />
          </Route>

          <Route path="/about">
            <About />
          </Route>

          <Route path="*">
            <Redirect to={{ pathname: '/' }} />
          </Route>
        </Switch>
      </Layout>
    </Router>
  )
}

export default App
