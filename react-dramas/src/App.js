import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { getCookie } from "./utils";
import axios from "axios";
import Dramas from "./Dramas";
import DramasAdd from "./DramasAdd";
import DramasEdit from "./DramasEdit";
import DramasLogin from "./DramasLogin";
import DramasSignup from "./DramasSignup";
import DramasFavorites from "./DramasFavorites";
import DramasDelete from "./DramasDelete";
import "./App.css";

function AnimatedRoutes({ dramas, setDramas, isAuthenticated, setShowLogin, isFavorited, handleFavorite, favorites, 
  setDeleteModalOpen, setDramaToDelete, handleDelete }) {
    
    const navigate = useNavigate();
    const location = useLocation();

    const handleEdit = (id) => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }
    navigate(`/edit/${id}`);
    }

    const page_motion = {
      initial: { opacity: 0, scale: 0.98, y: 10 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.98, y: -10 },
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
    }

    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route 
            path="/" 
            element={
              <motion.div
                {...page_motion}
              >
                <Dramas 
                  dramas={dramas}
                  setShowLogin={setShowLogin} 
                  isAuthenticated={isAuthenticated} 
                  isFavorited={isFavorited} 
                  handleFavorite={handleFavorite}
                  setDeleteModalOpen={setDeleteModalOpen}
                  setDramaToDelete={setDramaToDelete}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                />
              </motion.div>
            } 
          />
          <Route 
            path="/add" 
            element={
              <motion.div
                {...page_motion}
              >
                <DramasAdd 
                  setDramas={setDramas}
                />
              </motion.div>
            } 
          />
          <Route 
            path="/edit/:id/" 
            element={
              <motion.div
                {...page_motion}
              >
                <DramasEdit 
                  setDramas={setDramas}
                />
              </motion.div>
            }
          />
          <Route 
            path="/login" 
            element={
              <motion.div
                {...page_motion}
              >
                <DramasLogin />
              </motion.div>
            } 
          />
          <Route 
            path="/favorites" 
            element={
              <motion.div
                {...page_motion}
              >
                <DramasFavorites 
                  isFavorited={isFavorited} 
                  handleFavorite={handleFavorite}
                  favorites={favorites}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                />
              </motion.div>
            } 
          />
        </Routes>
      </AnimatePresence>
    )
}

function App() {

  const [dramas, setDramas] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dramaToDelete, setDramaToDelete] = useState(null);

  useEffect(() => {
    axios
      .get("/api/dramas/", { withCredentials: true })
      .then(res => setDramas(res.data))
      .catch(err => console.error(err));

    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/check-auth/", { withCredentials: true })
        if (res.data.authenticated) {
          setIsAuthenticated(true);
          const favRes = await axios.get("/favorites/", { withCredentials: true })
          setFavorites(favRes.data);
        }
      } catch (err) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const isFavorited = (id) => {
          return favorites.some(fav => fav.drama.id === id);
      }
  
  const toggleFavorite = async (id) => {
      try {
          const fav = favorites.find(f => f.drama.id === id);
          
          if (fav) {
              await axios.delete(`/favorites/${fav.id}/`, { 
                  withCredentials: true, 
                  headers: { "X-CSRFToken": getCookie("csrftoken") },
              });
              setFavorites(prev => prev.filter(f => f.drama.id !== id));
          } else {
              const res = await axios.post(
                  "/favorites/", 
                  { drama_id: id}, 
                  { 
                      withCredentials: true,
                      headers: { "X-CSRFToken": getCookie("csrftoken") }, 
                  }
              );
              setFavorites(prev => [...prev, res.data]);
          }

      } catch (err) {
          console.error(err);
      }
  }

  const handleFavorite = (id) => {
      if (!isAuthenticated) {
          setShowLogin(true);
          return;
      }
      toggleFavorite(id);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout/", {}, {
        withCredentials: true,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
      });
      setIsAuthenticated(false);
      setFavorites([]);
    } catch (err) {
      console.error(err);
    }
  }

  const deleteDrama = async (id) => {
    try {
        await axios.delete(`/api/dramas/${id}/`, {
            withCredentials: true,
            headers: { "X-CSRFToken": getCookie("csrftoken") }
        });
        setDramas(prev => prev.filter((d) => d.id !== id));
    } catch (err) {
        console.error(err);
    }
  };

  const confirmDelete = () => {
    if (dramaToDelete) {
      setTimeout(() => {
        deleteDrama(dramaToDelete.id);
        setDeleteModalOpen(false);
        setDramaToDelete(null); 
      }, 300);
    }
  };

  const handleDelete = (drama) => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }
    setDramaToDelete(drama);
    setDeleteModalOpen(true);
    };

  const modalMotion = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { ease: [0.4, 0, 0.2, 1] }
  }

  return (
    <div className="App">
      <Router>
        <header className="app-header">
          <h1>K-Stream</h1>
          <nav className="main-nav">
            <Link to="/">Home</Link>
            <Link to="/add">Add K-Drama</Link>
            <Link to="/favorites">Favorites</Link>
            
            {!isAuthenticated ? (
              <button className="login-btn" onClick={() => setShowLogin(true)}>
                Log in
              </button>
            ) : (
              <div className="user-dropdown">
                <button 
                  className="user-icon"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <User size={28} color="white" />
                </button>
                {dropdownOpen && (
                  <div className="dropdown-content">
                    <button className="logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>
        </header>
        
        <AnimatedRoutes
          dramas={dramas}
          setDramas={setDramas}
          isAuthenticated={isAuthenticated}
          setShowLogin={setShowLogin}
          isFavorited={isFavorited}
          handleFavorite={handleFavorite}
          favorites={favorites}
          setDeleteModalOpen={setDeleteModalOpen}
          setDramaToDelete={setDramaToDelete}
          handleDelete={handleDelete}
        />

        <AnimatePresence>
          {showLogin && (
            <DramasLogin 
                animation={modalMotion}
                onClose={() => setShowLogin(false)}
                onOpen={() => setShowSignup(true)}
                onSuccess={() => {
                  setIsAuthenticated(true);
                    axios
                      .get("/favorites/", { withCredentials: true })
                      .then(res => setFavorites(res.data));                       
                }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSignup && (
            <DramasSignup 
              animation={modalMotion}
              onClose={() => setShowSignup(false)}
              onOpen={() => setShowLogin(true)}
              onSuccess={() => {
                setIsAuthenticated(true);
                  axios
                    .get("/favorites/", { withCredentials: true })
                    .then(res => setFavorites(res.data));                       
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {deleteModalOpen && (
            <DramasDelete 
              animation={modalMotion}
              isOpen={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              onConfirm={confirmDelete}
              dramaTitle={dramaToDelete?.title}
            />
          )}
        </AnimatePresence>
      </Router>
    </div>
  );
}

export default App;