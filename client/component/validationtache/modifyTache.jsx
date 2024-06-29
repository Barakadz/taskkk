import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { GoProjectRoadmap } from "react-icons/go";
import { MdOutlineDateRange } from "react-icons/md";
import { TbFileDescription } from "react-icons/tb";
import { useSelector } from 'react-redux';

const animatedComponents = makeAnimated();

const ModifyTache = ({ id, titre_tach,descrip, niveau, DateDebut, dateFin, projt, mai,equi,etaat }) => {
    const user = useSelector((state) => state.user);

    const [optionsPartic, setOptionsPartic] = useState([]);
    const [optionsProjet, setOptionsProjet] = useState([]);
    const [projet, setProjet] = useState('');

    const validationStatusOptions = [
        { value: 'valide', label: 'Tache validé' },
        { value: 'nonvalide', label: 'Tache non valide' },
    ];
    useEffect(()=>{
        axios.get(`https://task.groupe-hasnaoui.com/api/projet/${projt}`)
        .then(response => {
            if (response.data && response.data.length > 0) {
                setProjet(response.data[0].titre_projet);
            } else {
                alert('No project data found.');
            }
        })
        .catch(error => {
            console.error('Error fetching project data:', error);
        });
    },[ ])
    useEffect(() => {
      
    


        axios.get('https://api.ldap.groupe-hasnaoui.com/get/users/group/GSHA-NEW?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJUb2tlbiI6IkZvciBEU0kiLCJVc2VybmFtZSI6ImFjaG91cl9hciJ9.aMy1LUzKa6StDvQUX54pIvmjRwu85Fd88o-ldQhyWnE')
            .then(response => {
                const options = response.data.members.map(member => ({
                    value: member,
                    label: member
                }));
                setOptionsPartic(options);
                fetchOptionsProjet();
            })
            .catch(error => {
               
            });
    }, []);

    const fetchOptionsProjet = async () => {
        try {
            const response = await fetch('https://task.groupe-hasnaoui.com/api/tache/projetmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mail: user.mail }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            const options = data.map(item => ({
                value: item.titre_projet,
                label: item.titre_projet
            }));

            setOptionsProjet(options);
        } catch (error) {
            console.error('Error fetching project options:', error);
         }
    };

    const removeQuotesAndBackslashes = (str) => str.replace(/["\\]/g, '');

    const initialValues = {
        titre_tache: titre_tach ? titre_tach.replace(/"/g, '') : '',
        dateDebut: DateDebut ? new Date(DateDebut).toISOString().split('T')[0] : '',
        dateFin: dateFin ? new Date(dateFin).toISOString().split('T')[0] : '',
        porjet: projt ? projt.split('-').map(ch => ({ value: removeQuotesAndBackslashes(ch), label: removeQuotesAndBackslashes(ch) })) : [],
        niveau: niveau || '',
        participant: equi ? equi.split('-').map(p => ({ value: removeQuotesAndBackslashes(p), label: removeQuotesAndBackslashes(p) })) : [],
        description: descrip ? descrip.replace(/"/g, '') : '',
        avance: etaat ? etaat.replace(/"/g, '') : '',
        level:  niveau ? niveau.split('-').map(p => ({ value: removeQuotesAndBackslashes(p), label: removeQuotesAndBackslashes(p) })) : [],// Assurez-vous que level a une valeur par défaut valide ici
        validationStatus: '', // Add this line for the validation status
        reason:'',
    };

    const validationSchema = Yup.object().shape({
        titre_tache: Yup.string().required('Titre de tache requis'),
        avance: Yup.string().required('Etat avancement requis'),
        dateDebut: Yup.date().required('Date de début requis').max(new Date(), "La date de début ne peut pas être dans le futur"),
        dateFin: Yup.date().required('Date de fin requis').min(Yup.ref('dateDebut'), 'La date de fin ne peut pas être avant la date de début'),
        porjet: Yup.array()
            .test('unique', 'Vous ne pouvez sélectionner qu\'un seul chef de projet', (value) => {
                return value.length <= 1;
            })
            .min(1, 'Chef de Projet requis')
            .required('Chef de Projet requis'),
        participant: Yup.array().min(1, 'Participant de Projet requis').required('Participant de Projet requis'),
        description: Yup.string().required('Description de Projet requis'),
        level: Yup.array()
        .test('unique', 'Vous ne pouvez sélectionner qu\'un seul niveau du tache', (value) => {
            return value.length <= 1;
        })
        .min(1, 'Chef de Projet requis')
        .required('Chef de Projet requis'),        validationStatus: Yup.array().test('unique', 'Vous ne pouvez sélectionner qu\'un seul etat', (value) => value.length <= 1)
        .min(1, 'Il faut remplir votre etat de validation')
        .required('Il faut remplir votre etat de validation'),
        reason:Yup.string().required('Il faut remplir votre Raison de validation'),
    });

    const onSubmit = async (values, { resetForm }) => {
        try {
            const ParticipantAll = values.participant.map(item => item.value).join('-');
            const proALL = values.porjet.map(item => item.value).join('-');
            const levelAll = values.level.map(item => item.value).join('-');

            const apiUrl = `https://task.groupe-hasnaoui.com/api/tache/${id}`;
            const requestData = {
                titre_tache: values.titre_tache,
                description: values.description,
                equipe: ParticipantAll,
                date_debut: values.dateDebut,
                date_fin: values.dateFin,
                etat: values.avance,
                projett: proALL,
                level: levelAll
            };

            await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const apiUrll = `https://task.groupe-hasnaoui.com/api/tachevalide/${id}`;
            const requestDataa = {
                validr: values.validationStatus[0].value,
                cause: values.reason,
            };

            await fetch(apiUrll, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestDataa),
            });

            const apiUrlla = 'https://www.groupe-hasnaoui.com/mailltache.php';
            const requestDataaa = {
              Email: mai.replace(/"/g, '') ,
              Nom: ' ',
              Prenom: ' '
            };
      
            await axios.post(apiUrlla, requestDataaa, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }); 
            toast.success('Tâche modifiée avec succès');
            resetForm();
            setTimeout(() => {
                window.location.href = ''
            }, 3000);
        } catch (error) {
            toast.error(`Erreur lors de la modification de la tâche: ${error.message}`);
        }
    };
    const handleCloseModalClick = () => {
        const modal = document.getElementById('exampleModall');
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
        }
    };

    const CustomSelect = ({ field, form, options, isMulti,isDisable }) => (
        <Select
            {...field}
            options={options}
            isMulti={isMulti}
            components={animatedComponents}
            onChange={option => form.setFieldValue(field.name, option)}
            value={field.value}
            isDisabled={isDisable}
        />
    );

    const levelOptions = ['1', '2', '3', '4', '5'].map(level => ({
        value: level,
        label: level
    }));

    return (
        <>
            <center>
                <div className="modal fade" id="exampleModall" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Validation du  Tache</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModalClick}></button>
                            </div>
                            <div className="modal-body">
                                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
                                    {({ values, setFieldValue }) => (
                                        <Form className="row g-3">
                                            <div className="col-lg-4">
                                                <label htmlFor="titre_tache" className="form-label">Titre Tache <b className='text-danger'>*</b><GoProjectRoadmap size={30} style={{ marginLeft: "10px" }} /></label>
                                                <Field type="text" className="form-control" id="titre_tache" name="titre_tache" disabled/>
                                                <ErrorMessage name="titre_tache" component="div" className="text-danger" />
                                            </div>
                                            <div className="col-lg-4">
                                                <label htmlFor="dateDebut" className="form-label">Date Début <b className='text-danger'>*</b> <MdOutlineDateRange size={30} style={{ marginLeft: "10px" }} /></label>
                                                <Field type="date" className="form-control" id="dateDebut" name="dateDebut" disabled/>
                                                <ErrorMessage name="dateDebut" component="div" className="text-danger" />
                                            </div>
                                            <div className="col-lg-4">
                                                <label htmlFor="dateFin" className="form-label">Date Fin <b className='text-danger'>*</b><MdOutlineDateRange size={30} style={{ marginLeft: "10px" }} /></label>
                                                <Field type="date" className="form-control" id="dateFin" name="dateFin" disabled/>
                                                <ErrorMessage name="dateFin" component="div" className="text-danger" />
                                            </div>
                                            <div className="col-lg-6">
                                                <label htmlFor="projet" style={{ float: 'left' }}>Projet <span className='text-danger'>*</span></label>
                                                <br />
                                                {projet}
                                                <Field
                                                    name="porjet"
                                                    component={CustomSelect}
                                                    options={optionsProjet}
                                                    isMulti={true}
                                                    isDisable="true"
                                                />
                                                <ErrorMessage name="porjet" component="div" className="text-danger" />
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="form-group">
                                                    <label htmlFor="avance" style={{ float: 'left' }}>Etat avancement <span className='text-danger'>*</span></label>
                                                    <div className="input-group  ">
                                                        <span className="input-group-text"><GoProjectRoadmap /></span>
                                                        <Field type="number" id="avance" name="avance" max="100" className="form-control" placeholder="Etat de Avancement" disabled/>
                                                    </div>
                                                    <ErrorMessage name="avance" component="div" className="text-danger" />
                                                </div>
                                            </div>







                                            <div className="col-lg-12">
                                                <div className="form-group">
                                                    <label htmlFor="description" style={{ float: 'left' }}>Description <span className='text-danger'>*</span></label>
                                                    <div className="input-group  ">
                                                        <span className="input-group-text"><TbFileDescription /></span>
                                                        <Field as="textarea" id="description" name="description" className="form-control" placeholder="Description" rows="4" disabled/>
                                                    </div>
                                                    <ErrorMessage name="description" component="div" className="text-danger" />
                                                </div>
                                            </div>
                                            <marquee style={{color:'red',fontWeight:'bold'}}>Veuillez noter que le niveau affecté à une tâche influence le salaire de vos employés comme suit : Niveau 1 - 5%, Niveau 2 - 10%, Niveau 3 - 15%, Niveau 4 - 20%, Niveau 5 - 25%.</marquee>

                                            <div className="col-lg-6">
                                                <label htmlFor="level" className="form-label">Niveau de tâche <b className='text-danger'>*</b></label>
                                                <Field
                                                    name="level"
                                                    component={CustomSelect}
                                                    options={levelOptions}
                                                    isMulti={true}
                                                    isDisable={true}
                                                />
                                                <ErrorMessage name="level" component="div" className="text-danger" />
                                            </div>



                                            <h5 style={{color:'red',fontWeight:'bold'}}>Attention : Les participants à cette tâche reçoivent le même niveau de prime. En tant que directeur, vous avez le droit de modifier.</h5>


                                            <div className="col-lg-12">
                                                <label htmlFor="participant" className="form-label">Participant <b className='text-danger'>*</b></label>
                                                <Field name="participant" options={optionsPartic} component={CustomSelect} isMulti={true} />
                                                <ErrorMessage name="participant" component="div" className="text-danger" />
                                            </div>

                                            
                                           
                                            <div className="col-md-12">
                                                <label htmlFor="validationStatus" className="form-label">Validation <b className='text-danger'>*</b><TbFileDescription size={30} style={{ marginLeft: "10px" }} /></label>
                                                <Field name="validationStatus" options={validationStatusOptions} component={CustomSelect} isMulti={true}isDisabled={false} />
                                                <ErrorMessage name="validationStatus" component="div" className="text-danger" />
                                            </div>
                                            <div className="col-md-12">
                                                <label htmlFor="reason" className="form-label">Raison <b className='text-danger'>*</b><TbFileDescription size={30} style={{ marginLeft: "10px" }} /></label>
                                                <Field as="textarea" className="form-control" id="reason" name="reason"  />
                                                <ErrorMessage name="reason" component="div" className="text-danger" />
                                            </div>

                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModalClick}>Fermer</button>
                                                <button type="submit" className="btn btn-primary">Sauvegarder</button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </center>
        </>
    );
};

export default ModifyTache;
