import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import axios from 'axios';
import ModifyProject from './modifyProject';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

const AdminProjetVall = () => {
  const [titreProject, setTitreProject] = useState('');
  const [descriptionProject, setDescriptionProject] = useState('');
  const [chefProject, setChefProject] = useState('');
  const [DateDebut, setDateDebut] = useState('');
  const [DateFin, setDateFin] = useState('');
  const [Departement, setDepartement] = useState('');
  const [Filiale, setFiliale] = useState('');
  const [Participant, setParticipant] = useState('');
  const [IdPro, setIdPro] = useState('');
  const [mailPro, setMailPro] = useState('');

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
      const response = await axios.get('https://task.groupe-hasnaoui.com/api/projetvalide/', requestData, {
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
    { field: 'titre_projet', title: 'Titre de Projet' },
    { field: 'date_debut', title: 'Date de Début' },
    { field: 'date_fin', title: 'Date de Fin' },
    { field: 'mail', title: 'Utilisateur' },
    { field: 'validation', title: 'Validation', cellStyle: { backgroundColor: '#D6FA8C' } },
    { field: 'validation_dg', title: 'Validation DGR', cellStyle: { backgroundColor: '#A5D721' } },
  ];

  const handleAddUserClick = () => {
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  };

  const Modiyprojet = (id, titre_projet, description, chef_projet, date_debut, date_fin, departement, filiale, participant, mail) => {
    setTitreProject(titre_projet);
    setDescriptionProject(description);
    setChefProject(chef_projet);
    setDateDebut(date_debut);
    setDateFin(date_fin);
    setDepartement(departement);
    setFiliale(filiale);
    setParticipant(participant);
    setIdPro(id);
    setMailPro(mail);

    const modal = document.getElementById('exampleModall');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  };

  return (
    <>
      <ModifyProject 
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
      />
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
          pageSize: 100,
          pageSizeOptions: [10, 20, 50, 100]
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
              rowData.titre_projet,
              rowData.description,
              rowData.chef_projet,
              rowData.date_debut,
              rowData.date_fin,
              rowData.departement,
              rowData.filiale,
              rowData.participant,
              rowData.mail
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

export default AdminProjetVall;
