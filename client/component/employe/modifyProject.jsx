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

const ModifyProject = ({ id,  username,salaire }) => {
 
    const router = useRouter();
    const user = useSelector((state) => state.user);
 
    const [optionsChef, setOptionsChef] = useState([]);
 
    useEffect(() => {
        axios.get('https://api.ldap.groupe-hasnaoui.com/get/users/group/GSHA?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJUb2tlbiI6IkZvciBEU0kiLCJVc2VybmFtZSI6ImFjaG91cl9hciJ9.aMy1LUzKa6StDvQUX54pIvmjRwu85Fd88o-ldQhyWnE')
            .then(response => {
                const options = response.data.members.map(member => ({
                    value: member,
                    label: member
                }));
                setOptionsChef(options);
             })
            .catch(error => {
               
            });
    }, []);
    const removeQuotesAndBackslashes = (str) => str.replace(/["\\]/g, '');

    const initialValues = {
      
        username: username ? username.split('-').map(ch => ({ value: removeQuotesAndBackslashes(ch), label: removeQuotesAndBackslashes(ch) })) : [],
      // Add this line for the validation status
salair:salaire.replace(/["\\]/g, '')
    };

    const validationSchema = Yup.object().shape({
          
        salair:Yup.string().required('Il faut remplir Salaire'),
    });

    const onSubmit =async (values, { resetForm }) => {
         
        const usernameAll = values.username.map(item => item.value).join('-');
 






        







 




        const apiUrl = `https://task.groupe-hasnaoui.com/api/employe@groupe/${id}`;
        const requestData = {
             
            salaire:values.salair   
           
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
                toast.success('Le Salaire à été bien Modifié');
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
                                             
                                            <div className="col-lg-6">
                                                <label htmlFor="username" className="form-label">Employe <b className='text-danger'>*</b></label>
                                                <Field name="username" options={optionsChef} component={CustomSelect} isMulti={true}  isDisabled={true}    />
                                                <ErrorMessage name="username" component="div" className="text-danger" />
                                            </div>
                                            
                                            <div className="col-lg-6">
                          <div className="form-group">
                            <label htmlFor="salair" style={{ float: 'left' }}>salaire <span className='text-danger'>*</span></label>
                            <div className="input-group mb-2">
                              <span className="input-group-text"><GoProjectRoadmap /></span>
                              <Field type="number" id="salair" name="salair" className="form-control" placeholder="salair" />
                            </div>
                            <ErrorMessage name="salair" component="div" className="text-danger" />
                          </div>
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
