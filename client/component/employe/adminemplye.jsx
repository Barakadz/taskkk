import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
  import Tour from '../tour';
import AddGalButtonEmploye from './addGalButton';

const AdminEmploye = () => {
  const [ImageGal, setImage] = useState('');
  const [TypeGal, setType] = useState('');
  const [IdGal, setId] = useState('');
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://task.groupe-hasnaoui.com/api/employe@groupe');
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
    { field: 'username', title: 'Employe' },
    { field: 'salaire', title: 'Salaire' },
    { field: 'prime', title: 'Prime' },
    { field: 'mois', title: 'Mois' },
    { field: 'trimestre', title: 'Trimestre' },
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
    <><AddGalButtonEmploye/>
        <ToastContainer />
      <MaterialTable
        title="La liste Des Employes :"
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
