import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { FaRegUserCircle } from "react-icons/fa";
import { AiFillProject, AiOutlineFundProjectionScreen } from "react-icons/ai";
import { GrValidate } from "react-icons/gr";
import { TiNews } from "react-icons/ti";
import axios from 'axios';
import { setUser } from '../redux/userSlice'; // Adjust the import path to your actual user slice
import { FaUser } from "react-icons/fa";


const Side = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);



  const [data, setData] = useState([]);
 
  





   const [userEmailExists, setUserEmailExists] = useState(false);

 

  useEffect(() => {
    const userEmail = localStorage.getItem('mailtask');
    if (data.length > 0) {
      const exists = data.some(item => item.mail === userEmail);
      setUserEmailExists(exists);
    }
  }, [data]);


























  useEffect(() => {
    const mail = localStorage.getItem('mailtask');
    const password = localStorage.getItem('passwordtask');

    if (mail && password) {


      const zer = async () => {
     
             try {
              const response = await axios.get('https://task.groupe-hasnaoui.com/api/directeur/');
              setData(response.data);
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
       
        
  
      zer();  
    
  

      const authHeader = 'Basic ' + btoa(`${mail}:${password}`);
      const url = 'https://api.ldap.groupe-hasnaoui.com/newtask/auth';

      const authenticate = async () => {
        try {
          const response = await axios.post(url, {}, {
            headers: {
              'Authorization': authHeader
            }
          });
          const isAuthenticated = response.data.authenticated;

          if (!isAuthenticated) {
            router.push('/login');
          } else {
            dispatch(setUser({
              firstName: response.data.userinfo.name,
              lastName: response.data.userinfo.fname,
              phoneNumber: response.data.userinfo.phonenumber,
              mail: response.data.userinfo.mail,
              department: response.data.userinfo.department,
              job: response.data.userinfo.title,
              loggedIn: 'true'
            }));
          }
        } catch (error) {
          console.error('Authentication error:', error);
          router.push('/login');
        }
      };

      authenticate();
    } else {
      router.push('/login');
    }
  }, []);

 
  return (
    <>
      <div id="sidebar">
        <header>
          <a href="#">Task Manager ver <b>1.0.0</b></a>
        </header>
        {userEmailExists ? (
                    <ul className="nav">
   <Link legacyBehavior href="/validationprojet">
        <li className={router.pathname === '/validationprojet' ? 'act ' : ''}>
          <div className="flex flex-row">
            <FaUser             color="white" fontSize={20} className="mr-4" />
            &nbsp; &nbsp;validation des projet
          </div>
        </li>
      </Link>
       

       <Link legacyBehavior href="/validationtache">
       <li className={router.pathname === '/validationtache' ? 'act ' : ''}>
         <div className="flex flex-row">
           <FaUser             color="white" fontSize={20} className="mr-4" />
           &nbsp; &nbsp;validation des tache
         </div>
       </li>
     </Link>
       
     <Link legacyBehavior href="/evaluation">
            <li className={router.pathname === '/evaluation' ? 'act evaluation-step' : 'evaluation-step'}>
              <div className="flex flex-row">
                <GrValidate color="white" fontSize={20} className="mr-4" />
                &nbsp; &nbsp;Evaluation
              </div>
            </li>
          </Link>
          <Link legacyBehavior href="/contact">
            <li className={router.pathname === '/contact' ? 'act ' : ''}>
              <div className="flex flex-row">
                <GrValidate color="white" fontSize={20} className="mr-4 problem-step" />
                &nbsp; &nbsp; Contacter la DSI
              </div>
            </li>
          </Link>
     
     </ul>
      ) : (
        
          <ul className="nav">
         
          <Link legacyBehavior href="/admin">
            <li className={router.pathname === '/admin' ? 'act ' : ''}>
              <div className="flex flex-row">
                <AiOutlineFundProjectionScreen color="white" fontSize={20} className="mr-4" />
                &nbsp; &nbsp;Dashboard
              </div>
            </li>
          </Link>
          <Link legacyBehavior href="/projet">
            <li className={router.pathname === '/projet' ? 'act projet-step' : 'projet-step'}>
              <div className="flex flex-row">
                <AiFillProject color="white" fontSize={20} className="mr-4 projet-step" />
                &nbsp; &nbsp;Les Projets
              </div>
            </li>
          </Link>
          <Link legacyBehavior href="/tache">
            <li className={router.pathname === '/tache' ? 'act ' : ''}>
              <div className="flex flex-row">
                <TiNews color="white" fontSize={20} className="mr-4" />
                &nbsp; &nbsp;Les Taches
              </div>
            </li>
          </Link>
        {/*  <Link legacyBehavior href="/admin">
            <li className={router.pathname === '/admin' ? 'act ' : ''}>
              <div className="flex flex-row">
                <GrValidate color="white" fontSize={20} className="mr-4" />
                &nbsp; &nbsp;Réclamation
              </div>
            </li>
          </Link>*/ }
          <Link legacyBehavior href="/evaluation">
            <li className={router.pathname === '/evaluation' ? 'act evaluation-step' : 'evaluation-step'}>
              <div className="flex flex-row">
                <GrValidate color="white" fontSize={20} className="mr-4" />
                &nbsp; &nbsp;Evaluation
              </div>
            </li>
          </Link>
          <Link legacyBehavior href="/contact">
            <li className={router.pathname === '/contact' ? 'act ' : ''}>
              <div className="flex flex-row">
                <GrValidate color="white" fontSize={20} className="mr-4 problem-step" />
                &nbsp; &nbsp; Contacter la DSI
              </div>
            </li>
          </Link>
        </ul> )}
      </div>
      <div id=" ">
        <nav className="">
          <div className="container-fluid">
            <div className="topbarrr">
              <div><img src="logo.png" width={50} alt="Logo" /></div>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <FaRegUserCircle size={33} color="blue" />
                </div>
                <div className="flex-grow-1 ms-3">
                  <strong>{user.firstName + ' ' + user.lastName}</strong>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Side;
