import './BookCard.css'

export default function BookCard({ title, author, price, image, onClick }) {
  return (
    <div className="book-card">
      <div className="book-card-image">
        {image ? (
          <img src={image} alt={title} />
        ) : (
          <div className="book-card-no-image">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 19.5C4 18.837 4.26379 18.2011 4.73223 17.7322C5.20067 17.2638 5.83657 17 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.5 2H20V22H6.5C5.83657 22 5.20067 21.7362 4.73223 21.2678C4.26379 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26379 3.20107 4.73223 2.73223C5.20067 2.26379 5.83657 2 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>
      <div className="book-card-info">
        <h3 className="book-card-title">{title}</h3>
        <p className="book-card-author">{author}</p>
        <p className="book-card-price">${typeof price === 'number' ? price.toFixed(2) : price}</p>
        <button onClick={onClick} className="btn btn-primary">
          Observar Libro
        </button>
      </div>
    </div>
  )
}
