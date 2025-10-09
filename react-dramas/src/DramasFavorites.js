import { Link } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

function DramasFavorites({ isFavorited, handleFavorite, favorites, handleEdit, handleDelete, }) {

    return (
        <div className="dramas-page">
            {favorites.length === 0 ? (
                <p>No favorites yet.</p>
            ) : (
                <div className="dramas-grid">
                    {favorites.map(m => (
                        <div className="drama-card" key={m.drama.id}>
                            <div className="poster-wrapper">
                                <img src={m.drama.poster_url} alt={m.drama.title} className="poster" />
                                <button 
                                    className={`favorite-btn ${isFavorited(m.drama.id) ? "favorited" : ""}`}
                                    onClick={() => handleFavorite(m.drama.id)}
                                    aria-label="Favorite"
                                >
                                    {isFavorited(m.drama.id) ? (
                                        <FavoriteIcon style={{ color: "red" }} />
                                    ) : (
                                        <FavoriteBorderIcon style={{ color: "white" }} />
                                    )}
                                </button>
                            </div>

                            <div className="card-body">
                                <h3>{m.drama.title}</h3>
                                <p className="genre">{m.drama.genre}</p>
                                <p className="release">
                                    {new Date(m.drama.release_date).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}
                                </p>
                            </div>

                            <div className="card-actions">
                                <button className="btn-icon" aria-label="Edit" onClick={() => handleEdit(m.drama.id)}>
                                    <EditIcon fontSize="small" />
                                </button>
                                <button className="btn-icon" aria-label="Delete" onClick={() => handleDelete(m.drama)}>
                                    <DeleteIcon fontSize="small" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}    
                <Link to="/add" className="back-link">Add K-Drama</Link>
        </div>
    );
}

export default DramasFavorites;