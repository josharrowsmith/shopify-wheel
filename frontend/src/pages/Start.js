import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { API } from 'aws-amplify';
import { AuthContext } from '../context';

export const Start = () => {
  const authContext = useContext(AuthContext);
  const [user, setUser] = useState(false);
  const history = useHistory();

  const { register, handleSubmit, reset, errors } = useForm();
  async function getData(data) {
    try {
      const result = await API.get('shopify', `/signup?user=${data.email}`);
      startGame(data.email);
    } catch (e) {
      if (e.response.status === 500) {
        setUser(true);
        reset();
      }
    }
  }

  const startGame = async (data) => {
    authContext.setUserId(data.email);
    authContext.updateAuthStatus();
    history.push('/game');
  };

  return (
    <>
      <form onSubmit={handleSubmit(getData)}>
        {/* register your input into the hook by invoking the "register" function */}
        <input
          name="email"
          defaultValue=""
          ref={register({
            required: true,
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
        />
        {errors.email && (
          <p style={{ color: 'white' }}>This field is required</p>
        )}
        <br />
        <input type="submit" name="submit" />
        {user && <p style={{ color: 'white' }}>try again</p>}
      </form>
    </>
  );
};
