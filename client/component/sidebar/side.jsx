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


const Side = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);



  const [data, setData] = useState([]);
  const [userInfoExists, setUserInfoExists] = useState(false); // State to track user info existence

 

















  useEffect(() => {
    const mail = localStorage.getItem('mailtask');
    const password = localStorage.getItem('passwordtask');

    if (mail && password) {


      const zer = async () => {
        try {
          const response = await fetch('http://localhost:8800/api/directeur/');
          const responseData = await response.json();
          console.log(responseData)
          setData(responseData);
          const userEmail = localStorage.getItem('mailtask');
          if (userEmail && response.data.some(user => user.mail === userEmail)) {
            setUserInfoExists(true); // Set state if user email exists in data
          }
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      };
  
      zer(); // Fetch data when component mounts
      console.log(data)  
        console.log(userInfoExists)
  
 






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
        <ul className="nav">
          <Link legacyBehavior href="/admin">
            <li className={router.pathname === '/admin' ? 'act ' : ''}>
              <div className="flex flex-row">
                <GrValidate color="white" fontSize={20} className="mr-4" />
                &nbsp; &nbsp;elements
              </div>
            </li>
          </Link>
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
          <Link legacyBehavior href="/admin">
            <li className={router.pathname === '/admin' ? 'act ' : ''}>
              <div className="flex flex-row">
                <GrValidate color="white" fontSize={20} className="mr-4" />
                &nbsp; &nbsp;Réclamation
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
