import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Product } from '../types/Product';
import { productService } from '../services/productService';
import { getShopProductById } from '../services/productShop';
import { addToCart } from '../api/api';
import '../styles/ProductDetail.css';

interface Comment {
  id: number;
  user_id: number;
  username: string;
  text: string;
  rating: number;
  created_at: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    loadProduct();
    loadLikes();
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;

    try {
      setLoading(true);
      console.log('Loading product with id:', id);
      const data = await getShopProductById(parseInt(id));
      console.log('Fetched product data:', data);
      setProduct(data || null);
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    if (!id) return;
    try {
      const response = await getProductVotes(parseInt(id));
      console.log('Réponse brute de l\'API:', response);

      let votes = [];
      if (Array.isArray(response)) {
        votes = response;
      } else if (response.votes && Array.isArray(response.votes)) {
        votes = response.votes;
      } else if (response.data && Array.isArray(response.data)) {
        votes = response.data;
      } else if (response.items && Array.isArray(response.items)) {
        votes = response.items;
      }

      const filteredVotes = votes.filter((vote: any) => {
        const hasComment = vote.comment && typeof vote.comment === 'string' && vote.comment.trim() !== '';
        console.log('Vote:', vote, 'Has comment:', hasComment);
        return hasComment;
      });

      setComments(filteredVotes);
    } catch (error) {
      setComments([]);
    }
  };

  const loadLikes = async () => {
    if (!id) return;
    try {
      const response = await getProductVotes(parseInt(id));

      let votes = [];
      if (Array.isArray(response)) {
        votes = response;
      } else if (response.votes && Array.isArray(response.votes)) {
        votes = response.votes;
      } else if (response.data && Array.isArray(response.data)) {
        votes = response.data;
      } else if (response.items && Array.isArray(response.items)) {
        votes = response.items;
      }

      const totalLikes = votes.filter((vote: any) => vote.like === true).length;
      setLikes(totalLikes);

      const userStr = localStorage.getItem('cev_auth_user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          const userLike = votes.find((vote: any) => vote.user_id === user.id && vote.like === true);
          setIsLiked(!!userLike);
        } catch (e) {
          console.error('Erreur parsing user:', e);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des likes:', error);
    }
  };

  const handleLike = async () => {
    const userStr = localStorage.getItem('cev_auth_user');
    const token = localStorage.getItem('cev_auth_token');

    if (!userStr || !token) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      const likePayload = {
        user_id: user.id,
        note: 1,
        comment: '',
        like: !isLiked,
      };
      await voteProduct(product!.id, likePayload);
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes - 1 : likes + 1);
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const userStr = localStorage.getItem('cev_auth_user');
    const token = localStorage.getItem('cev_auth_token');

    if (!userStr || !token) {
      navigate('/login');
      return;
    }

    if (!id || !product) return;

    try {
      const user = JSON.parse(userStr);
      const commentPayload = {
        user_id: user.id,
        note: rating,
        comment: newComment,
        like: isLiked,
      };
      await voteProduct(product.id, commentPayload);
      setNewComment('');
      setRating(5);
      await loadComments();
      await loadLikes();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      alert('Erreur lors de l\'ajout du commentaire: ' + (error as any).message);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (product && newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    const userStr = localStorage.getItem('cev_auth_user');
    const token = localStorage.getItem('cev_auth_token');
    if (!userStr || !token) {
      navigate('/login');
      return;
    }
    try {
      const user = JSON.parse(userStr);
      await addToCart(user.id, product!.id, quantity);
      window.dispatchEvent(new Event('cartUpdated'));
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'ajout au panier');
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Rupture de stock', className: 'out-of-stock' };
    if (stock <= 5) return { text: 'Stock limité', className: 'low-stock' };
    return { text: 'En stock', className: 'in-stock' };
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="loading">Chargement du produit...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="error-message">
            <h2>Produit introuvable</h2>
            <p>Le produit que vous recherchez n'existe pas ou n'est plus disponible.</p>
            <button onClick={() => navigate('/shop')} className="btn-primary">
              Retour à la boutique
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="product-detail-page">
      <div className="container">
        <button onClick={() => navigate('/shop')} className="btn-back">
          ← Retour à la boutique
        </button>

        <div className="product-detail-container">
          <div className="product-image-section">
            {product.image && product.image.trim() ? (
              <img src={product.image} alt={product.name} className="product-image-large" />
            ) : (
              <div className="image-placeholder-large">
                <span>IMAGE PRODUIT</span>
              </div>
            )}

            <div className="product-badges">
              <div className={`stock-badge ${stockStatus.className}`}>
                {stockStatus.text}
              </div>
              <div className="popularity-badge">
                Popularité: {product.popularity_score}/10
              </div>
            </div>
          </div>

          <div className="product-info-section">
            <h1 className="product-title">{product.name}</h1>

            <div className="product-meta">
              <span className="product-id">Réf: #{product.id}</span>
              <span className="product-stock-count">{product.stock} unité(s) disponible(s)</span>
            </div>

            <div className="product-price-section">
              <div className="price-container">
                {product.base_price !== product.current_price && (
                  <span className="original-price">{product.base_price} €</span>
                )}
                <span className="current-price">{product.current_price} €</span>
              </div>
            </div>

            <div className="product-description-section">
              <h2>Description</h2>
              <p className="product-description-text">{product.description}</p>
            </div>

            <div className="product-details">
              <h3>Caractéristiques</h3>
              <ul>
                <li><strong>Catégorie:</strong> #{product.category_id}</li>
                <li><strong>Stock disponible:</strong> {product.stock} unités</li>
                <li><strong>Score de popularité:</strong> {product.popularity_score}/10</li>
                <li><strong>Prix de base:</strong> {product.base_price} €</li>
              </ul>
            </div>

            {product.stock > 0 ? (
              <div className="purchase-section">
                <div className="quantity-selector">
                  <label>Quantité:</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-display">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="total-price">
                  <span>Total:</span>
                  <span className="total-amount">{(product.current_price * quantity).toFixed(2)} €</span>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`btn-add-to-cart ${addedToCart ? 'added' : ''}`}
                  disabled={addedToCart}
                >
                  {addedToCart ? '✓ Ajouté au panier' : 'Ajouter au panier'}
                </button>

                <button
                  onClick={handleLike}
                  className={`btn-like ${isLiked ? 'liked' : ''}`}
                  title="J'aime ce produit"
                >
                  ❤ ({likes})
                </button>
              </div>
            ) : (
              <div className="out-of-stock-message">
                <p>Ce produit est actuellement en rupture de stock.</p>
                <button className="btn-notify">Me notifier lors du réapprovisionnement</button>
              </div>
            )}

            <div className="comments-section">
              <h3>Avis et commentaires</h3>

              <div className="add-comment">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Partager votre avis..."
                  className="comment-input"
                />

                <div className="comment-controls">
                  <div className="rating-selector">
                    <label>Note:</label>
                    <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
                      <option value={1}>1 ⭐</option>
                      <option value={2}>2 ⭐</option>
                      <option value={3}>3 ⭐</option>
                      <option value={4}>4 ⭐</option>
                      <option value={5}>5 ⭐</option>
                    </select>
                  </div>
                  <button onClick={handleAddComment} className="btn-submit-comment">
                    Publier
                  </button>
                </div>
              </div>

              <div className="comments-list">
                {comments.length === 0 ? (
                  <p className="no-comments">Aucun avis pour le moment. Soyez le premier à commenter!</p>
                ) : (
                  comments.map((comment: any) => (
                    <div key={comment.vote_id} className="comment-card">
                      <div className="comment-header">
                        <span className="comment-author">{comment.username || 'Anonyme'}</span>
                        <span className="comment-rating">{'⭐'.repeat(comment.note || comment.rating || 5)}</span>
                      </div>
                      <p className="comment-text">{comment.comment || comment.text}</p>
                      <span className="comment-date">
                        {comment.created_at ? new Date(comment.created_at).toLocaleDateString('fr-FR') : ''}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
