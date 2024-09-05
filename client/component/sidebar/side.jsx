import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { FaRegUserCircle, FaUser } from "react-icons/fa";
import { AiFillProject, AiOutlineFundProjectionScreen } from "react-icons/ai";
import { GrValidate } from "react-icons/gr";
import { TiNews } from "react-icons/ti";
import axios from 'axios';
import { setUser } from '../redux/userSlice'; // Adjust the import path to your actual user slice

const Side = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [directorsEmails, setDirectorsEmails] = useState([]);
  const [dgEmails, setDgEmails] = useState([]);
  const [rhEmails, setRhEmails] = useState([]);

  const [userEmailExists, setUserEmailExists] = useState(false);
  const [userEmailExistss, setUserEmailExistss] = useState(false);
  const [userEmailDg, setUserEmailDg] = useState(false);

  useEffect(() => {
    const userEmail = user.mail;
    if (rhEmails.length > 0) {
      const exists = rhEmails.some(email => email === userEmail);
      setUserEmailExistss(exists);
    }
  }, [rhEmails, user.mail]);

  useEffect(() => {
    const userEmail = user.mail;
    if (dgEmails.length > 0) {
      const exists = dgEmails.some(email => email === userEmail);
      setUserEmailDg(exists);
    }
  }, [dgEmails, user.mail]);

  useEffect(() => {
    const userEmail = user.mail;
    if (directorsEmails.length > 0) {
      const exists = directorsEmails.some(email => email === userEmail);
      setUserEmailExists(exists);
    }
  }, [directorsEmails, user.mail]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const directeurResponse = await axios.get('https://task.groupe-hasnaoui.com/api/directeur/');
        setDirectorsEmails(directeurResponse.data.map(directeur => directeur.mail));

        const userEmailDg = await axios.get('https://task.groupe-hasnaoui.com/api/dg/');
        setDgEmails(userEmailDg.data.map(directeur => directeur.mail));

        const rhResponse = await axios.get('https://task.groupe-hasnaoui.com/api/rh/rh');
        setRhEmails(rhResponse.data.map(item => item.mail));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [user.mail]);

  useEffect(() => {
    const mail = localStorage.getItem('mailtask');
    const password = localStorage.getItem('passwordtask');

    if (mail && password) {
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
  }, [dispatch, router]);

  return (
    <>
      <div id="sidebar">
        <header>
          <a href="#">Task Manager ver <b>1.0.0</b></a>
        </header>
        <ul className="nav">
          {userEmailExistss && (
            <>
    <Link legacyBehavior href="/primerhusergsh">
                <li className={router.pathname === '/primerhusergsh' ? 'act' : ''}>
                  <div className="flex flex-row">
                    <GrValidate color="white" fontSize={20} className="mr-4" />
                    &nbsp; &nbsp;Tous les primes du GSH
                  </div>
                </li>
              </Link>
              <Link legacyBehavior href="/employe">
                <li className={router.pathname === '/employe' ? 'act' : ''}>
                  <div className="flex flex-row">
                    <GrValidate color="white" fontSize={20} className="mr-4" />
                    &nbsp; &nbsp;Employé
                  </div>
                </li>
              </Link>
              <Link legacyBehavior href="/primeee">
                <li className={router.pathname === '/primeee' ? 'act' : ''}>
                  <div className="flex flex-row">
                    <GrValidate color="white" fontSize={20} className="mr-4" />
                    &nbsp; &nbsp;Calculer des primes 
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
            
              <Link legacyBehavior href="/prime">
                <li className={router.pathname === '/prime' ? 'act' : ''}>
                  <div className="flex flex-row">
                    <GrValidate color="white" fontSize={20} className="mr-4" />
                    &nbsp; &nbsp;Prime
                  </div>
                </li>
              </Link>
              <div
  onClick={() => {
    localStorage.removeItem('mailtask');
    localStorage.removeItem('passwordtask');
  }}
>
  <Link legacyBehavior href="/">
    <li className={router.pathname === '/' ? 'act' : ''}>
      <div className="flex flex-row">
        <GrValidate color="white" fontSize={20} className="mr-4" />
        &nbsp; &nbsp;Déconnexion
      </div>
    </li>
  </Link>
</div>


            </>
          )}
        

          {userEmailDg && (
            <>
              <Link legacyBehavior href="/validationtousprojet">
                <li className={router.pathname === '/validationtousprojet' ? 'act ' : ''}>
                  <div className="flex flex-row">
                    <FaUser color="white" fontSize={20} className="mr-4" />
                    &nbsp; &nbsp;Validation des Projets GSH
                  </div>
                </li>
              </Link>
              <Link legacyBehavior href="/primerhusergsh">
                <li className={router.pathname === '/primerhusergsh' ? 'act' : ''}>
                  <div className="flex flex-row">
                    <GrValidate color="white" fontSize={20} className="mr-4" />
                    &nbsp; &nbsp;Tous les primes du GSH
                  </div>
                </li>
              </Link>
              <Link legacyBehavior href="/primerhusergsh">
                <li className={router.pathname === '/primerhusergsh' ? 'act' : ''}>
                  <div className="flex flex-row">
                    <GrValidate color="white" fontSize={20} className="mr-4" />
                    &nbsp; &nbsp;Déconnexion
                  </div>
                </li>
              </Link>
            </>
          )}

          {userEmailExists && (
            <>
            
              <Link legacyBehavior href="/validationprojet">
                <li className={router.pathname === '/validationprojet' ? 'act ' : ''}>
                  <div className="flex flex-row">
                    <FaUser color="white" fontSize={20} className="mr-4" />
                    &nbsp; &nbsp;validation des projets de département
                  </div>
                </li>
              </Link>
              <Link legacyBehavior href="/validationtache">
                <li className={router.pathname === '/validationtache' ? 'act ' : ''}>
                  <div className="flex flex-row">
                    <FaUser color="white" fontSize={20} className="mr-4" />
                    &nbsp; &nbsp;validation des taches de département
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
              <Link legacyBehavior href="/primerhusergsh">
                <li className={router.pathname === '/primerhusergsh' ? 'act' : ''}>
                  <div className="flex flex-row">
                    <GrValidate color="white" fontSize={20} className="mr-4" />
                    &nbsp; &nbsp;Déconnexion
                  </div>
                </li>
              </Link>
            </>
          )}

          {!userEmailExists && !userEmailExistss && !userEmailDg && (
            <>
            
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
              <Link legacyBehavior href="/prime">
                <li className={router.pathname === '/prime' ? 'act' : ''}>
                  <div className="flex flex-row">
                    <GrValidate color="white" fontSize={20} className="mr-4" />
                    &nbsp; &nbsp;Prime
                  </div>
                </li>
              </Link>
              <Link legacyBehavior href="/primerhusergsh">
                <li className={router.pathname === '/primerhusergsh' ? 'act' : ''}>
                  <div className="flex flex-row">
                    <GrValidate color="white" fontSize={20} className="mr-4" />
                    &nbsp; &nbsp;Déconnexion
                  </div>
                </li>
              </Link>
             
            </>
          )}
        </ul>
      </div>
      <div id="">
        <nav className="">
          <div className="container-fluid">
            <div className="topbarrr">
              <div><img src="logo.png" width={50} alt="Logo" /></div>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <FaRegUserCircle size={33} color="blue" />
                </div>
                <div className="flex-grow-1 ms-3">
                  <strong>{`${user.firstName} ${user.lastName}`}</strong>
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