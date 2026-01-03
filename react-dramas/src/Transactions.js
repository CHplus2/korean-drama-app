import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Dramas.css";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

function Transactions({ transactions, setShowLogin, isAuthenticated, setDeleteModalOpen, 
    setDramaToDelete, handleDelete, handleEdit}) {
        const [query, setQuery] = useState("");
        const [debouncedQuery, setDebouncedQuery] = useState(query)
        const [genreFilter, setGenreFilter] = useState("");
        const [yearFilter, setYearFilter] = useState("");
        const [sortBy, setSortBy] = useState("newest");

        useEffect(() => {
            document.title = "K-Drama Collection";

            const handler = setTimeout(() => {
                setDebouncedQuery(query);
            }, 300);

            return () => clearTimeout(handler);
        }, [query]);

        const filteredDramas = useMemo(() => {
            let result = dramas.filter((d) => 
                d.title.toLowerCase().includes(debouncedQuery.toLowerCase()) 
                && (!genreFilter || d.genre.toLowerCase().includes(genreFilter.toLowerCase()))
                && d.release_date?.startsWith(yearFilter)
            );
            
            if (sortBy === "newest") {
                result = [...result].sort(
                    (a, b) => new Date(b.release_date) - new Date(a.release_date)
                );
            } else if (sortBy === "oldest") {
                result = [...result].sort(
                    (a, b) => new Date(a.release_date) - new Date(b.release_date)
                );
            } else if (sortBy === "a-z") {
                result = [...result].sort(
                    (a, b) => a.title.localeCompare(b.title)
                )
            } else if (sortBy === "z-a") {
                result = [...result].sort(
                    (a, b) => b.title.localeCompare(a.title)
                )
            }

            return result
        }, [dramas, debouncedQuery, genreFilter, yearFilter, sortBy]);

        return (
            <div className="dramas-page">
                <div className="page-title-wrap">
                    <h2 className="page-title">K-Drama Collection</h2>
                    <input type="text" className="search-input" placeholder="Search dramas..." value={query} onChange={e => setQuery(e.target.value)} />
                    <select name="genre" id="genre-select" value={genreFilter} onChange={e => setGenreFilter(e.target.value)}>
                        <option value="">All Genres</option>
                        <option value="romance">Romance</option>
                        <option  value="comedy">Comedy</option>
                        <option value="action">Action</option>
                        <option value="thriller">Thriller</option>
                        <option value="science-fiction">Science Fiction</option>
                    </select>
                    <select name="year" id="year-select" value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
                        <option value="">All Years</option>
                        <option value="2025">2025</option>
                        <option  value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                    </select>
                    <select name="sort" id="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option  value="a-z">A-Z</option>
                        <option value="z-a">Z-A</option>
                    </select>
                </div>

                {transactions.length === 0 ? (
                    <p className="empty-text">No dramas added yet.</p>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1  }}
                    >
                        <div className="transaction-rows">
                            {transactions.map(t => (
                                <div className="transaction-row" key={t.id}>
                                    <div className="col-1">
                                        <p className="date">
                                            {new Date(t.release_date).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}
                                        </p>
                                    </div>

                                    <div className="col-2">
                                        <p>{t.transaction}</p>
                                    </div>

                                    <div className="col-3">
                                        <p>{t.category}</p>
                                    </div>

                                    <div className="card-actions">
                                        <button className="btn-icon" aria-label="Edit" onClick={() => handleEdit(t.id)}>
                                            <EditIcon fontSize="small" />
                                        </button>
                                        <button className="btn-icon" aria-label="Delete" onClick={() => handleDelete(t)}>
                                            <DeleteIcon fontSize="small" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>  
                )}    
                    <Link to="/add" className="back-link">Add Transaction</Link>
            </div>
        );
}

export default Transactions;