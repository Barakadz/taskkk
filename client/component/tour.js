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
      target: '.addproject-step',
      content: "Vous pouvez ajouter un projet en cliquant sur le bouton.",
    }
   
    ,
    {
      target: '.addtache-step',
      content: "Vous pouvez ajouter une tache en cliquant sur le bouton.",
    }
   
   ,
    {
      target: '.etatprojetresponsable-step',
      content: "Le statut de validation du responsable",
    },
    {
      target: '.etatprojetdga-step',
      content: "Le statut de validation du Directeur Général Adjoint ",
    },
    {
      target: '.parametres-step',
      content: "Possible de connaître la raison si le projet n'est pas valide..... ",
    }
  
  ];

  if (!isClient) return null;

  return (
    <Joyride
      steps={steps}
      continuous={true}
      scrollToFirstStep={true}
      showProgress={true}
      showSkipButton={false}
    />
  );
};

export default Tour;
