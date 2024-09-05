// components/Tour.js
import React, { useState, useEffect } from 'react';
import Joyride from 'react-joyride';
import useClientOnly from './useClientOnly';

// Define a unique key for each page where the tour should run
const PAGE_TOUR_KEYS = {
  projet: 'hasShownTourProjet',
  tache: 'hasShownTourTache',
};

const Tour = ({ page }) => {
  const isClient = useClientOnly();
  const [runTour, setRunTour] = useState(false);

  // Get the correct key based on the page prop
  const tourKey = PAGE_TOUR_KEYS[page];

  useEffect(() => {
    if (isClient && tourKey) {
      // Check if the tour for the specific page has been shown
      const hasShownTour = localStorage.getItem(tourKey);
      if (!hasShownTour) {
        setRunTour(true); // Run the tour if it hasn't been shown
        localStorage.setItem(tourKey, 'true'); // Set the flag to prevent future runs
      }
    }
  }, [isClient, tourKey]);

  const steps = [
    {
      target: '.email-step',
      content: 'Entrez votre adresse Mail ici.',
    },
    {
      target: '.password-step',
      content: 'Entrez votre Mot de passe ici.',
    },
    {
      target: '.addproject-step',
      content: 'Vous pouvez ajouter un projet en cliquant sur le bouton.',
    },
    {
      target: '.addtache-step',
      content: 'Vous pouvez ajouter une tâche en cliquant sur le bouton.',
    },
    {
      target: '.etatprojetresponsable-step',
      content: 'Le statut de validation du responsable.',
    },
    {
      target: '.etatprojetdga-step',
      content: 'Le statut de validation du Directeur Général Adjoint.',
    },
    {
      target: '.parametres-step',
      content: "Possible de connaître la raison si le projet n'est pas valide.",
    },
  ];

  if (!isClient || !runTour) return null;

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous={true}
      scrollToFirstStep={true}
      showProgress={true}
      showSkipButton={false}
      locale={{ back: 'Précédent', next: 'Suivant', last: 'Terminer' }}
    />
  );
};

export default Tour;
