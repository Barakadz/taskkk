import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import AddGalButton from './addGalButton';
import ModifyGalerie from './modifygalerie';
import Tour from '../tour';

const AdminEmploye = () => {
  const [ImageGal, setImage] = useState('');
  const [TypeGal, setType] = useState('');
  const [IdGal, setId] = useState('');
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api/projet/');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 3000); // Fetch data every 5 seconds
    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  const columns = [
    { field: 'id', title: 'id', hidden: true },
    { field: 'titre_projet', title: 'Titre de Projet' },
    { field: 'chef_projet', title: 'Chef de projet' },
    { field: 'date_debut', title: 'Date de Début' },
    { field: 'date_fin', title: 'Date de Fin' },
    { field: 'departement', title: 'Département' },
    { field: 'validation', title: 'Validation', cellStyle: { backgroundColor: '#C4D600' } },
  ];

  const handleAddUserClick = () => {
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  };

  const ModiyGalerie = (id, image, type) => {
    setImage(image);
    setType(type);
    setId(id);
    const modal = document.getElementById('exampleModall');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  };

  return (
    <>
      <AddGalButton />
      <ModifyGalerie id={IdGal} image={ImageGal} type={TypeGal} />
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
            tooltip: 'Modifier Projet',
            isFreeAction: false,
            onClick: (event, rowData) => ModiyGalerie(JSON.stringify(rowData.id), JSON.stringify(rowData.image), JSON.stringify(rowData.type)),
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
                axios.delete(`http://localhost:8800/api/projet/${id}`)
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

export default AdminEmploye;
