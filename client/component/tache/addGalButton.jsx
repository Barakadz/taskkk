import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoProjectRoadmap } from "react-icons/go";
import { MdOutlineDateRange } from "react-icons/md";
import { TbFileDescription } from "react-icons/tb";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FaRegStar } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

const animatedComponents = makeAnimated();

const AddGalButton = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
   const [optionsPartic, setOptionsPartic] = useState([]);
  const [optionsProjet, setOptionsProjet] = useState([]);
  const [isProjetSelected, setIsProjetSelected] = useState(true);
const[DateDebutProject,setDateDebutProject]=useState('2024-04-01');
const[dateFinProject,setDateFinProject]=useState('2024-06-30');
const [mailDirector, setMailDirector] = useState('');
const[idProject,setIdProject]= useState('');
const ff=async(see)=>{
  try {
    const response = await axios.post('https://task.groupe-hasnaoui.com/api/projet/projettitre', {
       titre_projet: see
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = response.data;
   
    setIdProject(response.data[0].id);
   } catch (error) {
    console.error('There was an error fetching the options!', error);
  }
}


const fetchDirectorMail = async () => {
  try {
    const response = await axios.post('https://task.groupe-hasnaoui.com/api/directeur/directeurmail', { dep: user.department });
    const data = response.data;
    if (data.length > 0) {
      setMailDirector(data[0].mail);
    }
  } catch (error) {
    console.error('Error fetching director mail:', error);
  }
};
  useEffect(() => {
    fetchOptionsProjet();
  }, []);

  const fetchOptionsProjet = async () => {
    try {
      const response = await axios.post('https://task.groupe-hasnaoui.com/api/projet/projetmail', {
        mail: localStorage.getItem('mailtask')
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      const options = data.map(item => ({
        value: item.titre_projet,
        label: item.titre_projet,
      }));

      setOptionsProjet(options);
    } catch (error) {
      console.error('There was an error fetching the options!', error);
    }
  };

  const fetchOptions = async (selectedProject) => {
    try {
      const response = await axios.post('https://task.groupe-hasnaoui.com/api/projet/projetdate', {
         titre_projet: selectedProject
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
     
      setDateDebutProject(response.data[0].date_debut);
      setDateFinProject(response.data[0].date_fin)
    } catch (error) {
      console.error('There was an error fetching the options!', error);
    }






    try {
      const response = await axios.post('https://task.groupe-hasnaoui.com/api/projet/projetpar', {
        mail: localStorage.getItem('mailtask'),
        titre_projet: selectedProject
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      const options = data.map(item => ({
        value: item.participant,
        label: item.participant,
      }));

      setOptionsPartic(options);
    } catch (error) {
      console.error('There was an error fetching the options!', error);
    }
  };

  const initialValues = {
    titreTache: '',
    dateDebut: '',
    dateFin: '',
    projet: [], // Ensure projet field is initialized as an empty array
    participant: [],
    description: '',
    etat: '',
    niveau: ''
  };
const validationSchema = Yup.object().shape({
    niveau: Yup.string().required('Il faut remplir votre Niveau de Tache'),
    titreTache: Yup.string().required('Il faut remplir votre Titre de Tache'),
    dateDebut: Yup.date()
    .required('Il faut remplir Votre Date de début de la tache')
    .min(new Date(DateDebutProject), 'La date de début de tache doit être après la date de début du projet')
    .max(new Date(dateFinProject), 'La date de début de tache doit être avant la date de fin du projet'),
  dateFin: Yup.date()
    .required('Il faut remplir Votre Date de fin de tache')
    .min(Yup.ref('dateDebut'), 'La date de fin du tache ne peut pas être avant la date de début du tache')
    .max(new Date(dateFinProject), 'La date de fin doit être avant la fin du projet'),
 
     projet: Yup.array()
      .test('unique', 'Vous ne pouvez sélectionner qu\'un seul projet', (value) => {
        return value.length <= 1;
      })
      .min(1, 'Il faut remplir votre  Projet')
      .required('Il faut remplir votre Projet'),
    participant: Yup.array().min(1, 'Il faut remplir votre participant de cette Tache').required('Il faut remplir votre participant de cette tache'),
    description: Yup.string().required('Il faut remplir votre description de Tache'),
    etat: Yup.string().required("Il faut remplir votre Etat d'avancement de Tache")
  });
// Adjust dateDebut and dateFin validations to subtract 1 day from DateDebutProject
validationSchema.fields.dateDebut = validationSchema.fields.dateDebut.min(new Date(new Date(DateDebutProject).setDate(new Date(DateDebutProject).getDate() - 1)));
validationSchema.fields.dateFin = validationSchema.fields.dateFin.min(new Date(new Date(DateDebutProject).setDate(new Date(DateDebutProject).getDate() - 1)));
 
  const onSubmit = async(values, { resetForm }) => {
    
    const ParticipantAll = values.participant.map(item => item.value).join('-');
    const ProjetAll = values.projet.map(item => item.value).join('-');
 
 
    const apiUrl = 'https://task.groupe-hasnaoui.com/api/tache/add';
    const requestData = {
      level: values.niveau,
      titre_tache: values.titreTache,
      description: values.description,
      etat: values.etat,
      date_debut: values.dateDebut,
      date_fin: values.dateFin,
      equipe: ParticipantAll,
      mail: user.mail,
      projet: idProject,
      departement_user: user.department
    };
  const mailsend=async() =>{
    const apiUrll = 'https://www.groupe-hasnaoui.com/mailtache.php';
    const requestDataa = {
      Email: mailDirector,
      Nom: user.firstName,
      Prenom: user.lastName
    };

    await axios.post(apiUrll, requestDataa, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }  











  







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
 toast.success('La Tache à été bien Ajouté');
resetForm(initialValues); // Reset form fields
mailsend()
setTimeout(() => {
  window.location.href = ''
}, 3000);
  } catch (error) {
    console.error('An error occurred:', error);
    toast.error(`Error: ${error.message}`);
    resetForm(initialValues);

  }
};

 
  const handleCloseModalClick = () => {
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  };

  const CustomSelect = ({ field, form, options, isMulti, isDisabled }) => {
    return (
      <Select
        {...field}
        options={options}
        isMulti={isMulti}
        isDisabled={isDisabled}
        components={animatedComponents}
        onChange={option => {
          form.setFieldValue(field.name, option);
          if (field.name === 'projet') {
            if(option==''){
              setIsProjetSelected(true);
              form.setFieldValue('participant', []); // Reset participant field to empty array
              form.setFieldValue('dateDebut',  '');  
              form.setFieldValue('dateFin',  ''); 
setDateDebutProject('2024-04-01')
setDateFinProject('2024-06-30')
            }
          else{
                        fetchOptions(option[0].value); // Fetch equipe based on selected projet
                        ff(option[0].value)
            setIsProjetSelected(false);

          }
          }
        }}
        value={field.value}
      />
    );
  };

  return (
    <>
      <center>
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Ajouter Tache</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModalClick}></button>
              </div>
              <div className="modal-body">        <h6><b>NB:</b> Date de debut projet :<b style={{color:'red'}}>{DateDebutProject}</b> -  Date de fin projet :<b style={{color:'red'}}>{dateFinProject} </b></h6>

                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} validateOnMount>
                   {({ setFieldValue,errors,touched }) => (
                    <Form>
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label htmlFor="titreTache" style={{ float: 'left' }}>Titre de Tache <span className='text-danger'>*</span></label>
                            <div className="input-group mb-2">
                              <span className="input-group-text"><GoProjectRoadmap /></span>
                              <Field type="text" id="titreTache" name="titreTache"   placeholder="Titre de tache"  className={`form-control problem-step ${
                                    touched.titreTache && errors.titreTache ? 'is-invalid' : ''
                                }`}
                            />
                            <div className="invalid-feedback">
                                {touched.titreTache && errors.titreTache}
                            </div>
                            </div>
                           </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label htmlFor="niveau" style={{ float: 'left' }}>Niveau <span className='text-danger'>*</span>:</label>
                            <div className="input-group mb-3">
                              <span className="input-group-text" id="basic-addon1"><FaRegStar /></span>
                              <Field as="select" id="niveau" name="niveau" className="form-select">
                                <option value="">--choisir le niveau de projet--</option>
                                {['1', '2', '3', '4', '5'].map((state) => (
                                  <option key={state} value={state}>
                                    {state}
                                  </option>
                                ))}
                              </Field>
                            </div>
                            <ErrorMessage name="niveau" component="div" className="text-danger" />
                          </div>
                        </div>
                        
                        <div className="col-lg-6">
                          <label htmlFor="projet" style={{ float: 'left' }}>Projet <span className='text-danger'>*</span></label>
                          <br />
                          <Field
  name="projet"
  component={CustomSelect}
  options={optionsProjet}
  isMulti={true}
  onChange={(selectedOptions) => {
    // Ensure selectedOptions is an array
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];

    // Set the field value using Formik's setFieldValue
    setFieldValue('projet', selectedValues);

    // Alert each selected value individually
    selectedValues.forEach(value => {
     });

    // Update state
    setIsProjetSelected(selectedValues.length > 0);
  }}
/>


                          <ErrorMessage name="projet" component="div" className="text-danger" />
                        </div>
                        <div className="col-lg-6">
                          <label htmlFor="participant" style={{ float: 'left' }}>Equipe <span className='text-danger'>*</span></label>
                          <br />
                          <Field
                            name="participant"
                            component={CustomSelect}
                            options={optionsPartic}
                            isMulti={true}
                            isDisabled={isProjetSelected}
                          />
                          <ErrorMessage name="participant" component="div" className="text-danger" />
                        </div>
                        
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label htmlFor="dateDebut" style={{ float: 'left' }}>Date début <span className='text-danger'>*</span></label>
                            <div className="input-group mb-2">
                              <span className="input-group-text"><MdOutlineDateRange /></span>
                              <Field type="date" id="dateDebut" name="dateDebut" className="form-control" placeholder="Date début" disabled={isProjetSelected} />
                            </div>
                            <ErrorMessage name="dateDebut" component="div" className="text-danger" />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label htmlFor="dateFin" style={{ float: 'left' }}>Date Fin <span className='text-danger'>*</span></label>
                            <div className="input-group mb-2">
                              <span className="input-group-text"><MdOutlineDateRange /></span>
                              <Field type="date" id="dateFin" name="dateFin" className="form-control" placeholder="Date Fin"  disabled={isProjetSelected}/>
                            </div>
                            <ErrorMessage name="dateFin" component="div" className="text-danger" />
                          </div>
                        </div>
                        
                        
                        
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label htmlFor="etat" style={{ float: 'left' }}>Etat avancement <span className='text-danger'>*</span></label>
                            <div className="input-group mb-2">
                              <span className="input-group-text"><GoProjectRoadmap /></span>
                              <Field type="number" id="etat" name="etat" max="100"   placeholder="Etat de Avancement"  className={`form-control problem-step ${
                                    touched.etat && errors.etat ? 'is-invalid' : ''
                                }`}
                            />
                            <div className="invalid-feedback">
                                {touched.etat && errors.etat}
                            </div>
                            </div>
                           </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="form-group">
                            <label htmlFor="description" style={{ float: 'left' }}>Description <span className='text-danger'>*</span></label>
                            <div className="input-group mb-2">
                              <span className="input-group-text"><TbFileDescription /></span>
                              <Field as="textarea" id="description" name="description"   placeholder="Description" rows="4"  className={`form-control problem-step ${
                                    touched.description && errors.description ? 'is-invalid' : ''
                                }`}
                            />
                            <div className="invalid-feedback">
                                {touched.description && errors.description}
                            </div>
                            </div>
                           </div>
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary">Enregistrer</button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
        <button type="button" className="btn btn-success addtache-step m-2" data-bs-toggle="modal" data-bs-target="#exampleModal"   onClick={fetchDirectorMail}
        >
          <i className="fa fa-plus"></i> Ajouter une tache
        </button>
        <ToastContainer />
      </center>
    </>
  );
};

export default AddGalButton;
