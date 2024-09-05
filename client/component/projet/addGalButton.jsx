import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoProjectRoadmap } from "react-icons/go";
import { FaRegStar } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import { TbFileDescription } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa";
import { IoIosBusiness } from "react-icons/io";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';

const animatedComponents = makeAnimated();

const AddGalButton = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const optionsFiliale = [
    { value: 'GSHA', label: 'GSHA' },
    { value: 'BTPH', label: 'BTPH' },
    { value: 'ALUX', label: 'ALUX' },
    { value: 'SODE', label: 'SODE' },
    { value: 'STRU', label: 'STRU' },
    { value: 'HPS', label: 'HPS' },
    { value: 'HTA', label: 'HTA' },
    { value: 'PUMA', label: 'PUMA' },
    { value: 'TEKN', label: 'TEKN' },
    { value: 'HLOG', label: 'HLOG' },
    { value: 'MDM', label: 'MDM' },
    { value: 'SECH', label: 'SECH' },
    { value: 'TAMS', label: 'TAMS' },
    { value: 'HGP', label: 'HGP' },
    { value: 'GAMS', label: 'GAMS' },
    { value: 'HTF', label: 'HTF' },
    { value: 'SPI', label: 'SPI' },
    { value: 'GRYD', label: 'GRYD' },
    { value: 'PHAR', label: 'PHAR' },
    { value: 'EHPH', label: 'EHPH' },
  ];

  const optionsDirection = [
    { value: 'CPO', label: 'CPO' },
    { value: 'DSI', label: 'DSI' },
    { value: 'DGR', label: 'DGR' },
    { value: 'DCE', label: 'DCE' },
    { value: 'DQH', label: 'DQH' },
    { value: 'DRH', label: 'DRH' },
    { value: 'DGA', label: 'DGA' },
    { value: 'DAJ', label: 'DAJ' },
    { value: 'DCO', label: 'DCO' },
    { value: 'DCG', label: 'DCG' },
    { value: 'DMC', label: 'DMC' },
     { value: 'DFC', label: 'DFC' },
  ];

  const [optionsChef, setOptionsChef] = useState([]);
  const [optionsPartic, setOptionsPartic] = useState([]);
  const [mailDirector, setMailDirector] = useState('');
   
 
  useEffect(() => {
    axios.get('https://api.ldap.groupe-hasnaoui.com/get/users/group/GSHA-NEW?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJUb2tlbiI6IkZvciBEU0kiLCJVc2VybmFtZSI6ImFjaG91cl9hciJ9.aMy1LUzKa6StDvQUX54pIvmjRwu85Fd88o-ldQhyWnE')
      .then(response => {
        const options = response.data.members.map(member => ({
          value: member,
          label: member
        }));
        setOptionsChef(options);
        setOptionsPartic(options);
      })
      .catch(error => {
        console.error('There was an error fetching the options!', error);
        toast.error("Error fetching user data.");
      });

  }, []);

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

  const initialValues = {
    titreProjet: '',
    dateDebut: '',
    dateFin: '',
    chefProjet: [],
    direction: [],
    filiale: [],
    participant: [],
    description: '',
  };

  const validationSchema = Yup.object().shape({
    titreProjet: Yup.string().required('Il faut remplir votre Titre de Projet'),
    dateDebut: Yup.date().required('Il faut remplir Votre Date de début de projet').min(new Date('2024-06-30'), 'La date de début doit être après le 1er Juillet 2024').max(new Date('2024-09-30'), 'La date de début doit être avant le 30 septembre 2024'),
    dateFin: Yup.date().required('Il faut remplir Votre Date de fin de projet').min(Yup.ref('dateDebut'), 'La date de fin ne peut pas être avant la date de début').max(new Date('2024-09-30'), 'La date de fin doit être avant le 30 septembre 2024'),
    chefProjet: Yup.array().test('unique', 'Vous ne pouvez sélectionner qu\'un seul chef de projet', value => value.length <= 1).min(1, 'Il faut remplir votre Chef de Projet').required('Il faut remplir votre Chef de Projet'),
    direction: Yup.array().min(1, 'Il faut remplir votre Direction de Projet').required('Il faut remplir votre Direction de Projet'),
    filiale: Yup.array().min(1, 'Il faut remplir votre filiale de Projet').required('Il faut remplir votre filiale de Projet'),
    participant: Yup.array().min(1, 'Il faut remplir votre participant de Projet').required('Il faut remplir votre participant de Projet'),
    description: Yup.string().required('Il faut remplir votre description de Projet'),
  });

  const onSubmit = async (values, { resetForm }) => {
    await fetchDirectorMail();
    
    const DirectionAll = values.direction.map(item => item.value).join('-');
    const FilialeAll = values.filiale.map(item => item.value).join('-');
    const ParticipantAll = values.participant.map(item => item.value).join('-');
    const ChefProjetAll = values.chefProjet.map(item => item.value).join('-');

    const apiUrl = 'https://task.groupe-hasnaoui.com/api/projet/add';
    const requestData = {
      titre_projet: values.titreProjet,
      description: values.description,
      chefprojetgroupe: ChefProjetAll,
      date_debut: values.dateDebut,
      date_fin: values.dateFin,
      departement: DirectionAll,
      filialegroupe: FilialeAll,
      participant: ParticipantAll,
      mail: user.mail,
      departement_user: user.department
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

      const apiUrll = 'https://www.groupe-hasnaoui.com/maildirecteur.php';
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

      resetForm(initialValues);
      toast.success('Le Projet a été bien Ajouté');
    /*     const modal = document.getElementById('exampleModal');
  if (modal) {
    modal.classList.remove('show'); // Remove 'show' class to hide modal
    const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
    if (modalBackdrop) {
      modalBackdrop.remove(); // Remove modal backdrop
    }
  }*/
      setTimeout(() => {
        window.location.href = '';
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

  const CustomSelect = ({ field, form, options, isMulti }) => (
    <Select
      {...field}
      options={options}
      isMulti={isMulti}
      components={animatedComponents}
      onChange={option => form.setFieldValue(field.name, option)}
      value={field.value}
    />
  );

  return (
    <>
      <center>
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header " >
              <div className="d-flex justify-content-between align-items-center">
  <h1 className="modal-title fs-5 " id="exampleModalLabel" style={{marginRight:'400px'}}>Ajouter Projet</h1>
  <a className="cssbuttons-io-button" href="https://www.groupe-hasnaoui.com/doc_employe.pdf" download style={{ width: 'fit-content' }} target="_blank" rel="noopener noreferrer">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path fill="none" d="M0 0h24v24H0z"></path>
      <path
        fill="currentColor"
        d="M1 14.5a6.496 6.496 0 0 1 3.064-5.519 8.001 8.001 0 0 1 15.872 0 6.5 6.5 0 0 1-2.936 12L7 21c-3.356-.274-6-3.078-6-6.5zm15.848 4.487a4.5 4.5 0 0 0 2.03-8.309l-.807-.503-.12-.942a6.001 6.001 0 0 0-11.903 0l-.12.942-.805.503a4.5 4.5 0 0 0 2.029 8.309l.173.013h9.35l.173-.013zM13 12h3l-4 5-4-5h3V8h2v4z"
      ></path>
    </svg>
    <span>Documentation</span>
  </a>
</div>

               
                 <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModalClick}></button>
              </div>
              <div className="modal-body">
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} validateOnMount>
                  {({ setFieldValue }) => (
                    <Form>
                 
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label htmlFor="titreProjet" style={{ float: 'left' }}>Titre de projet <span className='text-danger'>*</span></label>
                            <div className="input-group mb-2">
                              <span className="input-group-text"><GoProjectRoadmap /></span>
                              <Field type="text" id="titreProjet" name="titreProjet" className="form-control" placeholder="Titre de projet" />
                            </div>
                            <ErrorMessage name="titreProjet" component="div" className="text-danger" />
                          </div>
                        </div>
                        <div className="col-lg-6">
                             <label htmlFor="chefProjet" style={{ float: 'left' }}>Chef de projet <span className='text-danger'>*</span></label>
                           <br/>    <Field
                                name="chefProjet"
                                component={CustomSelect}
                                options={optionsChef}
                                isMulti={true}
                              />
                            <ErrorMessage name="chefProjet" component="div" className="text-danger" />
                                                        </div>  
                    
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label htmlFor="dateDebut" style={{ float: 'left' }}>Date début <span className='text-danger'>*</span></label>
                            <div className="input-group mb-2">
                              <span className="input-group-text"><MdOutlineDateRange /></span>
                              <Field type="date" id="dateDebut" name="dateDebut" className="form-control" placeholder="Date début" />
                            </div>
                            <ErrorMessage name="dateDebut" component="div" className="text-danger" />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label htmlFor="dateFin" style={{ float: 'left' }}>Date Fin <span className='text-danger'>*</span></label>
                            <div className="input-group mb-2">
                              <span className="input-group-text"><MdOutlineDateRange /></span>
                              <Field type="date" id="dateFin" name="dateFin" className="form-control" placeholder="Date Fin" />
                            </div>
                            <ErrorMessage name="dateFin" component="div" className="text-danger" />
                          </div>
                        </div>
                       
                                                        <div className="col-lg-6">
                             <label htmlFor="participant" style={{ float: 'left' }}>Participant <span className='text-danger'>*</span></label>
                             <br/>   <Field
                                name="participant"
                                component={CustomSelect}
                                options={optionsPartic}
                                isMulti={true}
                              />
                             <ErrorMessage name="participant" component="div" className="text-danger" />
                         </div>
                         <div className="col-lg-6">
                             <label htmlFor="direction" style={{ float: 'left' }}>Scope <span className='text-danger'>*</span></label>
                              <br/> <Field
                                name="direction"
                                component={CustomSelect}
                                options={optionsDirection}
                                isMulti={true}
                              />
                             <ErrorMessage name="direction" component="div" className="text-danger" />
                         </div>
                        <div className="col-lg-6">
                             <label htmlFor="filiale" style={{ float: 'left' }}>Filiale <span className='text-danger'>*</span></label>
                            <br/>    <Field
                                name="filiale"
                                component={CustomSelect}
                                options={optionsFiliale}
                                isMulti={true}
                              />
                             <ErrorMessage name="filiale" component="div" className="text-danger" />
                         </div>
                     
                        <div className="col-lg-12">
                          <div className="form-group">
                            <label htmlFor="description" style={{ float: 'left' }}>Description <span className='text-danger'>*</span></label>
                            <div className="input-group mb-2">
                              <span className="input-group-text"><TbFileDescription /></span>
                              <Field as="textarea" id="description" name="description" className="form-control" placeholder="Description" rows="4" />
                            </div>
                            <ErrorMessage name="description" component="div" className="text-danger" />
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
        <button
  type="button"
  className="btn btn-success projet-step m-2 addproject-step"
  data-bs-toggle="modal"
  data-bs-target="#exampleModal"
  onClick={fetchDirectorMail}
>
  <i className="fa fa-plus"></i> Ajouter un Projet
</button>

        <ToastContainer />
      </center>
    </>
  );
}

export default AddGalButton;
