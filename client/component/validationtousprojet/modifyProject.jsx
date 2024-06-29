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
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

const animatedComponents = makeAnimated();

const ModifyProject = ({ id, tire_projet, descri, chefp, dadebut, dafin, dep, filia, par,mai }) => {
 
    const router = useRouter();
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
    ];
    const validationStatusOptions = [
        { value: 'valide', label: 'Projet validé' },
        { value: 'nonvalide', label: 'Projet non valide' },
    ];
    const [optionsChef, setOptionsChef] = useState([]);
    const [optionsPartic, setOptionsPartic] = useState([]);

    useEffect(() => {
        axios.get('https://api.ldap.groupe-hasnaoui.com/get/users/group/GSHA?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJUb2tlbiI6IkZvciBEU0kiLCJVc2VybmFtZSI6ImFjaG91cl9hciJ9.aMy1LUzKa6StDvQUX54pIvmjRwu85Fd88o-ldQhyWnE')
            .then(response => {
                const options = response.data.members.map(member => ({
                    value: member,
                    label: member
                }));
                setOptionsChef(options);
                setOptionsPartic(options);
            })
            .catch(error => {
               
            });
    }, []);
    const removeQuotesAndBackslashes = (str) => str.replace(/["\\]/g, '');

    const initialValues = {
        titreProjet: tire_projet ? tire_projet.replace(/"/g, '') : '',
        dateDebut: dadebut ? new Date(dadebut).toISOString().split('T')[0] : '',
        dateFin: dafin ? new Date(dafin).toISOString().split('T')[0] : '',
        chefProjet: chefp ? chefp.split('-').map(ch => ({ value: removeQuotesAndBackslashes(ch), label: removeQuotesAndBackslashes(ch) })) : [],
        direction: dep ? dep.split('-').map(d => ({ value: removeQuotesAndBackslashes(d), label: removeQuotesAndBackslashes(d) })) : [],
        filiale: filia ? filia.split('-').map(f => ({ value: removeQuotesAndBackslashes(f), label: removeQuotesAndBackslashes(f) })) : [],
        participant: par ? par.split('-').map(p => ({ value: removeQuotesAndBackslashes(p), label: removeQuotesAndBackslashes(p) })) : [],
       description: descri ? descri.replace(/"/g, '') : '',
       validationStatus: '', // Add this line for the validation status
reason:'',
    };

    const validationSchema = Yup.object().shape({
        titreProjet: Yup.string().required('Il faut remplir votre Titre de Projet'),
        dateDebut: Yup.date().required('Il faut remplir Votre Date de début de projet').max(new Date(), "La date de début ne peut pas être dans le futur"),
        dateFin: Yup.date().required('Il faut remplir Votre Date de fin de projet').min(Yup.ref('dateDebut'), 'La date de fin ne peut pas être avant la date de début'),
        chefProjet: Yup.array().test('unique', 'Vous ne pouvez sélectionner qu\'un seul chef de projet', (value) => value.length <= 1)
            .min(1, 'Il faut remplir votre Chef de Projet')
            .required('Il faut remplir votre Chef de Projet'),
        direction: Yup.array().min(1, 'Il faut remplir votre Direction de Projet').required('Il faut remplir votre Direction de Projet'),
        filiale: Yup.array().min(1, 'Il faut remplir votre filiale de Projet').required('Il faut remplir votre filiale de Projet'),
        participant: Yup.array().min(1, 'Il faut remplir votre participant de Projet').required('Il faut remplir votre participant de Projet'),
        description: Yup.string().required('Il faut remplir votre description de Projet'),
         validationStatus: Yup.array().test('unique', 'Vous ne pouvez sélectionner qu\'un seul etat', (value) => value.length <= 1)
        .min(1, 'Il faut remplir votre etat de validation')
        .required('Il faut remplir votre etat de validation'),
        reason:Yup.string().required('Il faut remplir votre Raison de validation'),
    });

    const onSubmit =async (values, { resetForm }) => {
        const DirectionAll = values.direction.map(item => item.value).join('-');
        const FilialeAll = values.filiale.map(item => item.value).join('-');
        const ParticipantAll = values.participant.map(item => item.value).join('-');
        const ChefProjetAll = values.chefProjet.map(item => item.value).join('-');
        const valAll = values.validationStatus.map(item => item.value).join('-');







        








        const apiUrll = 'https://www.groupe-hasnaoui.com/mailprojetdga.php';
      const requestDataa = {
        Email: mai.replace(/"/g, '') ,
        Nom: ' ',
        Prenom: ' '
      };

      await axios.post(apiUrll, requestDataa, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }); 
         







        const apiUrl = `https://task.groupe-hasnaoui.com/api/tousprojetvalidation/${id}`;
        const requestData = {
             
            validr: valAll,
            cause: values.reason,
        participant:ParticipantAll     
           
        };

       
       
       
        fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                toast.success('Le Projet à été bien Modifié');
                resetForm(initialValues); // Reset form fields
                setTimeout(() => {
                    window.location.href = '';
                  }, 3000);
                        })
            .catch(error => {
                toast.error('An error occurred:', error);
            });
    };

    const handleCloseModalClickk = () => {
        const modal = document.getElementById('exampleModall');
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
        }
    };

    const handleCloseModalClick = () => {
        const modal = document.getElementById('exampleModall');
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
        }
    };

    const CustomSelect = ({ field, form, options, isMulti ,isDisabled}) => (
        <Select
            {...field}
            options={options}
            isMulti={isMulti}
            components={animatedComponents}
            onChange={option => form.setFieldValue(field.name, option)}
            value={field.value}
            isDisabled={isDisabled} // Pass the isDisabled prop to Select
                    />
    );

    return (
        <>
            <center>
                <div className="modal fade" id="exampleModall" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Modifier Projet</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModalClickk}></button>
                            </div>
                            <div className="modal-body">
                                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
                                    {({ values, setFieldValue }) => (
                                        <Form className="row g-3">
                                            <div className="col-lg-4">
                                                <label htmlFor="titreProjet" className="form-label">Titre Projet <b className='text-danger'>*</b><GoProjectRoadmap size={30} style={{ marginLeft: "10px" }} /></label>
                                                <Field type="text" className="form-control" id="titreProjet" name="titreProjet" disabled/>
                                                <ErrorMessage name="titreProjet" component="div" className="text-danger" />
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
                                            <div className="col-lg-4">
                                                <label htmlFor="chefProjet" className="form-label">Chef Projet <b className='text-danger'>*</b></label>
                                                <Field name="chefProjet" options={optionsChef} component={CustomSelect} isMulti={true}  isDisabled={true}    />
                                                <ErrorMessage name="chefProjet" component="div" className="text-danger" />
                                            </div>
                                            <div className="col-lg-4">
                                                <label htmlFor="direction" className="form-label">Direction <b className='text-danger'>*</b></label>
                                                <Field name="direction" options={optionsDirection} component={CustomSelect} isMulti={true}  isDisabled={true}    />
                                                <ErrorMessage name="direction" component="div" className="text-danger" />
                                            </div>
                                            <div className="col-lg-4">
                                                <label htmlFor="filiale" className="form-label">Filiale <b className='text-danger'>*</b></label>
                                                <Field name="filiale" options={optionsFiliale} component={CustomSelect} isMulti={true}  isDisabled={true}    />
                                                <ErrorMessage name="filiale" component="div" className="text-danger" />
                                            </div>   <div className="col-md-12">
                                                <label htmlFor="description" className="form-label">Description <b className='text-danger'>*</b><TbFileDescription size={30} style={{ marginLeft: "10px" }} /></label>
                                                <Field as="textarea" className="form-control" id="description" name="description" disabled/>
                                                <ErrorMessage name="description" component="div" className="text-danger" />
                                            </div>
                                            <div className="col-l-12">
                                                <label htmlFor="participant" className="form-label">Participant <b className='text-danger'>*</b></label>
                                                <Field name="participant" options={optionsPartic} component={CustomSelect} isMulti={true}   isDisabled={false}   
                                                />
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
                                                <button type="submit" className="btn btn-primary">Sauvegardé</button>
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

export default ModifyProject;
