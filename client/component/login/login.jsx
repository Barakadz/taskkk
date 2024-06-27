 import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
 import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
 import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CiUser, CiCalendarDate, CiMail } from "react-icons/ci";
import InputAdornment from '@mui/material/InputAdornment';
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
  import * as Yup from 'yup';
 import { Formik, Form, Field, ErrorMessage } from 'formik';
  import { useSelector, useDispatch } from 'react-redux';
 import { setUser } from '../redux/userSlice';
 import { ToastContainer, toast } from 'react-toastify';
 import 'react-toastify/dist/ReactToastify.css';
 import { useRouter } from 'next/router';
 import { RiLockPasswordLine } from "react-icons/ri";
import Tour from '../tour';
import CryptoJS from 'crypto-js';
 
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {''}
      <Link color="inherit" href="https://www.groupe-hasnaoui.com/fr/">
      Copyright © Groupe des Societés HASNAOUI - DSI.
      All Rights Reserved-Développed By Direction des Systémes d'informations 
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
//https://task.groupe-hasnaoui.com/api/directeur/
const defaultTheme = createTheme();

export default function Login() {
    const router = useRouter();
    const [hash, setHash] = useState('');

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

 const fetchData = async () => {
      try {
        const response = await axios.get('https://task.groupe-hasnaoui.com/api/directeur/');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
  
    useEffect(() => {
      fetchData();
      //const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds
      //return () => clearInterval(intervalId); // Clear interval on component unmount
    }, []);
    
  const initialValues = {
 
    email: ''  ,
   password:'',
  };

  const validationSchema = Yup.object().shape({
     email: Yup.string().email('invalid Mail format').required('il faut remplir votre Mail'),
     password: Yup.string().required('il faut remplir le Mot pass'),
   });
   const onSubmit = async (values) => {    setLoading(true);

    //dispatch(setUser(values));
    const username = values.email;
    const password = values.password;
    const url = 'https://api.ldap.groupe-hasnaoui.com/newtask/auth';
  
    // Créez l'en-tête d'authentification de base
    const authHeader = 'Basic ' + btoa(`${username}:${password}`);
  
    try {
      const response = await axios.post(
        url,
        {}, // Si vous avez besoin de données dans le corps de la requête, ajoutez-les ici
        {
          headers: {
            'Authorization': authHeader
          }
        }
      );
  var authentification=JSON.stringify(response.data.authenticated);
  if(authentification=='false'){
    toast.error("Mail ou Mot de passe incorrect");
setLoading(false)
  }else{    setLoading(false)

     dispatch(setUser({
        firstName: response.data.userinfo.name,
        lastName: response.data.userinfo.fname, // Vous pouvez mettre les valeurs actuelles ou d'autres valeurs nécessaires
        phoneNumber: response.data.userinfo.phonenumber,
        mail: response.data.userinfo.mail,
        department: response.data.userinfo.department,
        job: response.data.userinfo.title,
        loggedIn:'true'
      }));
      
  //set localstorage
  localStorage.setItem("mailtask", response.data.userinfo.mail);

  localStorage.setItem("passwordtask", values.password);


    }

    router.push('/projet');

       } catch (error) {
      console.error('Erreur :', error);
    }
   }
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
   
 
  
  return (
    <ThemeProvider theme={defaultTheme}>

      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(login.png)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
          <img src="experience.png"  width={250} alt="" srcset="" />
            <Typography id="kk" component="h3" variant="h5"                
>
            S’identifier

            </Typography>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} validateOnMount>
                          {({ errors, touched, handleChange, handleBlur, values }) => (
                            <Form>
             <TextField fullWidth
                                      id="input-with-icon-textfield"
                                      label="Mail :"
                                      InputProps={{
                                        startAdornment: (
                                          <InputAdornment position="start">
                                            <CiMail />
                                          </InputAdornment>
                                        ),
                                      }}
                                      variant="outlined"
                                      
                                      className="email-step"
                                      name="email"
                                       
                                       onChange={handleChange}
                                      value={values.email}
                                       error={touched.email && Boolean(errors.email)}
                                      helperText={touched.email && errors.email}
                                    />
                                    <br/><br/>
                                    <TextField fullWidth
                                    type='password'
                                      id="input-with-icon-textfield"
                                      label="Password :"
                                      InputProps={{
                                        startAdornment: (
                                          <InputAdornment position="start">
                                            <RiLockPasswordLine />
                                          </InputAdornment>
                                        ),
                                      }}
                                      variant="outlined"
                                      className="password-step"
                                      name="password"
                                       
                                       onChange={handleChange}
                                      value={values.password}
                                       error={touched.password && Boolean(errors.passwprd)}
                                      helperText={touched.password && errors.password}
                                    />
            
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
              >
Connect              </Button>
{loading &&<center><img src='lodingg.gif' width={200}/></center> }
              <Copyright sx={{ mt:1 }} />
              </Form>
                          )}
                        </Formik>          </Box>
        </Grid>
      </Grid>        <ToastContainer />

    </ThemeProvider>
  );
}