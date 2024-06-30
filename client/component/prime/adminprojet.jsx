import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import axios from 'axios';
import ModifyProject from './modifyProject';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

const AdminPrimeVal = () => {
 
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
      dep: user.department
    };
    
    try {
      const response = await axios.get('https://task.groupe-hasnaoui.com/api/primeee/primgshahasnaoui', requestData, {
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
    { field: 'titre_tache', title: 'Titre de Tache' },
    { field: 'username', title: 'Utilisateur' },
    { field: 'equipe', title: 'Equipe' },
    { field: 'mois', title: 'Mois' },
    { field: 'level', title: 'Level' , render: rowData => (
      <div style={{ backgroundColor: rowData.level === '5' ? 'red' : '#D6FA8C' }} className='etatprojetresponsable-step p-2'>
        {rowData.level}
      </div>
    )
  },  

     { field: 'validation_dg', title: 'Validation DGA', cellStyle: { backgroundColor: '#A5D721' } },
  ];

  const handleAddUserClick = () => {
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  };

  const Modiyprojet =async (id,moiss,levell ,user,equip ) => {
    setIdTache(id)
    setMois(moiss)
    setLevel(levell)
    
    
    

    const apiUrl = 'https://task.groupe-hasnaoui.com/api/primeee/add';
    const requestData = {
      username: user,
      mois: moiss,
      level: levell,
      prime: '3000',
      equipe:equip
     
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data);
      }

     

    
    } catch (error) {
     

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
          filtering: true,
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
          {
            icon: 'edit',
            tooltip: 'Validation Projet',
            isFreeAction: false,
            onClick: (event, rowData) => Modiyprojet(
              rowData.id,
              rowData.mois,
              rowData.level,
              rowData.username,
              rowData.equipe,
            
            ),
          }
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

export default AdminPrimeVal;
