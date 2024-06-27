import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
  import Tour from '../tour';
import ModifyProject from './modifyProject';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

const AdminProjetVal = () => {
  const [titreProject, setTitreProject] = useState('');
  const [descriptionProject, setdescriptionProject] = useState('');
  const [chefProject, setChefProject] = useState('');
  const [DateDebut, setDateDebut] = useState('');
  const [DateFin, SetDateFin] = useState('');
  const [Departement, setDepartement] = useState('');
  const [Filiale, setFiliale] = useState('');
  const [Participant, setParticipant] = useState('');
  const [IdPro, setIdPro] = useState('');
  const [mailPro, setmailPro] = useState('');

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  

  const [data, setData] = useState([]);

  const fetchData = async () => {
    let mailts = localStorage.getItem('mailtask');

    const requestData = {
      dep:user.department
    };
    
    axios.post('https://task.groupe-hasnaoui.com/api/projetvalide/projetdep/', requestData, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      setData(response.data);
    })
    .catch(error => {
      console.log('There was an error!', error);
    });




     
  };

  useEffect(() => {
    fetchData();
    //const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds
    //return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  const columns = [
    { field: 'id', title: 'id', hidden: true },
    { field: 'titre_projet', title: 'Titre de Projet' },
    { field: 'date_debut', title: 'Date de Début' },
    { field: 'date_fin', title: 'Date de Fin' },
    { field: 'mail', title: 'Utilisateur' },

     { field: 'validation', title: 'Validation', cellStyle: { backgroundColor: '#D6FA8C' }  },
    { field: 'validation_dg', title: 'Validation DGA', cellStyle: { backgroundColor: '#A5D721' }  },

    
  ];

  const handleAddUserClick = () => {
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  };

  const Modiyprojet = (id, titre_projet, description,chef_projet, date_debut, date_fin,departement, filiale, participant,mail) => {
    setTitreProject(titre_projet);
    setdescriptionProject(description);
    setChefProject(chef_projet);
    setDateDebut(date_debut);
    SetDateFin(date_fin);
    setDepartement(departement);
    setFiliale(filiale);
    setParticipant(participant);
    setIdPro(id);
    setmailPro(mail);

    const modal = document.getElementById('exampleModall');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  };

  return (
    <>
      <ModifyProject  id={IdPro}   tire_projet={titreProject}   descri={descriptionProject}   chefp={chefProject} 
       dadebut={DateDebut}   dafin={DateFin}dep={Departement}   filia={Filiale} par={Participant} mai={mailPro} 
       />   
       <ToastContainer />
      <MaterialTable
        title="La liste Des Projets :"
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
            tooltip: 'validation Projet',
            isFreeAction: false,
            onClick: (event, rowData) => Modiyprojet(JSON.stringify(rowData.id), JSON.stringify(rowData.titre_projet), JSON.stringify(rowData.description),
            JSON.stringify(rowData.chef_projet), JSON.stringify(rowData.date_debut), JSON.stringify(rowData.date_fin),
            JSON.stringify(rowData.departement), JSON.stringify(rowData.filiale), JSON.stringify(rowData.participant), JSON.stringify(rowData.mail)
          ),
          }
        ]}
        
        detailPanel={rowData => (
          <div style={{ marginLeft: '25px' }}>
            <p><b>Description :</b></p>
            <div dangerouslySetInnerHTML={{ __html: rowData.description }} />
            <p><b>Participant :</b></p>
            <div dangerouslySetInnerHTML={{ __html: rowData.participant }} />
            <p><b>Filiale :</b></p>
            <div dangerouslySetInnerHTML={{ __html: rowData.filiale }} />
            <p><b>Scope :</b></p>
            <div dangerouslySetInnerHTML={{ __html: rowData.departement }} />
            
            <p><b>Scope :</b></p>
            <div dangerouslySetInnerHTML={{ __html: rowData.departement }} />
             <p><b>Chef de projet :</b></p>
            <div dangerouslySetInnerHTML={{ __html: rowData.chef_projet }} />




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

export default AdminProjetVal;
