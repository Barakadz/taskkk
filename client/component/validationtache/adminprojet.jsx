import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
 
import axios from 'axios';
  import Tour from '../tour';
 import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import ModifyTache from './modifyTache';

const AdminTacheVal = () => {
  const [titreTache, setTitreTache] = useState('');
  const [descriptionTache, setDescriptionTache] = useState('');
  const [IdTache, setIdTache] = useState('');
  const [etat, setEtat] = useState('');

   const [DateDebut, setDateDebut] = useState('');
  const [DateFin, SetDateFin] = useState('');
  const [projet, setProjet] = useState('');
     const [mailTach, setmailTach] = useState('');
     const [level, setLevel] = useState('');
     const [equipe, setEquipe] = useState('');



 
 




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
      const response = await axios.post('https://task.groupe-hasnaoui.com/api/tachevalide/projetdep/', requestData, {
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
    { field: 'titre_tache', title: 'Titre de tache' },
    { field: 'level', title: 'Niveau' },

    { field: 'date_debut', title: 'Date de Début' },
    { field: 'date_fin', title: 'Date de Fin' },
    { field: 'mail', title: 'Utilisateur' },

     { field: 'validation', title: 'Validation resopnsable', cellStyle: { backgroundColor: '#D6FA8C' }  },
 
    
  ];

  const handleAddUserClick = () => {
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  };
 
  const Modiytach = (id, titre_tache, description, date_debut, date_fin,etat, mail, projet,level,equipe) => {
    setTitreTache(titre_tache);

 
setProjet(projet)
setEtat(etat)
setLevel(level)
       setTitreTache(titre_tache)
      setDescriptionTache(description);
     setDateDebut(date_debut);
    SetDateFin(date_fin);
     setIdTache(id);
    setmailTach(mail);
setEquipe(equipe);
    const modal = document.getElementById('exampleModall');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  };

  return (
    <>
 
         <ModifyTache  id={IdTache}   titre_tach={titreTache}   descrip={descriptionTache}  
       DateDebut={DateDebut}   dateFin={DateFin}projt={projet}   etaat={etat} niveau={level} mai={mailTach} equi={equipe}
       />   
       <MaterialTable
        title="La liste Des Taches :"
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
            tooltip: 'validation Tache',
            isFreeAction: false,
            onClick: (event, rowData) => Modiytach(JSON.stringify(rowData.id), JSON.stringify(rowData.titre_tache), JSON.stringify(rowData.description),
             JSON.stringify(rowData.date_debut), JSON.stringify(rowData.date_fin),
            JSON.stringify(rowData.etat), JSON.stringify(rowData.mail) ,JSON.stringify(rowData.projet) ,JSON.stringify(rowData.level) ,JSON.stringify(rowData.equipe)
          ),
          }
        ]}
        
        detailPanel={rowData => (
          <div style={{ marginLeft: '25px' }}>
            <p><b>Description :</b></p>
            <div dangerouslySetInnerHTML={{ __html: rowData.description }} />
            <p><b>Equipe :</b></p>
            <div dangerouslySetInnerHTML={{ __html: rowData.equipe }} />
            <p><b>Niveau du tache :</b></p>
            <div dangerouslySetInnerHTML={{ __html: rowData.level }} />
            <p><b>Etat d'avancement :</b></p>
            <div dangerouslySetInnerHTML={{ __html: rowData.etat }} />
            
           


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

export default AdminTacheVal;
