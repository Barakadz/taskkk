// components/Tour.js
import React from 'react';
import Joyride from 'react-joyride';
import useClientOnly from './useClientOnly';
  

const Tour = () => {
  const isClient = useClientOnly();

  const steps = [
    {
      target: '.email-step',
      content: 'Entrez votre adresse Mail ici ',
    },
    {
      target: '.password-step',
      content: 'Entrez votre Mot de pass ici',
    }
    ,
    {
      target: '.problem-step',
      content: "Pour résoudre un problème, veuillez contacter la Direction des Systèmes d'Information",
    },
  ];

  if (!isClient) return null;

  return (
    <Joyride
      steps={steps}
      continuous={true}
      scrollToFirstStep={true}
      showProgress={true}
      showSkipButton={true}
    />
  );
};

export default Tour;
