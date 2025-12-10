import SeriesCard from '../components/SeriesCard';

// Mock data - à remplacer par des vrais appels API
const seriesData = [
  { id: 1, title: 'Breaking Bad', image: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', rating: 9.5, seasons: 5, year: 2008, genre: 'Crime' },
  { id: 2, title: 'Game of Thrones', image: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg', rating: 9.2, seasons: 8, year: 2011, genre: 'Fantasy' },
  { id: 3, title: 'Stranger Things', image: 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg', rating: 8.7, seasons: 4, year: 2016, genre: 'Science-Fiction' },
  { id: 4, title: 'The Crown', image: 'https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg', rating: 8.6, seasons: 6, year: 2016, genre: 'Drame' },
  { id: 5, title: 'The Mandalorian', image: 'https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg', rating: 8.7, seasons: 3, year: 2019, genre: 'Science-Fiction' },
  { id: 6, title: 'The Witcher', image: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg', rating: 8.0, seasons: 3, year: 2019, genre: 'Fantasy' },
  { id: 7, title: 'Dark', image: 'https://image.tmdb.org/t/p/w500/5tRS9OKspmJkKAjQWcHvBJu3Nis.jpg', rating: 8.8, seasons: 3, year: 2017, genre: 'Science-Fiction' },
  { id: 8, title: 'The Boys', image: 'https://image.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg', rating: 8.7, seasons: 4, year: 2019, genre: 'Action' },
  { id: 9, title: 'Squid Game', image: 'https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg', rating: 8.0, seasons: 2, year: 2021, genre: 'Thriller' },
  { id: 10, title: 'The Last of Us', image: 'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg', rating: 8.8, seasons: 1, year: 2023, genre: 'Drame' },
  { id: 11, title: 'Wednesday', image: 'https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg', rating: 8.1, seasons: 1, year: 2022, genre: 'Comédie' },
  { id: 12, title: 'House of the Dragon', image: 'https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg', rating: 8.4, seasons: 2, year: 2022, genre: 'Fantasy' },
];

export default function Series() {


  const handleRate = (id: number, rating: number) => {
    console.log(`Série ${id} notée ${rating}`);
    // TODO: Implémenter la notation
  };

  return (
    <div className="min-h-screen bg-netflix-dark pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Séries recommandées</h1>
          <p className="text-gray-300 text-lg">
            Découvrez notre sélection de séries basée sur vos préférences
          </p>
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
          <button className="px-4 py-2 bg-netflix-red text-white text-sm font-medium rounded hover:bg-netflix-red-dark transition-colors whitespace-nowrap">
            Tous les genres
          </button>
          <button className="px-4 py-2 bg-netflix-black text-gray-300 text-sm font-medium rounded hover:bg-netflix-gray hover:text-white transition-colors whitespace-nowrap border border-netflix-gray">
            Crime
          </button>
          <button className="px-4 py-2 bg-netflix-black text-gray-300 text-sm font-medium rounded hover:bg-netflix-gray hover:text-white transition-colors whitespace-nowrap border border-netflix-gray">
            Fantasy
          </button>
          <button className="px-4 py-2 bg-netflix-black text-gray-300 text-sm font-medium rounded hover:bg-netflix-gray hover:text-white transition-colors whitespace-nowrap border border-netflix-gray">
            Science-Fiction
          </button>
          <button className="px-4 py-2 bg-netflix-black text-gray-300 text-sm font-medium rounded hover:bg-netflix-gray hover:text-white transition-colors whitespace-nowrap border border-netflix-gray">
            Drame
          </button>
          <button className="px-4 py-2 bg-netflix-black text-gray-300 text-sm font-medium rounded hover:bg-netflix-gray hover:text-white transition-colors whitespace-nowrap border border-netflix-gray">
            Thriller
          </button>
        </div>

        {/* Grille de séries */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {seriesData.map((series) => (
            <SeriesCard
              key={series.id}
              id={series.id}
              title={series.title}
              image={series.image}
              rating={series.rating}
              seasons={series.seasons}
              year={series.year}
              genre={series.genre}
              onRate={handleRate}
            />
          ))}
        </div>

        {/* Section "Charger plus" */}
        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-netflix-black text-white text-sm font-medium rounded hover:bg-netflix-gray transition-colors border border-netflix-gray">
            Charger plus de recommandations
          </button>
        </div>
      </div>
    </div>
  );
}
