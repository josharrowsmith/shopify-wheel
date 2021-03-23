import React, { useContext, useState } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context';
import { ReactComponent as RotorBackground } from '../img/background.svg';
import { ReactComponent as RotorTop } from '../img/front.svg';
import options from '../options.json';
import '../styles.scss';

const rotateV = {
  start: ({ rotate }) => ({
    rotate,
    transition: { type: 'tween', duration: 8, ease: [0.44, -0.205, 0.0, 1] },
  }),
  stop: ({ endDeg }) => ({
    rotate: endDeg,
    transition: { type: 'tween', duration: 0 },
  }),
};

const variants = {
  hidden: {
    x: '-400%',
  },
  visible: {
    x: '-40%',
    y: 0,
  },
  exit: {
    x: '-400%',
    transition: {
      duration: 0.4,
      ease: 'easeInOut',
    },
  },
};

export const Game = () => {
  const [isAnimationStart, setIsAnimationStart] = useState(false);
  const rotateControl = useAnimation();
  const authContext = useContext(AuthContext);
  const history = useHistory();

  const spinCount = 10;
  const offset = (360 / 8) * 4;
  const endValue = useMotionValue(360 * spinCount - offset);

  const onAnimationStart = () => {
    if (!isAnimationStart) {
      setIsAnimationStart(true);
      rotateControl.start('start');
    }

    setTimeout(() => {
      rotateControl.start('stop');
      setIsAnimationStart(false);
      history.push('/result');
    }, 8300);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
    >
      <motion.div
        className="circleInner"
        onClick={() => onAnimationStart()}
        style={
          isAnimationStart
            ? { pointerEvents: 'none' }
            : { pointerEvents: 'auto' }
        }
      >
        <motion.div
          custom={{
            rotate: [0, endValue.current],
            endDeg: endValue.current,
          }}
          animate={rotateControl}
          variants={rotateV}
        >
          <RotorTop />
          {options.map((option, index) => {
            const deg = (360 / options.length) * index;
            return (
              <div
                key={index}
                className="wheel-label"
                style={{
                  transform: `rotate(-${deg}deg) translate(0px, -50%)`,
                }}
              >
                {option.name}
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
