import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCookie } from "./utils";
import axios from "axios";
import "./DramasAdd.css";

function DramasAdd( { setDramas } ) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        release_date: "",
        genre: "",
        poster_url: ""
    });

    useEffect(() => {
        document.title = "Add K-Drama";
    }, [])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let payload = { ...formData };

        try {
            if (!payload.poster_url && payload.title) {
                const res = await fetch(
                    `/api/tmdb_search/?title=${encodeURIComponent(payload.title)}`
                );
                const data = await res.json();
                const filtered = data.results.filter(
                    r => r.original_language === "ko" && r.first_air_date.startsWith(payload.release_date.slice(0,4))
                );

                if (filtered[0]?.poster_path) {
                    payload.poster_url = `https://image.tmdb.org/t/p/w500${filtered[0].poster_path}`;
                };
            }

            const res = await axios.post("/api/dramas/", payload, {
                        withCredentials: true,
                        headers: { "X-CSRFToken": getCookie("csrftoken") }
                    });
            
            setDramas(prev => [...prev, res.data]);
            setFormData({ 
                title: "",
                description: "",
                release_date: "",
                genre: "",
                poster_url: "" 
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="form-page">
            <h2>Add K-Drama</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text" 
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                ></textarea>
                <input
                    type="date" 
                    name="release_date"
                    placeholder="Release date"
                    value={formData.release_date}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text" 
                    name="genre"
                    placeholder="Genre"
                    value={formData.genre}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text" 
                    name="poster_url"
                    placeholder="Poster URL"
                    value={formData.poster_url}
                    onChange={handleChange}
                />
                <button type="submit">Add Drama</button>
                <Link to="/" className="back-link">Go to K-Drama List</Link>
            </form>
        </div>
    );
}

export default DramasAdd;