import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import AddGalButton from './addGalButton';
 import Tour from '../tour';
import ModifyProject from './modifyProject';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import { CiUser, CiCalendarDate, CiMail } from "react-icons/ci";
import { IoIosArrowDropright } from "react-icons/io";
import { IoIosArrowDropdownCircle } from "react-icons/io";

const AdminProjet = () => {
  const [titreProject, setTitreProject] = useState('');
  const [descriptionProject, setdescriptionProject] = useState('');
  const [chefProject, setChefProject] = useState('');
  const [DateDebut, setDateDebut] = useState('');
  const [DateFin, SetDateFin] = useState('');
  const [Departement, setDepartement] = useState('');
  const [Filiale, setFiliale] = useState('');
  const [Participant, setParticipant] = useState('');
  const [IdPro, setIdPro] = useState('');

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  

  const [data, setData] = useState([]);

  const fetchData = async () => {
    let mailts = localStorage.getItem('mailtask');

    const requestData = {
      mail:mailts
    };
    
    axios.post('https://task.groupe-hasnaoui.com/api/projet/projetmail/', requestData, {
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
    { 
      field: 'validation', 
      title: 'Validation Responsable',
      render: rowData => (
        <div style={{ backgroundColor: rowData.validation === 'nonvalide' ? 'red' : '#D6FA8C' }} className='etatprojetresponsable-step p-2'>
          {rowData.validation}
        </div>
      )
    },
    { 
      field: 'validation_dg', 
      title: 'Validation DGA',
      render: rowData => (
        <div style={{ backgroundColor: rowData.validation_dg === 'nonvalide' ? 'red' : '#A5D721' }} className='etatprojetdga-step p-2'>
          {rowData.validation_dg}
        </div>
      )
    }
 
    
  ];

  const handleAddUserClick = () => {
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  };

  const Modiyprojet = (id, titre_projet, description,chef_projet, date_debut, date_fin,departement, filiale, participant) => {
    setTitreProject(titre_projet);
    setdescriptionProject(description);
    setChefProject(chef_projet);
    setDateDebut(date_debut);
    SetDateFin(date_fin);
    setDepartement(departement);
    setFiliale(filiale);
    setParticipant(participant);
    setIdPro(id);
    
    const modal = document.getElementById('exampleModall');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  };

  return (
    <>
        <AddGalButton /> <ModifyProject  id={IdPro}   tire_projet={titreProject}   descri={descriptionProject}   chefp={chefProject} 
       dadebut={DateDebut}   dafin={DateFin}dep={Departement}   filia={Filiale} par={Participant}  
       />   
       <ToastContainer />
      <MaterialTable
        title="La liste Des Projets :"
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
          {
            icon: 'edit',
            tooltip: 'Modifier Projet',
            isFreeAction: false,
            onClick: (event, rowData) => Modiyprojet(JSON.stringify(rowData.id), JSON.stringify(rowData.titre_projet), JSON.stringify(rowData.description),
            JSON.stringify(rowData.chef_projet), JSON.stringify(rowData.date_debut), JSON.stringify(rowData.date_fin),
            JSON.stringify(rowData.departement), JSON.stringify(rowData.filiale), JSON.stringify(rowData.participant)
          ),
          }
        ]}
        editable={{
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setData([...dataDelete]);
                const id = oldData.id;
                axios.delete(`https://task.groupe-hasnaoui.com/api/projet/${id}`)
                  .then(response => {
                    toast.success(response.data);
                  })
                  .catch(error => {
                    toast.error(error);
                  });
                resolve();
              }, 1000);
            }),
        }}
        detailPanel={[
          {  icon: () => <IoIosArrowDropright className='parametres-step'/>, // Icône lorsque le panneau est fermé
            openIcon: () => <IoIosArrowDropdownCircle className='parametres-step'/>, // Icône lorsque le panneau est ouvert
          
            tooltip: 'Plus Détails',
            render: rowData => {
              return (
          <div style={{ marginLeft: '25px' }} >
            
            <p><b>Cause responsable :</b></p>
            <div dangerouslySetInnerHTML={{ __html: rowData.cause_responsable }} />
            <p><b>Cause directeur :</b></p>
            <div dangerouslySetInnerHTML={{ __html: rowData.cause_directeur }} />
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



          </div>);
             },
            },
          ]}
      
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

export default AdminProjet;
