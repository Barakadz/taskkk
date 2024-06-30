import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import axios from 'axios';
 import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

const AdminPrimeValUserRh = () => {
 
  const [IdTach, setIdTache] = useState('');
  const [mois, setMois] = useState('');
  const [level, setLevel] = useState('');


  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [data, setData] = useState([]);

  const fetchData = async () => {
    if (!user || !user.department) {
      console.log('User data is not available yet');
      return;
    }

    const requestData = {
      mail: user.firstName+' '+user.lastName
    };
    
    try {
      const response = await axios.get('https://task.groupe-hasnaoui.com/api/primeee/getAllPrimegsh' , {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setData(response.data);
    } catch (error) {
      console.log('There was an error!', error);
    }
  };
 
  useEffect(() => {
    if (user && user.department) {
      fetchData();
    }
  }, [user]);

  const columns = [
    { field: 'id', title: 'id', hidden: true },
    { field: 'username', title: 'Personne' },

      { field: 'mois', title: 'Mois' },
    
     { field: 'prime', title: 'Prime', cellStyle: { backgroundColor: '#A5D721' } },
     { field: 'salaire', title: 'Salaire' },
  ];

  const handleAddUserClick = () => {
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  };
 

  return (
    <>
 { /*   <ModifyProject 
        id={IdPro}
        tire_projet={titreProject}
        descri={descriptionProject}
        chefp={chefProject}
        dadebut={DateDebut}
        dafin={DateFin}
        dep={Departement}
        filia={Filiale}
        par={Participant}
        mai={mailPro}
      />*/} 
      <MaterialTable
        title="La liste Des Primes :"
        columns={columns}
        data={data}
        options={{
          search: true,
          paging: true,
           exportButton: true,
          headerStyle: {
            backgroundColor: '#01579b',
            color: '#FFF'
          },
          actionsColumnIndex: -1,
        }}
        actions={[
          {
            icon: 'refresh',
            tooltip: 'Actualiser',
            isFreeAction: true,
            onClick: () => fetchData(),
          },
          
        ]}
        detailPanel={rowData => (
          <div style={{ marginLeft: '25px' }}>
             
          </div>
        )}
        localization={{
          body: {
            emptyDataSourceMessage: "Pas d'enregistrement à afficher",
            addTooltip: 'Ajouter',
            deleteTooltip: 'Supprimer',
            editTooltip: 'Editer',
            filterRow: {
              filterTooltip: 'Filtrer'
            },
            editRow: {
              deleteText: 'Voulez-vous supprimer ce projet?',
              cancelTooltip: 'Annuler',
              saveTooltip: 'Enregistrer'
            }
          },
          grouping: {
            placeholder: "Tirer l'entête ...",
            groupedBy: 'Grouper par:'
          },
          header: {
            actions: 'Actions'
          },
          pagination: {
            labelDisplayedRows: '{from}-{to} de {count}',
            labelRowsSelect: 'lignes',
            labelRowsPerPage: 'lignes par page:',
            firstAriaLabel: 'Première page',
            firstTooltip: 'Première page',
            previousAriaLabel: 'Page précédente',
            previousTooltip: 'Page précédente',
            nextAriaLabel: 'Page suivante',
            nextTooltip: 'Page suivante',
            lastAriaLabel: 'Dernière page',
            lastTooltip: 'Dernière page'
          },
          toolbar: {
            addRemoveColumns: 'Ajouter ou supprimer des colonnes',
            nRowsSelected: '{0} ligne(s) sélectionée(s)',
            showColumnsTitle: 'Voir les colonnes',
            showColumnsAriaLabel: 'Voir les colonnes',
            exportTitle: 'Exporter',
            exportAriaLabel: 'Exporter',
            exportName: 'Exporter en CSV',
            searchTooltip: 'Recherche',
            searchPlaceholder: 'Recherche'
          }
        }}
      />
    </>
  );
};

export default AdminPrimeValUserRh;
