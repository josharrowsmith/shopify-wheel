import React, { useState, useEffect } from 'react';
import { AuthContext, GameContext } from './context';
import Routes from './routes';

export default function GameScreen() {
  const [isAuth, setIsAuth] = useState(false);
  const [userId, setUserId] = useState(null);

  const [coupon, setCoupon] = useState(null);
  const [prize, setPrize] = useState(null);
  const [result, setResult] = useState(null);

  const login = () => {
    setIsAuth(true);
  };

  const logout = () => {
    setIsAuth(false);
  };

  return (
    <>
      <AuthContext.Provider
        value={{
          isAuth,
          userId,
          updateAuthStatus: login,
          logout,
          setUserId,
        }}
      >
        <GameContext.Provider
          value={{
            coupon,
            prize,
            result,
            setPrize,
            setCoupon,
            setResult,
          }}
        >
          <Routes />
        </GameContext.Provider>
      </AuthContext.Provider>
    </>
  );
}
