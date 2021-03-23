import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Start, Game, Result } from '../pages';
import { ProtectedRoute } from '../components/ProtectedRoute';

const Routes = () => {
  const location = useLocation();
  return (
    <AnimatePresence exitBeforeEnter>
      <Switch location={location} key={location.pathname}>
        <Route exact path="/">
          <Start />
        </Route>
        <Route exact path="/game">
          <Game />
        </Route>
        <ProtectedRoute exact path="/result">
          <Result />
        </ProtectedRoute>
      </Switch>
    </AnimatePresence>
  );
};

export default Routes;
